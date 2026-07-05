import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  center?: boolean;
  titleMaxCh?: number;
};

// Trace-line + eyebrow + headline used at the top of most sections.
export default function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
  titleMaxCh = 24,
}: Props) {
  return (
    <div
      data-reveal
      className={`flex flex-col gap-4 ${center ? "items-center text-center" : ""}`}
    >
      <div
        data-reveal="trace"
        className="h-0.5 w-12 origin-left bg-cyan"
      />
      <div className="text-sm font-semibold text-cyan-ice">{eyebrow}</div>
      <h2
        className="m-0 text-[clamp(28px,4.2vw,52px)] font-bold leading-[1.15] tracking-[-0.02em] text-balance"
        style={{ maxWidth: `${titleMaxCh}ch` }}
      >
        {title}
      </h2>
      {description && (
        <p className="m-0 max-w-[56ch] text-[clamp(15px,1.5vw,17px)] leading-[1.6] text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
