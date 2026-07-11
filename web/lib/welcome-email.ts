// Digital-Twilight-branded welcome email. Inline styles only — email clients
// strip <style>/class-based CSS, so every rule lives on the element.

// First name for a friendly greeting, from a full name.
function firstName(name?: string): string {
  const first = (name ?? "").trim().split(/\s+/)[0];
  return first || "there";
}

export function welcomeEmail(position: number, name?: string): string {
  const pos = position.toLocaleString("en-US");
  const hi = firstName(name);
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0a0a0c;color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0c;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
            <!-- Wordmark -->
            <tr>
              <td style="padding-bottom:28px;">
                <span style="font-size:18px;font-weight:700;letter-spacing:0.04em;color:#f3f4f6;">PRAXIS</span>
                <span style="font-size:14px;font-weight:500;color:#8a8b92;margin-left:8px;">AI</span>
              </td>
            </tr>
            <!-- Card -->
            <tr>
              <td style="background:#101014;border:1px solid #26262b;border-radius:20px;padding:32px;">
                <div style="font-size:24px;font-weight:700;line-height:1.2;color:#f3f4f6;">You're on the waitlist, ${hi}. 🎉</div>
                <div style="margin-top:20px;padding:18px 20px;background:rgba(0,240,255,0.05);border:1px solid rgba(0,240,255,0.4);border-radius:14px;">
                  <div style="font-size:13px;color:#a6a7ad;">Your position</div>
                  <div style="font-size:28px;font-weight:700;color:#00f0ff;font-variant-numeric:tabular-nums;">#${pos}</div>
                </div>
                <p style="margin:20px 0 0;font-size:15px;line-height:1.65;color:#c9cad1;">
                  Thanks for joining Praxis AI — the engine for autonomous companies.
                  You bring the idea; Praxis becomes your whole back office: sales, ads,
                  inventory, email, and support, all inside the limits you set.
                </p>
                <p style="margin:16px 0 0;font-size:15px;line-height:1.65;color:#c9cad1;">
                  <strong style="color:#f3f4f6;">Want to jump ahead 1,000 spots?</strong>
                  Invite two friends who run stores — we'll move you up the queue.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding-top:24px;font-size:12px;color:#55565e;">
                © 2026 Praxis AI · The engine for autonomous companies
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
