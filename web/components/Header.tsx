"use client";

import { useEffect, useRef } from "react";
import { LogoLockup } from "./Logo";

export default function Header() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = progressRef.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-[60px] items-center justify-between border-b border-line bg-obsidian/80 px-[clamp(16px,4vw,48px)] backdrop-blur-md">
      <LogoLockup />
      <a
        href="#waitlist"
        className="inline-flex h-[38px] items-center rounded-[10px] bg-cyan px-5 text-sm font-semibold text-obsidian transition-colors hover:bg-cyan-bright"
      >
        Join waitlist
      </a>
      <div
        ref={progressRef}
        className="pointer-events-none absolute bottom-[-1px] left-0 h-0.5 w-full origin-left scale-x-0 bg-cyan"
      />
    </header>
  );
}
