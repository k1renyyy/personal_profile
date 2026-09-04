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

export const repositoryIdentityContent: Phase4IdentityContent = {
  siteSettings: {
    _id: "siteSettings",
    siteTitle: "于卓立 / Kiren｜AI 产品经理",
    siteDescription: "从市场洞察出发，探索真正有用户价值的 AI 产品。关注产品规划、需求分析、数据分析与 AI 产品落地。",
    socialName: "于卓立 / Kiren",
    allowIndexing: false,
  },
  profile: {
    _id: "profile",
    name: "于卓立",
    englishName: "Kiren",
    professionalTitle: "AI 产品经理",
    locations: ["New York", "Guangzhou"],
    timezone: "北京时间（UTC+8）",
    availability: "开放 AI 产品相关工作机会",
    shortBio: "从市场洞察出发，探索真正有用户价值的 AI 产品。",
    fullBio: [{
      _type: "block",
      _key: "profile-full-bio",
      style: "normal",
      markDefs: [],
      children: [{
        _type: "span",
        _key: "profile-full-bio-span",
        marks: [],
        text: "我是一名关注市场洞察与用户价值的 AI 产品经理，擅长从市场和用户需求中识别 AI 产品机会，并将模糊的业务问题转化为可验证的产品方案。我的实践覆盖市场研究、用户分析、竞品测试、Agent 工作流设计和 AI 效果评估，包括智能客服 Agent 功能分析、游戏视频高光分析 Agent，以及 Nike × Adidas 赞助策略与经营表现分析。目前就读于纽约大学体育商业硕士项目，希望结合市场判断、用户理解与 AI 产品能力，为真实用户创造价值。",
      }],
    }],
  },
  homepage: {
    _id: "homepage",
    heroTitleLines: ["AI Product", "Manager"],
    heroNameLines: ["于卓立", "KIREN"],
    heroTechChips: ["Next.js", "TypeScript", "UI systems"],
    regionLabel: "Based in New York · Open to opportunities across China",
    valuePropositionLines: ["从市场洞察出发", "探索真正有用户价值的 AI 产品"],
    availability: "开放 AI 产品相关工作机会",
    primaryCtaLabel: "查看经历",
    contactTitleLines: ["一起探索", "下一步可能"],
    contactInvitation: "如果你也关注市场洞察、用户价值与 AI 产品落地，欢迎与我交流。",
  },
  socialLinks: [
    {_id: "social-email", platform: "email", label: "Email", url: "mailto:zy3690@nyu.edu", accessibilityLabel: "给于卓立发送邮件", order: 0, isVisible: true},
    {_id: "social-github", platform: "github", label: "GitHub", url: "https://github.com/k1renyyy", accessibilityLabel: "访问 Kiren 的 GitHub", order: 1, isVisible: true},
    {_id: "social-linkedin", platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/zhuoli-yu", accessibilityLabel: "访问于卓立的 LinkedIn", order: 2, isVisible: true},
  ],
};
