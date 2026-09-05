"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroInteractivePortrait } from "@/app/components/hero/hero-interactive";
import type {ProductionMediaContent} from "@/lib/content/types";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

type StatsProps = {
    title: string;
    paragraphs: string[];
    photos: ProductionMediaContent[];
};

const photoPlaceholders = [
    { label: "Photo 01", className: "bg-linear-to-br from-[#858bd0]/70 via-[#b9bde8]/35 to-background" },
    { label: "Photo 02", className: "bg-linear-to-br from-amber-300/70 via-orange-200/30 to-background" },
    { label: "Photo 03", className: "bg-linear-to-br from-cyan-300/65 via-sky-200/30 to-background" },
];

const paragraphLabels = ["CROSSOVER", "CURIOSITY", "CONTINUITY"];

export default function Stats({ title, paragraphs, photos }: StatsProps) {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const [left, center, right] = ["left", "center", "right"].map((position) =>
                section.querySelector<HTMLElement>(`[data-photo='${position}']`),
            );
            const spread = window.matchMedia("(min-width: 1024px)").matches ? 68 : 58;
            if (left && center && right) {
                gsap.set(left, { xPercent: -spread, yPercent: 8, rotate: -7 });
                gsap.set(center, { yPercent: -4 });
                gsap.set(right, { xPercent: spread, yPercent: 8, rotate: 7 });
                return () => gsap.set([left, center, right], {clearProps: "transform"});
            }
            return;
        }

        const ctx = gsap.context(() => {
            const root = sectionRef.current;
            if (!root) return;

            const leftPanel = root.querySelector<HTMLElement>(".stats-panel-left");
            const rightPanel = root.querySelector<HTMLElement>(".stats-panel-right");
            const leftPhoto = root.querySelector<HTMLElement>("[data-photo='left']");
            const centerPhoto = root.querySelector<HTMLElement>("[data-photo='center']");
            const rightPhoto = root.querySelector<HTMLElement>("[data-photo='right']");

            const statsItems = gsap.utils.toArray<HTMLElement>(".stats-anim", root);

            const panels: HTMLElement[] = [leftPanel, rightPanel].filter((el): el is HTMLElement => !!el);

            gsap.set(panels, { autoAlpha: 0, y: 40 });
            gsap.set(statsItems, { autoAlpha: 0, y: 22 });

            // One timeline + one ScrollTrigger (no scrub). Previously each .stats-anim / .tech-anim had its
            // own scrubbed trigger (~24 listeners updating every scroll frame -> heavy jank from Marquee/Projects).
            const master = gsap.timeline({ paused: true });

            if (panels.length > 0) {
                master.to(panels, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "power2.out",
                });
            }

            if (statsItems.length > 0) {
                master.to(
                    statsItems,
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.36,
                        stagger: 0.03,
                        ease: "power2.out",
                    },
                    panels.length > 0 ? "-=0.18" : 0,
                );
            }

            ScrollTrigger.create({
                trigger: root,
                start: "top 78%",
                once: true,
                invalidateOnRefresh: true,
                onEnter: () => {
                    master.play(0);
                },
                onRefresh: (self) => {
                    if (self.progress > 0) {
                        master.progress(1);
                    } else {
                        master.pause(0).progress(0);
                    }
                },
            });

            if (leftPhoto && centerPhoto && rightPhoto) {
                const spread = window.matchMedia("(min-width: 1024px)").matches ? 68 : 58;
                gsap.fromTo(leftPhoto, { xPercent: 0, yPercent: 0, rotate: 0 }, {
                        xPercent: -spread,
                        yPercent: 8,
                        rotate: -7,
                        ease: "none",
                        scrollTrigger: { trigger: rightPanel, start: "top 88%", end: "center 48%", scrub: 0.8 },
                    });
                    gsap.fromTo(centerPhoto, { yPercent: 0 }, {
                        yPercent: -4,
                        ease: "none",
                        scrollTrigger: { trigger: rightPanel, start: "top 88%", end: "center 48%", scrub: 0.8 },
                    });
                    gsap.fromTo(rightPhoto, { xPercent: 0, yPercent: 0, rotate: 0 }, {
                        xPercent: spread,
                        yPercent: 8,
                        rotate: 7,
                        ease: "none",
                        scrollTrigger: { trigger: rightPanel, start: "top 88%", end: "center 48%", scrub: 0.8 },
                    });
            }
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative min-w-0 overflow-x-clip bg-transparent py-12 text-foreground sm:py-16 md:py-20 lg:py-24 xl:py-28"
        >
            <div className="w-full min-w-0 max-w-[min(100%,1920px)] mx-auto px-3 min-[375px]:px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:px-28">
                <div className="flex min-w-0 flex-col lg:flex-row lg:justify-between lg:items-start gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 2xl:gap-24">
                    {/* Left — About */}
                    <div className="stats-panel-left w-full min-w-0 max-w-full lg:w-[42%] lg:max-w-none xl:w-5/12 space-y-4 sm:space-y-5 md:space-y-6">
                        <h2 className="stats-anim wrap-anywhere text-[clamp(1.625rem,calc(0.9rem+4.2vw),5rem)] font-black uppercase leading-[0.95] tracking-tight text-foreground">
                            {title}
                        </h2>
                        <div className="space-y-1 sm:max-w-xl">
                            {paragraphs.map((paragraph, index) => (
                                <p
                                    key={paragraph}
                                    className="stats-anim group relative max-w-full wrap-anywhere border-l border-foreground/10 py-2 pl-4 leading-relaxed text-foreground/50 transition-[color,transform,border-color] duration-300 ease-out hover:translate-x-2 hover:border-[#858bd0] hover:text-foreground sm:py-3 sm:pl-5"
                                >
                                    <span className="mb-1 block font-mono text-[0.625rem] uppercase tracking-[0.28em] text-[#858bd0]/65 transition-colors duration-300 group-hover:text-[#858bd0]">
                                        {String(index + 1).padStart(2, "0")} / {paragraphLabels[index]}
                                    </span>
                                    <span className={index === 0 ? "text-[0.9375rem] sm:text-base md:text-lg" : "text-[0.8125rem] sm:text-sm md:text-base"}>
                                        {paragraph}
                                    </span>
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Right — Photo cluster */}
                    <div className="stats-panel-right flex min-h-[320px] w-full min-w-0 max-w-full items-center justify-center sm:min-h-[390px] lg:min-h-[460px] lg:w-[58%] lg:max-w-none lg:self-center xl:w-7/12">
                        <div className="relative flex h-[280px] w-full items-center justify-center sm:h-[350px] lg:h-[420px]">
                            {photoPlaceholders.map((photo, index) => (
                                <div
                                    key={photo.label}
                                    data-photo={index === 0 ? "left" : index === 1 ? "center" : "right"}
                                    className={`absolute w-[clamp(9rem,40vw,15rem)] transform-gpu transition-[z-index] hover:z-10 lg:w-[clamp(13rem,20vw,18rem)] ${index === 0 ? "z-1" : index === 1 ? "z-2" : "z-3"}`}
                                >
                                    <div data-shoot-target="1" data-shoot-disappear="1">
                                        <HeroInteractivePortrait frameClassName="aspect-3/4 w-full">
                                            {photos[index] ? (
                                                <Image
                                                    src={photos[index].assetUrl}
                                                    alt={photos[index].alt}
                                                    fill
                                                    loading={index === 0 ? "eager" : "lazy"}
                                                    sizes="(max-width: 1023px) 40vw, 20vw"
                                                    className="object-cover"
                                                    style={photos[index].focalPoint ? {
                                                        objectPosition: `${photos[index].focalPoint.x * 100}% ${photos[index].focalPoint.y * 100}%`,
                                                    } : undefined}
                                                />
                                            ) : (
                                                <div
                                                    role="img"
                                                    aria-label={`${photo.label} placeholder`}
                                                    className={`relative flex h-full w-full items-end overflow-hidden p-4 ${photo.className}`}
                                                >
                                                    <span className="absolute -right-2 -top-6 font-black text-[7rem] leading-none tracking-[-0.08em] text-foreground/8" aria-hidden="true">
                                                        {index + 1}
                                                    </span>
                                                    <span className="relative font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/60">
                                                        {photo.label} / Placeholder
                                                    </span>
                                                </div>
                                            )}
                                        </HeroInteractivePortrait>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
