import nodemailer from "nodemailer";
import { welcomeEmail } from "./welcome-email";

const USER = process.env.GMAIL_USER;
const PASS = process.env.GMAIL_APP_PASSWORD;
// Optional: address that gets a "new signup" notification (defaults to GMAIL_USER).
const NOTIFY = process.env.GMAIL_NOTIFY ?? process.env.GMAIL_USER;

export const gmailConfigured = Boolean(USER && PASS);

// One shared transporter. Gmail SMTP over implicit TLS (App Password required —
// enable 2-Step Verification, then create the password at
// https://myaccount.google.com/apppasswords).
let transporter: nodemailer.Transporter | null = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: USER, pass: PASS },
      // Fail fast on a bad/unreachable SMTP config instead of hanging the
      // request for the default multi-minute timeout.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }
  return transporter;
}

/** Send the branded welcome email to a new signup. Throws on SMTP failure. */
export async function sendWelcomeEmail(to: string, position: number) {
  await getTransporter().sendMail({
    from: `"Praxis AI" <${USER}>`,
    to,
    subject: "You're on the Praxis AI waitlist 🎉",
    html: welcomeEmail(position),
  });
}

/** Best-effort internal heads-up that someone joined. Never throws. */
export async function notifyFounder(signupEmail: string, source: string) {
  if (!NOTIFY) return;
  try {
    await getTransporter().sendMail({
      from: `"Praxis Waitlist" <${USER}>`,
      to: NOTIFY,
      subject: `New waitlist signup: ${signupEmail}`,
      text: `${signupEmail} just joined the Praxis waitlist (via ${source}).`,
    });
  } catch (err) {
    console.error("[waitlist] founder notification failed:", err);
  }
}
