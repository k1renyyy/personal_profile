import {describe, expect, it} from "vitest";
import type {Phase4IdentityContent} from "./types";
import {mapIdentityContent, splitEmailAddress} from "./map-identity";

const identity: Phase4IdentityContent = {
  siteSettings: {_id: "siteSettings", siteTitle: "于卓立 / Kiren｜AI 产品经理", siteDescription: "从市场洞察出发，探索真正有用户价值的 AI 产品。", socialName: "于卓立 / Kiren", allowIndexing: false},
  profile: {_id: "profile", name: "于卓立", englishName: "Kiren", professionalTitle: "AI 产品经理", locations: ["New York", "Guangzhou"], timezone: "北京时间（UTC+8）", availability: "开放 AI 产品相关工作机会", shortBio: "从市场洞察出发，探索真正有用户价值的 AI 产品。", fullBio: [{_type: "block"}]},
  homepage: {_id: "homepage", heroTitleLines: ["AI Product", "Manager"], heroNameLines: ["于卓立", "KIREN"], heroTechChips: ["Next.js", "TypeScript", "UI systems"], regionLabel: "Based in New York · Open to opportunities across China", valuePropositionLines: ["从市场洞察出发", "探索真正有用户价值的 AI 产品"], availability: "开放 AI 产品相关工作机会", primaryCtaLabel: "查看经历", contactTitleLines: ["一起探索", "下一步可能"], contactInvitation: "如果你也关注市场洞察、用户价值与 AI 产品落地，欢迎与我交流。"},
  socialLinks: [
    {_id: "social-email", platform: "email", label: "Email", url: "mailto:zy3690@nyu.edu", accessibilityLabel: "给于卓立发送邮件", order: 0, isVisible: true},
    {_id: "social-github", platform: "github", label: "GitHub", url: "https://github.com/k1renyyy", accessibilityLabel: "访问 Kiren 的 GitHub", order: 1, isVisible: true},
    {_id: "social-linkedin", platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/zhuoli-yu", accessibilityLabel: "访问于卓立的 LinkedIn", order: 2, isVisible: true},
  ],
};

describe("mapIdentityContent", () => {
  it("maps approved identity into the serializable UI model", () => {
    expect(mapIdentityContent(identity)).toMatchObject({
      brandLabel: "KIREN",
      displayName: "于卓立 / Kiren",
      hero: {titleLines: ["AI Product", "Manager"], nameLines: ["于卓立", "KIREN"]},
      email: {href: "mailto:zy3690@nyu.edu", address: "zy3690@nyu.edu", localPart: "zy3690", domainPart: "@nyu.edu"},
    });
  });
});

describe("splitEmailAddress", () => {
  it("derives display and clipboard fields from one mailto link", () => {
    expect(splitEmailAddress("mailto:zy3690@nyu.edu")).toEqual({address: "zy3690@nyu.edu", localPart: "zy3690", domainPart: "@nyu.edu"});
  });

  it("rejects malformed email links", () => {
    expect(() => splitEmailAddress("mailto:invalid-address")).toThrow("Invalid email link");
  });
});
