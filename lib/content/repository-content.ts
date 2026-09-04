import type {PortfolioContent} from "./types";

export const repositoryContent: PortfolioContent = {
  siteSettings: {
    _id: "repository-site-settings",
    siteTitle: "于卓立 / Kiren｜AI 产品经理",
    description: "从市场洞察出发，探索真正有用户价值的 AI 产品。",
    canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    allowIndexing: false,
    socialName: "于卓立 / Kiren",
    defaultShareImage: "",
  },
  profile: {
    _id: "repository-profile",
    name: "于卓立 / Kiren",
    professionalTitle: "AI 产品经理",
    locations: ["New York", "Guangzhou"],
    shortBiography: "从市场洞察出发，探索真正有用户价值的 AI 产品。",
    biography: [],
    portrait: "",
  },
  projects: [],
  mediaRecords: [],
};
