"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

type MarqueeProps = {
    content: {
        primaryLines: [string, string];
        secondaryLines: [string, string];
    };
};

export default function Marquee({ content }: MarqueeProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackTopRef = useRef<HTMLDivElement>(null);
    const trackBottomRef = useRef<HTMLDivElement>(null);
    const mobileRow1Ref = useRef<HTMLDivElement>(null);
    const mobileRow2Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add("(max-width: 767px)", () => {
                const row1 = mobileRow1Ref.current;
                const row2 = mobileRow2Ref.current;
                const trigger = sectionRef.current;
                if (row1 || row2) {
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                            fastScrollEnd: true,
                            invalidateOnRefresh: true,
                        },
                    });
                    if (row1) tl.to(row1, { x: -120, ease: "none" }, 0);
                    if (row2) tl.to(row2, { x: 120, ease: "none" }, 0);
                }

                return () => {};
            });

            mm.add("(min-width: 768px)", () => {
                const trackTop = trackTopRef.current;
                const trackBottom = trackBottomRef.current;
                if (!trackTop || !trackBottom) return () => {};

                const travel = () => Math.min(window.innerWidth * 0.3, 420);

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 0.16,
                        fastScrollEnd: true,
                        invalidateOnRefresh: true,
                    },
                });

                tl.fromTo(
                    trackTop,
                    { x: () => travel() },
                    { x: () => -travel(), ease: "none" },
                    0,
                );
                tl.fromTo(
                    trackBottom,
                    { x: () => -travel() },
                    { x: () => travel(), ease: "none" },
                    0,
                );

                return () => {
                    tl.scrollTrigger?.kill();
                };
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-transparent py-16 sm:py-20 md:py-24"
        >
            {/* DESKTOP VIEW */}
            <div className="hidden md:flex items-center overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />
                
                <div className="w-full flex flex-col justify-center gap-12 lg:gap-14">
                    {/* Row 1 (right -> left) */}
                    <div
                        ref={trackTopRef}
                        className="flex items-center justify-center whitespace-nowrap will-change-transform"
                    >
                        <span className="text-[clamp(5rem,10vw,12rem)] font-black text-foreground leading-[0.9] tracking-tighter select-none">
                            {content.primaryLines[0]}
                        </span>
                        <span className="text-[clamp(3rem,5vw,5rem)] text-foreground/20 mx-14 select-none font-light italic">
                            &
                        </span>
                        <span className="text-[clamp(5rem,10vw,12rem)] font-black text-foreground leading-[0.9] tracking-tighter select-none">
                            {content.primaryLines[1]}
                        </span>

                    </div>

                    {/* Row 2 (left -> right) */}
                    <div
                        ref={trackBottomRef}
                        className="flex items-center justify-center whitespace-nowrap will-change-transform"
                    >
                        <span className="text-[clamp(5rem,10vw,12rem)] font-black text-foreground leading-[0.9] tracking-tighter select-none">
                            {content.secondaryLines[0]}
                        </span>
                        <span className="text-[clamp(3rem,5vw,5rem)] text-foreground/20 mx-14 select-none font-light italic">
                            &
                        </span>
                        <span className="text-[clamp(5rem,10vw,12rem)] font-black text-foreground leading-[0.9] tracking-tighter select-none">
                            {content.secondaryLines[1]}
                        </span>

                    </div>
                </div>
            </div>

            {/* MOBILE VIEW - Redesigned for vertical screens */}
            <div className="md:hidden px-6 flex flex-col gap-12">
                <div className="space-y-2">
                    <div ref={mobileRow1Ref} className="whitespace-nowrap translate-x-12">
                        <span className="text-7xl font-black text-foreground uppercase leading-none tracking-tighter">
                            {content.primaryLines[0]}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-3xl font-light italic text-foreground/30">&</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>
                    <div ref={mobileRow2Ref} className="whitespace-nowrap -translate-x-12 flex justify-end">
                        <span className="text-7xl font-black text-foreground uppercase leading-none tracking-tighter">
                            {content.primaryLines[1]}
                        </span>
                    </div>
                </div>

            </div>
        </section>
    );
}
