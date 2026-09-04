import {describe, expect, it, vi} from "vitest";
import {loadPortfolioContent} from "./load-content";
import {productionContentFixture} from "./production-fixture";
import {createPublishedContentClient} from "./sanity-query";

const validSanityFixture = {
  siteSettings: {
    _id: "siteSettings",
    siteTitle: "Portfolio PoC",
    description: "Published content validation fixture.",
    canonicalUrl: "https://example.com",
    allowIndexing: false,
    socialName: "Portfolio PoC",
    defaultShareImage: "https://cdn.sanity.io/images/foow59ov/poc/share.webp",
  },
  profile: {
    _id: "profile",
    name: "PoC Editor",
    professionalTitle: "Software Developer",
    locations: ["Test location"],
    shortBiography: "Short test biography.",
    biography: [{_type: "block", _key: "bio", children: [{_type: "span", _key: "span", text: "Biography"}]}],
    portrait: "media-record",
  },
  projects: [
    {
      _id: "project-one",
      name: "Project One",
      role: "Developer",
      year: "2025",
      summary: "First project.",
      description: [{_type: "block", _key: "one", children: [{_type: "span", _key: "one-span", text: "One"}]}],
      highlights: ["First highlight"],
      order: 1,
      isPublished: true,
    },
    {
      _id: "project-two",
      name: "Project Two",
      role: "Developer",
      year: "2026",
      summary: "Second project.",
      description: [{_type: "block", _key: "two", children: [{_type: "span", _key: "two-span", text: "Two"}]}],
      highlights: ["Second highlight"],
      order: 2,
      isPublished: true,
    },
  ],
  mediaRecords: [
    {
      _id: "media-record",
      label: "PoC image",
      alt: "Test image",
      source: "Owner-provided PoC asset",
      rightsStatus: "owned",
      placements: ["portrait", "default-share-image"],
      assetUrl: "https://cdn.sanity.io/images/foow59ov/poc/image.webp",
    },
  ],
};

const invalidSanityFixture = {
  ...validSanityFixture,
  siteSettings: {
    ...validSanityFixture.siteSettings,
    canonicalUrl: "http://example.com",
  },
  projects: [
    {...validSanityFixture.projects[0], _id: "drafts.project-one"},
    validSanityFixture.projects[1],
  ],
};

describe("loadPortfolioContent", () => {
  it("does not query Sanity in repository mode", async () => {
    const fetch = vi.fn();
    const content = await loadPortfolioContent({source: "repository", client: {fetch}});
    expect(fetch).not.toHaveBeenCalled();
    expect(content.siteSettings.siteTitle).toBeTruthy();
  });

  it("returns validated published content in sanity-poc mode", async () => {
    const fetch = vi.fn().mockResolvedValue(validSanityFixture);
    const content = await loadPortfolioContent({source: "sanity-poc", client: {fetch}});
    expect(content.projects).toHaveLength(2);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("fails the PoC build when Sanity is unavailable", async () => {
    const fetch = vi.fn().mockRejectedValue(new Error("offline"));
    await expect(loadPortfolioContent({source: "sanity-poc", client: {fetch}})).rejects.toThrow(
      "Sanity PoC content could not be loaded",
    );
  });

  it("rejects drafts, wrong record counts, and unsafe canonical URLs", async () => {
    const fetch = vi.fn().mockResolvedValue(invalidSanityFixture);
    await expect(loadPortfolioContent({source: "sanity-poc", client: {fetch}})).rejects.toThrow(
      "Invalid Sanity PoC content",
    );
  });

  it("requires explicit production Sanity identifiers", () => {
    expect(() => createPublishedContentClient({projectId: "", dataset: "production"})).toThrow(
      "SANITY_PROJECT_ID is required",
    );
    expect(() => createPublishedContentClient({projectId: "foow59ov", dataset: ""})).toThrow(
      "SANITY_DATASET is required",
    );
  });

  it("returns strictly validated published production content", async () => {
    const fetch = vi.fn().mockResolvedValue(productionContentFixture);
    const content = await loadPortfolioContent({source: "sanity", client: {fetch}});
    expect(content).toEqual(productionContentFixture);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("fails a production build when published content is unavailable", async () => {
    const fetch = vi.fn().mockRejectedValue(new Error("offline"));
    await expect(loadPortfolioContent({source: "sanity", client: {fetch}})).rejects.toThrow(
      "Sanity published content could not be loaded",
    );
  });

  it("fails a production build when published content is invalid", async () => {
    const invalid = structuredClone(productionContentFixture);
    invalid.projects[1].order = invalid.projects[0].order;
    const fetch = vi.fn().mockResolvedValue(invalid);
    await expect(loadPortfolioContent({source: "sanity", client: {fetch}})).rejects.toThrow(
      "Invalid published Sanity content",
    );
  });

  it("rejects unsupported sources before querying", async () => {
    const fetch = vi.fn();
    await expect(
      loadPortfolioContent({source: "unsupported" as "repository", client: {fetch}}),
    ).rejects.toThrow("Unsupported CONTENT_SOURCE: unsupported");
    expect(fetch).not.toHaveBeenCalled();
  });
});
