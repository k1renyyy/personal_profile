"use client";

import { useRef } from "react";
import { useGSAP } from "@/app/hooks/useGSAP";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

type TestimonialsProps = {
    content: {
        title: string;
        intro: string;
        items: Array<{id: string; name: string; company: string; content: string; initials: string}>;
    };
};

const testimonialAvatars: Record<string, string> = {
    "栾兴良": "https://api.dicebear.com/10.x/lorelei/svg?seed=luan-xingliang&hairVariant=variant03&glassesProbability=100&glassesVariant=variant01&mouthVariant=happy09&hairColor=2c1b18&skinColor=e5a07e&backgroundColor=ffffff",
    "陈志鹏": "https://api.dicebear.com/10.x/lorelei/svg?seed=chen-zhipeng&hairVariant=variant04&glassesProbability=0&mouthVariant=happy12&hairColor=2c1b18&skinColor=d78774&backgroundColor=ffffff",
    "叶大伟": "https://api.dicebear.com/10.x/lorelei/svg?seed=ye-dawei&hairVariant=variant02&glassesProbability=100&glassesVariant=variant04&mouthVariant=happy09&hairColor=2c1b18&skinColor=e5a07e&backgroundColor=ffffff",
    "Gina Antoniello": "https://api.dicebear.com/10.x/lorelei/svg?seed=gina-antoniello&hairVariant=variant45&glassesProbability=0&mouthVariant=happy02&hairColor=6c4545&skinColor=e7a391&backgroundColor=ffffff",
};

export default function Testimonials({ content }: TestimonialsProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    
    // Create a looped array of testimonials to ensure infinite scrolling covers wide screens
    // duplicating 4 times to ensure enough length for large screens
    const loopedTestimonials = [...content.items, ...content.items, ...content.items, ...content.items];

    const containerRef = useGSAP(() => {
        const slider = sliderRef.current;
        if (!slider) return;
        const section = slider.closest(".testimonials-section");
        if (!section) return;

        const totalWidth = slider.scrollWidth;
        const widthPerSet = totalWidth / 4; // Since we quadrupled the items

        gsap.to(slider, {
            x: -widthPerSet,
            duration: 20,
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % widthPerSet)
            }
        });

        // Specific animation for the section title
        gsap.from(".testimonial-header", {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });

    });

    if (content.items.length === 0) return null;

    const titleLines = content.title.split(/\s+/);
    const titleBreak = Math.max(1, Math.ceil(titleLines.length / 2));

    return (
        <section ref={containerRef} className="testimonials-section relative w-full pt-16 pb-24 overflow-hidden bg-transparent">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 mb-20">
                <div className="flex flex-col gap-4">
                    <span className="testimonial-header text-xs uppercase tracking-[0.3em] text-foreground/45 dark:text-foreground/60 font-medium">{content.intro}</span>
                    <h2 className="testimonial-header text-[clamp(2.5rem,6vw,6rem)] font-black uppercase leading-[0.9] text-foreground">
                        {titleLines.slice(0, titleBreak).join(" ")} <br /> {titleLines.slice(titleBreak).join(" ")}
                    </h2>
                </div>
            </div>

            <div className="relative w-full overflow-hidden mask-fade-sides">
                {/* Gradient Masks for smooth fade out at edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 z-10 bg-linear-to-r from-background to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 z-10 bg-linear-to-l from-background to-transparent pointer-events-none"></div>

                <div ref={sliderRef} className="flex gap-6 w-max items-stretch pl-4 sm:pl-6 md:pl-12 lg:pl-20">
                    {loopedTestimonials.map((testimonial, index) => (
                        <div 
                            key={index} 
                            className="w-[350px] md:w-[500px] shrink-0 group relative"
                        >
                            <div className="h-full bg-transparent border-t border-border hover:border-foreground/40 transition-colors duration-500 pt-8 flex flex-col justify-between">
                                <div>
                                    <div className="mb-6 text-foreground/40">
                                        <Quote className="w-8 h-8 opacity-50" />
                                    </div>
                                    
                                    <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light mb-8">
                                        &ldquo;{testimonial.content}&rdquo;
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg border border-border overflow-hidden">
                                        {testimonialAvatars[testimonial.name] ? (
                                            <span
                                                aria-hidden="true"
                                                className="w-full h-full bg-cover bg-center"
                                                style={{backgroundImage: `url(${testimonialAvatars[testimonial.name]})`}}
                                            />
                                        ) : testimonial.initials}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground uppercase tracking-wider text-xs">{testimonial.name}</h4>
                                        <p className="text-[10px] text-foreground/45 dark:text-foreground/60 uppercase tracking-widest mt-1">{testimonial.company}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
