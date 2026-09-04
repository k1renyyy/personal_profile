import { expect, test, type Locator, type Page } from "@playwright/test";

const desktopViewport = { width: 1440, height: 900 };
const stageHeightCases = [
  { viewport: { width: 1024, height: 768 }, expectedHeight: 640 },
  { viewport: desktopViewport, expectedHeight: 640 },
  { viewport: { width: 1920, height: 1080 }, expectedHeight: 734.4 },
] as const;

function projectTitle(selectorText: string): string {
  return selectorText.replace(/^\s*\d{2}\s*[/.:\-]?\s*/, "").trim();
}

async function openFeaturedWork(page: Page, viewport = desktopViewport) {
  await page.setViewportSize(viewport);
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "networkidle" });

  const section = page.locator("#projects");
  await section.scrollIntoViewIfNeeded();
  await expect(section).toBeVisible();

  const desktop = section.getByTestId("featured-work-desktop");
  await expect(desktop).toBeVisible();
  await expect.poll(() => section.evaluate((element) => {
    const revealOwner = element.parentElement;
    return revealOwner ? Number.parseFloat(getComputedStyle(revealOwner).opacity) : 0;
  })).toBe(1);
  return { section, desktop };
}

async function selectorTitles(selectors: Locator): Promise<string[]> {
  const buttons = selectors.getByRole("button");
  const names = await buttons.allTextContents();
  return names.map(projectTitle);
}

async function waitForProjectReveal(page: Page, desktop: Locator, projectIndex: number) {
  const selectors = desktop.getByTestId("featured-work-selectors");
  const stage = desktop.getByTestId("featured-work-stage");
  const title = stage.getByTestId("featured-work-title");
  const sequence = stage.getByTestId("featured-work-sequence");
  const content = stage.getByTestId("featured-work-content");
  const selected = selectors.getByRole("button").nth(projectIndex);
  const selectedTitle = projectTitle(await selected.innerText());

  await expect(selected).toHaveAttribute("aria-pressed", "true");
  await expect(sequence).toHaveText(String(projectIndex + 1).padStart(2, "0"));
  await expect(title).toHaveText(selectedTitle);
  await expect(content).toHaveCSS("opacity", "1");
  await expect(content).toHaveCSS("transform", "none");
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
}

type ContrastSample = {
  background: string;
  foreground: string;
  name: string;
  ratio: number;
};

async function featuredWorkContrastSamples(
  root: Locator,
  surface: "light-stage" | "dark-selector",
): Promise<{ focusVisible: boolean; samples: ContrastSample[] }> {
  return root.evaluate((element, requestedSurface) => {
    type Rgba = { alpha: number; blue: number; green: number; red: number };
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Canvas color parser was not available");

    const parseColor = (value: string): Rgba => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = "rgba(0, 0, 0, 0)";
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
      return { red, green, blue, alpha: alpha / 255 };
    };
    const composite = (foreground: Rgba, background: Rgba): Rgba => {
      const alpha = foreground.alpha + background.alpha * (1 - foreground.alpha);
      if (alpha === 0) return { red: 0, green: 0, blue: 0, alpha: 0 };
      return {
        red: (foreground.red * foreground.alpha
          + background.red * background.alpha * (1 - foreground.alpha)) / alpha,
        green: (foreground.green * foreground.alpha
          + background.green * background.alpha * (1 - foreground.alpha)) / alpha,
        blue: (foreground.blue * foreground.alpha
          + background.blue * background.alpha * (1 - foreground.alpha)) / alpha,
        alpha,
      };
    };
    const renderedBackground = (node: Element): Rgba => {
      const ancestry: Element[] = [];
      for (let current: Element | null = node; current; current = current.parentElement) {
        ancestry.push(current);
      }
      return ancestry.reverse().reduce(
        (background, current) => composite(parseColor(getComputedStyle(current).backgroundColor), background),
        { red: 255, green: 255, blue: 255, alpha: 1 },
      );
    };
    const luminance = (color: Rgba) => {
      const channels = [color.red, color.green, color.blue].map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const contrast = (foreground: Rgba, background: Rgba) => {
      const foregroundLuminance = luminance(composite(foreground, background));
      const backgroundLuminance = luminance(background);
      return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
        / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
    };
    const sample = (name: string, node: Element, background: Rgba): ContrastSample => {
      const foreground = getComputedStyle(node).color;
      return {
        name,
        foreground,
        background: `rgb(${background.red} ${background.green} ${background.blue})`,
        ratio: contrast(parseColor(foreground), background),
      };
    };

    if (requestedSurface === "light-stage") {
      const background = renderedBackground(element);
      const exactText = (selector: string, text: string) => {
        const match = [...element.querySelectorAll(selector)].find((node) => node.textContent?.trim() === text);
        if (!match) throw new Error(`Could not find contrast target: ${text}`);
        return match;
      };
      const sequence = element.querySelector("[data-testid='featured-work-sequence']");
      if (!sequence) throw new Error("Could not find project sequence");
      const metadata = [...element.querySelectorAll("dl dd")];
      const outcomeIndices = [...element.querySelectorAll("ol li span")];
      return {
        focusVisible: false,
        samples: [
          sample("sequence", sequence, background),
          ...metadata.map((node, index) => sample(`metadata ${index + 1}`, node, background)),
          sample("outcomes label", exactText("p", "Outcomes"), background),
          sample("capabilities label", exactText("p", "Capabilities"), background),
          ...outcomeIndices.map((node, index) => sample(`outcome index ${index + 1}`, node, background)),
        ],
      };
    }

    const activeButton = element.querySelector("button[aria-pressed='true']");
    if (!(activeButton instanceof HTMLButtonElement)) throw new Error("Could not find active selector");
    const inactiveButton = element.querySelector("button[aria-pressed='false']");
    if (!(inactiveButton instanceof HTMLButtonElement)) throw new Error("Could not find inactive selector");
    const spans = activeButton.querySelectorAll("span");
    const inactiveSpans = inactiveButton.querySelectorAll("span");
    const sequence = spans.item(0);
    const title = spans.item(1);
    const dot = spans.item(2);
    const background = renderedBackground(activeButton);
    const inactiveBackground = renderedBackground(inactiveButton);
    const buttonStyle = getComputedStyle(activeButton);
    const dotStyle = getComputedStyle(dot);
    const shadowColors = buttonStyle.boxShadow.match(
      /(?:rgba?|hsla?|oklch|oklab|color)\([^)]*\)|#[\da-f]{3,8}/gi,
    ) ?? [];
    const focusRatios = shadowColors.map((color) => contrast(parseColor(color), background));
    return {
      focusVisible: activeButton.matches(":focus-visible"),
      samples: [
        sample("active selector sequence", sequence, background),
        sample("inactive selector sequence", inactiveSpans.item(0), inactiveBackground),
        sample("selector title", title, background),
        {
          name: "active border",
          foreground: buttonStyle.borderLeftColor,
          background: `rgb(${background.red} ${background.green} ${background.blue})`,
          ratio: contrast(parseColor(buttonStyle.borderLeftColor), background),
        },
        {
          name: "active dot",
          foreground: dotStyle.backgroundColor,
          background: `rgb(${background.red} ${background.green} ${background.blue})`,
          ratio: contrast(parseColor(dotStyle.backgroundColor), background),
        },
        {
          name: "focus indicator",
          foreground: buttonStyle.boxShadow,
          background: `rgb(${background.red} ${background.green} ${background.blue})`,
          ratio: focusRatios.length > 0 ? Math.max(...focusRatios) : 1,
        },
      ],
    };
  }, surface);
}

test.describe("Featured Work desktop redesign", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "Desktop visual contract uses Chromium.");

  test("renders three named text selectors and one text stage without desktop navigation", async ({ page }) => {
    const { desktop } = await openFeaturedWork(page);
    const beforeUrl = page.url();
    const selectors = desktop.getByTestId("featured-work-selectors");
    const stage = desktop.getByTestId("featured-work-stage");
    const article = stage.getByTestId("featured-work-article");
    const buttons = selectors.getByRole("button");

    await expect(selectors).toBeVisible();
    await expect(buttons).toHaveCount(3);
    for (let index = 0; index < 3; index += 1) {
      await expect(buttons.nth(index)).toBeVisible();
    }
    const names = await selectorTitles(selectors);
    expect(names.every((name) => name.length > 0)).toBe(true);
    expect(new Set(names).size).toBe(3);
    expect((await buttons.allTextContents()).every((name) => /^\s*\d{2}/.test(name))).toBe(true);
    await expect(selectors.locator("img")).toHaveCount(0);
    await expect(desktop.getByRole("link", { name: /view all/i })).toHaveCount(0);
    await expect(desktop.getByRole("button", { name: /view all/i })).toHaveCount(0);
    await expect(desktop.getByText(/view all/i)).toHaveCount(0);

    await expect(stage).toBeVisible();
    await expect(article).toHaveCount(1);
    await expect(article).toBeVisible();
    await expect(article).not.toHaveAttribute("aria-live");
    await expect(stage.getByTestId("featured-work-announcement")).toHaveAttribute("aria-live", "polite");
    await expect(article.getByTestId("featured-work-title")).toBeVisible();
    await expect(article.getByTestId("featured-work-content")).toBeVisible();
    await expect(article.getByText("Year", { exact: true })).toHaveCount(0);
    await expect(article.getByText(/year tbd/i)).toHaveCount(0);
    await expect(article.getByText(/select a project/i)).toHaveCount(0);

    const capabilities = article.getByTestId("featured-work-capabilities");
    const outcomes = article.getByText("Outcomes", { exact: true });
    const [capabilitiesBox, outcomesBox] = await Promise.all([
      capabilities.boundingBox(),
      outcomes.boundingBox(),
    ]);
    expect(capabilitiesBox).not.toBeNull();
    expect(outcomesBox).not.toBeNull();
    expect(capabilitiesBox!.y).toBeGreaterThan(outcomesBox!.y);

    const stageMetrics = await stage.evaluate((element) => {
      const style = getComputedStyle(element);
      const channels = style.backgroundColor.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
      return {
        background: style.backgroundColor,
        height: element.getBoundingClientRect().height,
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
        red: channels[0] ?? 0,
        green: channels[1] ?? 0,
        blue: channels[2] ?? 0,
      };
    });
    expect(stageMetrics.background).not.toBe("rgba(0, 0, 0, 0)");
    expect(Math.min(stageMetrics.red, stageMetrics.green, stageMetrics.blue)).toBeGreaterThan(240);
    expect(stageMetrics.height).toBeGreaterThanOrEqual(640);
    expect(stageMetrics.height).toBeLessThanOrEqual(760);
    expect(stageMetrics.scrollHeight).toBeLessThanOrEqual(stageMetrics.clientHeight + 1);
    expect(stageMetrics.scrollWidth).toBeLessThanOrEqual(stageMetrics.clientWidth + 1);

    await stage.click({ position: { x: 20, y: 20 } });
    await expect.poll(() => page.url()).toBe(beforeUrl);
  });

  test("keeps normal light-stage metadata and labels at 4.5 to 1 contrast", async ({ page }) => {
    const { desktop } = await openFeaturedWork(page);
    const stage = desktop.getByTestId("featured-work-stage");
    const { samples } = await featuredWorkContrastSamples(stage, "light-stage");

    for (const sample of samples) {
      expect.soft(
        sample.ratio,
        `${sample.name}: ${sample.foreground} against ${sample.background}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("keeps dark selector titles and active control cues distinguishable", async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem("theme", "dark"));
    const { desktop } = await openFeaturedWork(page);
    await expect(page.locator("html")).toHaveClass(/dark/);
    const selectors = desktop.getByTestId("featured-work-selectors");
    const activeButton = selectors.getByRole("button").first();
    await expect(activeButton).toHaveAttribute("aria-pressed", "true");
    await activeButton.focus();

    const result = await featuredWorkContrastSamples(selectors, "dark-selector");
    expect(result.focusVisible).toBe(true);
    for (const sample of result.samples) {
      const requiredRatio = sample.name.includes("sequence") || sample.name === "selector title" ? 4.5 : 3;
      expect.soft(
        sample.ratio,
        `${sample.name}: ${sample.foreground} against ${sample.background}`,
      ).toBeGreaterThanOrEqual(requiredRatio);
    }
  });

  for (const { viewport, expectedHeight } of stageHeightCases) {
    test(`uses the ${expectedHeight}px stage clamp at ${viewport.width} by ${viewport.height}`, async ({ page }) => {
      const { desktop } = await openFeaturedWork(page, viewport);
      const stage = desktop.getByTestId("featured-work-stage");
      const height = await stage.evaluate((element) => element.getBoundingClientRect().height);

      expect(Math.abs(height - expectedHeight)).toBeLessThanOrEqual(1);
    });
  }

  test("aligns the stage top with the desktop introduction", async ({ page }) => {
    const { desktop } = await openFeaturedWork(page);
    const intro = desktop.getByTestId("featured-work-intro");
    const stage = desktop.getByTestId("featured-work-stage");
    const [introTop, stageTop] = await Promise.all([
      intro.evaluate((element) => element.getBoundingClientRect().top),
      stage.evaluate((element) => element.getBoundingClientRect().top),
    ]);

    expect(Math.abs(introTop - stageTop)).toBeLessThanOrEqual(1);
  });

  test("types the project sequence and title at the slower approved cadence", async ({ page }) => {
    const { desktop } = await openFeaturedWork(page);
    const selectors = desktop.getByTestId("featured-work-selectors");
    const stage = desktop.getByTestId("featured-work-stage");
    const sequence = stage.getByTestId("featured-work-sequence");
    const title = stage.getByTestId("featured-work-title");
    const second = selectors.getByRole("button").nth(1);
    const secondTitle = projectTitle(await second.innerText());

    await waitForProjectReveal(page, desktop, 0);
    await page.clock.install({ time: new Date("2026-08-31T03:39:00-04:00") });
    await second.click();

    await page.clock.runFor(150);
    expect(await sequence.innerText()).toBe("0");
    await page.clock.runFor(50);
    await expect(sequence).toHaveText("02");

    await page.clock.runFor(50);
    expect(await title.innerText()).not.toBe(secondTitle);
    await page.clock.runFor(2_000);
    await expect(title).toHaveText(secondTitle);
  });

  test("selects a project by pointer and keyboard with visible non-color state cues", async ({ page }) => {
    const { desktop } = await openFeaturedWork(page);
    const beforeUrl = page.url();
    const selectors = desktop.getByTestId("featured-work-selectors");
    const stage = desktop.getByTestId("featured-work-stage");
    const content = stage.getByTestId("featured-work-content");
    const buttons = selectors.getByRole("button");
    const first = buttons.nth(0);
    const second = buttons.nth(1);
    const third = buttons.nth(2);
    const initialContent = await content.innerText();

    await expect(first).toHaveAttribute("aria-pressed", "true");
    await second.click();
    await expect(second).toHaveAttribute("aria-pressed", "true");
    await expect(first).toHaveAttribute("aria-pressed", "false");
    await expect.poll(() => content.innerText()).not.toBe(initialContent);

    await expect.poll(async () => {
      const [selectedCue, unselectedCue] = await Promise.all([second, first].map((button) =>
        button.evaluate((element) => {
          const style = getComputedStyle(element);
          return {
            background: style.backgroundColor,
            borderLeftWidth: Number.parseFloat(style.borderLeftWidth),
          };
        }),
      ));
      return selectedCue.borderLeftWidth > unselectedCue.borderLeftWidth
        && selectedCue.background !== unselectedCue.background;
    }).toBe(true);

    await second.focus();
    await page.keyboard.press("Tab");
    await expect(third).toBeFocused();
    expect(await third.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe("none");
    await page.keyboard.press("Space");
    await expect(third).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Shift+Tab");
    await expect(second).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(second).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => page.url()).toBe(beforeUrl);
  });

  test("announces each selection once with a stable full title and hides visual typing", async ({ page }) => {
    const { desktop } = await openFeaturedWork(page);
    const stage = desktop.getByTestId("featured-work-stage");
    const liveRegions = stage.locator('[aria-live="polite"]');
    const announcement = stage.getByTestId("featured-work-announcement");
    const title = stage.getByTestId("featured-work-title");
    const sequence = stage.getByTestId("featured-work-sequence");

    await expect(liveRegions).toHaveCount(1);
    await expect(announcement).toHaveAttribute("aria-atomic", "true");
    await expect(announcement).toHaveText("Project 01 of 03: 网易七鱼智能客服 Agent 功能分析.");
    await expect(title).toHaveAttribute("aria-hidden", "true");
    await expect(sequence).toHaveAttribute("aria-hidden", "true");

    await desktop.getByTestId("featured-work-selectors").getByRole("button").nth(1).click();
    await expect(announcement).toHaveText("Project 02 of 03: 多模态直播高光分析 Agent.");
    await expect(liveRegions).toHaveCount(1);
  });

  test("changes selection without changing the URL or scroll position", async ({ page }) => {
    const { desktop } = await openFeaturedWork(page);
    const second = desktop.getByTestId("featured-work-selectors").getByRole("button").nth(1);
    const announcement = desktop.getByTestId("featured-work-announcement");
    const beforeUrl = page.url();

    const result = await second.evaluate(async (button) => {
      const startY = window.scrollY;
      (button as HTMLButtonElement).click();
      await new Promise<void>((resolve) => window.setTimeout(resolve, 600));
      return { endY: window.scrollY, startY };
    });

    await expect(second).toHaveAttribute("aria-pressed", "true");
    await expect(announcement).toHaveText("Project 02 of 03: 多模态直播高光分析 Agent.");
    expect(result.endY).toBe(result.startY);
    expect(page.url()).toBe(beforeUrl);
  });

  test("cancels a superseded title typing timer after rapid selection", async ({ page }) => {
    const { desktop } = await openFeaturedWork(page);
    const selectors = desktop.getByTestId("featured-work-selectors");
    const stage = desktop.getByTestId("featured-work-stage");
    const title = stage.getByTestId("featured-work-title");
    const buttons = selectors.getByRole("button");
    const secondTitle = projectTitle(await buttons.nth(1).innerText());
    const thirdTitle = projectTitle(await buttons.nth(2).innerText());

    await waitForProjectReveal(page, desktop, 0);
    await page.clock.install({ time: new Date("2026-08-31T03:39:00-04:00") });
    await buttons.nth(1).click();
    await buttons.nth(2).click();
    await page.clock.runFor(2_000);

    await expect(buttons.nth(2)).toHaveAttribute("aria-pressed", "true");
    await expect(title).toContainText(thirdTitle);
    await expect(title).not.toContainText(secondTitle);
  });

  test("renders the selected sequence and title immediately without spatial motion when reduced motion is requested", async ({ page }) => {
    await page.setViewportSize(desktopViewport);
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });

    const desktop = page.locator("#projects").getByTestId("featured-work-desktop");
    await expect(desktop).toBeVisible();
    await desktop.scrollIntoViewIfNeeded();
    const selectors = desktop.getByTestId("featured-work-selectors");
    const stage = desktop.getByTestId("featured-work-stage");
    const title = stage.getByTestId("featured-work-title");
    const content = stage.getByTestId("featured-work-content");
    const firstTitle = projectTitle(await selectors.getByRole("button").first().innerText());

    await expect(title).toContainText(firstTitle);
    const transforms = await content.evaluate(async (element) => {
      const immediate = getComputedStyle(element).transform;
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      return { immediate, nextFrame: getComputedStyle(element).transform };
    });
    expect(transforms).toEqual({ immediate: "none", nextFrame: "none" });
  });

  test("keeps the selected project stable while the page scrolls naturally through the section", async ({ page }) => {
    const { section, desktop } = await openFeaturedWork(page);
    const selectors = desktop.getByTestId("featured-work-selectors");
    const stage = desktop.getByTestId("featured-work-stage");
    const title = stage.getByTestId("featured-work-title");
    const buttons = selectors.getByRole("button");
    const second = buttons.nth(1);
    const secondTitle = projectTitle(await second.innerText());

    await second.click();
    await waitForProjectReveal(page, desktop, 1);

    const structure = await section.evaluate((element) => ({
      parentClass: element.parentElement?.className ?? "",
      parentHeight: element.parentElement?.getBoundingClientRect().height ?? 0,
      sectionHeight: element.getBoundingClientRect().height,
    }));
    expect(structure.parentClass).not.toContain("pin-spacer");
    expect(Math.abs(structure.parentHeight - structure.sectionHeight)).toBeLessThanOrEqual(2);

    await section.evaluate((element) => element.parentElement?.previousElementSibling?.scrollIntoView());
    await page.waitForTimeout(300);
    await section.evaluate((element) => element.parentElement?.nextElementSibling?.scrollIntoView());
    await page.waitForTimeout(300);

    await expect(second).toHaveAttribute("aria-pressed", "true");
    await expect(title).toContainText(secondTitle);
  });

  test("settles the switched second-project content after its reveal", async ({ page }) => {
    const { desktop } = await openFeaturedWork(page);
    const selectors = desktop.getByTestId("featured-work-selectors");
    const stage = desktop.getByTestId("featured-work-stage");
    const title = stage.getByTestId("featured-work-title");
    const content = stage.getByTestId("featured-work-content");
    const second = selectors.getByRole("button").nth(1);
    const secondTitle = projectTitle(await second.innerText());

    await second.click();
    await expect(second).toHaveAttribute("aria-pressed", "true");
    await expect(title).toContainText(secondTitle);
    await expect(content).toHaveCSS("opacity", "1");
    await expect(content).toHaveCSS("transform", "none");
    await waitForProjectReveal(page, desktop, 1);
  });
});

test("keeps the confirmed no-navigation project model below the desktop breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  const section = page.locator("#projects");
  await section.scrollIntoViewIfNeeded();
  const mobile = section.getByTestId("featured-work-mobile");

  await expect(mobile.locator("article")).toHaveCount(3);
  await expect(mobile.getByRole("link")).toHaveCount(0);
  await expect(mobile.getByRole("button")).toHaveCount(0);
  await expect(mobile.getByText(/view all/i)).toHaveCount(0);
});
