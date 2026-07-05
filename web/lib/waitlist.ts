import { Resend } from "resend";
import { QUEUE_POSITION } from "./data";
import { gmailConfigured, sendWelcomeEmail, notifyFounder } from "./mailer";

export type WaitlistResult =
  | { ok: true; position: number; alreadyJoined: boolean }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Resend stores the contact list; Gmail (SMTP) sends the welcome email.
const RESEND_KEY = process.env.RESEND_API_KEY;
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const BASE_POSITION = Number(process.env.WAITLIST_BASE_POSITION) || QUEUE_POSITION;

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
  const resendConfigured = Boolean(RESEND_KEY && AUDIENCE_ID);

  // Dev fallback: nothing configured → capture succeeds without external calls,
  // so the form is fully functional locally. Add creds to go live.
  if (!resendConfigured && !gmailConfigured) {
    console.warn(
      `[waitlist] no Resend/Gmail creds — captured ${email} (${source}) in dev mode; nothing sent/stored.`,
    );
    return { ok: true, position, alreadyJoined: false };
  }

  let alreadyJoined = false;
  let storeFailed = false;
  let emailFailed = false;

  // 1. Store the signup as a contact in the Resend Audience.
  if (resendConfigured) {
    try {
      const resend = new Resend(RESEND_KEY);
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

  // 2. Send the welcome email from Gmail (and a founder notification).
  if (gmailConfigured) {
    try {
      await sendWelcomeEmail(email, position);
    } catch (err) {
      emailFailed = true;
      console.error("[waitlist] welcome email failed:", err);
    }
    void notifyFounder(email, source); // fire-and-forget, never throws
  }

  // If every configured sink failed, we truly didn't record the signup.
  const configuredCount = (resendConfigured ? 1 : 0) + (gmailConfigured ? 1 : 0);
  const failedCount = (storeFailed ? 1 : 0) + (emailFailed ? 1 : 0);
  if (configuredCount > 0 && failedCount === configuredCount) {
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  return { ok: true, position, alreadyJoined };
}
