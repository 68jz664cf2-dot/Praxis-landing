import { Resend } from "resend";
import { QUEUE_POSITION } from "./data";
import { COUNTRY_SET } from "./countries";
import { welcomeEmail } from "./welcome-email";
import { sheetConfigured, appendSignup } from "./sheets";
import { gmailConfigured, sendWelcomeEmail, notifyFounder } from "./mailer";

export type WaitlistResult =
  | { ok: true; position: number; alreadyJoined: boolean }
  | { ok: false; error: string };

export type SignupInput = {
  fullName: unknown;
  email: unknown;
  country: unknown;
  age: unknown;
  source?: "hero" | "cta" | "unknown";
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_AGE = 13;
const MAX_AGE = 120;

// The Google Sheet is the durable store. Resend/Gmail only send the welcome email.
const RESEND_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM;
const BASE_POSITION = Number(process.env.WAITLIST_BASE_POSITION) || QUEUE_POSITION;

const canStore = sheetConfigured;
const canSendGmail = gmailConfigured;
const canSendResend = Boolean(RESEND_KEY && RESEND_FROM);
const canSend = canSendGmail || canSendResend;

type CleanSignup = {
  fullName: string;
  email: string;
  country: string;
  age: number;
  source: string;
};

// Validate + normalize the raw form input. Returns a friendly error string on
// the first invalid field.
function validate(input: SignupInput): { data?: CleanSignup; error?: string } {
  const fullName = typeof input.fullName === "string" ? input.fullName.trim() : "";
  if (fullName.length < 2 || fullName.length > 120) {
    return { error: "Please enter your full name." };
  }

  const email =
    typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 320) {
    return { error: "Please enter a valid email address." };
  }

  const country = typeof input.country === "string" ? input.country.trim() : "";
  if (!COUNTRY_SET.has(country)) {
    return { error: "Please select your country." };
  }

  const age = Number(input.age);
  if (!Number.isInteger(age) || age < MIN_AGE || age > MAX_AGE) {
    return { error: `Please enter a valid age (${MIN_AGE}–${MAX_AGE}).` };
  }

  const source =
    input.source === "hero" || input.source === "cta" ? input.source : "unknown";

  return { data: { fullName, email, country, age, source } };
}

export async function joinWaitlist(input: SignupInput): Promise<WaitlistResult> {
  const { data, error } = validate(input);
  if (!data) return { ok: false, error: error! };

  // Dev fallback: nothing configured → succeed without external calls so the
  // form works locally. Add the Sheet webhook (and Resend) to go live.
  if (!canStore && !canSend) {
    console.warn(
      `[waitlist] no storage/email creds — captured ${data.email} (${data.source}) in dev mode.`,
    );
    return { ok: true, position: BASE_POSITION, alreadyJoined: false };
  }

  let position = BASE_POSITION;
  let alreadyJoined = false;

  // 1. Store the signup in the Google Sheet (authoritative — never claim success
  //    unless it's actually saved). Real queue position = base + total signups.
  if (canStore) {
    const stored = await appendSignup(data);
    if (!stored.ok) {
      return { ok: false, error: "We couldn't save your spot. Please try again." };
    }
    alreadyJoined = Boolean(stored.duplicate);
    if (typeof stored.count === "number") position = BASE_POSITION + stored.count;
  }

  // 2. Send the welcome email — Gmail SMTP if configured, else Resend. Best-effort:
  //    a failed email does not lose the (already-stored) signup.
  if (canSendGmail) {
    try {
      await sendWelcomeEmail(data.email, position, data.fullName);
      void notifyFounder(data.email, data.source);
    } catch (err) {
      console.error("[waitlist] Gmail welcome email failed:", err);
    }
  } else if (canSendResend) {
    try {
      const resend = new Resend(RESEND_KEY);
      const { error: sendErr } = await resend.emails.send({
        from: RESEND_FROM!,
        to: data.email,
        subject: "You're on the Praxis AI waitlist 🎉",
        html: welcomeEmail(position, data.fullName),
      });
      if (sendErr) console.error("[waitlist] Resend welcome email failed:", sendErr.message);
    } catch (err) {
      console.error("[waitlist] Resend welcome email threw:", err);
    }
  }

  // No storage configured but sending is → the send is the only signal; if it
  // threw we still return ok (we logged it) to avoid blocking the signup.
  return { ok: true, position, alreadyJoined };
}
