import {repositoryContent} from "./repository-content";
import type {
  ContentSource,
  PortfolioContent,
  ProductionContentSnapshot,
  SanityQueryClient,
} from "./types";
import {validatePublishedContent} from "./validate-content";

type LoadContentOptions = {
  source?: ContentSource;
  client?: SanityQueryClient;
};

function selectedSource(source?: ContentSource): ContentSource {
  const value = source ?? process.env.CONTENT_SOURCE ?? "repository";
  if (value !== "repository" && value !== "sanity-poc" && value !== "sanity") {
    throw new Error(`Unsupported CONTENT_SOURCE: ${value}`);
  }
  return value;
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function hasDraftId(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(hasDraftId);
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return (typeof record._id === "string" && record._id.startsWith("drafts.")) ||
      Object.values(record).some(hasDraftId);
  }
  return false;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isValidSanityContent(content: unknown): content is PortfolioContent {
  if (!isRecord(content) || !isRecord(content.siteSettings) || !isRecord(content.profile)) {
    return false;
  }
  if (!Array.isArray(content.projects) || !Array.isArray(content.mediaRecords)) {
    return false;
  }

  const typedContent = content as PortfolioContent;
  const {siteSettings, profile, projects, mediaRecords} = typedContent;
  const orders = projects.map((project) => project.order);

  return Boolean(
    siteSettings &&
      profile &&
      projects.length === 2 &&
      mediaRecords.length === 1 &&
      !hasDraftId(typedContent) &&
      isNonEmptyString(siteSettings.siteTitle) &&
      isNonEmptyString(siteSettings.description) &&
      isHttpsUrl(siteSettings.canonicalUrl) &&
      isHttpsUrl(siteSettings.defaultShareImage) &&
      isNonEmptyString(profile.name) &&
      isNonEmptyString(profile.professionalTitle) &&
      profile.locations.length > 0 &&
      isNonEmptyString(profile.shortBiography) &&
      profile.biography.length > 0 &&
      isNonEmptyString(profile.portrait) &&
      projects.every(
        (project) =>
          project.isPublished === true &&
          isNonEmptyString(project.name) &&
          isNonEmptyString(project.role) &&
          /^\d{4}$/.test(project.year) &&
          isNonEmptyString(project.summary) &&
          project.description.length > 0 &&
          project.highlights.length > 0 &&
          Number.isInteger(project.order),
      ) &&
      new Set(orders).size === orders.length &&
      orders.every((order, index) => index === 0 || orders[index - 1] < order) &&
      mediaRecords.every(
        (media) =>
          isNonEmptyString(media.label) &&
          isNonEmptyString(media.alt) &&
          isNonEmptyString(media.source) &&
          media.placements.length > 0 &&
          isHttpsUrl(media.assetUrl) &&
          ["owned", "licensed", "permission-granted"].includes(media.rightsStatus),
      ),
  );
}

export function loadPortfolioContent(options?: LoadContentOptions & {source?: "repository"}): Promise<PortfolioContent>;
export function loadPortfolioContent(options: LoadContentOptions & {source: "sanity-poc"}): Promise<PortfolioContent>;
export function loadPortfolioContent(options: LoadContentOptions & {source: "sanity"}): Promise<ProductionContentSnapshot>;
export async function loadPortfolioContent(
  options: LoadContentOptions = {},
): Promise<PortfolioContent | ProductionContentSnapshot> {
  const source = selectedSource(options.source);
  if (source === "repository") {
    return repositoryContent;
  }

  const sanity = await import("./sanity-query");

  if (source === "sanity") {
    let content: unknown;
    try {
      const client = options.client ?? sanity.createPublishedContentClient();
      content = await sanity.queryPublishedContent(client);
    } catch (error) {
      throw new Error("Sanity published content could not be loaded", {cause: error});
    }

    try {
      return validatePublishedContent(content);
    } catch (error) {
      throw new Error("Invalid published Sanity content", {cause: error});
    }
  }

  let content: unknown;
  try {
    const client = options.client ?? sanity.createPocContentClient();
    content = await sanity.queryPocContent(client);
  } catch (error) {
    throw new Error("Sanity PoC content could not be loaded", {cause: error});
  }

  if (!isValidSanityContent(content)) {
    throw new Error("Invalid Sanity PoC content");
  }
  return content;
}
