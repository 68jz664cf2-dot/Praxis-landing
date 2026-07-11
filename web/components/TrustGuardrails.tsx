"use client";

import { useState } from "react";
import SectionHeading from "./SectionHeading";

const REASONS = [
  <>
    A <strong className="text-frost">$20,500 invoice</strong> came in from a
    vendor you already work with.
  </>,
  <>
    It matches the order you approved, and the vendor is{" "}
    <strong className="text-frost">verified</strong>. ✓
  </>,
  <>
    It&apos;s within budget — but it&apos;s over your{" "}
    <strong className="text-frost">$500 auto-approve limit</strong>.
  </>,
  <>
    So Praxis paused and brought it to you before paying. ✋
  </>,
];

export default function TrustGuardrails() {
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);

  return (
    <section className="relative z-[1] border-t border-line bg-well">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-[clamp(16px,4vw,48px)] py-[clamp(64px,10vw,140px)]">
        <SectionHeading
          eyebrow="You're always in charge"
          title="Big decisions always come back to you."
          titleMaxCh={22}
          description="Anything over your limit gets paused, explained in plain language, and waits for your call. Praxis never crosses the lines you draw."
        />

        <div
          data-reveal-group
          className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]"
        >
          {/* Left — friendly reasoning */}
          <div className="flex flex-col overflow-hidden rounded-[20px] border border-line-2 bg-panel">
            <div className="border-b border-line px-[22px] py-4 text-[15px] font-semibold">
              Why is Praxis asking?
            </div>
            <div className="flex flex-col gap-4 p-[22px]">
              {REASONS.map((reason, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-xs font-semibold text-cyan-ice">
                    {i + 1}
                  </span>
                  <span className="text-[14.5px] leading-[1.55] text-ink">
                    {reason}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — approval card */}
          <div className="flex flex-col gap-5 rounded-[20px] border border-cyan/30 bg-panel p-[clamp(20px,3vw,30px)]">
            <span className="self-start rounded-full bg-cyan/10 px-[14px] py-[6px] text-[12.5px] font-semibold text-cyan-ice">
              Waiting for your approval
            </span>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[19px] font-semibold">
                Approve this $20,500 payment?
              </div>
              <div className="text-sm text-muted">
                Acme Co. · invoice #4471 · due in 5 days
              </div>
            </div>
            <div className="grid grid-cols-2 gap-[10px]">
              <div className="rounded-xl border border-line bg-panel-2 px-4 py-[13px]">
                <div className="text-xs text-faint">Cash impact</div>
                <div className="tnum text-[17px] font-semibold text-cyan-ice">
                  −$20,500
                </div>
              </div>
              <div className="rounded-xl border border-line bg-panel-2 px-4 py-[13px]">
                <div className="text-xs text-faint">Payment due in</div>
                <div className="tnum text-[17px] font-semibold">5 days</div>
              </div>
            </div>

            {decision === null ? (
              <div className="mt-auto flex gap-[10px]">
                <button
                  onClick={() => setDecision("approved")}
                  className="h-[50px] flex-1 cursor-pointer rounded-xl bg-cyan text-[15px] font-semibold text-obsidian transition-colors hover:bg-cyan-bright"
                >
                  Approve
                </button>
                <button
                  onClick={() => setDecision("rejected")}
                  className="h-[50px] flex-1 cursor-pointer rounded-xl border border-line-4 bg-transparent text-[15px] font-semibold text-frost transition-colors hover:border-frost"
                >
                  Not now
                </button>
              </div>
            ) : (
              <div className="mt-auto rounded-xl border border-line-2 bg-panel-2 px-[18px] py-4 text-sm leading-[1.6]">
                <div className="font-semibold text-cyan-ice">
                  {decision === "approved"
                    ? "Approved — the payment is scheduled to send."
                    : "Held — Praxis will keep it drafted and check back with you."}
                </div>
                <div className="text-faint">
                  Logged to your history — you can undo for 24 hours.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
