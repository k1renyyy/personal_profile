import type {MetadataRoute} from "next";
import {getIdentityViewModel} from "@/lib/identity/get-identity";

export const dynamic = "force-static";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const {metadata} = await getIdentityViewModel();
  if (!metadata.canonicalUrl) throw new Error("Canonical URL is required for robots.txt");

  return {
    rules: {userAgent: "*", allow: "/"},
    sitemap: new URL("/sitemap.xml", metadata.canonicalUrl).toString(),
    host: metadata.canonicalUrl,
  };
}
