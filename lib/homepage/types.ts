import type {ProductionMediaContent} from "@/lib/content/types";

export type HomepageViewModel = {
  marquee: {
    primaryLines: [string, string];
    secondaryLines: [string, string];
  };
  about: {
    title: string;
    label: string;
    paragraphs: string[];
    photos: ProductionMediaContent[];
  };
  experiences: Array<{
    id: string;
    company: string;
    role: string;
    dateRange: string;
    highlights: string[];
  }>;
  experienceTitle: string;
  experienceLabel: string;
  projects: {
    title: string;
    label: string;
    intro: string;
    items: Array<{
      id: string;
      title: string;
      type: string;
      role: string;
      summary: string;
      outcomes: string[];
      capabilities: string[];
    }>;
  };
  skillTickerItems: string[];
  testimonials: {
    title: string;
    intro: string;
    items: Array<{
      id: string;
      name: string;
      company: string;
      content: string;
      initials: string;
    }>;
  };
};

export type HomepageSanityContent = {
  homepage: {
    _id: string;
    aboutTitle: unknown;
    aboutLabel: unknown;
    about: Array<Record<string, unknown>>;
    aboutPhotos?: unknown;
    marqueePrimaryLines: unknown;
    marqueeSecondaryLines: unknown;
    skillTickerItems: unknown;
    experienceTitle: unknown;
    experienceLabel: unknown;
    projectsTitle: unknown;
    projectsLabel: unknown;
    projectsIntro: unknown;
    testimonialsTitle: unknown;
    testimonialsIntro: unknown;
  };
  experiences: unknown;
  projects: unknown;
  testimonials: unknown;
};
