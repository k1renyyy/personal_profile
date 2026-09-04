export type SanityQueryClient = {
  fetch<T>(
    query: string,
    params?: Record<string, unknown>,
    options?: {cache?: RequestCache; tag?: string},
  ): Promise<T>;
};

export type PortableTextBlock = Record<string, unknown>;

export type ProductionMediaContent = {
  _id: string;
  label: string;
  alt: string;
  caption?: string;
  source: string;
  rightsStatus: "owned" | "licensed" | "permission-granted";
  attribution?: string;
  placements: string[];
  originalDimensions: {width: number; height: number};
  targetAspectRatio: string;
  focalPoint?: {x: number; y: number};
  assetUrl: string;
};

export type ProductionSiteSettingsContent = {
  _id: string;
  siteTitle: string;
  siteDescription: string;
  canonicalUrl?: string;
  socialName: string;
  allowIndexing: boolean;
  defaultShareImage?: ProductionMediaContent;
};

export type ProductionProfileContent = {
  _id: string;
  name: string;
  englishName: string;
  professionalTitle: string;
  locations: string[];
  timezone: string;
  availability: string;
  shortBio: string;
  fullBio: PortableTextBlock[];
  portrait?: ProductionMediaContent;
};

export type HomepageContent = {
  _id: string;
  heroTitleLines: [string, string];
  heroNameLines: [string, string];
  heroTechChips: string[];
  regionLabel: string;
  valuePropositionLines: [string, string];
  availability: string;
  primaryCtaLabel: string;
  aboutTitle: string;
  aboutLabel: string;
  about: PortableTextBlock[];
  aboutPhotos?: ProductionMediaContent[];
  marqueePrimaryLines: [string, string];
  marqueeSecondaryLines: [string, string];
  skillTickerItems: string[];
  experienceTitle: string;
  experienceLabel: string;
  projectsTitle: string;
  projectsLabel: string;
  projectsIntro: string;
  testimonialsTitle: string;
  testimonialsIntro: string;
  contactTitleLines: [string, string];
  contactInvitation: string;
};

export type ExperienceContent = {
  _id: string;
  company: string;
  role: string;
  timeLabel: string;
  outcomes: string[];
  order: number;
  isVisible: boolean;
};

export type ProductionProjectContent = {
  _id: string;
  name: string;
  projectType: string;
  role: string;
  summary: string;
  outcomes: string[];
  capabilities: string[];
  order: number;
  isVisible: boolean;
};

export type TestimonialContent = {
  _id: string;
  personName: string;
  personRole: string;
  company: string;
  relationship: string;
  quote: string;
  date?: string;
  portrait?: ProductionMediaContent;
  permissionStatus: "pending" | "granted" | "denied";
  permissionNote?: string;
  order: number;
  isVisible: boolean;
};

export type SocialLinkContent = {
  _id: string;
  platform: "email" | "github" | "linkedin";
  label: string;
  url: string;
  accessibilityLabel: string;
  order: number;
  isVisible: boolean;
};

export type DomainContentMap = {
  siteSettings: ProductionSiteSettingsContent;
  profile: ProductionProfileContent;
  socialLinks: SocialLinkContent[];
};

export type ContentDomain = keyof DomainContentMap;
