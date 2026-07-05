import { Resend } from "resend";
import { QUEUE_POSITION } from "./data";
import { welcomeEmail } from "./welcome-email";
import { gmailConfigured, sendWelcomeEmail, notifyFounder } from "./mailer";

export type WaitlistResult =
  | { ok: true; position: number; alreadyJoined: boolean }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Resend stores the contact list and can also send (HTTP API — reliable from
// serverless). Gmail SMTP is the alternative sender. Whichever is configured wins.
const RESEND_KEY = process.env.RESEND_API_KEY;
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
// No default: sending only turns on once a from-address is explicitly set. This
// lets you run "capture-only" (store contacts) by setting just the key + audience.
const RESEND_FROM = process.env.RESEND_FROM;
const BASE_POSITION = Number(process.env.WAITLIST_BASE_POSITION) || QUEUE_POSITION;

const canStore = Boolean(RESEND_KEY && AUDIENCE_ID);
const canSendGmail = gmailConfigured;
const canSendResend = Boolean(RESEND_KEY && RESEND_FROM);
const canSend = canSendGmail || canSendResend;

/**
 * The displayed queue position — a configured marketing anchor. Swap in a
 * datastore counter here if you want a truly incrementing position.
 */
function queuePosition(): number {
  return BASE_POSITION;
}

export async function joinWaitlist(
  rawEmail: unknown,
  source: "hero" | "cta" | "unknown" = "unknown",
): Promise<WaitlistResult> {
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 320) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const position = queuePosition();

  // Dev fallback: nothing configured → capture succeeds without external calls,
  // so the form is fully functional locally. Add creds to go live.
  if (!canStore && !canSend) {
    console.warn(
      `[waitlist] no email/storage creds — captured ${email} (${source}) in dev mode; nothing sent/stored.`,
    );
    return { ok: true, position, alreadyJoined: false };
  }

  const resend = RESEND_KEY ? new Resend(RESEND_KEY) : null;
  let alreadyJoined = false;
  let storeFailed = false;
  let sendFailed = false;

  // 1. Store the signup as a contact in the Resend Audience.
  if (canStore && resend) {
    try {
      const { error } = await resend.contacts.create({
        email,
        audienceId: AUDIENCE_ID!,
        unsubscribed: false,
      });
      if (error) {
        if (/already|exist/i.test(error.message)) alreadyJoined = true;
        else {
          storeFailed = true;
          console.error("[waitlist] contact.create failed:", error.message);
        }
      }
    } catch (err) {
      storeFailed = true;
      console.error("[waitlist] contact.create threw:", err);
    }
  }

  // 2. Send the welcome email — Gmail SMTP if configured, else Resend.
  if (canSendGmail) {
    try {
      await sendWelcomeEmail(email, position);
      void notifyFounder(email, source); // fire-and-forget, never throws
    } catch (err) {
      sendFailed = true;
      console.error("[waitlist] Gmail welcome email failed:", err);
    }
  } else if (canSendResend && resend) {
    try {
      const { error } = await resend.emails.send({
        from: RESEND_FROM!, // guaranteed by canSendResend
        to: email,
        subject: "You're on the Praxis AI waitlist 🎉",
        html: welcomeEmail(position),
      });
      if (error) {
        sendFailed = true;
        console.error("[waitlist] Resend welcome email failed:", error.message);
      }
    } catch (err) {
      sendFailed = true;
      console.error("[waitlist] Resend welcome email threw:", err);
    }
  }

  // If every configured sink failed, we truly didn't record the signup.
  const configured = (canStore ? 1 : 0) + (canSend ? 1 : 0);
  const failed = (storeFailed ? 1 : 0) + (sendFailed ? 1 : 0);
  if (configured > 0 && failed === configured) {
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  return { ok: true, position, alreadyJoined };
}
