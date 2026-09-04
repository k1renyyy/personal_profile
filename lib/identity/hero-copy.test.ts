import {describe, expect, it} from "vitest";
import {mapIdentityContent, repositoryIdentityContent} from "./map-identity";
import {buildHeroCopy} from "@/app/components/hero/hero";

describe("buildHeroCopy", () => {
  it("projects every approved Hero field without reference-owner identity", () => {
    const identity = mapIdentityContent(repositoryIdentityContent);
    const copy = buildHeroCopy(identity.hero, identity.profile);
    expect(copy).toEqual({
      titleLines: ["AI Product", "Manager"],
      nameLines: ["于卓立", "KIREN"],
      techChips: ["Next.js", "TypeScript", "UI systems"],
      regionLabel: "Based in New York · Open to opportunities across China",
      valuePropositionLines: ["从市场洞察出发", "探索真正有用户价值的 AI 产品"],
      availability: "开放 AI 产品相关工作机会",
      primaryCtaLabel: "查看经历",
      portrait: undefined,
      portraitLabel: "Portrait pending; Kiren identity wordmark",
    });
    expect(JSON.stringify(copy)).not.toMatch(/heropic\.svg/i);
  });
});
