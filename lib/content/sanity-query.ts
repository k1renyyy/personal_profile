import {createClient} from "@sanity/client";
import type {SanityQueryClient} from "./types";

export const SANITY_API_DATE = "2026-08-30";

export type PublishedSanityConfig = {
  projectId: string;
  dataset: string;
};

const publishedDocument = '!(_id in path("drafts.**"))';
const visibleDocument = `${publishedDocument} && isVisible == true`;

const mediaProjection = `{
  _id, label, alt, caption, source, rightsStatus, attribution, placements,
  originalDimensions, targetAspectRatio, focalPoint,
  "assetUrl": asset.asset->url
}`;

export const siteSettingsQuery = `*[_type == "siteSettings" && _id == "siteSettings" && ${publishedDocument}][0]{
  _id, siteTitle, siteDescription, canonicalUrl, socialName, allowIndexing,
  "defaultShareImage": defaultShareImage->${mediaProjection}
}`;

export const profileQuery = `*[_type == "profile" && _id == "profile" && ${publishedDocument}][0]{
  _id, name, englishName, professionalTitle, locations, timezone, availability,
  shortBio, fullBio, "portrait": portrait->${mediaProjection}
}`;

export const homepageQuery = `*[_type == "homepage" && _id == "homepage" && ${publishedDocument}][0]{
  _id, heroTitleLines, heroNameLines, heroTechChips, regionLabel, valuePropositionLines,
  availability, primaryCtaLabel, aboutTitle, aboutLabel, about,
  "aboutPhotos": aboutPhotos[]->${mediaProjection}, marqueePrimaryLines, marqueeSecondaryLines,
  skillTickerItems, experienceTitle, experienceLabel, experienceIntro,
  projectsTitle, projectsLabel, projectsIntro, testimonialsTitle, testimonialsIntro,
  contactTitleLines, contactInvitation
}`;

export const educationsQuery = `*[_type == "education" && ${visibleDocument}] | order(order asc){
  _id, institution, degree, fieldOfStudy, location, startDate, endDate,
  isExpected, description, highlights, relatedUrl, order, isVisible
}`;

export const experiencesQuery = `*[_type == "experience" && ${visibleDocument}] | order(order asc){
  _id, company, role, timeLabel, outcomes, order, isVisible
}`;

export const capabilityGroupsQuery = `*[_type == "capabilityGroup" && ${visibleDocument}] | order(order asc){
  _id, name, items, order, isVisible
}`;

export const projectsQuery = `*[_type == "project" && ${visibleDocument}] | order(order asc){
  _id, name, projectType, role, summary, outcomes, capabilities, order, isVisible
}`;

export const testimonialsQuery = `*[_type == "testimonial" && ${visibleDocument} && permissionStatus == "granted"] | order(order asc){
  _id, personName, personRole, company, relationship, quote, date,
  "portrait": portrait->${mediaProjection}, permissionStatus, permissionNote,
  order, isVisible
}`;

export const socialLinksQuery = `*[_type == "socialLink" && ${visibleDocument}] | order(order asc){
  _id, platform, label, url, accessibilityLabel, order, isVisible
}`;

export const mediaRecordsQuery = `*[_type == "mediaRecord" && ${publishedDocument}]${mediaProjection}`;

export const publishedContentQuery = `{
  "siteSettings": ${siteSettingsQuery},
  "profile": ${profileQuery},
  "homepage": ${homepageQuery},
  "educations": ${educationsQuery},
  "experiences": ${experiencesQuery},
  "capabilityGroups": ${capabilityGroupsQuery},
  "projects": ${projectsQuery},
  "testimonials": ${testimonialsQuery},
  "socialLinks": ${socialLinksQuery},
  "mediaRecords": ${mediaRecordsQuery}
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

export const pocPublishedContentQuery = `{
  "siteSettings": *[_type == "siteSettings" && _id == "siteSettings" && !(_id in path("drafts.**"))][0]{
    _id, siteTitle, "description": siteDescription, canonicalUrl, allowIndexing,
    socialName, "defaultShareImage": defaultShareImage->asset.asset->url
  },
  "profile": *[_type == "profile" && _id == "profile" && !(_id in path("drafts.**"))][0]{
    _id, name, professionalTitle, locations, "shortBiography": shortBio,
    "biography": fullBio, "portrait": portrait->_id
  },
  "projects": *[_type == "project" && isPublished == true && !(_id in path("drafts.**"))] | order(order asc){
    _id, name, role, year, summary, description, highlights, order, isPublished
  },
  "mediaRecords": *[_type == "mediaRecord" && !(_id in path("drafts.**"))]{
    _id, label, alt, source, rightsStatus, placements, "assetUrl": asset.asset->url
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

export function createPocContentClient(): SanityQueryClient {
  return createClient({
    projectId: "foow59ov",
    dataset: "poc",
    apiVersion: SANITY_API_DATE,
    useCdn: false,
    perspective: "published",
  });
}

export async function queryPublishedContent(client: SanityQueryClient): Promise<unknown> {
  return client.fetch<unknown>(publishedContentQuery);
}

export async function queryPublishedIdentity(client: SanityQueryClient): Promise<unknown> {
  return client.fetch<unknown>(phase4IdentityQuery);
}

export async function queryPublishedHomepage(client: SanityQueryClient): Promise<unknown> {
  return client.fetch<unknown>(homepagePageQuery);
}

export async function queryPocContent(client: SanityQueryClient): Promise<unknown> {
  return client.fetch<unknown>(pocPublishedContentQuery);
}
