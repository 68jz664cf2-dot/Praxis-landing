// Content model for the Praxis landing page (ported from the v2 design).

export type FeedEntry = {
  initials: string;
  name: string;
  msg: string;
  chip: string;
};

export const FEED_POOL: FeedEntry[] = [
  { initials: "AO", name: "Ad Optimizer", msg: "Moved $500 to your best-performing ad set", chip: "4.2× return" },
  { initials: "IP", name: "Inventory Planner", msg: "Your candle set is selling 18% faster — updated the reorder plan", chip: "On track" },
  { initials: "EM", name: "Email & SMS", msg: "Sent your winback email to 2,841 lapsed customers", chip: "Sent ✓" },
  { initials: "AO", name: "Ad Optimizer", msg: "Paused an underperforming ad before it wasted more budget", chip: "Saved $120" },
  { initials: "FI", name: "Finance", msg: "Checked your margins — comfortably above your 38% floor", chip: "41.2% ✓" },
  { initials: "IP", name: "Inventory Planner", msg: "Drafted a big restock order and flagged it for your approval", chip: "Needs you" },
  { initials: "SU", name: "Support", msg: "Refunded a $42 order — well within your limits", chip: "Done ✓" },
  { initials: "EM", name: "Email & SMS", msg: "Your A/B test finished — the winning subject line is live", chip: "+12% opens" },
];

export type Agent = {
  initials: string;
  name: string;
  desc: string;
  sample: string;
};

export const AGENTS: Agent[] = [
  { initials: "SA", name: "Sales", desc: "Keeps prices and promos healthy — always above your margin floor.", sample: "Adjusted 3 prices today" },
  { initials: "PU", name: "Publishing", desc: "Writes and ships product copy and campaigns in your brand voice.", sample: "12 pages refreshed" },
  { initials: "RE", name: "Reporting", desc: "A plain-language daily brief: what happened, what it earned you.", sample: "Your 8am briefing, ready" },
  { initials: "AO", name: "Ad Optimizer", desc: "Shifts ad budget to what's working — hourly, within your caps.", sample: "Moved $500 to a winner" },
  { initials: "IP", name: "Inventory", desc: "Spots stockouts weeks ahead and drafts reorders for your OK.", sample: "Restock drafted for you" },
  { initials: "EM", name: "Email & SMS", desc: "Runs your flows end-to-end and picks A/B winners on its own.", sample: "Winback flow live" },
  { initials: "SU", name: "Support", desc: "Handles refunds and reships under your limit. Edge cases come to you.", sample: "14 tickets resolved" },
  { initials: "FI", name: "Finance", desc: "Reconciles payouts and taps the brakes if anything nears a limit.", sample: "All payouts matched ✓" },
];

export type Department = {
  emoji: string;
  name: string;
  role: string;
  desc: string;
  tools: string[];
};

export const DEPARTMENTS: Department[] = [
  { emoji: "🛍️", name: "Sales", role: "Head of Sales", desc: "Manages your prices, promos, and product listings — and closes the gap when a day runs slow.", tools: ["Shopify", "Stripe"] },
  { emoji: "📣", name: "Marketing", role: "Head of Ads", desc: "Runs your ad budget across channels, hour by hour, always inside your spend caps.", tools: ["Meta Ads", "Google Ads", "TikTok Shop"] },
  { emoji: "💌", name: "Email & SMS", role: "Lifecycle lead", desc: "Sends the right message at the right time — welcomes, winbacks, and everything between.", tools: ["Klaviyo"] },
  { emoji: "📦", name: "Inventory", role: "Operations lead", desc: "Watches your stock weeks ahead and drafts reorders before you ever run out.", tools: ["Shopify", "ShipBob"] },
  { emoji: "🤝", name: "Support", role: "Customer care", desc: "Resolves refunds and reships within your limits. Tricky cases come straight to you.", tools: ["Gorgias"] },
  { emoji: "🧮", name: "Finance", role: "Your CFO", desc: "Reconciles every payout and guards your margin floor — nothing slips through.", tools: ["Stripe", "Shopify"] },
];

export const INTEGRATIONS = [
  "Shopify",
  "Meta Ads",
  "Klaviyo",
  "Stripe",
  "Google Ads",
  "TikTok Shop",
  "Gorgias",
  "ShipBob",
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
