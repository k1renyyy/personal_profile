import type {
  ContentDomain,
  DomainContentMap,
  ProductionMediaContent,
} from "./types";

function fail(message: string): never {
  throw new Error(message);
}

function record(value: unknown, message = "Invalid published content"): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(message);
  return value as Record<string, unknown>;
}

function string(value: unknown, message = "Invalid published content"): string {
  if (typeof value !== "string" || !value.trim()) fail(message);
  return value;
}

function optionalString(value: unknown, message = "Invalid published content"): string | undefined {
  if (value === undefined || value === null) return undefined;
  return string(value, message);
}

function boolean(value: unknown, message = "Invalid published content"): boolean {
  if (typeof value !== "boolean") fail(message);
  return value;
}

function array(value: unknown, message = "Invalid published content"): unknown[] {
  if (!Array.isArray(value)) fail(message);
  return value;
}

function strings(value: unknown, message = "Invalid published content"): string[] {
  const values = array(value, message);
  if (values.some((item) => typeof item !== "string" || !item.trim())) fail(message);
  return values as string[];
}

function https(value: unknown, message: string): string {
  const url = string(value, message);
  try {
    if (new URL(url).protocol !== "https:") fail(message);
  } catch {
    fail(message);
  }
  return url;
}

function mailto(value: unknown, message: string): string {
  const url = string(value, message);
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "mailto:" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(parsed.pathname)) {
      fail(message);
    }
  } catch {
    fail(message);
  }
  return url;
}

function id(value: unknown): string {
  return string(value);
}

function portableText(value: unknown): Record<string, unknown>[] {
  const blocks = array(value);
  if (!blocks.length || blocks.some((item) => !item || typeof item !== "object" || Array.isArray(item))) {
    fail("Invalid published content");
  }
  return blocks as Record<string, unknown>[];
}

function visibleOrder(item: Record<string, unknown>): number {
  if (!Number.isInteger(item.order) || (item.order as number) < 0) fail("Invalid published content");
  boolean(item.isVisible);
  return item.order as number;
}

function ordered<T>(value: unknown, label: string, validate: (item: unknown) => T): T[] {
  const items = array(value).map(validate);
  const orders = items.map((item) => (item as {order: number}).order);
  if (new Set(orders).size !== orders.length) fail(`Duplicate ${label} order`);
  if (orders.some((order, index) => index > 0 && order <= orders[index - 1])) {
    fail(`Invalid ${label} order`);
  }
  return items;
}

export function validateMedia(value: unknown): ProductionMediaContent {
  const item = record(value);
  const rightsStatus = string(item.rightsStatus, "Invalid media rights");
  if (!(["owned", "licensed", "permission-granted"] as string[]).includes(rightsStatus)) {
    fail("Invalid media rights");
  }
  const dimensions = record(item.originalDimensions);
  if (!Number.isInteger(dimensions.width) || (dimensions.width as number) <= 0 ||
      !Number.isInteger(dimensions.height) || (dimensions.height as number) <= 0) {
    fail("Invalid published content");
  }
  const attribution = optionalString(item.attribution);
  if ((rightsStatus === "licensed" || rightsStatus === "permission-granted") && !attribution) {
    fail("Invalid media rights");
  }
  const focalPoint = item.focalPoint == null ? undefined : record(item.focalPoint);
  if (focalPoint &&
      (typeof focalPoint.x !== "number" || focalPoint.x < 0 || focalPoint.x > 1 ||
       typeof focalPoint.y !== "number" || focalPoint.y < 0 || focalPoint.y > 1)) {
    fail("Invalid published content");
  }
  return {
    _id: id(item._id),
    label: string(item.label),
    alt: string(item.alt),
    caption: optionalString(item.caption),
    source: string(item.source),
    rightsStatus: rightsStatus as ProductionMediaContent["rightsStatus"],
    attribution,
    placements: strings(item.placements),
    originalDimensions: {width: dimensions.width as number, height: dimensions.height as number},
    targetAspectRatio: string(item.targetAspectRatio),
    focalPoint: focalPoint ? {x: focalPoint.x as number, y: focalPoint.y as number} : undefined,
    assetUrl: https(item.assetUrl, "Invalid media asset URL"),
  };
}

function validateSiteSettings(value: unknown): DomainContentMap["siteSettings"] {
  const item = record(value);
  const canonicalUrl = item.canonicalUrl == null ? undefined : https(item.canonicalUrl, "Invalid canonical URL");
  const defaultShareImage = item.defaultShareImage == null ? undefined : validateMedia(item.defaultShareImage);
  const allowIndexing = boolean(item.allowIndexing);
  if (allowIndexing && (!canonicalUrl || !defaultShareImage)) {
    fail("Indexing requires canonical URL and share image");
  }
  return {
    _id: id(item._id),
    siteTitle: string(item.siteTitle),
    siteDescription: string(item.siteDescription),
    canonicalUrl,
    socialName: string(item.socialName),
    allowIndexing,
    defaultShareImage,
  };
}

function validateProfile(value: unknown): DomainContentMap["profile"] {
  const item = record(value);
  return {
    _id: id(item._id),
    name: string(item.name),
    englishName: string(item.englishName),
    professionalTitle: string(item.professionalTitle),
    locations: strings(item.locations),
    timezone: string(item.timezone),
    availability: string(item.availability),
    shortBio: string(item.shortBio),
    fullBio: portableText(item.fullBio),
    portrait: item.portrait == null ? undefined : validateMedia(item.portrait),
  };
}

function validateSocialLink(value: unknown): DomainContentMap["socialLinks"][number] {
  const item = record(value);
  const platform = string(item.platform);
  if (!(["email", "github", "linkedin"] as string[]).includes(platform)) fail("Invalid social link");
  const url = platform === "email" ? mailto(item.url, "Invalid social link") : https(item.url, "Invalid social link");
  return {_id: id(item._id), platform: platform as "email" | "github" | "linkedin", label: string(item.label), url, accessibilityLabel: string(item.accessibilityLabel), order: visibleOrder(item), isVisible: item.isVisible as boolean};
}

const validators: {[K in ContentDomain]: (value: unknown) => DomainContentMap[K]} = {
  siteSettings: validateSiteSettings,
  profile: validateProfile,
  socialLinks: (value) => ordered(value, "social link", validateSocialLink),
};

function hasDraftId(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasDraftId);
  if (value && typeof value === "object") {
    const item = value as Record<string, unknown>;
    return (typeof item._id === "string" && item._id.startsWith("drafts.")) ||
      Object.values(item).some(hasDraftId);
  }
  return false;
}

export function validateDomain<K extends ContentDomain>(
  domain: K,
  value: unknown,
): DomainContentMap[K] {
  if (hasDraftId(value)) fail("Draft content is not allowed");
  return validators[domain](value);
}
