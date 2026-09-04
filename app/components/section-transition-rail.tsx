"use client";

import { gsap } from "gsap";
import { useGSAP } from "@/app/hooks/useGSAP";

interface SectionTransitionRailProps {
  label: string;
  meta: string;
}

export default function SectionTransitionRail({ label, meta }: SectionTransitionRailProps) {
  const railRef = useGSAP<HTMLDivElement>((rail) => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: rail,
        start: "top 92%",
        end: "top 48%",
        scrub: 0.6,
      },
    });

    timeline
      .fromTo("[data-rail-line]", { scaleX: 0.08, opacity: 0.2 }, { scaleX: 1, opacity: 0.65, ease: "none" }, 0)
      .fromTo("[data-rail-mark]", { y: 12, rotate: -45, opacity: 0 }, { y: 0, rotate: 0, opacity: 0.9, ease: "none" }, 0)
      .fromTo("[data-rail-copy]", { x: -18, opacity: 0 }, { x: 0, opacity: 0.75, ease: "none" }, 0.12);
  });

  return (
    <div ref={railRef} className="pointer-events-none relative z-10 h-0" aria-hidden="true">
      <div className="absolute inset-x-0 top-0 -translate-y-1/2 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-[1760px] items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground sm:gap-5 sm:text-[11px]">
          <span data-rail-mark className="hidden sm:inline">+ + +</span>
          <span data-rail-line className="h-px flex-1 origin-center bg-foreground" />
          <span data-rail-copy className="whitespace-nowrap">{label}</span>
          <span data-rail-mark className="text-sm font-bold text-[#858bd0]">+</span>
          <span data-rail-copy className="hidden whitespace-nowrap md:inline">{meta}</span>
          <span data-rail-line className="h-px flex-1 origin-center bg-foreground" />
          <span data-rail-mark className="hidden sm:inline">+ + +</span>
        </div>
      </div>
    </div>
  );
}
