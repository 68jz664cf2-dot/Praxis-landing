// Durable signup storage via a Google Apps Script web app bound to your Sheet.
// The script appends a row per registration and returns the running count.

const WEBHOOK = process.env.SHEETS_WEBHOOK_URL;

export const sheetConfigured = Boolean(WEBHOOK);

export type SignupRow = {
  fullName: string;
  email: string;
  country: string;
  age: number;
  source: string;
};

export type AppendResult = {
  ok: boolean;
  /** Total signups in the sheet after this insert (excludes header row). */
  count?: number;
  /** True when the email was already present (no new row added). */
  duplicate?: boolean;
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Append a signup to the Google Sheet, retrying transient failures so a
 * registration is never silently lost. Returns ok:false only after all retries.
 */
export async function appendSignup(
  row: SignupRow,
  attempts = 3,
): Promise<AppendResult> {
  if (!WEBHOOK) return { ok: false };
  let lastErr = "";
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });
      if (res.ok) {
        const data = (await res.json().catch(() => null)) as AppendResult | null;
        if (data && data.ok === true) {
          return { ok: true, count: data.count, duplicate: data.duplicate };
        }
        lastErr = `bad response: ${JSON.stringify(data)}`;
      } else {
        lastErr = `HTTP ${res.status}`;
      }
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
    }
    if (i < attempts - 1) await delay(300 * (i + 1));
  }
  console.error(`[waitlist] sheet append failed after ${attempts} tries: ${lastErr}`);
  return { ok: false };
}
