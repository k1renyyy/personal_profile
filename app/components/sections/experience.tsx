"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

import { useHydrationSafeReducedMotion } from "@/app/hooks/use-hydration-safe-reduced-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export type ExperienceContentItem = {
  id: string;
  company: string;
  role: string;
  dateRange: string;
  highlights: string[];
};

type ExperienceItem = ExperienceContentItem & {
  color: string;
  logo?: { src: string };
};

const experienceColors = ["#191918", "#222220", "#2b2a27"];

function ExperienceLogo({ item }: { item: ExperienceItem }) {
  const [failed, setFailed] = React.useState(false);

  if (!item.logo || failed) {
    return (
      <span
        data-testid="experience-logo-fallback"
        aria-hidden="true"
        className="flex size-12 items-center justify-center border border-border bg-background font-mono text-sm font-semibold text-foreground/55"
      >
        {item.company.slice(0, 1)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.logo.src}
      alt=""
      aria-hidden="true"
      className="size-12 border border-border bg-background object-contain p-1.5"
      onError={() => setFailed(true)}
    />
  );
}

function MobileExperienceTabs({ experiences }: {experiences: ExperienceItem[]}) {
  const [activeId, setActiveId] = React.useState(experiences[0].id);
  const reduceMotion = useHydrationSafeReducedMotion();

  return (
    <Tabs
      data-testid="experience-mobile-tabs"
      value={activeId}
      onValueChange={setActiveId}
      orientation="vertical"
      activationMode="automatic"
      className="grid gap-8 lg:hidden"
    >
      <TabsList aria-label="Experience companies" className="flex w-full flex-col">
        {experiences.map((experience, index) => (
          <TabsTrigger
            key={experience.id}
            value={experience.id}
            className="group relative grid min-h-24 w-full grid-cols-[48px_minmax(0,1fr)] items-center gap-4 border-l-2 border-transparent px-5 py-4 text-left outline-none transition-colors hover:bg-foreground/[0.035] focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=active]:border-foreground data-[state=active]:bg-foreground/[0.055]"
          >
            <ExperienceLogo item={experience} />
            <span className="min-w-0">
              <span className="flex items-center gap-3 text-base font-semibold text-foreground">
                <span className="size-1.5 shrink-0 rounded-full border border-foreground/35 bg-transparent group-data-[state=active]:border-foreground group-data-[state=active]:bg-foreground" aria-hidden="true" />
                {experience.company}
              </span>
              <span className="mt-1 block pl-[18px] font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/45">
                {experience.dateRange}
              </span>
            </span>
            <span className="sr-only">Experience {String(index + 1).padStart(2, "0")}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="min-w-0">
        {experiences.map((experience) => (
          <TabsContent key={experience.id} value={experience.id} forceMount hidden={activeId !== experience.id}>
            {activeId === experience.id ? (
              <motion.article
                key={experience.id}
                data-testid="experience-mobile-panel"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="text-3xl font-black leading-none tracking-tight text-foreground">{experience.role}</h3>
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-foreground/50">
                  {experience.dateRange}
                </p>
                <ol className="mt-8 border-t border-border">
                  {experience.highlights.map((highlight, index) => (
                    <li key={`${experience.id}-${index}`} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-b border-border py-5">
                      <span aria-hidden="true" className="font-mono text-xs tracking-[0.18em] text-foreground/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-6 text-foreground/75">{highlight}</p>
                    </li>
                  ))}
                </ol>
              </motion.article>
            ) : null}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}

function ExperienceCardArtwork({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg data-testid="experience-card-artwork" data-artwork="curved" viewBox="0 0 320 454" className="size-full" aria-hidden="true">
        <path d="M62 270a98 98 0 0 1 156-80" fill="none" stroke="#f1ede5" strokeWidth="28" strokeLinecap="round" />
        <path d="M95 305a58 58 0 0 0 92 18" fill="none" stroke="#aaa59d" strokeWidth="13" strokeLinecap="round" />
        <circle cx="221" cy="177" r="23" fill="#f1ede5" />
        <circle cx="88" cy="309" r="9" fill="#f1ede5" />
        <path d="M88 309 221 177" stroke="#aaa59d" strokeWidth="2" strokeDasharray="5 8" />
        <g data-testid="experience-card-corner-mark" transform="translate(258 36)">
          <path d="M0 22A22 22 0 0 1 22 0" fill="none" stroke="#f1ede5" strokeWidth="7" />
          <circle cx="24" cy="24" r="4" fill="#aaa59d" />
        </g>
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg data-testid="experience-card-artwork" data-artwork="orthogonal" viewBox="0 0 320 454" className="size-full" aria-hidden="true">
        <rect x="70" y="142" width="54" height="172" rx="4" fill="#f1ede5" />
        <rect x="196" y="110" width="54" height="172" rx="4" fill="#aaa59d" />
        <rect x="112" y="205" width="96" height="38" rx="3" fill="#f1ede5" />
        <rect x="150" y="181" width="20" height="20" fill="#222220" stroke="#f1ede5" strokeWidth="3" />
        <path d="M97 330V350H223V300" fill="none" stroke="#aaa59d" strokeWidth="2" strokeDasharray="5 8" />
        <g data-testid="experience-card-corner-mark" transform="translate(258 34)">
          <rect width="18" height="18" fill="#f1ede5" />
          <rect x="12" y="14" width="18" height="18" fill="#aaa59d" />
        </g>
      </svg>
    );
  }

  return (
    <svg data-testid="experience-card-artwork" data-artwork="diagonal" viewBox="0 0 320 454" className="size-full" aria-hidden="true">
      <path d="m68 304 74-118 50 42 62-104" fill="none" stroke="#f1ede5" strokeWidth="24" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M66 348h188V106" fill="none" stroke="#aaa59d" strokeWidth="2" strokeDasharray="6 9" />
      <circle cx="68" cy="304" r="12" fill="#aaa59d" />
      <circle cx="142" cy="186" r="12" fill="#f1ede5" />
      <circle cx="192" cy="228" r="12" fill="#aaa59d" />
      <g data-testid="experience-card-corner-mark" transform="translate(256 34)">
        <path d="M2 28 15 4l13 10" fill="none" stroke="#f1ede5" strokeWidth="6" strokeLinecap="square" />
        <circle cx="28" cy="14" r="5" fill="#aaa59d" />
      </g>
    </svg>
  );
}

function DesktopExperienceCards({ experiences, title, label }: {experiences: ExperienceItem[]; title: string; label: string}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLElement>(null);
  const stackRef = React.useRef<HTMLOListElement>(null);

  React.useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const header = headerRef.current;
    const stack = stackRef.current;
    if (!track || !stage || !header || !stack) return;

    const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-card]"));
    if (cards.length !== experiences.length) return;

    const setPhase = (progress: number) => {
      const phase = progress < 0.55 ? "front" : progress < 0.828 ? "transitioning" : "back";
      track.dataset.phase = phase;
      cards.forEach((card) => {
        card.dataset.cardState = phase;
      });
    };

    const media = gsap.matchMedia();
    const context = gsap.context(() => {

      media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        let wanderTweens: gsap.core.Tween[] = [];

        const stopWander = () => {
          wanderTweens.forEach((tween) => tween.kill());
          wanderTweens = [];
        };

        const startWander = () => {
          if (wanderTweens.length > 0) return;
          wanderTweens = [...cards].reverse().map((card) => gsap.fromTo(card,
            { yPercent: -1 },
            {
              yPercent: 1,
              duration: () => gsap.utils.random(1.5, 2.5),
              ease: "sine.inOut",
              repeat: -1,
              repeatRefresh: true,
              yoyo: true,
            },
          ));
        };

        const buildMasterTimeline = () => {
          setPhase(0);

          [...cards].reverse().forEach((card, index) => {
            const position = cards.length - index - 2;
            gsap.set(card, {
              y: () => -0.75 * window.innerHeight + 1,
              x: () => -position * card.offsetWidth * 1.15,
              scale: 0.2,
              rotationZ: [12, 0, -12][index],
              rotationY: 0,
              rotationX: 24,
            });
            gsap.set(card.querySelector("[data-front-overlay]"), { opacity: 1 });
          });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: track,
              start: "top 95%",
              end: "bottom 75%",
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                setPhase(self.progress);
              },
            },
          });

          [...cards].reverse().forEach((card, index) => {
            const position = cards.length - index - 2;
            const staggerIndex = cards.length - 1 - index;
            const overlay = card.querySelector<HTMLElement>("[data-front-overlay]");

            timeline.to(card, {
              force3D: true,
              keyframes: {
                "0%": {
                  y: () => -0.75 * window.innerHeight + 1,
                  x: () => -position * card.offsetWidth * 1.15,
                  scale: 0.2,
                  rotationZ: [12, 0, -12][index],
                  rotationY: 0,
                  rotationX: 24,
                },
                "40%": {
                  y: "20%",
                  scale: 0.8,
                  rotationZ: [5, 0, -5][index],
                  rotationY: 0,
                  rotationX: 0,
                },
                "55%": {
                  rotationY: 0,
                  y: 0,
                  x: () => gsap.getProperty(card, "x"),
                },
                "75%": {
                  x: 0,
                  rotationZ: 0,
                  rotationY: -190,
                  scale: 1,
                },
                "82%": { rotationY: -180 },
                "100%": { rotationZ: 0 },
              },
            }, 0.012 * staggerIndex);

            if (overlay) {
              timeline.to(overlay, {
                opacity: 1,
                keyframes: {
                  "10%": { opacity: 1 },
                  "25%": { opacity: 0 },
                  "100%": { opacity: 0 },
                },
              }, "<");
            }
          });

          return timeline;
        };

        let masterTimeline = buildMasterTimeline();
        const exitTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: track,
            start: () => {
              const trigger = masterTimeline.scrollTrigger;
              return trigger ? trigger.start + (trigger.end - trigger.start) * 0.82 : 0;
            },
            end: () => track.getBoundingClientRect().top + window.scrollY + track.offsetHeight - window.innerHeight,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        exitTimeline
          .fromTo(header, { y: 0 }, { y: "-12rem", ease: "none" }, 0)
          .fromTo(stack, { y: 0 }, { y: "-18rem", ease: "none" }, 0);

        const visibilityTrigger = ScrollTrigger.create({
          trigger: track,
          start: "top bottom",
          end: "bottom top",
          onEnter: startWander,
          onEnterBack: startWander,
          onLeave: stopWander,
          onLeaveBack: stopWander,
        });
        let resizeFrame = 0;
        const handleResize = () => {
          window.cancelAnimationFrame(resizeFrame);
          resizeFrame = window.requestAnimationFrame(() => {
            const progress = masterTimeline.scrollTrigger?.progress ?? 0;
            masterTimeline.scrollTrigger?.kill();
            masterTimeline.kill();
            masterTimeline = buildMasterTimeline();
            ScrollTrigger.refresh();
            const trigger = masterTimeline.scrollTrigger;
            if (trigger) {
              const targetScroll = trigger.start + (trigger.end - trigger.start) * progress;
              const lenisWindow = window as Window & {
                lenis?: { scrollTo: (position: number, options: { immediate: boolean }) => void };
              };
              lenisWindow.lenis?.scrollTo(targetScroll, { immediate: true });
              window.scrollTo(0, targetScroll);
              trigger.update();
            }
          });
        };
        window.addEventListener("resize", handleResize);

        return () => {
          window.cancelAnimationFrame(resizeFrame);
          window.removeEventListener("resize", handleResize);
          stopWander();
          visibilityTrigger.kill();
          exitTimeline.scrollTrigger?.kill();
          exitTimeline.kill();
          masterTimeline.scrollTrigger?.kill();
          masterTimeline.kill();
          gsap.set([header, stack], { clearProps: "transform" });
          gsap.set(cards, { clearProps: "transform" });
          gsap.set(cards.map((card) => card.querySelector("[data-front-overlay]")), { clearProps: "opacity" });
        };
      });

      media.add("(min-width: 1024px) and (prefers-reduced-motion: reduce)", () => {
        gsap.set(cards, {
          x: 0,
          y: 0,
          scale: 1,
          rotationX: 0,
          rotationZ: 0,
          rotationY: -180,
        });
        track.dataset.phase = "back";
        cards.forEach((card) => {
          card.dataset.cardState = "back";
        });

        return () => {
          gsap.set(cards, { clearProps: "transform" });
        };
      });

    }, stage);

    const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refreshId);
      media.revert();
      context.revert();
    };
  }, [experiences.length]);

  return (
    <div ref={trackRef} data-testid="experience-track" data-phase="front" className="relative hidden h-[350vh] lg:block">
      <div ref={stageRef} data-testid="experience-stage" className="sticky top-0 h-screen overflow-hidden [perspective:1600px]">
        <header ref={headerRef} className="absolute inset-x-0 top-0 z-20 mx-auto w-full max-w-[1920px] px-20 pt-8 xl:px-32 2xl:px-44 2xl:pt-10">
          <div className="flex items-end gap-4 border-b border-border pb-4">
            <h2 id="experience-heading-desktop" className="text-[clamp(2.5rem,6vw,6rem)] font-black uppercase leading-none tracking-tight text-foreground">{title}</h2>
            <span className="pb-1 font-mono text-xs uppercase tracking-[0.28em] text-foreground/45">{label}</span>
          </div>
          </header>
          <ol ref={stackRef} data-testid="experience-card-stack" className="absolute inset-x-0 bottom-[clamp(1rem,3vh,2rem)] top-[clamp(8rem,17vh,11rem)] mx-auto flex max-w-[1640px] list-none items-center justify-center gap-[clamp(16px,1.5vw,24px)] px-4 xl:px-8">
          {experiences.map((experience, index) => (
            <li key={experience.id} data-testid="experience-card" data-card data-card-state="front" className="relative h-[clamp(540px,70vh,720px)] w-[clamp(310px,30vw,480px)] shrink-0 [transform-style:preserve-3d] will-change-transform">
              <div
                data-shoot-target="1"
                data-testid="experience-card-front"
                aria-hidden="true"
                className="absolute inset-0 overflow-hidden rounded-[2rem] border border-black/5 [backface-visibility:hidden]"
                style={{ backgroundColor: experience.color }}
              >
                <ExperienceCardArtwork index={index} />
                <span data-front-overlay data-testid="experience-card-front-overlay" className="absolute inset-0 bg-background" />
              </div>

              <article
                data-testid="experience-card-back"
                aria-labelledby={`experience-card-title-${index}`}
                className="absolute inset-0 overflow-hidden rounded-[2rem] border bg-[#fafbf9] p-[clamp(1.25rem,2vw,2.5rem)] text-[#171512] dark:bg-[#171512] dark:text-[#f5f1e8] [backface-visibility:hidden] [transform:rotateY(180deg)]"
                style={{ borderColor: experience.color }}
              >
                    <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: experience.color }} aria-hidden="true" />
                    <div data-card-back-content data-shoot-target="1" className="h-full">
                      <div className="flex items-start justify-between gap-5 border-b border-current/15 pb-[clamp(1rem,2vh,1.5rem)]">
                        <div>
                          <span className="font-mono text-xs tracking-[0.24em] opacity-45">{String(index + 1).padStart(2, "0")}</span>
                          <h3 id={`experience-card-title-${index}`} className="mt-3 text-[clamp(1.75rem,2.5vw,3rem)] font-black leading-none tracking-tight">
                            {experience.company}
                          </h3>
                        </div>
                        <span className="mt-1 size-4 shrink-0" style={{ backgroundColor: experience.color }} aria-hidden="true" />
                      </div>
                      <p className="mt-[clamp(1rem,2vh,1.5rem)] font-mono text-[10px] uppercase leading-5 tracking-[0.13em] opacity-55 xl:text-xs">
                        {experience.role} · {experience.dateRange}
                      </p>
                      <ol className="mt-[clamp(1rem,2vh,1.75rem)] border-t border-current/15">
                        {experience.highlights.map((highlight, highlightIndex) => (
                          <li key={`${experience.id}-${highlightIndex}`} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-b border-current/15 py-[clamp(0.65rem,1.5vh,1rem)] last:border-b-0 xl:grid-cols-[2.5rem_minmax(0,1fr)] xl:gap-4">
                            <span aria-hidden="true" className="font-mono text-xs tracking-[0.18em] opacity-40">
                              {String(highlightIndex + 1).padStart(2, "0")}
                            </span>
                            <p className="text-xs leading-5 opacity-75 xl:text-sm xl:leading-6">{highlight}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
              </article>
            </li>
          ))}
          </ol>
      </div>
    </div>
  );
}

export default function Experience({ items, title, label }: {items: ExperienceContentItem[]; title: string; label: string}) {
  const experiences = items.map((item, index) => ({
    ...item,
    color: experienceColors[index] ?? experienceColors[experienceColors.length - 1],
  }));

  return (
    <section data-testid="experience-section" aria-label="Experience 工作经历" className="relative bg-transparent pt-16 sm:pt-20 lg:pt-24">
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 md:px-12 lg:hidden">
        <header className="flex items-end gap-4 border-b border-border pb-5">
          <h2 id="experience-heading-mobile" className="text-[clamp(2.5rem,6vw,6rem)] font-black uppercase leading-none tracking-tight text-foreground">{title}</h2>
          <span className="pb-1 font-mono text-xs uppercase tracking-[0.28em] text-foreground/45">{label}</span>
        </header>
        <div className="py-10"><MobileExperienceTabs experiences={experiences} /></div>
      </div>
      <DesktopExperienceCards experiences={experiences} title={title} label={label} />
    </section>
  );
}
