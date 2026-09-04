import "server-only";

import {cache} from "react";
import {createPublishedContentClient, queryPublishedIdentity} from "@/lib/content/sanity-query";
import type {SanityQueryClient} from "@/lib/content/types";
import {mapIdentityContent, type IdentityViewModel} from "./map-identity";
import {validatePhase4Identity} from "./validate-identity";

type GetIdentityOptions = {
  client?: SanityQueryClient;
};

async function loadIdentityViewModel(
  options: GetIdentityOptions = {},
): Promise<IdentityViewModel> {
  let content: unknown;
  try {
    const client = options.client ?? createPublishedContentClient();
    content = await queryPublishedIdentity(client);
  } catch (error) {
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
