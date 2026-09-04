import Hero from "./components/hero/hero";
import dynamic from "next/dynamic";

import FloatingSocials from "./components/floating-socials";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import ScrollSection from "./components/scroll-section";
import SectionTransitionRail from "./components/section-transition-rail";
import {getIdentityViewModel} from "@/lib/identity/get-identity";
import {getHomepageViewModel} from "@/lib/homepage/get-homepage";

const Marquee = dynamic(() => import("./components/sections/marquee"));
const Stats = dynamic(() => import("./components/sections/stats"));
const Experience = dynamic(() => import("./components/sections/experience"));
const Projects = dynamic(() => import("./components/sections/projects"));
const Skills = dynamic(() => import("./components/sections/skills"));
const Testimonials = dynamic(() => import("./components/sections/testimonials"));
const Contact = dynamic(() => import("./components/sections/contact"));

export default async function Home() {
  const [identity, homepage] = await Promise.all([
    getIdentityViewModel(),
    getHomepageViewModel(),
  ]);
  return (
    <main className="relative min-h-screen w-full overflow-x-clip bg-background text-foreground">
      <ScrollProgress />
      <FloatingSocials socialLinks={identity.socialLinks} />
      
      <ScrollSection>
        <Hero identity={{brandLabel: identity.brandLabel, hero: identity.hero, profile: identity.profile}} />
      </ScrollSection>
      <div className="-mt-8 sm:-mt-10 md:-mt-14 lg:mt-0">
        <ScrollSection>
          <Marquee content={homepage.marquee} />
        </ScrollSection>
      </div>
      <SectionTransitionRail label="ABOUT" meta="AI · PRODUCT" />
      <ScrollSection>
        <Stats title={homepage.about.title} paragraphs={homepage.about.paragraphs} photos={homepage.about.photos} />
      </ScrollSection>

      <SectionTransitionRail label="EXPERIENCE" meta="KIREN · 2026" />
      <Experience title={homepage.experienceTitle} label={homepage.experienceLabel} items={homepage.experiences} />
      <ScrollSection>
        <Projects content={homepage.projects} />
      </ScrollSection>
      <SectionTransitionRail label="CAPABILITIES" meta="TOOLS · SYSTEMS" />
      <ScrollSection>
        <Skills items={homepage.skillTickerItems} />
      </ScrollSection>
      <SectionTransitionRail label="TESTIMONIALS" meta="OTHER PERSPECTIVES" />
      <ScrollSection>
        <Testimonials content={homepage.testimonials} />
      </ScrollSection>
      <SectionTransitionRail label="CONTACT" meta="NYC ↔ CN" />
      <ScrollSection>
        <Contact contact={identity.contact} email={identity.email} socialLinks={identity.socialLinks} />
      </ScrollSection>
    </main>
  );
}
