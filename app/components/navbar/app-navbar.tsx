"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/components/theme-provider";
import { useSyncExternalStore } from "react";

const subscribeToHydration = () => () => undefined;

export default function AppNavbar({brandLabel}: {brandLabel: string}) {
    const { resolvedTheme, setTheme } = useTheme();
    const themeReady = useSyncExternalStore(
        subscribeToHydration,
        () => true,
        () => false,
    );
    return (
            <nav
                data-shoot-ui="1"
                className="absolute inset-x-0 top-0 z-20 flex min-w-0 items-center justify-between gap-2 py-2 pl-4 pr-3 sm:gap-3 sm:px-8 sm:py-3 md:px-12 lg:px-20"
            >
                {/* Left - Logo */}
                <Link href="/" aria-label="Go to home" className="inline-flex min-w-0 shrink items-center">
                    <span className="truncate font-semibold leading-[0.88] tracking-[-0.03em] text-foreground/70 text-[clamp(0.65rem,3.2vw,0.95rem)] sm:text-[clamp(0.72rem,1.35vw,0.95rem)]">
                        {brandLabel}
                    </span>
                </Link>

                {/* Right Side - theme control */}
                <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-2 md:gap-4">
                    <button
                        type="button"
                        onClick={() =>
                            setTheme(resolvedTheme === "dark" ? "light" : "dark")
                        }
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground/80 transition-colors hover:border-foreground/20 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/60"
                        aria-label={
                            themeReady
                                ? resolvedTheme === "dark"
                                    ? "Switch to light theme"
                                    : "Switch to dark theme"
                                : "Toggle color theme"
                        }
                    >
                        {themeReady ? (
                            resolvedTheme === "dark" ? (
                                <Sun className="h-4 w-4" aria-hidden />
                            ) : (
                                <Moon className="h-4 w-4" aria-hidden />
                            )
                        ) : (
                            <Moon className="h-4 w-4 opacity-0" aria-hidden />
                        )}
                    </button>
                </div>
            </nav>
    );
}
