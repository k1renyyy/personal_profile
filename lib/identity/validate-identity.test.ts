import {describe, expect, it} from "vitest";
import type {Phase4IdentityContent} from "./types";
import {validatePhase4Identity} from "./validate-identity";

const validIdentity: Phase4IdentityContent = {
  siteSettings: {
    _id: "siteSettings",
    siteTitle: "于卓立 / Kiren｜AI 产品经理",
    siteDescription: "从市场洞察出发，探索真正有用户价值的 AI 产品。",
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
    fullBio: [{_type: "block", children: [{_type: "span", text: "简介"}]}],
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

describe("validatePhase4Identity", () => {
  it("returns a valid published identity", () => {
    expect(validatePhase4Identity(validIdentity)).toEqual(validIdentity);
  });

  it("rejects a missing profile singleton", () => {
    expect(() => validatePhase4Identity({...validIdentity, profile: undefined})).toThrow("Missing published profile");
  });

  it("rejects Hero titles that are not exactly two lines", () => {
    const value = {...validIdentity, homepage: {...validIdentity.homepage, heroTitleLines: ["one", "two", "three"]}};
    expect(() => validatePhase4Identity(value)).toThrow("Hero title must contain exactly two lines");
  });

  it("rejects duplicate visible email links", () => {
    const value = {...validIdentity, socialLinks: [...validIdentity.socialLinks, {...validIdentity.socialLinks[0], _id: "social-email-two", order: 3}]};
    expect(() => validatePhase4Identity(value)).toThrow("Exactly one visible email link is required");
  });

  it("rejects unsafe social links", () => {
    const value = {...validIdentity, socialLinks: validIdentity.socialLinks.map((link) => link.platform === "github" ? {...link, url: "http://github.com/k1renyyy"} : link)};
    expect(() => validatePhase4Identity(value)).toThrow("Invalid social link");
  });

  it("rejects draft content recursively", () => {
    const value = {...validIdentity, profile: {...validIdentity.profile, _id: "drafts.profile"}};
    expect(() => validatePhase4Identity(value)).toThrow("Draft content is not allowed");
  });

  it("rejects indexing without canonical URL and share media", () => {
    const value = {...validIdentity, siteSettings: {...validIdentity.siteSettings, allowIndexing: true}};
    expect(() => validatePhase4Identity(value)).toThrow("Indexing requires canonical URL and share image");
  });
});

export {validIdentity};
