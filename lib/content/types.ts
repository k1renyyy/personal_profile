export type ContentSource = "repository" | "sanity-poc" | "sanity";

export type SanityQueryClient = {
  fetch<T>(query: string, params?: Record<string, unknown>): Promise<T>;
};

export type PortableTextBlock = Record<string, unknown>;

export type SiteSettingsContent = {
  _id: string;
  siteTitle: string;
  description: string;
  canonicalUrl: string;
  allowIndexing: boolean;
  socialName: string;
  defaultShareImage: string;
};

export type ProfileContent = {
  _id: string;
  name: string;
  professionalTitle: string;
  locations: string[];
  shortBiography: string;
  biography: PortableTextBlock[];
  portrait: string;
};

export type ProjectContent = {
  _id: string;
  name: string;
  role: string;
  year: string;
  summary: string;
  description: PortableTextBlock[];
  highlights: string[];
  order: number;
  isPublished: boolean;
};

export type MediaRecordContent = {
  _id: string;
  label: string;
  alt: string;
  source: string;
  rightsStatus: "owned" | "licensed" | "permission-granted";
  placements: string[];
  assetUrl: string;
};

export type PortfolioContent = {
  siteSettings: SiteSettingsContent;
  profile: ProfileContent;
  projects: ProjectContent[];
  mediaRecords: MediaRecordContent[];
};

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
  experienceIntro: string;
  projectsTitle: string;
  projectsLabel: string;
  projectsIntro: string;
  testimonialsTitle: string;
  testimonialsIntro: string;
  contactTitleLines: [string, string];
  contactInvitation: string;
};

export type EducationContent = {
  _id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  isExpected: boolean;
  description?: string;
  highlights: string[];
  relatedUrl?: string;
  order: number;
  isVisible: boolean;
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

export type CapabilityGroupContent = {
  _id: string;
  name: string;
  items: string[];
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

export type ProductionContentSnapshot = {
  siteSettings: ProductionSiteSettingsContent;
  profile: ProductionProfileContent;
  homepage: HomepageContent;
  educations: EducationContent[];
  experiences: ExperienceContent[];
  capabilityGroups: CapabilityGroupContent[];
  projects: ProductionProjectContent[];
  testimonials: TestimonialContent[];
  socialLinks: SocialLinkContent[];
  mediaRecords: ProductionMediaContent[];
};

export type ContentDomain = keyof ProductionContentSnapshot;

export type DomainContentMap = ProductionContentSnapshot;
