# Praxis AI — Landing Page

Production implementation of the **Praxis Landing v2** design exported from Claude
Design (`../project/Praxis Landing v2.dc.html`). Built with **Next.js 16 (App
Router) + Tailwind CSS v4 + TypeScript**, the stack mandated by the source spec
(`../project/uploads/AI dr 4.txt`).

The "Digital Twilight" aesthetic is preserved exactly: graphite/obsidian base,
frost-white text, a single electric-cyan accent, an exposed 1px technical grid,
and tabular figures via Geist / Geist Mono.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (static)
npm run start    # serve the production build
```

## Structure

- `app/globals.css` — Tailwind v4 theme tokens (the full palette) + base styles.
- `app/layout.tsx` — Geist/Geist Mono fonts, metadata.
- `app/page.tsx` — composes the sections + the fixed technical grid.
- `lib/data.ts` — content model (activity feed, agents, departments, integrations).
- `components/` — one file per section:
  - `Header` (sticky, scroll-progress bar) · `Hero` (live agent activity feed +
    waitlist capture) · `ValidationGap` · `DashboardReveal` (3-step selector with
    auto-advance) · `AgenticCapabilities` (bento) · `OrgChart` (you → Praxis →
    departments, with per-department tools) · `DailyBriefing` · `TrustGuardrails`
    (Approve / Not now) · `Integrations` · `FinalCTA` + footer.
  - `ScrollMotion` — kinetic blur-rise reveals, staggered groups, and cyan
    hairline traces (honors `prefers-reduced-motion`).
  - `Logo`, `SectionHeading`, `WaitlistForm` — shared pieces.

Interactive behavior (feed ticking, step auto-advance, approve/reject, waitlist
success with queue position) is verified end-to-end at desktop and mobile widths.

## Waitlist (Gmail send + Resend list)

Both signup forms POST to `app/api/waitlist/route.ts` → `lib/waitlist.ts`, which:

1. Validates + normalizes the email.
2. Stores the signup as a contact in a **Resend Audience** (`lib/waitlist.ts`).
3. Sends an on-brand **welcome email** from **Gmail SMTP** (`lib/mailer.ts`,
   template in `lib/welcome-email.ts`) and a "new signup" heads-up to you.

The two sinks are independent and best-effort: a signup only fails if *every*
configured sink fails. With no credentials at all, it runs in a **dev fallback**
that captures + logs locally so the form works immediately.

### Config

Copy `.env.example` → `.env.local` (or set these in your host):

| Variable                 | Purpose                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| `GMAIL_USER`             | Gmail address that sends the welcome email.                             |
| `GMAIL_APP_PASSWORD`     | 16-char **App Password** (needs 2-Step Verification). Never your login. |
| `GMAIL_NOTIFY`           | Where "new signup" alerts go (defaults to `GMAIL_USER`).               |
| `RESEND_API_KEY`         | Resend API key — stores signups as contacts.                           |
| `RESEND_AUDIENCE_ID`     | Resend Audience to store contacts in.                                   |
| `WAITLIST_BASE_POSITION` | Number shown as the queue position (default `4201`).                    |

Gmail App Password: enable 2-Step Verification, then create one at
<https://myaccount.google.com/apppasswords>. Free Gmail sends ~500 emails/day
(Workspace ~2,000); for higher volume move to a domain-verified sender.

> Queue position is a fixed marketing anchor. For a truly incrementing position,
> back it with a datastore counter in `lib/waitlist.ts`.
