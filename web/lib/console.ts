// Data model for the Praxis command center (/console) — the founder's cockpit
// for running a whole company through agents. Illustrative prototype data.

export type AgentStatus = "running" | "needs-ok" | "paused";

export type ConsoleAgent = {
  key: string;
  name: string;
  initials: string;
  tool: string;
  status: AgentStatus;
  lastAction: string;
  streakDays: number;
};

export const CONSOLE_AGENTS: ConsoleAgent[] = [
  { key: "sales", name: "Sales", initials: "SA", tool: "HubSpot", status: "running", lastAction: "Booked 3 demos this morning", streakDays: 21 },
  { key: "marketing", name: "Marketing", initials: "MK", tool: "Meta Ads", status: "running", lastAction: "Moved budget to your best channel", streakDays: 14 },
  { key: "finance", name: "Finance", initials: "FI", tool: "Stripe", status: "needs-ok", lastAction: "Flagged a $20,500 invoice for you", streakDays: 45 },
  { key: "operations", name: "Operations", initials: "OP", tool: "Slack", status: "running", lastAction: "Reordered supplies before running low", streakDays: 30 },
  { key: "support", name: "Support", initials: "CS", tool: "Intercom", status: "running", lastAction: "Resolved 14 customer messages", streakDays: 9 },
  { key: "people", name: "People", initials: "PE", tool: "Gmail", status: "paused", lastAction: "Shortlisted 5 candidates", streakDays: 3 },
];

export type FeedItem = {
  id: number;
  initials: string;
  name: string;
  msg: string;
  chip: string;
  time: string;
};

// Rotating pool the live ticker draws from.
export const CONSOLE_FEED: Omit<FeedItem, "id" | "time">[] = [
  { initials: "SA", name: "Sales", msg: "Followed up with 12 warm leads and booked 3 demos", chip: "3 booked" },
  { initials: "MK", name: "Marketing", msg: "Moved budget to your best-performing campaign", chip: "4.2× return" },
  { initials: "FI", name: "Finance", msg: "Reconciled this week's payments — books are up to date", chip: "Done ✓" },
  { initials: "OP", name: "Operations", msg: "Reordered supplies before you ran low", chip: "On track" },
  { initials: "CS", name: "Support", msg: "Resolved 14 customer messages — flagged 1 for you", chip: "14 resolved" },
  { initials: "MK", name: "Marketing", msg: "Published this week's content and scheduled next week's", chip: "Scheduled" },
  { initials: "SA", name: "Sales", msg: "Sent 240 personalized outreach emails", chip: "12% replies" },
  { initials: "FI", name: "Finance", msg: "Caught a duplicate software charge and cancelled it", chip: "Saved $340" },
  { initials: "PE", name: "People", msg: "Screened 60 applicants and shortlisted the top 5", chip: "5 shortlisted" },
  { initials: "OP", name: "Operations", msg: "Rescheduled a vendor delivery around the holiday", chip: "Handled" },
];

export type ApprovalMetric = { label: string; value: string };

export type Approval = {
  id: string;
  risk: "high" | "medium";
  title: string;
  subtitle: string;
  reasons: string[];
  metrics: ApprovalMetric[];
};

export const APPROVALS: Approval[] = [
  {
    id: "invoice-4471",
    risk: "high",
    title: "Approve this $20,500 payment?",
    subtitle: "Acme Co. · invoice #4471 · due in 5 days",
    reasons: [
      "A $20,500 invoice came in from a vendor you already work with.",
      "It matches the order you approved, and the vendor is verified.",
      "It's within budget — but it's over your $500 auto-approve limit.",
      "So Praxis paused and brought it to you before paying.",
    ],
    metrics: [
      { label: "Cash impact", value: "−$20,500" },
      { label: "Payment due in", value: "5 days" },
    ],
  },
];

// Medium-risk items the founder scans and approves together in a batch.
export const BATCH_REVIEW = [
  { id: "b1", dept: "Marketing", text: "Raise the daily budget on the winning campaign from $400 → $600" },
  { id: "b2", dept: "Sales", text: "Send a 10% renewal offer to 3 accounts that lapsed last month" },
  { id: "b3", dept: "Operations", text: "Switch to the cheaper shipping vendor for orders under 2kg" },
  { id: "b4", dept: "People", text: "Move 5 shortlisted candidates to a first-round screen" },
];

export const KPIS = {
  valueVelocityStart: 47120, // $ created / saved while you were away
  actionsToday: 1247,
  marginProtected: "38.0%",
  waitingOnYou: 1,
};
