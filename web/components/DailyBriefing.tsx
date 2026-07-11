import SectionHeading from "./SectionHeading";

export default function DailyBriefing() {
  return (
    <section className="relative z-[1] border-t border-line">
      <div className="mx-auto grid max-w-[1280px] items-center gap-[clamp(32px,5vw,72px)] px-[clamp(16px,4vw,48px)] py-[clamp(64px,10vw,140px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
        <div>
          <SectionHeading
            eyebrow="Your daily briefing"
            title="Start every day already caught up."
            titleMaxCh={20}
            description="Every morning, Praxis writes you a short, human briefing — what happened overnight, what's going well, and the one or two things that actually need you. No dashboards to dig through, no spreadsheet homework."
          />
          <div className="mt-4 text-[13.5px] text-faint">
            Delivered at 8am — email, SMS, or Slack. Your choice.
          </div>
        </div>

        {/* Briefing card */}
        <div
          data-reveal
          className="overflow-hidden rounded-[20px] border border-line-2 bg-panel shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-[26px] py-[22px]">
            <div className="text-[clamp(19px,2vw,23px)] font-bold">
              Good morning, Maya ☀️
            </div>
            <div className="text-[13px] text-faint">
              Saturday, July 5 · 8:00 am
            </div>
          </div>
          <div className="flex flex-col gap-[18px] px-[26px] py-6">
            <p className="m-0 text-[15px] leading-[1.65] text-ink">
              While you were away, your business kept moving — your agents handled{" "}
              <strong className="text-frost">47 tasks</strong> overnight.
              Here&apos;s what actually matters:
            </p>
            <div className="flex flex-col gap-[14px]">
              <BriefLine emoji="📈">
                Yesterday closed at{" "}
                <strong className="text-frost">$12,480</strong> — your best day
                this month. The new campaign is doing most of the heavy lifting.
              </BriefLine>
              <BriefLine emoji="🧾">
                A <strong className="text-frost">$20,500 vendor invoice</strong>{" "}
                came in — it&apos;s over your limit, so it&apos;s drafted and
                waiting for your OK.
              </BriefLine>
              <BriefLine emoji="😌">
                Nothing went wrong overnight. Spending stayed comfortably inside
                your limits all day.
              </BriefLine>
            </div>
            <div className="rounded-xl border border-cyan/30 bg-cyan/5 px-[18px] py-[14px] text-sm leading-[1.6] text-ink">
              <strong className="text-cyan-ice">One thing for today:</strong>{" "}
              approve the vendor invoice before 2pm to keep your early-payment
              discount.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BriefLine({
  emoji,
  children,
}: {
  emoji: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex-shrink-0 text-base">{emoji}</span>
      <span className="text-[14.5px] leading-[1.6] text-ink">{children}</span>
    </div>
  );
}
