import type {
  HomepageContent,
  ProductionProfileContent,
  ProductionSiteSettingsContent,
  SocialLinkContent,
} from "@/lib/content/types";

export type Phase4IdentityContent = {
  siteSettings: ProductionSiteSettingsContent;
  profile: ProductionProfileContent;
  homepage: Pick<
    HomepageContent,
    | "_id"
    | "heroTitleLines"
    | "heroNameLines"
    | "heroTechChips"
    | "regionLabel"
    | "valuePropositionLines"
    | "availability"
    | "primaryCtaLabel"
    | "contactTitleLines"
    | "contactInvitation"
  >;
  socialLinks: SocialLinkContent[];
};
