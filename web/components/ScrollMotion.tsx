"use client";

import { useEffect } from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Drives the kinetic scroll-reveal motion for the whole page.
 *
 * Elements opt in with data attributes rendered by the section components:
 *  - [data-reveal]            → blur-rise reveal on enter
 *  - [data-reveal="trace"]    → cyan hairline traces left→right
 *  - [data-reveal-group]      → children stagger in, 90ms apart
 *
 * Mounted once near the top of the page. No-ops under prefers-reduced-motion.
 */
export default function ScrollMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const prep = (el: HTMLElement, delay: number, kind: "trace" | "block") => {
      if (kind === "trace") {
        el.style.transform = "scaleX(0)";
        el.style.transition = `transform 0.9s ${EASE} ${delay}ms`;
      } else {
        el.style.opacity = "0";
        el.style.transform = "translateY(26px)";
        el.style.filter = "blur(8px)";
        el.style.transition = ["opacity", "transform", "filter"]
          .map((p) => `${p} 0.75s ${EASE} ${delay}ms`)
          .join(", ");
      }
    };

    const show = (el: HTMLElement) => {
      if (el.dataset.reveal === "trace") {
        el.style.transform = "scaleX(1)";
        return;
      }
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      el.style.filter = "blur(0px)";
    };

    const groupKids = new WeakMap<Element, HTMLElement[]>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const el = en.target as HTMLElement;
          const kids = groupKids.get(el);
          if (kids) kids.forEach(show);
          else show(el);
          io.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      prep(el, 0, el.dataset.reveal === "trace" ? "trace" : "block");
      io.observe(el);
    });

    document
      .querySelectorAll<HTMLElement>("[data-reveal-group]")
      .forEach((g) => {
        const kids = Array.from(g.children) as HTMLElement[];
        kids.forEach((k, i) => prep(k, i * 90, "block"));
        groupKids.set(g, kids);
        io.observe(g);
      });

    return () => io.disconnect();
  }, []);

  return null;
}
