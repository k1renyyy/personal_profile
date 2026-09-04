import {describe, expect, it} from "vitest";
import {identityFixture} from "./identity-fixture";
import {mapIdentityContent} from "./map-identity";
import {buildHeroCopy} from "@/app/components/hero/hero";

describe("buildHeroCopy", () => {
  it("projects every approved Hero field without reference-owner identity", () => {
    const identity = mapIdentityContent(identityFixture);
    const copy = buildHeroCopy(identity.hero, identity.profile);
    expect(copy).toEqual({
      titleLines: ["Test", "Professional"],
      nameLines: ["Test", "Person"],
      techChips: ["Next.js", "TypeScript", "UI systems"],
      regionLabel: "Test Region",
      valuePropositionLines: ["Test value", "Test outcome"],
      availability: "Available for test work",
      primaryCtaLabel: "Contact Test Person",
      portrait: undefined,
      portraitLabel: "Portrait pending; Kiren identity wordmark",
    });
    expect(JSON.stringify(copy)).not.toMatch(/heropic\.svg/i);
  });
});
