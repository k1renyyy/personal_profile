import {validateDomain} from "@/lib/content/validate-content";
import type {Phase4IdentityContent} from "./types";

function fail(message: string): never {
  throw new Error(message);
}

function record(value: unknown, message: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(message);
  return value as Record<string, unknown>;
}

function requiredString(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) fail("Invalid published identity");
  return value;
}

function twoLines(value: unknown, label: string): [string, string] {
  if (!Array.isArray(value) || value.length !== 2) {
    fail(`${label} must contain exactly two lines`);
  }
  return [requiredString(value[0]), requiredString(value[1])];
}

function hasDraftId(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasDraftId);
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (typeof item._id === "string" && item._id.startsWith("drafts.")) ||
    Object.values(item).some(hasDraftId);
}

export function validatePhase4Identity(value: unknown): Phase4IdentityContent {
  if (hasDraftId(value)) fail("Draft content is not allowed");
  const identity = record(value, "Invalid published identity");
  if (!identity.siteSettings) fail("Missing published siteSettings");
  if (!identity.profile) fail("Missing published profile");
  if (!identity.homepage) fail("Missing published homepage");
  if (!identity.socialLinks) fail("Missing published socialLinks");

  const siteSettings = validateDomain("siteSettings", identity.siteSettings);
  const profile = validateDomain("profile", identity.profile);
  const socialLinks = validateDomain("socialLinks", identity.socialLinks);
  const homepage = record(identity.homepage, "Missing published homepage");

  for (const link of socialLinks) {
    if (!link.isVisible) fail("Invalid social link");
  }
  for (const platform of ["email", "github", "linkedin"] as const) {
    if (socialLinks.filter((link) => link.platform === platform).length !== 1) {
      fail(`Exactly one visible ${platform} link is required`);
    }
  }
  if (socialLinks.some((link, index) => link.order !== index)) {
    fail("Invalid social link order");
  }

  return {
    siteSettings,
    profile,
    homepage: {
      _id: requiredString(homepage._id),
      heroTitleLines: twoLines(homepage.heroTitleLines, "Hero title"),
      heroNameLines: twoLines(homepage.heroNameLines, "Hero name"),
      heroTechChips: (() => {
        if (!Array.isArray(homepage.heroTechChips) || homepage.heroTechChips.length < 1 || homepage.heroTechChips.length > 6) {
          fail("Hero tech chips must contain between one and six items");
        }
        return homepage.heroTechChips.map((item) => requiredString(item));
      })(),
      regionLabel: requiredString(homepage.regionLabel),
      valuePropositionLines: twoLines(homepage.valuePropositionLines, "Value proposition"),
      availability: requiredString(homepage.availability),
      primaryCtaLabel: requiredString(homepage.primaryCtaLabel),
      contactTitleLines: twoLines(homepage.contactTitleLines, "Contact title"),
      contactInvitation: requiredString(homepage.contactInvitation),
    },
    socialLinks,
  };
}
