import {describe, expect, it} from "vitest";
import {identityFixture} from "./identity-fixture";
import {mapIdentityContent} from "./map-identity";
import {buildIdentityMetadata} from "./build-metadata";

describe("buildIdentityMetadata", () => {
  it("omits unapproved launch URLs and emits noindex metadata", () => {
    const identity = mapIdentityContent(identityFixture).metadata;
    const metadata = buildIdentityMetadata({...identity, canonicalUrl: undefined, defaultShareImage: undefined});
    expect(metadata.title).toBe("Test Portfolio");
    expect(metadata.description).toContain("Test-only");
    expect(metadata.robots).toEqual({index: false, follow: false});
    expect(metadata.alternates?.canonical).toBeUndefined();
    expect(metadata.openGraph?.images).toBeUndefined();
    expect(metadata.twitter?.images).toBeUndefined();
  });

  it("cannot enable indexing without both canonical URL and share media", () => {
    const identity = mapIdentityContent(identityFixture).metadata;
    const metadata = buildIdentityMetadata({...identity, allowIndexing: true, canonicalUrl: undefined, defaultShareImage: undefined});
    expect(metadata.robots).toEqual({index: false, follow: false});
  });
});
