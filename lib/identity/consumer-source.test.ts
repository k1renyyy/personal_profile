import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import FloatingSocials from "@/app/components/floating-socials";
import Contact from "@/app/components/sections/contact";
import Footer from "@/app/components/footer";
import {mapIdentityContent, repositoryIdentityContent} from "./map-identity";

describe("Phase 4 identity consumers", () => {
  it("renders only the approved prop-driven identity and links", () => {
    const identity = mapIdentityContent(repositoryIdentityContent);
    const html = [
      renderToStaticMarkup(createElement(FloatingSocials, {socialLinks: identity.socialLinks})),
      renderToStaticMarkup(createElement(Contact, {contact: identity.contact, email: identity.email, socialLinks: identity.socialLinks})),
      renderToStaticMarkup(createElement(Footer, {displayName: identity.displayName, copyrightName: identity.copyrightName, socialLinks: identity.socialLinks})),
    ].join("");
    expect(html).toContain("mailto:zy3690@nyu.edu");
    expect(html).toContain("https://github.com/k1renyyy");
    expect(html).toContain("https://www.linkedin.com/in/zhuoli-yu");
    expect(html).toContain("于卓立 / Kiren");
    expect(html).not.toMatch(/Twitter|Instagram|x\.com/i);
  });
});
