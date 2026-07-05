"use client";

import { useEffect, useState } from "react";
import { FEED_POOL, feedTime } from "@/lib/data";
import WaitlistForm from "./WaitlistForm";

export default function Hero() {
  const [tick, setTick] = useState(5);
  const [actionCount, setActionCount] = useState(1247);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setActionCount((c) => c + 1);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const items = [];
  for (let i = Math.max(0, tick - 5); i < tick; i++) {
    const e = FEED_POOL[i % FEED_POOL.length];
    items.push({ ...e, key: i, time: feedTime(i) });
  }
  items.reverse();

  return (
    <section className="relative z-[1] mx-auto max-w-[1280px] px-[clamp(16px,4vw,48px)] pb-[clamp(48px,6vw,96px)] pt-[clamp(56px,9vw,120px)]">
      <div className="grid items-center gap-[clamp(32px,5vw,72px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))]">
        {/* Left — copy + capture */}
        <div data-reveal-group className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-cyan/35 bg-cyan/[0.06] px-[14px] py-[6px] text-[13px] font-medium text-cyan-pale">
            <span className="h-[7px] w-[7px] rounded-full bg-cyan" />
            Early access is open
          </div>
          <h1 className="m-0 text-[clamp(38px,5.4vw,68px)] font-bold leading-[1.05] tracking-[-0.02em] text-balance">
            The Engine for Autonomous Companies.
          </h1>
          <p className="m-0 max-w-[46ch] text-[clamp(16px,1.7vw,20px)] leading-[1.55] text-muted">
            Connect your business. Set your limits. Let AI operate the rest.
          </p>
          <p className="m-0 max-w-[48ch] text-[clamp(14px,1.4vw,16px)] leading-[1.6] text-dim">
            You bring the idea. Praxis becomes your whole back office — sales,
            ads, inventory, email, support — a team of departments that never
            sleeps.
          </p>
          <WaitlistForm variant="hero" />
          <div className="text-[13.5px] text-faint">
            No demo calls. No credit card. Cancel anytime.
          </div>
        </div>

        {/* Right — live agent activity feed */}
        <div
          data-reveal
          className="flex min-h-[420px] flex-col overflow-hidden rounded-[20px] border border-line-2 bg-panel shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <span className="text-[15px] font-semibold">
              Your team of agents, working right now
            </span>
            <span className="flex items-center gap-[7px] text-[12.5px] text-cyan-pale">
              <span className="h-[7px] w-[7px] rounded-full bg-cyan" />
              Live
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-2 overflow-hidden p-3">
            {items.map((item) => (
              <div
                key={item.key}
                className="animate-feed-in flex items-start gap-[14px] rounded-[14px] border border-line bg-panel-2 px-[14px] py-3"
              >
                <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[11px] border border-cyan/25 bg-cyan/10 text-[13px] font-semibold text-cyan-ice">
                  {item.initials}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-semibold">{item.name}</span>
                    <span className="tnum text-xs text-faint">{item.time}</span>
                  </div>
                  <div className="text-sm leading-[1.45] text-ink">
                    {item.msg}
                  </div>
                </div>
                <span className="flex-shrink-0 whitespace-nowrap rounded-full bg-cyan/10 px-[10px] py-1 text-xs font-semibold text-cyan-ice">
                  {item.chip}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 border-t border-line bg-well-2">
            <div className="px-5 py-[14px]">
              <div className="text-xs text-faint">Actions today</div>
              <div className="tnum text-[19px] font-semibold">
                {actionCount.toLocaleString("en-US")}
              </div>
            </div>
            <div className="border-l border-line px-5 py-[14px]">
              <div className="text-xs text-faint">Margin protected</div>
              <div className="tnum text-[19px] font-semibold">38.0%</div>
            </div>
            <div className="border-l border-line px-5 py-[14px]">
              <div className="text-xs text-faint">Waiting on you</div>
              <div className="tnum text-[19px] font-semibold text-cyan">1</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
