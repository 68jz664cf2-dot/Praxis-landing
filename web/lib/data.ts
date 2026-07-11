// Content model for the Praxis landing page (ported from the v2 design).

export type FeedEntry = {
  initials: string;
  name: string;
  msg: string;
  chip: string;
};

export const FEED_POOL: FeedEntry[] = [
  { initials: "SA", name: "Sales", msg: "Followed up with 12 warm leads and booked 3 demos this week", chip: "3 booked" },
  { initials: "MK", name: "Marketing", msg: "Moved budget to your best-performing campaign", chip: "4.2× return" },
  { initials: "FI", name: "Finance", msg: "Reconciled this week's payments — your books are up to date", chip: "Done ✓" },
  { initials: "OP", name: "Operations", msg: "Reordered supplies before you ran low", chip: "On track" },
  { initials: "CS", name: "Support", msg: "Resolved 14 customer messages — flagged 1 for you", chip: "14 resolved" },
  { initials: "FI", name: "Finance", msg: "A vendor invoice is over your limit — drafted it for your approval", chip: "Needs you" },
  { initials: "MK", name: "Marketing", msg: "Published this week's content and scheduled next week's", chip: "Scheduled" },
  { initials: "SA", name: "Sales", msg: "Sent 240 personalized outreach emails — replies are coming in", chip: "12% replies" },
];

export type Agent = {
  initials: string;
  name: string;
  desc: string;
  sample: string;
};

export const AGENTS: Agent[] = [
  { initials: "SA", name: "Sales", desc: "Works your pipeline end-to-end — outreach, follow-ups, and booking demos.", sample: "3 demos booked today" },
  { initials: "MK", name: "Marketing", desc: "Runs ads and content across channels, always inside your budget.", sample: "Budget moved to a winner" },
  { initials: "FI", name: "Finance", desc: "Invoices, payments, and reconciliation — and it guards your limits.", sample: "Books reconciled ✓" },
  { initials: "OP", name: "Operations", desc: "Vendors, orders, and scheduling — the day-to-day that keeps things moving.", sample: "Reordered before running out" },
  { initials: "CS", name: "Support", desc: "Answers customers and resolves issues under your limits. Edge cases come to you.", sample: "14 messages resolved" },
  { initials: "GR", name: "Growth", desc: "Tests channels, measures results, and doubles down on what works.", sample: "Found a 4.2× channel" },
  { initials: "RE", name: "Reporting", desc: "A plain-language daily brief: what happened, and what it earned you.", sample: "Your 8am briefing, ready" },
  { initials: "PE", name: "People", desc: "Screens candidates and handles the busywork of hiring and onboarding.", sample: "5 candidates shortlisted" },
];

export type Department = {
  emoji: string;
  name: string;
  role: string;
  desc: string;
  tools: string[];
};

export const DEPARTMENTS: Department[] = [
  { emoji: "💼", name: "Sales", role: "Head of Sales", desc: "Works your pipeline end-to-end — outreach, follow-ups, demos, and closing the gaps.", tools: ["HubSpot", "Stripe"] },
  { emoji: "📣", name: "Marketing", role: "Head of Growth", desc: "Runs your ads and content across channels, hour by hour, always inside your budget.", tools: ["Meta Ads", "Google Ads"] },
  { emoji: "🧮", name: "Finance", role: "Your CFO", desc: "Invoices, payments, and reconciliation — nothing slips through, nothing overspends.", tools: ["Stripe", "QuickBooks"] },
  { emoji: "📦", name: "Operations", role: "Operations lead", desc: "Vendors, orders, scheduling, and the day-to-day that keeps the business running.", tools: ["Slack", "Notion"] },
  { emoji: "🤝", name: "Support", role: "Customer care", desc: "Answers customers and resolves issues within your limits. Tricky cases come to you.", tools: ["Gmail", "Intercom"] },
  { emoji: "🧑‍💼", name: "People", role: "Head of People", desc: "Screens candidates and handles the paperwork of hiring and onboarding.", tools: ["Gmail", "Notion"] },
];

export const INTEGRATIONS = [
  "Stripe",
  "QuickBooks",
  "HubSpot",
  "Meta Ads",
  "Slack",
  "Google Workspace",
  "Shopify",
  "Notion",
];

// Default post-signup queue position shown after joining the waitlist.
export const QUEUE_POSITION = 4201;

// Deterministic fake timestamp for feed entries, mirroring the prototype.
export function feedTime(i: number): string {
  const base = 14 * 3600 + 6 * 60 + 12 + i * 47;
  const h = Math.floor(base / 3600) % 24;
  const m = String(Math.floor(base / 60) % 60).padStart(2, "0");
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${m} pm`;
}
