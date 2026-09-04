import {describe, expect, it, vi} from "vitest";
import {repositoryIdentityContent} from "./map-identity";
import {getIdentityViewModel} from "./get-identity";

describe("getIdentityViewModel", () => {
  it("does not query Sanity in explicit repository mode", async () => {
    const fetch = vi.fn();
    const identity = await getIdentityViewModel({source: "repository", client: {fetch}});
    expect(fetch).not.toHaveBeenCalled();
    expect(identity.brandLabel).toBe("KIREN");
  });

  it("queries and validates the narrow published identity in sanity mode", async () => {
    const fetch = vi.fn().mockResolvedValue(repositoryIdentityContent);
    const identity = await getIdentityViewModel({source: "sanity", client: {fetch}});
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(identity.email.address).toBe("zy3690@nyu.edu");
  });

  it("fails closed when selected Sanity is unavailable", async () => {
    const fetch = vi.fn().mockRejectedValue(new Error("offline"));
    await expect(getIdentityViewModel({source: "sanity", client: {fetch}})).rejects.toThrow(
      "Sanity identity content could not be loaded",
    );
  });

  it("fails closed for invalid published identity", async () => {
    const invalid = structuredClone(repositoryIdentityContent) as Record<string, unknown>;
    invalid.profile = undefined;
    const fetch = vi.fn().mockResolvedValue(invalid);
    await expect(getIdentityViewModel({source: "sanity", client: {fetch}})).rejects.toThrow(
      "Invalid published Sanity identity",
    );
  });

  it("rejects unsupported CONTENT_SOURCE values before querying", async () => {
    const fetch = vi.fn();
    await expect(getIdentityViewModel({source: "unsupported" as "repository", client: {fetch}})).rejects.toThrow(
      "Unsupported CONTENT_SOURCE: unsupported",
    );
    expect(fetch).not.toHaveBeenCalled();
  });
});
