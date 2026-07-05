import { Resend } from "resend";
import { QUEUE_POSITION } from "./data";
import { welcomeEmail } from "./welcome-email";

export type WaitlistResult =
  | { ok: true; position: number; alreadyJoined: boolean }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const API_KEY = process.env.RESEND_API_KEY;
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const FROM = process.env.RESEND_FROM ?? "Praxis AI <onboarding@resend.dev>";
const BASE_POSITION = Number(process.env.WAITLIST_BASE_POSITION) || QUEUE_POSITION;

/**
 * The displayed queue position. Resend has no cheap "audience size" call, so we
 * anchor on a configured base (matches the launch design). Swap in a datastore
 * counter here if you want a truly incrementing position.
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

  // Dev fallback: no key configured → capture succeeds without external calls,
  // so the form is fully functional locally. Add RESEND_API_KEY to go live.
  if (!API_KEY) {
    console.warn(
      `[waitlist] RESEND_API_KEY not set — captured ${email} (${source}) in dev mode; no contact/email sent.`,
    );
    return { ok: true, position: queuePosition(), alreadyJoined: false };
  }

  const resend = new Resend(API_KEY);
  let alreadyJoined = false;

  // 1. Store the signup as a contact in the audience.
  if (AUDIENCE_ID) {
    try {
      const { error } = await resend.contacts.create({
        email,
        audienceId: AUDIENCE_ID,
        unsubscribed: false,
      });
      if (error) {
        // Treat "already exists" as a soft success rather than a failure.
        if (/already|exist/i.test(error.message)) alreadyJoined = true;
        else console.error("[waitlist] contact.create failed:", error.message);
      }
    } catch (err) {
      console.error("[waitlist] contact.create threw:", err);
    }
  } else {
    console.warn("[waitlist] RESEND_AUDIENCE_ID not set — skipping contact storage.");
  }

  // 2. Send the branded welcome email.
  const position = queuePosition();
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "You're on the Praxis AI waitlist 🎉",
      html: welcomeEmail(position),
    });
    if (error) {
      console.error("[waitlist] email.send failed:", error.message);
      // If we couldn't store the contact AND couldn't email, surface a failure.
      if (!AUDIENCE_ID) {
        return { ok: false, error: "Something went wrong. Please try again." };
      }
    }
  } catch (err) {
    console.error("[waitlist] email.send threw:", err);
  }

  return { ok: true, position, alreadyJoined };
}
