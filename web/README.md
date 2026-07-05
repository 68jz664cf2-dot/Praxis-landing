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

## Waitlist (Resend)

Both signup forms POST to `app/api/waitlist/route.ts`, which calls
`lib/waitlist.ts`:

1. Validates + normalizes the email.
2. Stores the signup as a contact in a **Resend Audience**.
3. Sends an on-brand **welcome email** (`lib/welcome-email.ts`) with the queue
   position.

### Config

Copy `.env.example` → `.env.local` and fill in:

| Variable                 | Purpose                                                        |
| ------------------------ | ------------------------------------------------------------- |
| `RESEND_API_KEY`         | Resend API key. **Without it, the form runs in dev mode** — signups are captured/logged locally, no external calls. |
| `RESEND_AUDIENCE_ID`     | Audience to store contacts in.                                |
| `RESEND_FROM`            | Verified sender (defaults to Resend's shared test sender).    |
| `WAITLIST_BASE_POSITION` | Number shown as the queue position (default `4201`).          |

The dev-mode fallback means the page works immediately with no credentials; add
the key to go live. Verify a domain in Resend before using a real `RESEND_FROM`.

> Queue position is a fixed marketing anchor (Resend has no cheap audience-count
> call). For a truly incrementing position, back it with a datastore counter in
> `lib/waitlist.ts`.
