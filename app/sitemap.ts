import type {MetadataRoute} from "next";
import {getIdentityViewModel} from "@/lib/identity/get-identity";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const {metadata} = await getIdentityViewModel();
  if (!metadata.canonicalUrl) throw new Error("Canonical URL is required for sitemap.xml");

  return [{url: metadata.canonicalUrl, changeFrequency: "monthly", priority: 1}];
}
