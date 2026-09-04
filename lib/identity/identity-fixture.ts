import type {Phase4IdentityContent} from "./types";

export const identityFixture: Phase4IdentityContent = {
  siteSettings: {
    _id: "siteSettings",
    siteTitle: "Test Portfolio",
    siteDescription: "Test-only identity fixture.",
    canonicalUrl: "https://example.com",
    socialName: "Test Portfolio",
    allowIndexing: false,
  },
  profile: {
    _id: "profile",
    name: "测试用户",
    englishName: "Test Person",
    professionalTitle: "Test Professional",
    locations: ["Test City"],
    timezone: "America/New_York",
    availability: "Available for test work",
    shortBio: "Short test biography.",
    fullBio: [{_type: "block"}],
  },
  homepage: {
    _id: "homepage",
    heroTitleLines: ["Test", "Professional"],
    heroNameLines: ["Test", "Person"],
    heroTechChips: ["Next.js", "TypeScript", "UI systems"],
    regionLabel: "Test Region",
    valuePropositionLines: ["Test value", "Test outcome"],
    availability: "Available for test work",
    primaryCtaLabel: "Contact Test Person",
    contactTitleLines: ["Test", "Contact"],
    contactInvitation: "Test contact invitation.",
  },
  socialLinks: [
    {_id: "social-email", platform: "email", label: "Email", url: "mailto:test@example.com", accessibilityLabel: "Email Test Person", order: 0, isVisible: true},
    {_id: "social-github", platform: "github", label: "GitHub", url: "https://github.com/example", accessibilityLabel: "Test GitHub profile", order: 1, isVisible: true},
    {_id: "social-linkedin", platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/example", accessibilityLabel: "Test LinkedIn profile", order: 2, isVisible: true},
  ],
};
