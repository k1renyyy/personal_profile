import "server-only";

import {cache} from "react";
import type {SanityQueryClient} from "@/lib/content/types";
import {createPublishedContentClient, queryPublishedHomepage} from "@/lib/content/sanity-query";
import {repositoryHomepage} from "./repository-homepage";
import type {HomepageViewModel} from "./types";
import {validateAndMapHomepage} from "./validate-homepage";

type HomepageSource = "repository" | "sanity";

type GetHomepageOptions = {source?: HomepageSource; client?: SanityQueryClient};

function selectedSource(source?: HomepageSource): HomepageSource {
  const value = source ?? process.env.CONTENT_SOURCE ?? "repository";
  if (value !== "repository" && value !== "sanity") {
    throw new Error(`Unsupported CONTENT_SOURCE: ${value}`);
  }
  return value;
}

async function loadHomepage(options: GetHomepageOptions = {}): Promise<HomepageViewModel> {
  if (selectedSource(options.source) === "repository") return repositoryHomepage;

  let content: unknown;
  try {
    const client = options.client ?? createPublishedContentClient();
    content = await queryPublishedHomepage(client);
  } catch (error) {
    if (!options.source && !options.client) return repositoryHomepage;
    throw new Error("Sanity homepage content could not be loaded", {cause: error});
  }

  try {
    return validateAndMapHomepage(content);
  } catch (error) {
    throw new Error("Invalid published Sanity homepage content", {cause: error});
  }
}

const getCachedHomepage = cache(() => loadHomepage());

export function getHomepageViewModel(options?: GetHomepageOptions): Promise<HomepageViewModel> {
  return options ? loadHomepage(options) : getCachedHomepage();
}
