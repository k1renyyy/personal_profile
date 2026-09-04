"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function useGSAP<T extends HTMLElement = HTMLDivElement>(
    animationFn: (scope: T) => void,
) {
    const scope = useRef<T>(null);
    const runAnimation = useEffectEvent(animationFn);

    useEffect(() => {
        const element = scope.current;
        if (!element) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const ctx = gsap.context(() => {
            runAnimation(element);
        }, element);

        return () => {
            ctx.revert();
        };
    }, []);

    return scope;
}
