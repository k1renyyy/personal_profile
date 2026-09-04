import type {ProductionMediaContent, SocialLinkContent} from "@/lib/content/types";
import type {Phase4IdentityContent} from "./types";

export type IdentityViewModel = {
  metadata: {
    title: string;
    description: string;
    socialName: string;
    allowIndexing: boolean;
    canonicalUrl?: string;
    defaultShareImage?: ProductionMediaContent;
  };
  brandLabel: string;
  displayName: string;
  copyrightName: string;
  profile: {
    chineseName: string;
    englishName: string;
    professionalTitle: string;
    locations: string[];
    timezone: string;
    availability: string;
    shortBio: string;
    portrait?: ProductionMediaContent;
  };
  hero: {
    titleLines: [string, string];
    nameLines: [string, string];
    techChips: string[];
    regionLabel: string;
    valuePropositionLines: [string, string];
    availability: string;
    primaryCtaLabel: string;
  };
  contact: {
    titleLines: [string, string];
    invitation: string;
  };
  socialLinks: SocialLinkContent[];
  email: {
    href: string;
    address: string;
    localPart: string;
    domainPart: string;
  };
};

export function splitEmailAddress(
  emailUrl: string,
): Omit<IdentityViewModel["email"], "href"> {
  const match = /^mailto:([^@\s]+)@([^@\s]+\.[^@\s]+)$/.exec(emailUrl);
  if (!match) throw new Error("Invalid email link");
  const address = `${match[1]}@${match[2]}`;
  return {address, localPart: match[1], domainPart: `@${match[2]}`};
}

export function mapIdentityContent(content: Phase4IdentityContent): IdentityViewModel {
  const emailLink = content.socialLinks.find((link) => link.platform === "email");
  if (!emailLink) throw new Error("Invalid email link");
  return {
    metadata: {
      title: content.siteSettings.siteTitle,
      description: content.siteSettings.siteDescription,
      socialName: content.siteSettings.socialName,
      allowIndexing: content.siteSettings.allowIndexing,
      canonicalUrl: content.siteSettings.canonicalUrl,
      defaultShareImage: content.siteSettings.defaultShareImage,
    },
    brandLabel: content.homepage.heroNameLines[1],
    displayName: `${content.profile.name} / ${content.profile.englishName}`,
    copyrightName: `${content.profile.name} / ${content.profile.englishName}`,
    profile: {
      chineseName: content.profile.name,
      englishName: content.profile.englishName,
      professionalTitle: content.profile.professionalTitle,
      locations: content.profile.locations,
      timezone: content.profile.timezone,
      availability: content.profile.availability,
      shortBio: content.profile.shortBio,
      portrait: content.profile.portrait,
    },
    hero: {
      titleLines: content.homepage.heroTitleLines,
      nameLines: content.homepage.heroNameLines,
      techChips: content.homepage.heroTechChips,
      regionLabel: content.homepage.regionLabel,
      valuePropositionLines: content.homepage.valuePropositionLines,
      availability: content.homepage.availability,
      primaryCtaLabel: content.homepage.primaryCtaLabel,
    },
    contact: {
      titleLines: content.homepage.contactTitleLines,
      invitation: content.homepage.contactInvitation,
    },
    socialLinks: content.socialLinks,
    email: {href: emailLink.url, ...splitEmailAddress(emailLink.url)},
  };
}
