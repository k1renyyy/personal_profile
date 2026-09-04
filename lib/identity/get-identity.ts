import "server-only";

import {cache} from "react";
import {createPublishedContentClient, queryPublishedIdentity} from "@/lib/content/sanity-query";
import type {SanityQueryClient} from "@/lib/content/types";
import {mapIdentityContent, repositoryIdentityContent, type IdentityViewModel} from "./map-identity";
import {validatePhase4Identity} from "./validate-identity";

type IdentitySource = "repository" | "sanity";

type GetIdentityOptions = {
  source?: IdentitySource;
  client?: SanityQueryClient;
};

function selectedSource(source?: IdentitySource): IdentitySource {
  const value = source ?? process.env.CONTENT_SOURCE ?? "repository";
  if (value !== "repository" && value !== "sanity") {
    throw new Error(`Unsupported CONTENT_SOURCE: ${value}`);
  }
  return value;
}

async function loadIdentityViewModel(
  options: GetIdentityOptions = {},
): Promise<IdentityViewModel> {
  const source = selectedSource(options.source);
  if (source === "repository") {
    return mapIdentityContent(validatePhase4Identity(repositoryIdentityContent));
  }

  let content: unknown;
  try {
    const client = options.client ?? createPublishedContentClient();
    content = await queryPublishedIdentity(client);
  } catch (error) {
    if (!options.source && !options.client) {
      return mapIdentityContent(validatePhase4Identity(repositoryIdentityContent));
    }
    throw new Error("Sanity identity content could not be loaded", {cause: error});
  }

  try {
    return mapIdentityContent(validatePhase4Identity(content));
  } catch (error) {
    throw new Error("Invalid published Sanity identity", {cause: error});
  }
}

const getCachedIdentityViewModel = cache(() => loadIdentityViewModel());

export function getIdentityViewModel(options?: GetIdentityOptions): Promise<IdentityViewModel> {
  return options ? loadIdentityViewModel(options) : getCachedIdentityViewModel();
}
