import {describe, expect, it} from "vitest";
import {mapIdentityContent, repositoryIdentityContent} from "./map-identity";
import {buildIdentityMetadata} from "./build-metadata";

describe("buildIdentityMetadata", () => {
  it("omits unapproved launch URLs and emits noindex metadata", () => {
    const metadata = buildIdentityMetadata(mapIdentityContent(repositoryIdentityContent).metadata);
    expect(metadata.title).toBe("于卓立 / Kiren｜AI 产品经理");
    expect(metadata.description).toContain("AI 产品");
    expect(metadata.robots).toEqual({index: false, follow: false});
    expect(metadata.alternates?.canonical).toBeUndefined();
    expect(metadata.openGraph?.images).toBeUndefined();
    expect(metadata.twitter?.images).toBeUndefined();
  });

  it("cannot enable indexing without both canonical URL and share media", () => {
    const identity = mapIdentityContent(repositoryIdentityContent).metadata;
    const metadata = buildIdentityMetadata({...identity, allowIndexing: true});
    expect(metadata.robots).toEqual({index: false, follow: false});
  });
});
