"use client";

import { memo, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useShootModeOn } from "@/app/utils/shoot-mode-store";

const REDUCED_MOTION_MQ = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void): () => void {
    const query = window.matchMedia(REDUCED_MOTION_MQ);
    query.addEventListener("change", callback);
    return () => query.removeEventListener("change", callback);
}

function reducedMotionSnapshot(): boolean {
    return window.matchMedia(REDUCED_MOTION_MQ).matches;
}

function serverReducedMotionSnapshot(): boolean {
    return false;
}

function usePrefersReducedMotion(): boolean {
    return useSyncExternalStore(
        subscribeToReducedMotion,
        reducedMotionSnapshot,
        serverReducedMotionSnapshot,
    );
}

export type FeaturedProject = {
    id: string;
    title: string;
    type: string;
    role: string;
    summary: string;
    outcomes: readonly string[];
    capabilities: readonly string[];
};

type FeaturedProjectArticleProps = {
    activeIndex: number;
    announcementId: string;
    project: FeaturedProject;
    reduceMotion: boolean;
};

const FeaturedProjectArticle = memo(function FeaturedProjectArticle({
    activeIndex,
    announcementId,
    project,
    reduceMotion,
}: FeaturedProjectArticleProps) {
    const sequence = String(activeIndex + 1).padStart(2, "0");
    const [typedSequence, setTypedSequence] = useState<string>(() => reduceMotion ? sequence : "");
    const [typedTitle, setTypedTitle] = useState<string>(() => reduceMotion ? project.title : "");
    const [contentEntered, setContentEntered] = useState(reduceMotion);

    useEffect(() => {
        if (reduceMotion) return;

        let sequenceIndex = 0;
        let titleIndex = 0;
        let secondFrameId: number | undefined;
        const sequenceIntervalId = window.setInterval(() => {
            sequenceIndex += 1;
            setTypedSequence(sequence.slice(0, sequenceIndex));
            if (sequenceIndex >= sequence.length) {
                window.clearInterval(sequenceIntervalId);
            }
        }, 100);
        const titleIntervalId = window.setInterval(() => {
            titleIndex += 1;
            setTypedTitle(project.title.slice(0, titleIndex));
            if (titleIndex >= project.title.length) {
                window.clearInterval(titleIntervalId);
            }
        }, 50);
        const firstFrameId = window.requestAnimationFrame(() => {
            secondFrameId = window.requestAnimationFrame(() => setContentEntered(true));
        });

        return () => {
            window.clearInterval(sequenceIntervalId);
            window.clearInterval(titleIntervalId);
            window.cancelAnimationFrame(firstFrameId);
            if (secondFrameId !== undefined) window.cancelAnimationFrame(secondFrameId);
        };
    }, [project.title, reduceMotion, sequence]);

    return (
        <article
            data-testid="featured-work-article"
            aria-labelledby={announcementId}
            className="flex h-full flex-col"
        >
            <div className="border-b border-current/15 pb-6">
                <p
                    data-testid="featured-work-sequence"
                    aria-hidden="true"
                    className="min-h-4 font-mono text-[10px] font-medium tracking-[0.36em] opacity-65"
                >
                    {reduceMotion ? sequence : typedSequence}
                </p>
                <h3
                    data-testid="featured-work-title"
                    aria-hidden="true"
                    className="mt-3 min-h-[1em] whitespace-nowrap font-black uppercase leading-[0.9] tracking-[-0.04em] text-[clamp(1.5rem,3vw,3.5rem)]"
                >
                    {reduceMotion ? project.title : typedTitle}
                </h3>
                <dl className="mt-6 grid grid-cols-2 gap-4 font-mono text-sm uppercase leading-relaxed tracking-[0.16em] opacity-65">
                    <div>
                        <dt className="sr-only">Project type</dt>
                        <dd>{project.type}</dd>
                    </div>
                    <div>
                        <dt className="sr-only">Role</dt>
                        <dd>{project.role}</dd>
                    </div>
                </dl>
            </div>

            <div
                data-testid="featured-work-content"
                className="flex min-h-0 flex-1 flex-col pt-6 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none"
                style={{
                    opacity: reduceMotion || contentEntered ? 1 : 0,
                    transform: reduceMotion || contentEntered ? "none" : "translateY(8px)",
                }}
            >
                <p className="max-w-3xl text-sm leading-relaxed opacity-70 xl:text-base">
                    {project.summary}
                </p>

                <div className="mt-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] opacity-65">
                        Outcomes
                    </p>
                    <ol className="mt-3 space-y-2">
                        {project.outcomes.map((outcome, index) => (
                            <li key={outcome} className="flex gap-4 border-t border-current/12 pt-3 text-base uppercase leading-relaxed tracking-[0.04em] opacity-80">
                                <span className="font-mono text-[10px] opacity-65">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                {outcome}
                            </li>
                        ))}
                    </ol>
                </div>

                <div data-testid="featured-work-capabilities" className="mt-auto pt-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] opacity-65">
                        Capabilities
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {project.capabilities.map((capability) => (
                            <span key={capability} className="border border-current/20 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] opacity-65">
                                {capability}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
});

type DesktopGalleryProps = {
    activeIndex: number;
    selectProject: (index: number) => void;
    projects: FeaturedProject[];
    title: string;
    label: string;
    intro: string;
};

const ProjectsDesktopGallery = memo(function ProjectsDesktopGallery({
    activeIndex,
    selectProject,
    projects,
    title,
    label,
    intro,
}: DesktopGalleryProps) {
    const project = projects[activeIndex] ?? projects[0];
    const sequence = String(activeIndex + 1).padStart(2, "0");
    const reduceMotion = usePrefersReducedMotion();
    const announcementId = "featured-work-announcement";

    return (
        <div
            data-testid="featured-work-desktop"
            className="hidden lg:grid lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start lg:gap-x-10 lg:gap-y-5 xl:grid-cols-[360px_minmax(0,1fr)] xl:gap-x-14"
        >
            <div className="lg:col-start-1 lg:row-start-1">
                <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.35em] text-foreground/45 dark:text-foreground/60">
                    {label}
                </span>
                <h2 className="text-3xl font-black uppercase leading-[0.95] tracking-tighter text-foreground sm:text-4xl lg:text-5xl">
                    {title}
                </h2>
            </div>

            <div className="lg:col-start-1 lg:row-start-2">
                <p
                    data-testid="featured-work-intro"
                    className="max-w-sm text-sm leading-relaxed text-foreground/55 sm:text-base"
                >
                    {intro}
                </p>

                <div data-testid="featured-work-selectors" className="mt-8 flex flex-col sm:mt-10">
                    {projects.map((item, index) => {
                        const isActive = activeIndex === index;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                data-shoot-target="1"
                                data-shoot-disappear="1"
                                aria-pressed={isActive}
                                onClick={() => selectProject(index)}
                                className={`group flex min-h-16 items-center gap-4 px-4 py-3 text-left outline-none transition-[background-color,border-color] duration-200 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground/60 dark:focus-visible:ring-[#e7dfd5] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none ${
                                    isActive
                                        ? "border-l-2 border-[#6f655b] bg-[#fafbf9] dark:border-[#73a7ff] dark:bg-[#203b60]/70"
                                        : "border-l border-foreground/15 bg-transparent hover:bg-white/55 dark:hover:bg-[#203b60]/70"
                                }`}
                            >
                                <span className="font-mono text-[10px] tracking-[0.28em] text-foreground/45 dark:text-foreground/50">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="min-w-0 flex-1 text-sm font-semibold tracking-[0.04em] text-foreground">
                                    {item.title}
                                </span>
                                <span
                                    className={`h-2 w-2 shrink-0 rounded-[2px] border transition-colors duration-200 motion-reduce:transition-none ${
                                        isActive
                                            ? "border-[#6f655b] bg-[#6f655b] dark:border-[#e7dfd5] dark:bg-[#e7dfd5]"
                                            : "border-foreground/35 bg-transparent"
                                    }`}
                                    aria-hidden
                                />
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="min-h-0 lg:col-start-2 lg:row-start-2 lg:pl-2">
                <div
                    data-shoot-target="1"
                    data-shoot-disappear="1"
                    data-testid="featured-work-stage"
                    className="w-full overflow-hidden border border-black/10 bg-[#fafbf9] p-8 text-[#171512] dark:border-[#7ea6d6]/25 dark:bg-[linear-gradient(180deg,rgba(32,59,96,0.92)_0%,rgba(21,36,58,0.96)_42%,rgba(16,25,37,0.98)_100%)] dark:text-[#f3f6fa] xl:p-10"
                    style={{ height: "clamp(640px, 68vh, 760px)" }}
                >
                    <div
                        id={announcementId}
                        data-testid="featured-work-announcement"
                        aria-live="polite"
                        aria-atomic="true"
                        className="sr-only"
                    >
                        Project {sequence} of {String(projects.length).padStart(2, "0")}: {project.title}.
                    </div>
                    <FeaturedProjectArticle
                        key={`${project.id}-${reduceMotion ? "reduced" : "motion"}`}
                        activeIndex={activeIndex}
                        announcementId={announcementId}
                        project={project}
                        reduceMotion={reduceMotion}
                    />
                </div>
            </div>
        </div>
    );
});

type ProjectsProps = {
    content: {
        title: string;
        label: string;
        intro: string;
        items: FeaturedProject[];
    };
};

export default function Projects({ content }: ProjectsProps) {
    const shootModeOn = useShootModeOn();
    const [activeIndex, setActiveIndex] = useState(0);

    const selectProject = useCallback(
        (index: number) => {
            if (shootModeOn) return;
            setActiveIndex(index);
        },
        [shootModeOn],
    );

    return (
        <section
            id="projects"
            className="projects-section scroll-mt-24 bg-transparent text-foreground lg:-mt-[23vh]"
            aria-label="Projects"
        >
            <div className="mx-auto w-full max-w-[1920px] px-5 py-14 sm:px-8 md:px-12 lg:px-14 xl:px-18 2xl:max-w-none 2xl:pl-24 2xl:pr-0">
                {/* ——— Below lg: single column, stacked projects (theme) ——— */}
                <div data-testid="featured-work-mobile" className="lg:hidden">
                    <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.35em] text-foreground/45 dark:text-foreground/60">{content.label}</span>
                    <h2 className="text-3xl font-black uppercase leading-[0.95] tracking-tighter text-foreground sm:text-4xl md:text-5xl">
                        {content.title}
                    </h2>
                    <p className="mt-5 max-w-2xl text-sm leading-relaxed text-foreground/55 sm:text-base md:text-lg">
                        {content.intro}
                    </p>

                    <div className="mt-12 flex flex-col gap-8 sm:mt-14">
                        {content.items.map((project, index) => (
                            <article key={project.id} data-shoot-target="1" data-shoot-disappear="1" className="border border-border bg-[#fafbf9] p-6 text-[#171512] dark:border-[#7ea6d6]/25 dark:bg-[linear-gradient(180deg,rgba(32,59,96,0.92)_0%,rgba(21,36,58,0.96)_42%,rgba(16,25,37,0.98)_100%)] dark:text-[#f3f6fa] sm:p-8">
                                <p className="font-mono text-[10px] tracking-[0.28em] opacity-55">{String(index + 1).padStart(2, "0")}</p>
                                <h3 className="mt-3 text-3xl font-black uppercase leading-none tracking-tight">{project.title}</h3>
                                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] opacity-60">{project.type} · {project.role}</p>
                                <p className="mt-5 text-sm leading-relaxed opacity-85">{project.summary}</p>
                                <ol className="mt-5 space-y-2">
                                    {project.outcomes.map((outcome, outcomeIndex) => (
                                        <li key={outcome} className="flex gap-3 border-t border-current/12 pt-2 text-xs uppercase opacity-75"><span className="font-mono text-[9px]">{String(outcomeIndex + 1).padStart(2, "0")}</span>{outcome}</li>
                                    ))}
                                </ol>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {project.capabilities.map((capability) => <span key={capability} className="border border-current/20 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.15em]">{capability}</span>)}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                {/* ——— lg+ : selector + text stage ——— */}
                <ProjectsDesktopGallery
                    activeIndex={activeIndex}
                    selectProject={selectProject}
                    projects={content.items}
                    title={content.title}
                    label={content.label}
                    intro={content.intro}
                />
            </div>
        </section>
    );
}
