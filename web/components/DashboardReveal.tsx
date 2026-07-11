"use client";

import { useEffect, useState } from "react";

const STEPS = [
  {
    title: "Connect your tools",
    desc: "One-click sign-in to the tools you already run on — payments, ads, email, and more. Takes about two minutes.",
  },
  {
    title: "Set your limits",
    desc: "Your margin floor, your spend ceiling, your approval threshold. The agents can never cross them.",
  },
  {
    title: "Let it run",
    desc: "Agents take over the daily grind — and check in with you only when something big comes up.",
  },
];

const PANEL_TITLES = ["Connections", "Your limits", "Your agents"];

export default function DashboardReveal() {
  const [active, setActive] = useState(0);
  const [userPicked, setUserPicked] = useState(false);

  useEffect(() => {
    if (userPicked) return;
    const id = setInterval(() => setActive((s) => (s + 1) % 3), 4000);
    return () => clearInterval(id);
  }, [userPicked]);

  const pick = (i: number) => {
    setActive(i);
    setUserPicked(true);
  };

  return (
    <section className="relative z-[1] border-t border-line bg-well">
      <div className="mx-auto grid max-w-[1280px] items-start gap-[clamp(32px,5vw,72px)] px-[clamp(16px,4vw,48px)] py-[clamp(64px,10vw,140px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
        {/* Steps */}
        <div data-reveal-group className="flex flex-col gap-[10px]">
          <div className="mb-[18px] text-sm font-semibold text-cyan-ice">
            How it works
          </div>
          {STEPS.map((step, i) => {
            const isActive = active === i;
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                className={`flex w-full cursor-pointer items-start gap-4 rounded-2xl border px-5 py-[18px] text-left transition-all duration-200 ${
                  isActive
                    ? "border-cyan/35 bg-panel-3"
                    : "border-line bg-transparent"
                }`}
              >
                <span className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px] bg-cyan/10 text-sm font-semibold text-cyan-ice">
                  {i + 1}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-[17px] font-semibold">
                    {step.title}
                  </span>
                  <span className="text-sm leading-[1.5] text-muted">
                    {step.desc}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Panel mockup */}
        <div
          data-reveal
          className="flex min-h-[420px] flex-col overflow-hidden rounded-[20px] border border-line-2 bg-panel shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center gap-2 border-b border-line px-5 py-[14px]">
            <span className="h-[10px] w-[10px] rounded-full bg-line-3" />
            <span className="h-[10px] w-[10px] rounded-full bg-line-3" />
            <span className="ml-2 text-[13px] text-faint">
              app.praxis.ai — {PANEL_TITLES[active]}
            </span>
          </div>

          {active === 0 && <ConnectionsPanel />}
          {active === 1 && <LimitsPanel />}
          {active === 2 && <AgentsPanel />}
        </div>
      </div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-panel-2 px-[18px] py-[15px] text-[14.5px]">
      {children}
    </div>
  );
}

function ConnectionsPanel() {
  const connected = ["Shopify", "Meta Ads", "Klaviyo"];
  return (
    <div className="flex flex-col gap-[10px] p-5">
      {connected.map((name) => (
        <Row key={name}>
          <span className="font-medium">{name}</span>
          <span className="text-[13px] font-semibold text-cyan-ice">
            ✓ Connected
          </span>
        </Row>
      ))}
      <Row>
        <span className="font-medium">Stripe</span>
        <span className="text-[13px] text-muted">Connecting…</span>
      </Row>
    </div>
  );
}

function LimitRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-panel-2 px-[18px] py-4">
      <div className="flex flex-col gap-[3px]">
        <span className="text-[13px] text-muted">{label}</span>
        <span className="tnum text-[21px] font-semibold">{value}</span>
      </div>
      <span className="rounded-full bg-cyan/10 px-3 py-[5px] text-xs font-semibold text-cyan-ice">
        🔒 Locked
      </span>
    </div>
  );
}

function LimitsPanel() {
  return (
    <div className="flex flex-col gap-[10px] p-5">
      <LimitRow label="Never let my margin drop below" value="38.0%" />
      <LimitRow label="Max ad spend per day" value="$1,000" />
      <LimitRow label="Ask me before spending over" value="$500" />
    </div>
  );
}

function AgentRow({
  name,
  tool,
  running = true,
}: {
  name: string;
  tool: string;
  running?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border bg-panel-2 px-[18px] py-[15px] ${
        running ? "border-line" : "border-cyan/35"
      }`}
    >
      <div className="flex flex-col gap-[2px]">
        <span className="text-[14.5px] font-medium">{name}</span>
        <span className="text-[12.5px] text-faint">{tool}</span>
      </div>
      {running ? (
        <span className="text-[13px] font-semibold text-cyan-ice">
          ● Running
        </span>
      ) : (
        <span className="rounded-full bg-cyan/[0.12] px-3 py-1 text-[12.5px] font-semibold text-frost">
          Needs your OK
        </span>
      )}
    </div>
  );
}

function AgentsPanel() {
  return (
    <div className="flex flex-col gap-[10px] p-5">
      <AgentRow name="Ad Optimizer" tool="Meta Ads" />
      <AgentRow name="Inventory Planner" tool="Shopify" />
      <AgentRow name="Email & SMS" tool="Klaviyo" />
      <AgentRow name="Finance" tool="Stripe" running={false} />
    </div>
  );
}
