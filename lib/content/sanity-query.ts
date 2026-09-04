import {createClient} from "@sanity/client";
import type {SanityQueryClient} from "./types";

export const SANITY_API_DATE = "2026-08-30";

export type PublishedSanityConfig = {
  projectId: string;
  dataset: string;
};

const publishedDocument = '!(_id in path("drafts.**"))';
const visibleDocument = `${publishedDocument} && isVisible == true`;
const buildRequest = {cache: "force-cache", tag: `portfolio-build-${Date.now()}`} as const;

const mediaProjection = `{
  _id, label, alt, caption, source, rightsStatus, attribution, placements,
  originalDimensions, targetAspectRatio, focalPoint,
  "assetUrl": asset.asset->url
}`;

export const phase4IdentityQuery = `{
  "siteSettings": *[_type == "siteSettings" && _id == "siteSettings" && ${publishedDocument}][0]{
    _id, siteTitle, siteDescription, canonicalUrl, socialName, allowIndexing,
    "defaultShareImage": defaultShareImage->${mediaProjection}
  },
  "profile": *[_type == "profile" && _id == "profile" && ${publishedDocument}][0]{
    _id, name, englishName, professionalTitle, locations, timezone, availability,
    shortBio, fullBio, "portrait": portrait->${mediaProjection}
  },
  "homepage": *[_type == "homepage" && _id == "homepage" && ${publishedDocument}][0]{
    _id, heroTitleLines, heroNameLines, heroTechChips, regionLabel, valuePropositionLines,
    availability, primaryCtaLabel, contactTitleLines, contactInvitation
  },
  "socialLinks": *[_type == "socialLink" && ${publishedDocument} && isVisible == true] | order(order asc){
    _id, platform, label, url, accessibilityLabel, order, isVisible
  }
}`;

export const homepagePageQuery = `{
  "homepage": *[_type == "homepage" && _id == "homepage" && ${publishedDocument}][0]{
    _id, aboutTitle, aboutLabel, about, "aboutPhotos": aboutPhotos[]->${mediaProjection}, marqueePrimaryLines, marqueeSecondaryLines,
    skillTickerItems, experienceTitle, experienceLabel, projectsTitle, projectsLabel, projectsIntro, testimonialsTitle, testimonialsIntro
  },
  "experiences": *[_type == "experience" && ${visibleDocument}] | order(order asc){
    _id, company, role, timeLabel, outcomes, order
  },
  "projects": *[_type == "project" && ${visibleDocument}] | order(order asc){
    _id, name, projectType, role, summary, outcomes, capabilities, order
  },
  "testimonials": *[_type == "testimonial" && ${visibleDocument} && permissionStatus == "granted"] | order(order asc){
    _id, personName, company, quote, order
  }
}`;

export function createPublishedContentClient(
  config: PublishedSanityConfig = {
    projectId: process.env.SANITY_PROJECT_ID ?? "",
    dataset: process.env.SANITY_DATASET ?? "",
  },
): SanityQueryClient {
  if (!config.projectId) throw new Error("SANITY_PROJECT_ID is required");
  if (!config.dataset) throw new Error("SANITY_DATASET is required");
  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: SANITY_API_DATE,
    useCdn: false,
    perspective: "published",
  });
}

export async function queryPublishedIdentity(client: SanityQueryClient): Promise<unknown> {
  return client.fetch<unknown>(phase4IdentityQuery, {}, buildRequest);
}

export async function queryPublishedHomepage(client: SanityQueryClient): Promise<unknown> {
  return client.fetch<unknown>(homepagePageQuery, {}, buildRequest);
}
