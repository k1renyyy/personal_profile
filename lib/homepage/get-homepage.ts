import "server-only";

import {cache} from "react";
import type {SanityQueryClient} from "@/lib/content/types";
import {createPublishedContentClient, queryPublishedHomepage} from "@/lib/content/sanity-query";
import type {HomepageViewModel} from "./types";
import {validateAndMapHomepage} from "./validate-homepage";

type GetHomepageOptions = {client?: SanityQueryClient};

async function loadHomepage(options: GetHomepageOptions = {}): Promise<HomepageViewModel> {
  let content: unknown;
  try {
    const client = options.client ?? createPublishedContentClient();
    content = await queryPublishedHomepage(client);
  } catch (error) {
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
