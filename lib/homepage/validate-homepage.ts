import type {HomepageViewModel} from "./types";
import {validateMedia} from "@/lib/content/validate-content";

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as Record<string, unknown>;
}

function text(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} is required`);
  return value.trim();
}

function strings(value: unknown, label: string, min: number, max: number): string[] {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  const result = value.map((item, index) => text(item, `${label}[${index}]`));
  if (result.length < min || result.length > max) throw new Error(`${label} must contain ${min}-${max} items`);
  if (new Set(result).size !== result.length) throw new Error(`${label} must be unique`);
  return result;
}

function ordered(value: unknown, label: string, min: number, max: number): Record<string, unknown>[] {
  if (!Array.isArray(value) || value.length < min || value.length > max) throw new Error(`${label} must contain ${min}-${max} items`);
  const items = value.map((item, index) => record(item, `${label}[${index}]`));
  const orders = items.map((item, index) => {
    if (!Number.isInteger(item.order)) throw new Error(`${label}[${index}].order must be an integer`);
    return item.order as number;
  });
  if (new Set(orders).size !== orders.length) throw new Error(`${label} order values must be unique`);
  return items;
}

function paragraphs(value: unknown): string[] {
  if (!Array.isArray(value)) throw new Error("homepage.about must be an array");
  const result = value.flatMap((block, blockIndex) => {
    const typedBlock = record(block, `homepage.about[${blockIndex}]`);
    if (!Array.isArray(typedBlock.children)) return [];
    const paragraph = typedBlock.children.map((child, childIndex) => text(record(child, `homepage.about[${blockIndex}].children[${childIndex}]`).text, "about span")).join("").trim();
    return paragraph ? [paragraph] : [];
  });
  if (result.length < 1 || result.length > 4) throw new Error("homepage.about must contain 1-4 paragraphs");
  return result;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function validateAndMapHomepage(value: unknown): HomepageViewModel {
  const root = record(value, "homepage content");
  const homepage = record(root.homepage, "homepage");
  if (typeof homepage._id !== "string" || homepage._id.startsWith("drafts.")) throw new Error("homepage must be published");

  const primary = strings(homepage.marqueePrimaryLines, "homepage.marqueePrimaryLines", 2, 2) as [string, string];
  const secondary = strings(homepage.marqueeSecondaryLines, "homepage.marqueeSecondaryLines", 2, 2) as [string, string];
  if (homepage.aboutPhotos != null && !Array.isArray(homepage.aboutPhotos)) throw new Error("homepage.aboutPhotos must be an array");
  const photos = homepage.aboutPhotos == null ? [] : homepage.aboutPhotos.map(validateMedia);
  if (photos.length !== 0 && photos.length !== 3) throw new Error("homepage.aboutPhotos must contain exactly 3 items");
  const experiences = ordered(root.experiences, "experiences", 1, 3).map((item, index) => ({
    id: text(item._id, `experiences[${index}]._id`),
    company: text(item.company, `experiences[${index}].company`),
    role: text(item.role, `experiences[${index}].role`),
    dateRange: text(item.timeLabel, `experiences[${index}].timeLabel`),
    highlights: strings(item.outcomes, `experiences[${index}].outcomes`, 1, 4),
  }));
  const projects = ordered(root.projects, "projects", 1, 4).map((item, index) => ({
    id: text(item._id, `projects[${index}]._id`),
    title: text(item.name, `projects[${index}].name`),
    type: text(item.projectType, `projects[${index}].projectType`),
    role: text(item.role, `projects[${index}].role`),
    summary: text(item.summary, `projects[${index}].summary`),
    outcomes: strings(item.outcomes, `projects[${index}].outcomes`, 1, 4),
    capabilities: strings(item.capabilities, `projects[${index}].capabilities`, 1, 6),
  }));
  const rawTestimonials = Array.isArray(root.testimonials) ? root.testimonials : [];
  const testimonials = rawTestimonials.map((entry, index) => {
    const item = record(entry, `testimonials[${index}]`);
    const name = text(item.personName, `testimonials[${index}].personName`);
    return {id: text(item._id, `testimonials[${index}]._id`), name, company: text(item.company, `testimonials[${index}].company`), content: text(item.quote, `testimonials[${index}].quote`), initials: initials(name)};
  });

  return {
    marquee: {primaryLines: primary, secondaryLines: secondary},
    about: {title: text(homepage.aboutTitle, "homepage.aboutTitle"), label: text(homepage.aboutLabel, "homepage.aboutLabel"), paragraphs: paragraphs(homepage.about), photos},
    experiences,
    experienceTitle: text(homepage.experienceTitle, "homepage.experienceTitle"),
    experienceLabel: text(homepage.experienceLabel, "homepage.experienceLabel"),
    projects: {title: text(homepage.projectsTitle, "homepage.projectsTitle"), label: text(homepage.projectsLabel, "homepage.projectsLabel"), intro: text(homepage.projectsIntro, "homepage.projectsIntro"), items: projects},
    skillTickerItems: strings(homepage.skillTickerItems, "homepage.skillTickerItems", 1, 24),
    testimonials: {title: text(homepage.testimonialsTitle, "homepage.testimonialsTitle"), intro: text(homepage.testimonialsIntro, "homepage.testimonialsIntro"), items: testimonials},
  };
}
