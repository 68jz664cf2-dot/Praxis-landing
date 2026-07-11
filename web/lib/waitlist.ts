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

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Store the signup as a Resend Audience contact, retrying transient failures so
 * we never silently drop a registration. A duplicate email counts as success.
 */
async function storeContact(
  resend: Resend,
  email: string,
  attempts = 3,
): Promise<{ ok: boolean; alreadyJoined: boolean }> {
  let lastErr = "";
  for (let i = 0; i < attempts; i++) {
    try {
      const { error } = await resend.contacts.create({
        email,
        audienceId: AUDIENCE_ID!,
        unsubscribed: false,
      });
      if (!error) return { ok: true, alreadyJoined: false };
      if (/already|exist/i.test(error.message))
        return { ok: true, alreadyJoined: true };
      lastErr = error.message;
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
    }
    if (i < attempts - 1) await delay(300 * (i + 1));
  }
  console.error(`[waitlist] contact.create failed after ${attempts} tries: ${lastErr}`);
  return { ok: false, alreadyJoined: false };
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

  // 1. Store the signup as a contact in the Resend Audience (with retries).
  if (canStore && resend) {
    const stored = await storeContact(resend, email);
    storeFailed = !stored.ok;
    alreadyJoined = stored.alreadyJoined;
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

  // Storage is authoritative: if we were supposed to save the signup but
  // couldn't (after retries), never report success — the person should retry.
  if (canStore && storeFailed) {
    return { ok: false, error: "We couldn't save your spot. Please try again." };
  }
  // No storage configured but sending is, and the send failed → surface it.
  if (!canStore && canSend && sendFailed) {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  // Stored OK; a failed welcome email is secondary and doesn't lose the signup.
  return { ok: true, position, alreadyJoined };
}
