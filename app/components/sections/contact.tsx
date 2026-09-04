"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@/app/hooks/useGSAP";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Github, Linkedin, ArrowUpRight, Copy, Check } from "lucide-react";
import type {SocialLinkContent} from "@/lib/content/types";
import type {IdentityViewModel} from "@/lib/identity/map-identity";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const socialIcons = {email: Mail, github: Github, linkedin: Linkedin};

export default function Contact({
    contact,
    email,
    socialLinks,
}: {
    contact: IdentityViewModel["contact"];
    email: IdentityViewModel["email"];
    socialLinks: SocialLinkContent[];
}) {
    const [copied, setCopied] = useState(false);
    const emailRef = useRef<HTMLDivElement>(null);

    const copyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(email.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const containerRef = useGSAP<HTMLElement>((container) => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top 70%",
                end: "bottom 80%",
            }
        });

        // Split text reveal effect for header
        tl.from(".contact-header-text", {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power4.out"
        });

        // Content reveal
        tl.from(".contact-content", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.5");

        // Email card animation
        tl.from(".email-card", {
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.2)"
        }, "-=0.6");

        // Hover effect for email card using GSAP
        const emailCard = emailRef.current;
        if(emailCard) {
            emailCard.addEventListener("mouseenter", () => {
                gsap.to(emailCard, { scale: 1.02, duration: 0.3, ease: "power2.out" });
                gsap.to(".email-icon", { x: 5, y: -5, duration: 0.3 }); // slightly move arrow
            });
            emailCard.addEventListener("mouseleave", () => {
                gsap.to(emailCard, { scale: 1, duration: 0.3, ease: "power2.out" });
                gsap.to(".email-icon", { x: 0, y: 0, duration: 0.3 });
            });
        }

    });

    return (
        <section ref={containerRef} id="contact" className="contact-section contact-klein-glow relative w-full pt-24 pb-32 bg-background overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-foreground/4 blur-[110px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-foreground/3 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    
                    {/* Left Column: Heading & Context */}
                    <div className="space-y-12">
                        <div className="space-y-2 overflow-hidden">
                            <div className="overflow-hidden">
                                <span className="contact-header-text block text-xs uppercase tracking-[0.3em] text-foreground/45 dark:text-foreground/60 font-medium mb-4">
                                    Contact
                                </span>
                            </div>
                            <div className="overflow-hidden">
                                <h2 className="contact-header-text block text-[clamp(3.5rem,9vw,8rem)] font-black uppercase leading-[0.9] text-foreground">
                                    {contact.titleLines[0]}
                                </h2>
                            </div>
                            <div className="overflow-hidden">
                                <h2 className="contact-header-text block text-[clamp(3.5rem,9vw,8rem)] font-black uppercase leading-[0.9] text-foreground/30">
                                    {contact.titleLines[1]}
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-8 max-w-md">
                            <p className="contact-content text-lg text-foreground/65 leading-relaxed font-light">
                                {contact.invitation}
                            </p>

                            <div className="contact-content flex gap-4">
                                {socialLinks.map((link) => {
                                    const Icon = socialIcons[link.platform];
                                    return (
                                    <a
                                        key={link._id}
                                        href={link.url}
                                        target={link.platform === "email" ? undefined : "_blank"}
                                        rel={link.platform === "email" ? undefined : "noopener noreferrer"}
                                        className="group flex items-center justify-center w-12 h-12 rounded-full border border-border bg-muted/30 hover:bg-foreground hover:border-transparent transition-[color,background-color,border-color] duration-300"
                                        aria-label={link.accessibilityLabel}
                                    >
                                        <Icon className="w-5 h-5 text-foreground/60 group-hover:text-background transition-colors duration-300" />
                                    </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Email Card */}
                    <div className="w-full h-full flex flex-col justify-center lg:pt-12">
                        <div
                            ref={emailRef}
                            className="email-card group relative block w-full h-[300px] lg:h-[400px] overflow-hidden bg-transparent border-t border-border hover:border-foreground/50 transition-colors duration-500 pt-8 sm:pt-12"
                        >
                            <div className="relative h-full flex flex-col justify-between z-10 px-2 sm:px-0 lg:pb-20">
                                <a href={email.href} aria-label={`Email ${email.address}`} className="flex justify-between items-start">
                                    <div className="p-0">
                                        <Mail className="w-8 h-8 text-foreground/50 group-hover:text-foreground transition-colors duration-500" />
                                    </div>
                                    <div className="email-icon">
                                        <ArrowUpRight className="w-8 h-8 text-foreground/35 group-hover:text-foreground group-hover:rotate-45 transition-[color,transform] duration-300" />
                                    </div>
                                </a>

                                <div>
                                    <a href={email.href} className="block">
                                        <span className="text-xs uppercase tracking-[0.2em] text-foreground/45 dark:text-foreground/60 mb-4 block">Drop me a line</span>
                                        <h3 className="flex flex-col text-xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-black uppercase text-foreground mb-8 leading-[0.9]">
                                            <span>{email.localPart}</span>
                                            <span className="text-foreground/50">{email.domainPart}</span>
                                        </h3>
                                    </a>
                                    
                                    <button 
                                        onClick={copyEmail}
                                        className="inline-flex items-center gap-3 text-sm uppercase tracking-wider text-foreground/50 hover:text-foreground transition-colors group/btn"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4 text-green-400" />
                                                <span className="text-green-400">Email Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                <span className="group-hover/btn:underline decoration-foreground/30 underline-offset-4">Copy Address</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
