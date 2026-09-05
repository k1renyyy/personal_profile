"use client";

import Link from "next/link";

export default function AppNavbar({brandLabel}: {brandLabel: string}) {
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
            </nav>
    );
}
