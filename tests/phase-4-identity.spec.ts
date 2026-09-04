import {expect, test} from "@playwright/test";

test("renders the approved Phase 4 identity and safe metadata", async ({page}) => {
  await page.goto("/");
  await expect(page.getByText("KIREN", {exact: true}).first()).toBeVisible();
  await expect(page.locator("span:visible", {hasText: /^AI Product$/}).first()).toBeVisible();
  await expect(page.getByRole("link", {name: /GitHub/i}).first()).toHaveAttribute("href", "https://github.com/k1renyyy");
  await expect(page.getByRole("link", {name: /LinkedIn/i}).first()).toHaveAttribute("href", "https://www.linkedin.com/in/zhuoli-yu");
  await expect(page.locator('a[href="mailto:zy3690@nyu.edu"]').first()).toBeAttached();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(0);
  await expect(page.getByRole("link", {name: /repository/i})).toHaveCount(0);

  for (const link of await page.locator('a[href^="https://github.com/k1renyyy"], a[href^="https://www.linkedin.com/in/zhuoli-yu"]').all()) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
    await expect(link).toHaveAttribute("rel", /noreferrer/);
  }
});

test("copies the one approved email address", async ({browser, browserName}) => {
  test.skip(browserName !== "chromium", "Clipboard permission verification uses Chromium.");
  const context = await browser.newContext({permissions: ["clipboard-read", "clipboard-write"]});
  const page = await context.newPage();
  await page.goto("/");
  const copy = page.getByRole("button", {name: "Copy Address"});
  await copy.scrollIntoViewIfNeeded();
  await copy.click();
  await expect(page.getByText("Email Copied")).toBeVisible();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("zy3690@nyu.edu");
  await context.close();
});

const evidenceViewports = [
  {name: "390x844", width: 390, height: 844},
  {name: "430x932", width: 430, height: 932},
  {name: "768x1024", width: 768, height: 1024},
  {name: "1024x768", width: 1024, height: 768},
  {name: "1440x900", width: 1440, height: 900},
  {name: "1920x1080", width: 1920, height: 1080},
] as const;

for (const viewport of evidenceViewports) {
  for (const theme of ["light", "dark"] as const) {
    test(`captures ${viewport.name} ${theme} identity evidence`, async ({page}, testInfo) => {
      test.skip(testInfo.project.name !== "chromium", "Deterministic visual evidence uses Chromium");
      await page.setViewportSize({width: viewport.width, height: viewport.height});
      await page.addInitScript((selectedTheme) => localStorage.setItem("theme", selectedTheme), theme);
      await page.goto("/");
      if (theme === "dark") {
        await expect(page.locator("html")).toHaveClass(/dark/);
      } else {
        await expect(page.locator("html")).not.toHaveClass(/dark/);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
      await page.screenshot({
        path: testInfo.outputPath(`home-${viewport.name}-${theme}.png`),
        fullPage: true,
        animations: "disabled",
      });
    });
  }
}
