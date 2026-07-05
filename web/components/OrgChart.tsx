import { DEPARTMENTS } from "@/lib/data";
import { LogoMark } from "./Logo";
import SectionHeading from "./SectionHeading";

export default function OrgChart() {
  return (
    <section className="relative z-[1] border-t border-line bg-well">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-12 px-[clamp(16px,4vw,48px)] py-[clamp(64px,10vw,140px)]">
        <SectionHeading
          center
          eyebrow="Your new org chart"
          title="One founder. A whole company underneath."
          titleMaxCh={22}
          description="You sit at the top and make the calls. Praxis runs every department below — sales, marketing, inventory, support, and finance — using the tools you already have."
        />

        <div className="flex flex-col items-center">
          {/* You */}
          <div
            data-reveal
            className="flex flex-col items-center gap-2 rounded-[18px] border border-cyan/45 bg-panel px-10 py-5 shadow-[0_0_30px_rgba(0,240,255,0.08)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan/35 bg-cyan/[0.12] text-xl">
              👋
            </div>
            <div className="text-[17px] font-bold">You</div>
            <div className="text-[13px] text-muted">
              Founder &amp; CEO — the only human required
            </div>
          </div>

          <div className="h-8 w-0.5 bg-line-3" />

          {/* Praxis */}
          <div
            data-reveal
            className="flex items-center gap-3 rounded-[14px] border border-line-2 bg-panel px-7 py-[14px]"
          >
            <LogoMark size={22} glow={false} />
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold">Praxis</span>
              <span className="text-[12.5px] text-faint">
                Your chief operating system — coordinates everything below
              </span>
            </div>
          </div>

          <div className="h-8 w-0.5 bg-line-3" />

          {/* Departments */}
          <div
            data-reveal-group
            className="grid w-full grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-3"
          >
            {DEPARTMENTS.map((d) => (
              <div
                key={d.name}
                className="flex flex-col gap-3 rounded-2xl border border-line-2 bg-panel p-5 transition-colors hover:border-cyan/40"
              >
                <div className="flex items-center gap-[10px]">
                  <span className="text-xl">{d.emoji}</span>
                  <div className="flex flex-col">
                    <span className="text-[15.5px] font-semibold">
                      {d.name}
                    </span>
                    <span className="text-[12.5px] text-faint">{d.role}</span>
                  </div>
                </div>
                <div className="flex-1 text-[13.5px] leading-[1.55] text-muted">
                  {d.desc}
                </div>
                <div className="flex flex-wrap gap-[6px] border-t border-line pt-3">
                  {d.tools.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-cyan/20 bg-cyan/[0.08] px-[10px] py-1 text-[11.5px] font-semibold text-cyan-ice"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
