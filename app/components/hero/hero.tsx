"use client";

import Image from "next/image";
import { LazyMotion, domAnimation } from "framer-motion";
import AppNavbar from "@/app/components/navbar/app-navbar";
import {
    HeroBackdrop,
    HeroEnterBlock,
    HeroInteractivePortrait,
    HeroMotionRoot,
    HeroTechChips,
} from "./hero-interactive";
import type {IdentityViewModel} from "@/lib/identity/map-identity";

type HeroIdentity = Pick<IdentityViewModel, "brandLabel" | "hero" | "profile">;

export function buildHeroCopy(
    hero: IdentityViewModel["hero"],
    profile: IdentityViewModel["profile"],
) {
    return {
        ...hero,
        portrait: profile.portrait,
        portraitLabel: "Portrait pending; Kiren identity wordmark",
    };
}

function HeroPortrait({
    copy,
    width,
    height,
    sizes,
}: {
    copy: ReturnType<typeof buildHeroCopy>;
    width: number;
    height: number;
    sizes: string;
}) {
    if (copy.portrait) {
        return (
            <Image
                src={copy.portrait.assetUrl}
                alt={copy.portrait.alt}
                width={copy.portrait.originalDimensions.width || width}
                height={copy.portrait.originalDimensions.height || height}
                sizes={sizes}
                priority
                fetchPriority="high"
                className="h-full w-full object-cover"
            />
        );
    }
    return (
        <div
            aria-label={copy.portraitLabel}
            className="relative grid h-full w-full place-content-center overflow-hidden bg-linear-to-br from-violet-500/18 via-background to-amber-400/20 text-center"
        >
            <div aria-hidden className="absolute inset-0 hero-backdrop-grid opacity-20 dark:opacity-35" />
            <div className="relative font-black uppercase leading-[0.82] tracking-[-0.06em] text-foreground/85 text-[clamp(2.5rem,8vw,7rem)]">
                KIREN
                <span className="mt-3 block font-mono text-[0.24em] tracking-[0.34em] text-foreground/55">于卓立</span>
            </div>
        </div>
    );
}

export default function Hero({identity}: {identity: HeroIdentity}) {
    const copy = buildHeroCopy(identity.hero, identity.profile);
    return (
        <LazyMotion features={domAnimation} strict>
        <section
            data-shoot-target="1"
            data-shoot-granularity="char"
            className="hero-klein-glow relative isolate w-full overflow-hidden bg-background contain-layout pb-8 min-h-[100svh] sm:min-h-[72dvh] sm:pb-10 md:min-h-0 md:pb-14 lg:pb-6 xl:flex xl:min-h-[100svh] xl:flex-col xl:justify-center xl:pb-8"
        >
            <HeroBackdrop />
            <AppNavbar brandLabel={identity.brandLabel} />
            <div className="relative z-10 mx-auto h-full min-h-0 w-full max-w-[1920px] px-4 sm:px-6 md:h-auto md:px-10 lg:px-14 xl:px-20">
                {/* Mobile layout */}
                <HeroMotionRoot className="md:hidden flex h-full flex-col justify-center gap-4 py-4 sm:py-6">
                    <HeroEnterBlock drift="center">
                        <h1
                            data-shoot-target="1"
                            data-shoot-granularity="char"
                            className="text-foreground font-black uppercase leading-[0.9] tracking-[-0.05em] text-[clamp(2.6rem,11vw,4.6rem)]"
                        >
                            <span>{copy.titleLines[0]}</span>
                            <br />
                            <span>{copy.titleLines[1]}</span>
                        </h1>
                    </HeroEnterBlock>

                    <HeroEnterBlock drift="left">
                        <HeroTechChips items={copy.techChips} />
                    </HeroEnterBlock>

                    <HeroEnterBlock drift="center">
                        <div className="text-[12px] font-mono uppercase tracking-[0.28em] text-foreground/70 mb-2">
                            Profile / 01
                        </div>
                        <HeroInteractivePortrait frameClassName="w-full aspect-video">
                            <HeroPortrait copy={copy} width={1200} height={675} sizes="100vw" />
                        </HeroInteractivePortrait>
                    </HeroEnterBlock>

                    <HeroEnterBlock drift="right">
                        <div className="text-right">
                            <p className="text-[15px] font-mono uppercase tracking-[0.22em] text-foreground/72">
                                {copy.valuePropositionLines[0]}
                                <br />
                                {copy.valuePropositionLines[1]}
                            </p>
                            <div className="mt-2 text-[14px] font-mono uppercase tracking-[0.24em] text-foreground/55">
                                {copy.availability}
                            </div>
                        </div>
                    </HeroEnterBlock>

                    <HeroEnterBlock drift="right">
                        <div
                            data-shoot-target="1"
                            data-shoot-granularity="char"
                            className="text-right text-foreground font-black uppercase leading-[0.88] tracking-[-0.06em] text-[clamp(3.1rem,13vw,5.2rem)]"
                        >
                            {copy.nameLines[0]}
                            <br />
                            {copy.nameLines[1]}
                        </div>
                    </HeroEnterBlock>

                    <HeroEnterBlock>
                        <div className="text-right text-[14px] font-mono uppercase tracking-[0.26em] text-foreground/55">
                            {new Date().getFullYear()} Portfolio
                        </div>
                    </HeroEnterBlock>

                    <HeroEnterBlock>
                        <div className="grid grid-cols-12 items-start gap-4">
                            <div className="col-span-2 text-foreground/70 text-lg leading-none select-none">
                                <span aria-hidden="true">-&gt;</span>
                            </div>
                            <div className="col-span-10">
                                <div className="text-[14px] font-mono uppercase tracking-[0.28em] text-foreground/70">
                                    {copy.regionLabel}
                                </div>
                            </div>
                        </div>
                    </HeroEnterBlock>

                    <HeroEnterBlock drift="right">
                        <div className="text-right text-[14px] font-mono uppercase tracking-[0.28em] text-foreground/55">
                            {identity.profile.professionalTitle} · {identity.profile.timezone}
                        </div>
                    </HeroEnterBlock>
                </HeroMotionRoot>

                {/* Desktop/tablet layout */}
                <HeroMotionRoot className="hidden flex-col gap-6 py-6 md:flex md:justify-start md:gap-8 md:py-8 lg:gap-10 lg:py-10">
                    {/* Top row */}
                    <div className="grid grid-cols-12 items-start gap-x-6 gap-y-10">
                        <HeroEnterBlock className="col-span-12 md:col-span-7 md:text-left" drift="left">
                            <h1
                                data-shoot-target="1"
                                data-shoot-granularity="char"
                                className="text-foreground font-black uppercase leading-[0.88] tracking-[-0.04em] text-[clamp(2.8rem,6.6vw,6.6rem)]"
                            >
                                <span>{copy.titleLines[0]}</span>
                                <br />
                                <span>{copy.titleLines[1]}</span>
                            </h1>
                            <div className="mt-4">
                                <HeroTechChips items={copy.techChips} />
                            </div>
                        </HeroEnterBlock>
                        <HeroEnterBlock className="col-span-5 hidden self-end pb-5 md:block" drift="right">
                            <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/70">
                                <span className="whitespace-nowrap">Available for opportunities</span>
                                <span className="text-sm font-bold text-[#858bd0]" aria-hidden="true">+</span>
                                <span className="h-px flex-1 bg-foreground/50" aria-hidden="true" />
                                <span className="whitespace-nowrap">NYC ↔ CN</span>
                            </div>
                        </HeroEnterBlock>
                    </div>

                    {/* Bottom row */}
                    <div className="grid grid-cols-12 items-start gap-x-6 gap-y-8">
                        <HeroEnterBlock className="col-span-12 md:col-span-5 md:order-2" drift="right">
                            <div className="mb-8 max-w-104 md:ml-auto md:text-right">
                                <p className="text-[15px] font-mono uppercase tracking-[0.22em] text-foreground/72">
                                    {copy.valuePropositionLines[0]}
                                    <br />
                                    {copy.valuePropositionLines[1]}
                                </p>
                                <div className="mt-3 text-[14px] font-mono uppercase tracking-[0.24em] text-foreground/55">
                                    {copy.availability}
                                </div>
                            </div>

                            <div
                                data-shoot-target="1"
                                data-shoot-granularity="char"
                                className="text-foreground font-black uppercase leading-[0.88] tracking-[-0.05em] text-[clamp(3.4rem,6.7vw,6.4rem)] md:text-right"
                            >
                                {copy.nameLines[0]}
                                <br />
                                {copy.nameLines[1]}
                            </div>

                            <div className="mt-8 text-[14px] font-mono uppercase tracking-[0.26em] text-foreground/55 md:text-right">
                                {new Date().getFullYear()} Portfolio
                            </div>

                        </HeroEnterBlock>

                        <HeroEnterBlock className="col-span-12 md:col-span-7 md:order-1" drift="left">
                            <div className="md:flex md:justify-start">
                                <div className="w-full max-w-[720px]">
                                    <HeroInteractivePortrait frameClassName="w-full aspect-16/6">
                                        <HeroPortrait copy={copy} width={1600} height={600} sizes="(max-width: 768px) 100vw, 640px" />
                                    </HeroInteractivePortrait>

                                    <div className="mt-6 grid grid-cols-12 items-start gap-4">
                                        <div className="col-span-2 text-foreground/70 text-lg leading-none select-none">
                                            <span aria-hidden="true">-&gt;</span>
                                        </div>
                                        <div className="col-span-10">
                                            <div className="text-[14px] font-mono uppercase tracking-[0.28em] text-foreground/70">
                                                {copy.regionLabel}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-10 text-left text-[14px] font-mono uppercase tracking-[0.28em] text-foreground/55">
                                        {identity.profile.professionalTitle} · {identity.profile.timezone}
                                    </div>
                                </div>
                            </div>
                        </HeroEnterBlock>
                    </div>
                </HeroMotionRoot>
            </div>
        </section>
        </LazyMotion>
    );
}
