import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/",
] as const;

function collectBrowserFailures(page: Page) {
  const failures: string[] = [];
  const driverDiagnostics: string[] = [];
  const localNetworkFailures: string[] = [];
  const supabaseRequests: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      const text = message.text();
      if (/^\[\.WebGL-.*GL Driver Message .*GPU stall due to ReadPixels(?: \(this message will no longer repeat\))?$/.test(text)) {
        driverDiagnostics.push(text);
      } else {
        failures.push(`${message.type()}: ${text}`);
      }
    }
  });
  page.on("pageerror", (error) =>
    failures.push(`pageerror: ${error.stack ?? error.message}`),
  );
  page.on("request", (request) => {
    if (/supabase/i.test(request.url())) supabaseRequests.push(request.url());
  });
  page.on("requestfailed", (request) => {
    if (new URL(request.url()).hostname === "127.0.0.1") {
      const errorText = request.failure()?.errorText;
      const isCancelledRouteProbe = request.method() === "HEAD" && errorText === "net::ERR_ABORTED";
      if (!isCancelledRouteProbe) {
        localNetworkFailures.push(`${request.method()} ${request.url()}: ${errorText}`);
      }
    }
  });
  page.on("response", (response) => {
    if (new URL(response.url()).hostname === "127.0.0.1" && response.status() >= 400) {
      localNetworkFailures.push(`${response.status()} ${response.url()}`);
    }
  });

  return { driverDiagnostics, failures, localNetworkFailures, supabaseRequests };
}

test("all generated routes render without browser or Supabase failures", async ({ browser }) => {
  for (const route of routes) {
    const page = await browser.newPage();
    const evidence = collectBrowserFailures(page);

    try {
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status(), route).toBeLessThan(400);
      await expect(page.locator("body"), route).not.toBeEmpty();
      expect(evidence.failures, route).toEqual([]);
      expect(evidence.driverDiagnostics.every((message) =>
        /GPU stall due to ReadPixels(?: \(this message will no longer repeat\))?$/.test(message),
      ), route).toBe(true);
      expect(evidence.localNetworkFailures, route).toEqual([]);
      expect(evidence.supabaseRequests, route).toEqual([]);
    } finally {
      await page.close();
    }
  }
});

test("responsive dark theme remains operational", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "The full viewport matrix uses pinned Chromium.");
  const evidence = collectBrowserFailures(page);
  const viewports = [
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ] as const;

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "load" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.getByRole("button", { name: /theme/i })).toHaveCount(0);
  }

  expect(evidence.failures).toEqual([]);
  expect(evidence.driverDiagnostics.every((message) =>
    /GPU stall due to ReadPixels(?: \(this message will no longer repeat\))?$/.test(message),
  )).toBe(true);
  expect(evidence.localNetworkFailures).toEqual([]);
  expect(evidence.supabaseRequests).toEqual([]);
});

test("theme remains dark regardless of a stale light preference", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "The fixed theme is verified once in pinned Chromium.");
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByRole("button", { name: /theme/i })).toHaveCount(0);
});

test("reduced motion, Shoot Mode, WebGL and testimonials remain operational", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Interaction timing is verified in pinned Chromium.");
  const evidence = collectBrowserFailures(page);
  await page.addInitScript(() => {
    const audioEvidence = { contexts: 0, sourceStarts: 0 };
    Object.defineProperty(window, "__audioEvidence", { value: audioEvidence });

    const NativeAudioContext = window.AudioContext;
    if (NativeAudioContext) {
      window.AudioContext = new Proxy(NativeAudioContext, {
        construct(Target, args) {
          audioEvidence.contexts += 1;
          return Reflect.construct(Target, args);
        },
      });
    }

    const nativeStart = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (...args) {
      audioEvidence.sourceStarts += 1;
      return nativeStart.apply(this, args as Parameters<AudioBufferSourceNode["start"]>);
    };
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "load" });
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);

  const shootToggle = page.getByRole("button", { name: "Toggle shoot mode" });
  await shootToggle.click({force: true});
  await expect(shootToggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("canvas")).toHaveCount(1);
  await page.mouse.click(100, 400);
  await expect(page.locator(".fixed.inset-0.z-9998 > div")).toHaveCount(1);
  expect(await page.evaluate(() => {
    const evidence = (window as unknown as Window & {
      __audioEvidence: { contexts: number; sourceStarts: number };
    }).__audioEvidence;
    return evidence.contexts > 0 && evidence.sourceStarts > 0;
  })).toBe(true);
  await shootToggle.click({force: true});

  await expect(page.locator(".testimonials-section")).toBeVisible();
  await expect(page.locator(".achievements-section")).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);
  await expect(page.locator(".hero-klein-glow")).toHaveCount(1);
  await expect(page.locator(".contact-klein-glow")).toHaveCount(1);

  expect(evidence.failures).toEqual([]);
  expect(evidence.driverDiagnostics.every((message) =>
    /GPU stall due to ReadPixels(?: \(this message will no longer repeat\))?$/.test(message),
  )).toBe(true);
  expect(evidence.localNetworkFailures).toEqual([]);
  expect(evidence.supabaseRequests).toEqual([]);
});

test("touch shooting remains operational", async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium", "Touch and transition behavior use pinned Chromium.");
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  const evidence = collectBrowserFailures(page);

  try {
    await page.goto("/", { waitUntil: "networkidle" });
    const shootToggle = page.getByRole("button", { name: "Toggle shoot mode" });
    await shootToggle.tap();
    await page.touchscreen.tap(195, 300);
    await expect(page.locator(".fixed.inset-0.z-9998 > div")).toHaveCount(1);
    await shootToggle.tap();

    expect(evidence.failures).toEqual([]);
    expect(evidence.driverDiagnostics.every((message) =>
      /GPU stall due to ReadPixels(?: \(this message will no longer repeat\))?$/.test(message),
    )).toBe(true);
    expect(evidence.localNetworkFailures).toEqual([]);
    expect(evidence.supabaseRequests).toEqual([]);
  } finally {
    await context.close();
  }
});

test("Shoot Mode removes grouped About and Project frames", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Grouped Shoot targets are verified once in pinned Chromium.");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "load" });

  const shootToggle = page.getByRole("button", { name: "Toggle shoot mode" });
  await shootToggle.click({ force: true });
  await expect(shootToggle).toHaveAttribute("aria-pressed", "true");

  const aboutFrame = page.locator("[data-photo='right'] [data-shoot-target]");
  await aboutFrame.locator("img").click();
  await expect(aboutFrame).toHaveAttribute("data-shot-down", "1");
  await expect(aboutFrame).toHaveCSS("opacity", "0");

  const projectRow = page.locator("[data-testid='featured-work-selectors'] [data-shoot-target]").first();
  await projectRow.click();
  await expect(projectRow).toHaveAttribute("data-shot-down", "1");
  await expect(projectRow).toHaveCSS("opacity", "0");

  const projectStage = page.locator("[data-testid='featured-work-stage'][data-shoot-target]");
  await projectStage.click({ position: { x: 40, y: 40 } });
  await expect(projectStage).toHaveAttribute("data-shot-down", "1");
  await expect(projectStage).toHaveCSS("opacity", "0");
});
