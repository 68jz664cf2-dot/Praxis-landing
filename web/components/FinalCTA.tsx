import { LogoMark } from "./Logo";
import WaitlistForm from "./WaitlistForm";

export default function FinalCTA() {
  return (
    <section id="waitlist" className="relative z-[1] border-t border-line">
      <div
        data-reveal-group
        className="mx-auto flex max-w-[720px] flex-col items-center gap-7 px-[clamp(16px,4vw,48px)] py-[clamp(80px,12vw,180px)] text-center"
      >
        <LogoMark size={44} />
        <h2 className="m-0 text-[clamp(30px,4.6vw,56px)] font-bold leading-[1.12] tracking-[-0.02em] text-balance">
          Run your business. Not your busywork.
        </h2>
        <p className="m-0 text-[clamp(15px,1.6vw,18px)] leading-[1.6] text-muted">
          The operating system that runs your whole company — so you can build
          with zero headcount. Early operators get first access.
        </p>
        <WaitlistForm variant="cta" />
      </div>

      <footer className="flex flex-wrap justify-between gap-4 border-t border-line px-[clamp(16px,4vw,48px)] py-6 text-[13px] text-ghost">
        <span className="flex items-center gap-2">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-[2px] border border-ghost">
            <span className="inline-block h-[7px] w-[7px] rotate-[-9deg] border border-cyan" />
          </span>
          © 2026 Praxis AI
        </span>
        <span>The engine for autonomous companies</span>
      </footer>
    </section>
  );
}
