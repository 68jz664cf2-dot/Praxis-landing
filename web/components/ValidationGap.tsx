import SectionHeading from "./SectionHeading";

export default function ValidationGap() {
  return (
    <section className="relative z-[1] border-t border-line">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-[clamp(16px,4vw,48px)] py-[clamp(64px,10vw,140px)]">
        <SectionHeading
          eyebrow="The problem"
          title="Your growth is bottlenecked by manual execution."
          titleMaxCh={22}
        />
        <div
          data-reveal-group
          className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]"
        >
          <div className="flex flex-col gap-3 rounded-[18px] border border-line-2 bg-panel p-[clamp(24px,3vw,40px)]">
            <div className="text-[13px] font-semibold text-faint">Today</div>
            <div className="text-[clamp(18px,2vw,24px)] font-semibold leading-[1.35]">
              Copilots only suggest.
            </div>
            <p className="m-0 text-[15px] leading-[1.6] text-muted">
              Every recommendation still routes through you. Budgets, orders,
              campaigns, follow-ups — a queue of decisions that only grows as
              your company grows.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-[18px] border border-cyan/30 bg-panel p-[clamp(24px,3vw,40px)]">
            <div className="text-[13px] font-semibold text-cyan-ice">
              With Praxis
            </div>
            <div className="text-[clamp(18px,2vw,24px)] font-semibold leading-[1.35]">
              You get a system that operates.
            </div>
            <p className="m-0 text-[15px] leading-[1.6] text-muted">
              Praxis handles the busywork inside limits you set, and only taps
              you on the shoulder for the decisions that really matter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
