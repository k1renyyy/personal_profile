import {describe, expect, it} from "vitest";
import {phase4IdentityQuery} from "./sanity-query";
import {productionContentFixture} from "./production-fixture";
import {validateDomain, validatePublishedContent} from "./validate-content";

const cloneFixture = () => structuredClone(productionContentFixture);

describe("validatePublishedContent", () => {
  it("dereferences image assets nested inside Sanity image fields", () => {
    expect(phase4IdentityQuery).toContain('"assetUrl": asset.asset->url');
  });

  it("accepts an omitted optional media focal point returned as null", () => {
    const fixture = cloneFixture();
    fixture.profile.portrait!.focalPoint = null as unknown as undefined;
    expect(validatePublishedContent(fixture).profile.portrait?.focalPoint).toBeUndefined();
  });
  it("accepts a complete published production snapshot", () => {
    const content = validatePublishedContent(productionContentFixture);
    expect(content.projects).toHaveLength(3);
    expect(content.experiences.map((item) => item.order)).toEqual([0, 1, 2]);
    expect(content.testimonials).toEqual([]);
  });

  it("rejects a partial homepage About photo set", () => {
    const fixture = cloneFixture();
    fixture.homepage.aboutPhotos = [fixture.mediaRecords[0]];
    expect(() => validatePublishedContent(fixture)).toThrow("Homepage requires exactly three about photos");
  });

  it("rejects draft identifiers anywhere in the snapshot", () => {
    const fixture = cloneFixture();
    fixture.projects[0]._id = "drafts.project-one";
    expect(() => validatePublishedContent(fixture)).toThrow("Draft content is not allowed");
  });

  it("rejects duplicate visible project order", () => {
    const fixture = cloneFixture();
    fixture.projects[1].order = fixture.projects[0].order;
    expect(() => validatePublishedContent(fixture)).toThrow("Duplicate project order");
  });

  it("rejects invalid social link protocols", () => {
    const fixture = cloneFixture();
    fixture.socialLinks[1].url = "http://example.com";
    expect(() => validatePublishedContent(fixture)).toThrow("Invalid social link");
  });

  it("rejects media with unknown rights", () => {
    const fixture = cloneFixture() as unknown as typeof productionContentFixture;
    Object.assign(fixture.mediaRecords[0], {rightsStatus: "unknown"});
    expect(() => validatePublishedContent(fixture)).toThrow("Invalid media rights");
  });

  it("rejects a visible Testimonial without granted permission", () => {
    const fixture = cloneFixture();
    fixture.testimonials.push({
      _id: "testimonial-one",
      personName: "Test Person",
      personRole: "Test Role",
      company: "Test Company",
      relationship: "Test relationship",
      quote: "Test-only testimonial text.",
      permissionStatus: "pending",
      order: 0,
      isVisible: true,
    });
    expect(() => validatePublishedContent(fixture)).toThrow(
      "Visible testimonial requires granted permission",
    );
  });

  it("allows missing optional portrait, share image, and Testimonials while indexing is disabled", () => {
    const fixture = cloneFixture();
    fixture.profile.portrait = undefined;
    fixture.siteSettings.defaultShareImage = undefined;
    fixture.testimonials = [];
    expect(validatePublishedContent(fixture).siteSettings.allowIndexing).toBe(false);
  });

  it("requires canonical URL and share image before indexing", () => {
    const withoutCanonical = cloneFixture();
    withoutCanonical.siteSettings.allowIndexing = true;
    withoutCanonical.siteSettings.canonicalUrl = undefined;
    expect(() => validatePublishedContent(withoutCanonical)).toThrow(
      "Indexing requires canonical URL and share image",
    );

    const withoutShareImage = cloneFixture();
    withoutShareImage.siteSettings.allowIndexing = true;
    withoutShareImage.siteSettings.defaultShareImage = undefined;
    expect(() => validatePublishedContent(withoutShareImage)).toThrow(
      "Indexing requires canonical URL and share image",
    );
  });

  it("uses the same validator for individual content domains", () => {
    const projects = validateDomain("projects", productionContentFixture.projects);
    expect(projects.map((project) => project.order)).toEqual([0, 1, 2]);

    const duplicate = cloneFixture().projects;
    duplicate[1].order = duplicate[0].order;
    expect(() => validateDomain("projects", duplicate)).toThrow("Duplicate project order");
  });
});
