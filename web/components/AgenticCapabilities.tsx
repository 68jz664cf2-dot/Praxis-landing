import { AGENTS } from "@/lib/data";
import SectionHeading from "./SectionHeading";

export default function AgenticCapabilities() {
  return (
    <section className="relative z-[1] border-t border-line">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-[clamp(16px,4vw,48px)] py-[clamp(64px,10vw,140px)]">
        <SectionHeading
          eyebrow="Meet the team"
          title="Every department of your company, run by agents."
          titleMaxCh={24}
        />
        <div
          data-reveal-group
          className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-4"
        >
          {AGENTS.map((a) => (
            <div
              key={a.name}
              className="flex min-h-[190px] flex-col gap-[14px] rounded-[18px] border border-line-2 bg-panel p-6 transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-cyan/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/25 bg-cyan/10 text-sm font-semibold text-cyan-ice">
                {a.initials}
              </div>
              <div className="text-lg font-semibold">{a.name}</div>
              <div className="flex-1 text-sm leading-[1.55] text-muted">
                {a.desc}
              </div>
              <div className="text-[13px] font-medium text-cyan-ice">
                {a.sample}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
