"use client";

import * as React from "react";
import { m, type Variants } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/app/hooks/use-hydration-safe-reduced-motion";
import { cn } from "@/lib/utils";

/** Local origin keeps compositing cheap; enter uses translate only (no scale). */
export const HERO_MOTION_ORIGIN: React.CSSProperties = {
    transformOrigin: "center",
};

export type HeroEnterDrift = "left" | "right" | "center";

function driftItemVariants(reduceMotion: boolean, drift: HeroEnterDrift): Variants {
    if (reduceMotion) {
        return {
            hidden: { opacity: 1, x: 0, y: 0 },
            visible: { opacity: 1, x: 0, y: 0 },
        };
    }

    const xHidden = drift === "left" ? 28 : drift === "right" ? -28 : 0;

    return {
        hidden: {
            opacity: 0,
            x: xHidden,
            y: drift === "center" ? 10 : 0,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                type: "tween",
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };
}

export function HeroMotionRoot({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element {
    const reduceMotion = useHydrationSafeReducedMotion();

    const containerVariants = React.useMemo<Variants>(
        () => ({
            hidden: {},
            visible: {
                transition: {
                    staggerChildren: reduceMotion ? 0 : 0.018,
                    delayChildren: reduceMotion ? 0 : 0,
                },
            },
        }),
        [reduceMotion]
    );

    return (
        <m.div
            className={cn(className, "transform-gpu")}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {children}
        </m.div>
    );
}

export function HeroEnterBlock({
    children,
    className,
    drift = "center",
}: {
    children: React.ReactNode;
    className?: string;
    drift?: HeroEnterDrift;
}): React.JSX.Element {
    const reduceMotion = useHydrationSafeReducedMotion();
    const variants = React.useMemo(
        () => driftItemVariants(!!reduceMotion, drift),
        [reduceMotion, drift]
    );

    return (
        <m.div
            className={cn(className, "transform-gpu")}
            variants={variants}
            style={HERO_MOTION_ORIGIN}
        >
            {children}
        </m.div>
    );
}

export function HeroBackdrop(): React.JSX.Element {
    const reduceMotion = useHydrationSafeReducedMotion();

    return (
        <div
            className={cn(
                "hero-backdrop-root pointer-events-none absolute inset-0 z-0 overflow-hidden",
                !reduceMotion && "hero-backdrop-reveal"
            )}
            aria-hidden
            style={HERO_MOTION_ORIGIN}
        >
            <div className="hero-backdrop-grid absolute inset-0 opacity-[0.04] dark:opacity-[0.12]" />
            {!reduceMotion ? (
                <>
                    <div
                        className="hero-backdrop-orb-a absolute -left-[18%] top-[12%] h-[min(42vw,420px)] w-[min(42vw,420px)] rounded-full bg-foreground/4.5 blur-2xl"
                        aria-hidden
                    />
                    <div
                        className="hero-backdrop-orb-b absolute -right-[12%] bottom-[18%] h-[min(36vw,360px)] w-[min(36vw,360px)] rounded-full bg-foreground/5.5 blur-2xl"
                        aria-hidden
                    />
                </>
            ) : null}
        </div>
    );
}

type HeroInteractivePortraitProps = {
    children: React.ReactNode;
    frameClassName?: string;
};

export function HeroInteractivePortrait({
    children,
    frameClassName,
}: HeroInteractivePortraitProps): React.JSX.Element {
    const reduceMotion = useHydrationSafeReducedMotion();

    return (
        <div className="group relative">
            <div
                className={cn(
                    "relative overflow-hidden border border-border bg-muted/60",
                    "shadow-none transition-shadow duration-300 ease-out",
                    !reduceMotion && "hover:shadow-xl",
                    frameClassName
                )}
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-1 bg-linear-to-t from-foreground/18 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="relative z-0 h-full w-full">
                    <div
                        className={cn(
                            "relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            !reduceMotion && "group-hover:scale-[1.02]"
                        )}
                    >
                        {children}
                    </div>
                </div>
                <span
                    className="pointer-events-none absolute left-2 top-2 z-2 h-3 w-3 border-l border-t border-foreground/30 opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                />
                <span
                    className="pointer-events-none absolute right-2 top-2 z-2 h-3 w-3 border-r border-t border-foreground/30 opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                />
                <span
                    className="pointer-events-none absolute bottom-2 left-2 z-2 h-3 w-3 border-l border-b border-foreground/30 opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                />
                <span
                    className="pointer-events-none absolute bottom-2 right-2 z-2 h-3 w-3 border-r border-b border-foreground/30 opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                />
            </div>
        </div>
    );
}

export function HeroTechChips({items}: {items: string[]}): React.JSX.Element {
    return (
        <div className="flex flex-wrap gap-2" data-shoot-ui="1">
            {items.map((label) => (
                <span
                    key={label}
                    className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/65"
                >
                    {label}
                </span>
            ))}
        </div>
    );
}
