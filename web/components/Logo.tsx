import type { CSSProperties } from "react";

type LogoMarkProps = {
  /** Outer square edge length in px. */
  size?: number;
  /** Add the cyan glow used on hero/CTA/header instances. */
  glow?: boolean;
  className?: string;
};

// The Praxis mark: a frost-white outer square framing a rotated cyan inner square.
export function LogoMark({ size = 28, glow = true, className }: LogoMarkProps) {
  const inner = Math.round(size * 0.46);
  const border = size >= 40 ? 1.5 : size >= 22 ? 1.5 : 1;
  const innerBorder = size >= 40 ? 2 : size >= 22 ? 1.5 : 1;
  const glowStyle: CSSProperties = glow
    ? {
        boxShadow:
          "0 0 8px rgba(0,240,255,0.55), inset 0 0 4px rgba(0,240,255,0.25)",
      }
    : {};

  return (
    <div
      className={`flex items-center justify-center ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        border: `${border}px solid var(--color-frost)`,
        borderRadius: size >= 40 ? 4 : 3,
      }}
    >
      <div
        style={{
          width: inner,
          height: inner,
          border: `${innerBorder}px solid var(--color-cyan)`,
          transform: "rotate(-9deg)",
          ...glowStyle,
        }}
      />
    </div>
  );
}

// Full header lockup: mark + PRAXIS / AI wordmark.
export function LogoLockup() {
  return (
    <div className="flex items-center gap-3">
      <LogoMark size={28} />
      <span className="flex items-baseline gap-2">
        <span className="text-base font-bold tracking-[0.04em]">PRAXIS</span>
        <span className="text-[13px] font-medium text-dim">AI</span>
      </span>
    </div>
  );
}
