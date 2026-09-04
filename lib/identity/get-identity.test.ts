import {describe, expect, it, vi} from "vitest";
import {identityFixture} from "./identity-fixture";
import {getIdentityViewModel} from "./get-identity";

describe("getIdentityViewModel", () => {
  it("queries and validates the narrow published identity", async () => {
    const fetch = vi.fn().mockResolvedValue(identityFixture);
    const identity = await getIdentityViewModel({client: {fetch}});
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(identity.email.address).toBe("test@example.com");
  });

  it("fails closed when selected Sanity is unavailable", async () => {
    const fetch = vi.fn().mockRejectedValue(new Error("offline"));
    await expect(getIdentityViewModel({client: {fetch}})).rejects.toThrow(
      "Sanity identity content could not be loaded",
    );
  });

  it("fails closed for invalid published identity", async () => {
    const invalid = structuredClone(identityFixture) as Record<string, unknown>;
    invalid.profile = undefined;
    const fetch = vi.fn().mockResolvedValue(invalid);
    await expect(getIdentityViewModel({client: {fetch}})).rejects.toThrow(
      "Invalid published Sanity identity",
    );
  });
});
