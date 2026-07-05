import { INTEGRATIONS } from "@/lib/data";
import SectionHeading from "./SectionHeading";

export default function Integrations() {
  return (
    <section className="relative z-[1] border-t border-line">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-[clamp(16px,4vw,48px)] py-[clamp(64px,10vw,140px)]">
        <SectionHeading
          eyebrow="Plays nicely with your stack"
          title="Works with the tools you already use."
          titleMaxCh={24}
        />
        <div
          data-reveal-group
          className="grid grid-cols-2 gap-[14px] md:grid-cols-4"
        >
          {INTEGRATIONS.map((tool) => (
            <div
              key={tool}
              className="flex h-[92px] items-center justify-center rounded-2xl border border-line-2 bg-panel text-base font-semibold text-ink transition-[color,border-color] duration-150 hover:border-cyan/40 hover:text-frost"
            >
              {tool}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
