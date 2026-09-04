import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import FloatingSocials from "@/app/components/floating-socials";
import Contact from "@/app/components/sections/contact";
import Footer from "@/app/components/footer";
import {identityFixture} from "./identity-fixture";
import {mapIdentityContent} from "./map-identity";

describe("Phase 4 identity consumers", () => {
  it("renders only the approved prop-driven identity and links", () => {
    const identity = mapIdentityContent(identityFixture);
    const html = [
      renderToStaticMarkup(createElement(FloatingSocials, {socialLinks: identity.socialLinks})),
      renderToStaticMarkup(createElement(Contact, {contact: identity.contact, email: identity.email, socialLinks: identity.socialLinks})),
      renderToStaticMarkup(createElement(Footer, {displayName: identity.displayName, copyrightName: identity.copyrightName, socialLinks: identity.socialLinks})),
    ].join("");
    expect(html).toContain("mailto:test@example.com");
    expect(html).toContain("https://github.com/example");
    expect(html).toContain("https://www.linkedin.com/in/example");
    expect(html).toContain("测试用户 / Test Person");
    expect(html).not.toMatch(/Twitter|Instagram|x\.com/i);
  });
});
