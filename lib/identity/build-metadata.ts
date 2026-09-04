import type {Metadata} from "next";
import type {IdentityViewModel} from "./map-identity";

export function buildIdentityMetadata(identity: IdentityViewModel["metadata"]): Metadata {
  const canIndex = Boolean(
    identity.allowIndexing && identity.canonicalUrl && identity.defaultShareImage,
  );
  const shareImage = identity.defaultShareImage
    ? [{
        url: identity.defaultShareImage.assetUrl,
        width: identity.defaultShareImage.originalDimensions.width,
        height: identity.defaultShareImage.originalDimensions.height,
        alt: identity.defaultShareImage.alt,
      }]
    : undefined;

  return {
    title: identity.title,
    description: identity.description,
    robots: {index: canIndex, follow: canIndex},
    alternates: identity.canonicalUrl ? {canonical: identity.canonicalUrl} : undefined,
    openGraph: {
      title: identity.title,
      description: identity.description,
      siteName: identity.socialName,
      type: "website",
      url: identity.canonicalUrl,
      images: shareImage,
    },
    twitter: {
      card: shareImage ? "summary_large_image" : "summary",
      title: identity.title,
      description: identity.description,
      images: shareImage,
    },
  };
}
