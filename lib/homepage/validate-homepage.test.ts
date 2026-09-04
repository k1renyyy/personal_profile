import {describe, expect, it} from "vitest";
import {validateAndMapHomepage} from "./validate-homepage";

function fixture() {
  return {
    homepage: {
      _id: "homepage",
      aboutTitle: "个人介绍",
      aboutLabel: "About",
      about: [{_type: "block", children: [{_type: "span", text: "About Kiren"}]}],
      aboutPhotos: [1, 2, 3].map((number) => ({
        _id: `about-photo-${number}`,
        label: `About photo ${number}`,
        alt: `Kiren portrait ${number}`,
        source: "Kiren",
        rightsStatus: "owned",
        placements: ["about-photo"],
        originalDimensions: {width: 1200, height: 1600},
        targetAspectRatio: "3:4",
        assetUrl: `https://cdn.sanity.io/images/project/production/about-${number}.webp`,
      })),
      marqueePrimaryLines: ["AI Product", "Strategy"],
      marqueeSecondaryLines: ["Research", "Systems"],
      skillTickerItems: ["Research", "Analysis"],
      experienceTitle: "工作经历",
      experienceLabel: "Experience",
      projectsTitle: "项目经历",
      projectsLabel: "Project",
      projectsIntro: "Selected product work.",
      testimonialsTitle: "What People Say",
      testimonialsIntro: "Testimonials",
    },
    capabilityGroups: [{_id: "group-1", name: "Product", items: ["Research"], order: 0}],
    experiences: [{_id: "experience-1", company: "Company", role: "Product Manager", timeLabel: "2026.01 — PRESENT", outcomes: ["Outcome"], order: 0}],
    projects: [{_id: "project-1", name: "Agent", projectType: "AI Product", role: "Product Lead", summary: "Summary", outcomes: ["Outcome"], capabilities: ["Research"], order: 0}],
    testimonials: [],
  };
}

describe("validateAndMapHomepage", () => {
  it("maps the published CMS shape to the page view model", () => {
    const result = validateAndMapHomepage(fixture());
    expect(result.experiences[0].dateRange).toBe("2026.01 — PRESENT");
    expect(result.projects.items[0]).not.toHaveProperty("year");
    expect(result.projects.items[0].capabilities).toEqual(["Research"]);
    expect(result.testimonials.items).toEqual([]);
    expect(result.about.photos).toHaveLength(3);
  });

  it("rejects draft singletons", () => {
    const content = fixture();
    content.homepage._id = "drafts.homepage";
    expect(() => validateAndMapHomepage(content)).toThrow("homepage must be published");
  });

  it("rejects more projects than the confirmed selector layout supports", () => {
    const content = fixture();
    content.projects = Array.from({length: 5}, (_, index) => ({...content.projects[0], _id: `project-${index}`, order: index}));
    expect(() => validateAndMapHomepage(content)).toThrow("projects must contain 1-4 items");
  });

  it("rejects duplicate ordering", () => {
    const content = fixture();
    content.experiences.push({...content.experiences[0], _id: "experience-2"});
    expect(() => validateAndMapHomepage(content)).toThrow("experiences order values must be unique");
  });

  it("rejects a partial About photo set", () => {
    const content = fixture();
    content.homepage.aboutPhotos.pop();
    expect(() => validateAndMapHomepage(content)).toThrow("homepage.aboutPhotos must contain exactly 3 items");
  });
});
