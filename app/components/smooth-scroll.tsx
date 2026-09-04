"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type LenisInstance = InstanceType<typeof Lenis>;

type WindowWithLenis = Window & { lenis?: LenisInstance };

function getWindowWithLenis(): WindowWithLenis {
  return window as WindowWithLenis;
}

/**
 * Lenis + touch after client-side navigations breaks scrolling on many mobile browsers.
 * Disable Lenis for coarse pointers and for touch-capable narrow viewports (iOS often reports "fine" pointer).
 */
function shouldUseLenis(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
    return false;
  }
  if (
    navigator.maxTouchPoints > 0 &&
    window.matchMedia("(max-width: 1024px)").matches
  ) {
    return false;
  }
  return true;
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    document.documentElement.style.overflowY = "auto";

    const useLenis = shouldUseLenis();

    if (!useLenis) {
      return () => {
        document.documentElement.style.overflowY = "";
      };
    }

    const lenis = new Lenis({
      lerp: 0.18,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    getWindowWithLenis().lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    let rafId: number | null = null;

    const raf = (time: number): void => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    const handleResize = (): void => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    const refreshId = window.setTimeout(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      window.clearTimeout(refreshId);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
      delete getWindowWithLenis().lenis;
      document.documentElement.style.overflowY = "";
      ScrollTrigger.refresh();
    };
  }, []);

  return children;
}
