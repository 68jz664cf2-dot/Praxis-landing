"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/Logo";
import {
  CONSOLE_AGENTS,
  CONSOLE_FEED,
  APPROVALS,
  BATCH_REVIEW,
  KPIS,
  type ConsoleAgent,
  type FeedItem,
} from "@/lib/console";

type View = "today" | "approvals" | "departments" | "guardrails";

const NAV: { key: View; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "approvals", label: "Approvals" },
  { key: "departments", label: "Departments" },
  { key: "guardrails", label: "Guardrails" },
];

const INITIAL_TIMES = ["just now", "3m", "7m", "12m", "18m"];

export default function Console() {
  const [view, setView] = useState<View>("today");
  const [velocity, setVelocity] = useState(KPIS.valueVelocityStart);
  const [feed, setFeed] = useState<FeedItem[]>(() =>
    CONSOLE_FEED.slice(0, 5).map((f, i) => ({ ...f, id: i, time: INITIAL_TIMES[i] })),
  );
  const [agents, setAgents] = useState<ConsoleAgent[]>(CONSOLE_AGENTS);
  const [invoiceDecision, setInvoiceDecision] = useState<"approved" | "held" | null>(null);
  const [batchApproved, setBatchApproved] = useState(false);
  const [autonomy, setAutonomy] = useState(65);
  const [cmdOpen, setCmdOpen] = useState(false);

  const feedCursor = useRef(5);

  // Value Velocity ticks upward — the "money made while you slept" hook.
  useEffect(() => {
    const id = setInterval(() => {
      setVelocity((v) => v + Math.round(8 + Math.random() * 60));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // Live agent ticker — new wins drop in over time.
  useEffect(() => {
    const id = setInterval(() => {
      const next = CONSOLE_FEED[feedCursor.current % CONSOLE_FEED.length];
      feedCursor.current += 1;
      setFeed((f) => [{ ...next, id: feedCursor.current + 100, time: "just now" }, ...f].slice(0, 6));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Cmd/Ctrl+K opens the command bar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      } else if (e.key === "Escape") {
        setCmdOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pendingCount = invoiceDecision === null ? 1 : 0;

  function toggleAgent(key: string) {
    setAgents((list) =>
      list.map((a) =>
        a.key === key
          ? { ...a, status: a.status === "paused" ? "running" : "paused" }
          : a,
      ),
    );
  }

  return (
    <div className="flex min-h-screen bg-obsidian text-frost">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-well px-4 py-5 md:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <LogoMark size={26} />
          <span className="flex items-baseline gap-2">
            <span className="text-[15px] font-bold tracking-[0.04em]">PRAXIS</span>
            <span className="text-xs font-medium text-dim">AI</span>
          </span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <NavButton
              key={n.key}
              label={n.label}
              active={view === n.key}
              badge={n.key === "approvals" ? pendingCount : 0}
              onClick={() => setView(n.key)}
            />
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-line bg-panel p-3 text-[12.5px] text-faint">
          Press{" "}
          <kbd className="rounded border border-line-3 bg-panel-2 px-1.5 py-0.5 font-mono text-[11px] text-muted">
            ⌘K
          </kbd>{" "}
          to command your agents.
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-3 border-b border-line bg-obsidian/80 px-[clamp(16px,3vw,28px)] py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-semibold">Maya&apos;s Company</span>
            {pendingCount > 0 && (
              <span className="rounded-full bg-cyan/10 px-2.5 py-1 text-[12px] font-semibold text-cyan-ice">
                {pendingCount} waiting on you
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCmdOpen(true)}
              className="hidden items-center gap-2 rounded-lg border border-line-3 bg-panel px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-cyan/40 sm:flex"
            >
              <span>Ask your agents…</span>
              <kbd className="rounded border border-line-3 bg-panel-2 px-1.5 font-mono text-[11px]">
                ⌘K
              </kbd>
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan/15 text-[13px] font-semibold text-cyan-ice">
              M
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="flex gap-1 overflow-x-auto border-b border-line px-3 py-2 md:hidden">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setView(n.key)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium ${
                view === n.key ? "bg-panel-2 text-frost" : "text-muted"
              }`}
            >
              {n.label}
              {n.key === "approvals" && pendingCount > 0 ? " ·1" : ""}
            </button>
          ))}
        </div>

        {/* Agent bullpen */}
        <div className="flex items-center gap-3 overflow-x-auto border-b border-line px-[clamp(16px,3vw,28px)] py-3">
          <span className="shrink-0 text-[12px] text-faint">Your team</span>
          {agents.map((a) => (
            <div key={a.key} className="flex shrink-0 items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-[9px] border text-[12px] font-semibold ${
                  a.status === "paused"
                    ? "border-line-3 bg-panel-2 text-faint"
                    : "border-cyan/40 bg-cyan/10 text-cyan-ice shadow-[0_0_12px_rgba(0,240,255,0.25)]"
                }`}
              >
                {a.initials}
              </span>
            </div>
          ))}
        </div>

        {/* Active view */}
        <main className="flex-1 overflow-y-auto px-[clamp(16px,3vw,28px)] py-[clamp(18px,3vw,28px)]">
          {view === "today" && (
            <TodayView velocity={velocity} feed={feed} onGoApprovals={() => setView("approvals")} />
          )}
          {view === "approvals" && (
            <ApprovalsView
              decision={invoiceDecision}
              onDecision={setInvoiceDecision}
              batchApproved={batchApproved}
              onApproveBatch={() => setBatchApproved(true)}
            />
          )}
          {view === "departments" && <DepartmentsView agents={agents} onToggle={toggleAgent} />}
          {view === "guardrails" && <GuardrailsView autonomy={autonomy} setAutonomy={setAutonomy} />}
        </main>
      </div>

      {cmdOpen && <CommandBar onClose={() => setCmdOpen(false)} />}
    </div>
  );
}

function NavButton({
  label,
  active,
  badge,
  onClick,
}: {
  label: string;
  active: boolean;
  badge: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between rounded-lg px-3 py-2 text-[14px] font-medium transition-colors ${
        active ? "bg-panel-2 text-frost" : "text-muted hover:text-frost"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-cyan" : "bg-line-4"}`} />
        {label}
      </span>
      {badge > 0 && (
        <span className="rounded-full bg-cyan/15 px-1.5 text-[11px] font-semibold text-cyan-ice">
          {badge}
        </span>
      )}
    </button>
  );
}

/* ── Today ─────────────────────────────────────────────────────── */
function TodayView({
  velocity,
  feed,
  onGoApprovals,
}: {
  velocity: number;
  feed: FeedItem[];
  onGoApprovals: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-5">
      <div>
        <h1 className="text-[clamp(22px,3vw,30px)] font-bold tracking-[-0.02em]">
          Good morning, Maya ☀️
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          While you were away, your company kept running. Here&apos;s where things stand.
        </p>
      </div>

      {/* Value Velocity + KPIs */}
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[18px] border border-cyan/25 bg-panel p-6 shadow-[0_0_30px_rgba(0,240,255,0.06)]">
          <div className="text-[13px] text-muted">Value created &amp; saved while you were away</div>
          <div className="tnum mt-2 text-[clamp(34px,5vw,52px)] font-bold leading-none text-cyan">
            ${velocity.toLocaleString("en-US")}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[13px] text-cyan-ice">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
            Updating live · ~68 agent actions/hour
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
          <Kpi label="Actions today" value={KPIS.actionsToday.toLocaleString("en-US")} />
          <Kpi label="Margin protected" value={KPIS.marginProtected} />
          <Kpi label="Waiting on you" value={String(KPIS.waitingOnYou)} accent />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        {/* Action queue + briefing */}
        <div className="flex flex-col gap-4">
          <Panel title="Needs your call today">
            <button
              onClick={onGoApprovals}
              className="flex w-full items-center justify-between rounded-xl border border-cyan/30 bg-cyan/[0.05] px-4 py-3 text-left transition-colors hover:border-cyan/50"
            >
              <span>
                <span className="block text-[14.5px] font-semibold">Approve a $20,500 vendor payment</span>
                <span className="block text-[12.5px] text-muted">Over your $500 auto-approve limit · due in 5 days</span>
              </span>
              <span className="text-cyan-ice">→</span>
            </button>
            <div className="mt-2 rounded-xl border border-line bg-panel-2 px-4 py-3 text-[13px] text-faint">
              4 smaller decisions are batched for your Daily Review.
            </div>
          </Panel>
          <Panel title="This morning's briefing">
            <p className="text-[14px] leading-[1.6] text-ink">
              Yesterday closed at <strong className="text-frost">$12,480</strong> — your best day
              this month. Nothing went wrong overnight, and spending stayed inside your limits.
              The one thing that needs you: the vendor payment above.
            </p>
          </Panel>
        </div>

        {/* Live ticker */}
        <Panel title="Your agents, working right now" live>
          <div className="flex flex-col gap-2">
            {feed.map((item) => (
              <div
                key={item.id}
                className="animate-feed-in flex items-start gap-3 rounded-xl border border-line bg-panel-2 px-3 py-2.5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-cyan/25 bg-cyan/10 text-[11px] font-semibold text-cyan-ice">
                  {item.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13.5px] font-semibold">{item.name}</span>
                    <span className="tnum text-[11px] text-faint">{item.time}</span>
                  </div>
                  <div className="text-[13px] leading-[1.45] text-ink">{item.msg}</div>
                </div>
                <span className="shrink-0 whitespace-nowrap rounded-full bg-cyan/10 px-2 py-0.5 text-[11px] font-semibold text-cyan-ice">
                  {item.chip}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-[16px] border border-line-2 bg-panel px-4 py-3">
      <div className="text-[12px] text-faint">{label}</div>
      <div className={`tnum text-[22px] font-semibold ${accent ? "text-cyan" : ""}`}>{value}</div>
    </div>
  );
}

function Panel({
  title,
  children,
  live,
}: {
  title: string;
  children: React.ReactNode;
  live?: boolean;
}) {
  return (
    <div className="rounded-[18px] border border-line-2 bg-panel">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="text-[14px] font-semibold">{title}</span>
        {live && (
          <span className="flex items-center gap-1.5 text-[12px] text-cyan-ice">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            Live
          </span>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ── Approvals (risk-stratified) ───────────────────────────────── */
function ApprovalsView({
  decision,
  onDecision,
  batchApproved,
  onApproveBatch,
}: {
  decision: "approved" | "held" | null;
  onDecision: (d: "approved" | "held") => void;
  batchApproved: boolean;
  onApproveBatch: () => void;
}) {
  const a = APPROVALS[0];
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-6">
      <div>
        <h1 className="text-[clamp(20px,3vw,26px)] font-bold tracking-[-0.02em]">Approvals</h1>
        <p className="mt-1 text-[14px] text-muted">
          Low-risk actions run on their own. The rest come to you — the bigger it is, the more
          deliberate the sign-off.
        </p>
      </div>

      {/* High-risk interrupt */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[20px] border border-line-2 bg-panel">
          <div className="border-b border-line px-5 py-3 text-[14px] font-semibold">Why is Praxis asking?</div>
          <div className="flex flex-col gap-4 p-5">
            {a.reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-[12px] font-semibold text-cyan-ice">
                  {i + 1}
                </span>
                <span className="text-[14px] leading-[1.55] text-ink">{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-[20px] border border-cyan/30 bg-panel p-5">
          <span className="self-start rounded-full bg-cyan/10 px-3 py-1 text-[12px] font-semibold text-cyan-ice">
            High-stakes · your approval required
          </span>
          <div>
            <div className="text-[19px] font-semibold">{a.title}</div>
            <div className="text-[13.5px] text-muted">{a.subtitle}</div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {a.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-line bg-panel-2 px-3.5 py-3">
                <div className="text-[11.5px] text-faint">{m.label}</div>
                <div className="tnum text-[16px] font-semibold text-cyan-ice">{m.value}</div>
              </div>
            ))}
          </div>

          {decision === null ? (
            <div className="mt-1 flex flex-col gap-2">
              <HoldToApprove onApprove={() => onDecision("approved")} />
              <button
                onClick={() => onDecision("held")}
                className="h-11 rounded-xl border border-line-4 bg-transparent text-[14px] font-semibold text-frost transition-colors hover:border-frost"
              >
                Not now
              </button>
            </div>
          ) : (
            <div className="mt-1 rounded-xl border border-line-2 bg-panel-2 px-4 py-3 text-[13.5px] leading-[1.6]">
              <div className="font-semibold text-cyan-ice">
                {decision === "approved"
                  ? "Approved — the payment is scheduled to send."
                  : "Held — Praxis will keep it drafted and check back with you."}
              </div>
              <div className="text-faint">Logged to your history — reversible for 24 hours.</div>
            </div>
          )}
        </div>
      </div>

      {/* Batched daily review */}
      <div className="rounded-[20px] border border-line-2 bg-panel">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <span className="text-[14px] font-semibold">Daily Review — {BATCH_REVIEW.length} smaller decisions</span>
          {!batchApproved ? (
            <button
              onClick={onApproveBatch}
              className="rounded-lg bg-cyan px-4 py-1.5 text-[13px] font-semibold text-obsidian transition-colors hover:bg-cyan-bright"
            >
              Approve all
            </button>
          ) : (
            <span className="text-[13px] font-semibold text-cyan-ice">All approved ✓</span>
          )}
        </div>
        <div className="flex flex-col divide-y divide-line">
          {BATCH_REVIEW.map((b) => (
            <div key={b.id} className="flex items-center gap-3 px-5 py-3">
              <span className="w-24 shrink-0 text-[12px] font-medium text-faint">{b.dept}</span>
              <span className="flex-1 text-[13.5px] text-ink">{b.text}</span>
              <span className={`text-[12.5px] font-semibold ${batchApproved ? "text-cyan-ice" : "text-faint"}`}>
                {batchApproved ? "Approved" : "Queued"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HoldToApprove({ onApprove }: { onApprove: () => void }) {
  const [progress, setProgress] = useState(0);
  const holding = useRef(false);
  const raf = useRef(0);

  const start = () => {
    holding.current = true;
    const t0 = performance.now();
    const tick = (t: number) => {
      if (!holding.current) return;
      const p = Math.min(1, (t - t0) / 850);
      setProgress(p);
      if (p >= 1) {
        holding.current = false;
        onApprove();
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  const stop = () => {
    holding.current = false;
    cancelAnimationFrame(raf.current);
    setProgress((p) => (p >= 1 ? p : 0));
  };

  return (
    <button
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      className="relative h-12 select-none overflow-hidden rounded-xl border border-cyan bg-cyan/10 text-[14px] font-semibold text-cyan-ice"
    >
      <span
        className="absolute inset-y-0 left-0 bg-cyan"
        style={{ width: `${progress * 100}%`, transition: progress === 0 ? "width 0.2s ease" : "none" }}
      />
      <span className="relative flex h-full items-center justify-center">
        <span className={progress > 0.5 ? "text-obsidian" : ""}>
          {progress >= 1 ? "Approved ✓" : "Hold to approve"}
        </span>
      </span>
    </button>
  );
}

/* ── Departments ───────────────────────────────────────────────── */
function DepartmentsView({
  agents,
  onToggle,
}: {
  agents: ConsoleAgent[];
  onToggle: (key: string) => void;
}) {
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-6">
      <div>
        <h1 className="text-[clamp(20px,3vw,26px)] font-bold tracking-[-0.02em]">Your departments</h1>
        <p className="mt-1 text-[14px] text-muted">
          Every function of your company, run by an agent. Pause any of them anytime — you&apos;re
          always in control.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((a) => (
          <div key={a.key} className="flex flex-col gap-3 rounded-[16px] border border-line-2 bg-panel p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-[10px] border text-[12px] font-semibold ${
                    a.status === "paused"
                      ? "border-line-3 bg-panel-2 text-faint"
                      : "border-cyan/30 bg-cyan/10 text-cyan-ice"
                  }`}
                >
                  {a.initials}
                </span>
                <div>
                  <div className="text-[15px] font-semibold">{a.name}</div>
                  <div className="text-[12px] text-faint">{a.tool}</div>
                </div>
              </div>
              <StatusChip status={a.status} />
            </div>
            <div className="text-[13px] text-muted">{a.lastAction}</div>
            <div className="flex items-center justify-between border-t border-line pt-3">
              <span className="text-[12px] text-faint">
                {a.status === "paused" ? "Paused by you" : `${a.streakDays}-day clean streak`}
              </span>
              <button
                onClick={() => onToggle(a.key)}
                className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                  a.status === "paused"
                    ? "bg-cyan text-obsidian hover:bg-cyan-bright"
                    : "border border-line-4 text-frost hover:border-frost"
                }`}
              >
                {a.status === "paused" ? "Resume" : "Pause"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: AgentStatusLocal }) {
  if (status === "running")
    return <span className="text-[12.5px] font-semibold text-cyan-ice">● Running</span>;
  if (status === "needs-ok")
    return (
      <span className="rounded-full bg-cyan/[0.12] px-2.5 py-0.5 text-[11.5px] font-semibold text-frost">
        Needs your OK
      </span>
    );
  return <span className="text-[12.5px] font-semibold text-faint">❚❚ Paused</span>;
}
type AgentStatusLocal = ConsoleAgent["status"];

/* ── Guardrails ────────────────────────────────────────────────── */
function GuardrailsView({
  autonomy,
  setAutonomy,
}: {
  autonomy: number;
  setAutonomy: (n: number) => void;
}) {
  const mode = autonomy < 33 ? "Copilot" : autonomy < 75 ? "Balanced" : "Autonomous";
  const limits = [
    { label: "Never let my margin drop below", value: "38.0%" },
    { label: "Max spend per day", value: "$1,000" },
    { label: "Ask me before spending over", value: "$500" },
  ];
  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-6">
      <div>
        <h1 className="text-[clamp(20px,3vw,26px)] font-bold tracking-[-0.02em]">Your guardrails</h1>
        <p className="mt-1 text-[14px] text-muted">
          Hard limits the agents can never cross. Anything beyond them pauses for your approval.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {limits.map((l) => (
          <div
            key={l.label}
            className="flex items-center justify-between rounded-xl border border-line-2 bg-panel px-5 py-4"
          >
            <div>
              <div className="text-[13px] text-muted">{l.label}</div>
              <div className="tnum text-[21px] font-semibold">{l.value}</div>
            </div>
            <span className="rounded-full bg-cyan/10 px-3 py-1 text-[12px] font-semibold text-cyan-ice">
              🔒 Locked
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-[18px] border border-line-2 bg-panel p-5">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-semibold">How much can agents do on their own?</span>
          <span className="rounded-full bg-cyan/10 px-3 py-1 text-[13px] font-semibold text-cyan-ice">
            {mode}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={autonomy}
          onChange={(e) => setAutonomy(Number(e.target.value))}
          className="mt-4 w-full accent-cyan"
        />
        <div className="mt-1 flex justify-between text-[12px] text-faint">
          <span>Copilot — suggests only</span>
          <span>Autonomous — acts within limits</span>
        </div>
      </div>
    </div>
  );
}

/* ── Command bar (Cmd+K, generative UI) ────────────────────────── */
function CommandBar({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function run(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setResult(`Spawning a temporary agent to "${query.trim()}"… it's assembling the data and will drop the results into your feed.`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[18vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-line-2 bg-panel shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={run} className="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <span className="text-cyan-ice">⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tell your agents what to do…"
            className="flex-1 bg-transparent text-[15px] text-frost outline-none placeholder:text-faint"
          />
          <kbd className="rounded border border-line-3 bg-panel-2 px-1.5 font-mono text-[11px] text-faint">
            esc
          </kbd>
        </form>
        <div className="p-4">
          {result ? (
            <div className="rounded-xl border border-cyan/30 bg-cyan/[0.05] px-4 py-3 text-[13.5px] leading-[1.6] text-ink">
              {result}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 text-[13.5px] text-muted">
              <div className="px-1 text-[12px] uppercase tracking-wide text-faint">Try</div>
              {[
                "Audit last 6 months of spend for waste",
                "Draft this week's marketing plan",
                "Chase the 5 largest unpaid invoices",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-panel-2"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
