import { expect, test, type Locator, type Page } from "@playwright/test";

const desktopViewport = { width: 1440, height: 900 };

async function scrollExperienceTo(page: Page, track: Locator, progress: number) {
  await track.evaluate((element, targetProgress) => {
    const trackElement = element as HTMLElement;
    const absoluteTop = trackElement.getBoundingClientRect().top + window.scrollY;
    const triggerStart = absoluteTop - window.innerHeight * 0.95;
    const triggerEnd = absoluteTop + trackElement.offsetHeight - window.innerHeight * 0.75;
    const target = triggerStart + (triggerEnd - triggerStart) * targetProgress;
    const lenisWindow = window as Window & {
      lenis?: { scrollTo: (position: number, options: { immediate: boolean }) => void };
    };
    lenisWindow.lenis?.scrollTo(target, { immediate: true });
    window.scrollTo(0, target);
  }, progress);
  await page.waitForTimeout(300);
}

async function openDesktopExperience(page: Page, reducedMotion: "no-preference" | "reduce" = "no-preference") {
  await page.setViewportSize(desktopViewport);
  await page.emulateMedia({ colorScheme: "light", reducedMotion });
  await page.goto("/", { waitUntil: "networkidle" });
  const track = page.getByTestId("experience-track");
  await scrollExperienceTo(page, track, 0);
  return { track, stage: track.getByTestId("experience-stage") };
}

async function cardGeometry(track: Locator) {
  return track.getByTestId("experience-card").evaluateAll((cards) => cards.map((card) => {
    const rect = card.getBoundingClientRect();
    return {
      state: (card as HTMLElement).dataset.cardState,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
      transform: getComputedStyle(card).transform,
    };
  }));
}

function firstCardKeyframeProgress(localProgress: number) {
  return (0.5 * localProgress) / (0.5 + 0.024);
}

test.describe("Experience desktop three-column flip", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "Geometry assertions use Chromium rendering.");

  test("reveals the heading and three deep-blue company wordmarks during the entrance", async ({ page }) => {
    const { track, stage } = await openDesktopExperience(page);
    await expect(track.getByTestId("experience-card-front-overlay")).toHaveCount(3);
    const covered = await track.getByTestId("experience-card-front-overlay").evaluateAll((overlays) => overlays.map((overlay) => Number(getComputedStyle(overlay).opacity)));
    expect(covered.every((opacity) => opacity > 0.95)).toBe(true);

    await scrollExperienceTo(page, track, 0.4);
    await expect(stage.getByRole("heading", { name: "工作经历" })).toBeVisible();
    await expect(stage.getByText("工作经历", { exact: true })).toBeVisible();
    await expect(track.getByTestId("experience-card")).toHaveCount(3);
    await expect(track.getByTestId("experience-card-artwork")).toHaveCount(3);
    const revealed = await track.getByTestId("experience-card-front-overlay").evaluateAll((overlays) => overlays.map((overlay) => Number(getComputedStyle(overlay).opacity)));
    expect(revealed.every((opacity) => opacity < 0.05)).toBe(true);
    const backgrounds = await track.getByTestId("experience-card-front").evaluateAll((fronts) => fronts.map((front) => getComputedStyle(front).backgroundImage));
    expect(backgrounds.every((background) => background.includes("rgba(32, 59, 96, 0.92)") && background.includes("rgba(16, 25, 37, 0.98)"))).toBe(true);
    await expect(track.getByTestId("experience-card-artwork").nth(0)).toHaveAttribute("data-artwork", "wordmark-1");
    await expect(track.getByTestId("experience-card-artwork").nth(1)).toHaveAttribute("data-artwork", "wordmark-2");
    await expect(track.getByTestId("experience-card-artwork").nth(2)).toHaveAttribute("data-artwork", "wordmark-3");
  });

  test("uses a 350vh scrubbed track with no scroll lock", async ({ page }) => {
    const { track } = await openDesktopExperience(page);
    expect(await track.evaluate((element) => (element as HTMLElement).offsetHeight)).toBeCloseTo(desktopViewport.height * 3.5, 0);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  });

  test("spreads and flips all cards into visible portrait columns", async ({ page }) => {
    const { track, stage } = await openDesktopExperience(page);
    const opening = await cardGeometry(track);
    await scrollExperienceTo(page, track, 0.84);
    await expect(track).toHaveAttribute("data-phase", "back");
    const cards = await cardGeometry(track);
    expect(cards.map((card) => card.state)).toEqual(["back", "back", "back"]);
    expect(cards.every((card) => card.height > card.width)).toBe(true);
    expect(cards[0].left).toBeLessThan(cards[1].left);
    expect(cards[1].left).toBeLessThan(cards[2].left);
    expect(cards[0].right).toBeLessThanOrEqual(cards[1].left + 1);
    expect(cards[1].right).toBeLessThanOrEqual(cards[2].left + 1);
    expect(cards[0].width).toBeGreaterThan(opening[0].width * 1.35);
    const heading = await stage.getByRole("heading", { name: "工作经历" }).boundingBox();
    expect(heading).not.toBeNull();
    expect(cards.every((card) => card.top > heading!.y + heading!.height)).toBe(true);
    expect(cards.every((card) => card.bottom <= desktopViewport.height)).toBe(true);
    for (const company of ["网易互娱", "bilibili", "姚基金"]) {
      await expect(track.getByRole("heading", { name: company })).toBeVisible();
    }
    await expect(track).not.toContainText("Location One");
    await expect(track).not.toContainText("Location Two");
    await expect(track).not.toContainText("Location Three");
  });

  test("keeps every card populated through the staggered transition", async ({ page }) => {
    const { track } = await openDesktopExperience(page);
    for (const progress of [0.58, 0.68, 0.76, 0.82]) {
      await scrollExperienceTo(page, track, progress);
      await expect(track.getByTestId("experience-card")).toHaveCount(3);
      for (const company of ["网易互娱", "bilibili", "姚基金"]) {
        await expect(track.getByTestId("experience-card").filter({ hasText: company })).toHaveCount(1);
      }
    }
  });

  test("floats subtly from the initial card entrance", async ({ page }) => {
    const { track } = await openDesktopExperience(page);
    await scrollExperienceTo(page, track, 0.2);
    const before = await cardGeometry(track);
    await page.waitForTimeout(700);
    const after = await cardGeometry(track);
    expect(after.some((card, index) => Math.abs(card.top - before[index].top) > 0.2)).toBe(true);
  });

  test("spreads and flips simultaneously across the reference timeline range", async ({ page }) => {
    const { track } = await openDesktopExperience(page);
    await scrollExperienceTo(page, track, 0.5);
    const collapsed = await cardGeometry(track);
    const preFlipY = await track.getByTestId("experience-card").evaluateAll((cards) => cards.map((card) => Math.abs(new DOMMatrix(getComputedStyle(card).transform).m13)));
    expect(preFlipY.every((value) => value < 0.02)).toBe(true);

    await scrollExperienceTo(page, track, 0.66);
    const transitioning = await cardGeometry(track);
    const midFlipY = await track.getByTestId("experience-card").evaluateAll((cards) => cards.map((card) => Math.abs(new DOMMatrix(getComputedStyle(card).transform).m13)));
    expect(transitioning[0].left).toBeLessThan(collapsed[0].left);
    expect(transitioning[2].left).toBeGreaterThan(collapsed[2].left);
    expect(midFlipY.every((value) => value > 0.1)).toBe(true);

    await scrollExperienceTo(page, track, 0.86);
    await expect(track).toHaveAttribute("data-phase", "back");
  });

  test("reaches the reference scale and flip correction keyframes", async ({ page }) => {
    const { track } = await openDesktopExperience(page);
    const firstCard = track.getByTestId("experience-card").first();

    await scrollExperienceTo(page, track, firstCardKeyframeProgress(0.4));
    const scaleAtForty = await firstCard.evaluate((card) => {
      const matrix = new DOMMatrix(getComputedStyle(card).transform);
      return Math.hypot(matrix.m11, matrix.m12, matrix.m13);
    });
    expect(scaleAtForty).toBeCloseTo(0.8, 1);

    await scrollExperienceTo(page, track, firstCardKeyframeProgress(0.75));
    const overshoot = await firstCard.evaluate((card) => {
      const matrix = new DOMMatrix(getComputedStyle(card).transform);
      return { m11: matrix.m11, m13: matrix.m13 };
    });
    expect(overshoot.m11).toBeCloseTo(Math.cos(190 * Math.PI / 180), 1);
    expect(Math.abs(overshoot.m13)).toBeGreaterThan(0.1);

    await scrollExperienceTo(page, track, firstCardKeyframeProgress(0.82));
    const corrected = await firstCard.evaluate((card) => {
      const matrix = new DOMMatrix(getComputedStyle(card).transform);
      return { m11: matrix.m11, m13: matrix.m13 };
    });
    expect(corrected.m11).toBeCloseTo(-1, 1);
    expect(Math.abs(corrected.m13)).toBeLessThan(0.05);
  });

  test("reverses the same timeline to the original stack", async ({ page }) => {
    const { track } = await openDesktopExperience(page);
    const initialOverlays = await track.getByTestId("experience-card-front-overlay").evaluateAll((overlays) => overlays.map((overlay) => Number(getComputedStyle(overlay).opacity)));
    await scrollExperienceTo(page, track, 0.94);
    await scrollExperienceTo(page, track, 0);
    await expect(track).toHaveAttribute("data-phase", "front");
    const returned = await cardGeometry(track);
    const returnedOverlays = await track.getByTestId("experience-card-front-overlay").evaluateAll((overlays) => overlays.map((overlay) => Number(getComputedStyle(overlay).opacity)));
    expect(returned.map((card) => card.state)).toEqual(["front", "front", "front"]);
    expect(returnedOverlays).toEqual(initialOverlays);
    expect(returned.every((card) => card.width < 150)).toBe(true);
  });

  test("keeps the completed backs floating through the handoff after the master timeline ends", async ({ page }) => {
    const { track } = await openDesktopExperience(page);
    await scrollExperienceTo(page, track, 1.005);
    const before = await cardGeometry(track);
    await page.waitForTimeout(700);
    const after = await cardGeometry(track);
    expect(after.some((card, index) => Math.abs(card.top - before[index].top) > 0.2)).toBe(true);
  });

  test("moves the completed card stage upward through the sticky handoff", async ({ page }) => {
    const { track, stage } = await openDesktopExperience(page);
    const stack = track.getByTestId("experience-card-stack");
    await scrollExperienceTo(page, track, 0.8);
    const before = await stack.boundingBox();
    await scrollExperienceTo(page, track, 0.9);
    const after = await stack.boundingBox();

    expect(before).not.toBeNull();
    expect(after).not.toBeNull();
    expect(Math.abs(before!.y + before!.height / 2 - desktopViewport.height / 2)).toBeLessThan(desktopViewport.height * 0.1);
    expect(after!.y).toBeLessThan(before!.y - 1);
    await expect.poll(() => stage.evaluate((element) => element.getBoundingClientRect().top)).toBeCloseTo(0, 0);
  });

  test("shows a slim native scrollbar on desktop", async ({ page }) => {
    await openDesktopExperience(page);
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).scrollbarWidth)).toBe("thin");
  });

  test("finishes the flip before sticky release and carries wheel momentum into Featured Work", async ({ page }) => {
    const { track, stage } = await openDesktopExperience(page);
    const triggerMetrics = await track.evaluate((element) => {
      const trackElement = element as HTMLElement;
      const absoluteTop = trackElement.getBoundingClientRect().top + window.scrollY;
      const triggerStart = absoluteTop - window.innerHeight * 0.95;
      const triggerEnd = absoluteTop + trackElement.offsetHeight - window.innerHeight * 0.75;
      return {
        animationEnd: triggerStart + (triggerEnd - triggerStart) * 0.82,
        stickyRelease: absoluteTop + trackElement.offsetHeight - window.innerHeight,
      };
    });
    expect(triggerMetrics.stickyRelease - triggerMetrics.animationEnd).toBeGreaterThan(0);

    await track.evaluate((element) => {
      const trackElement = element as HTMLElement;
      const absoluteTop = trackElement.getBoundingClientRect().top + window.scrollY;
      const release = absoluteTop + trackElement.offsetHeight - window.innerHeight;
      const lenisWindow = window as Window & {
        lenis?: { scrollTo: (position: number, options: { immediate: boolean }) => void };
      };
      lenisWindow.lenis?.scrollTo(release, { immediate: true });
      window.scrollTo(0, release);
    });
    await page.waitForTimeout(300);
    await expect(track).toHaveAttribute("data-phase", "back");
    await expect.poll(() => stage.evaluate((element) => element.getBoundingClientRect().top)).toBeCloseTo(0, 0);

    const projects = page.locator("#projects");
    const before = await projects.evaluate((element) => element.getBoundingClientRect().top);
    expect(before).toBeGreaterThan(0);
    expect(before).toBeLessThanOrEqual(desktopViewport.height * 0.82);
    await page.mouse.wheel(0, 260);
    await expect.poll(() => projects.evaluate((element) => element.getBoundingClientRect().top)).toBeLessThan(before - 10);
    expect(await stage.evaluate((element) => element.getBoundingClientRect().top)).toBeLessThan(-10);
  });

  test("uses the reference Lenis interpolation without duration override", async ({ page }) => {
    await openDesktopExperience(page);
    const options = await page.evaluate(() => {
      const lenis = (window as Window & { lenis?: { options?: { lerp?: number; duration?: number } } }).lenis;
      return { lerp: lenis?.options?.lerp, duration: lenis?.options?.duration ?? null };
    });
    expect(options).toEqual({ lerp: 0.18, duration: null });
  });

  test("fits the final layout across approved desktop sizes", async ({ page }) => {
    for (const viewport of [{ width: 1024, height: 768 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
      await page.goto("/", { waitUntil: "networkidle" });
      const track = page.getByTestId("experience-track");
      await scrollExperienceTo(page, track, 0.84);
      const heading = await track.getByRole("heading", { name: "工作经历" }).boundingBox();
      const cards = await cardGeometry(track);
      expect(heading, `${viewport.width}x${viewport.height}`).not.toBeNull();
      expect(cards.every((card) => card.top > heading!.y + heading!.height)).toBe(true);
      expect(cards.every((card) => card.bottom <= viewport.height)).toBe(true);
      expect(cards[0].left).toBeGreaterThanOrEqual(0);
      expect(cards[2].right).toBeLessThanOrEqual(viewport.width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    }
  });

  test("rebuilds cleanly when crossing the desktop breakpoint", async ({ page }) => {
    const { track } = await openDesktopExperience(page);
    await scrollExperienceTo(page, track, 0.9);
    await page.setViewportSize({ width: 768, height: 900 });
    await expect(page.getByTestId("experience-mobile-tabs")).toBeVisible();
    await page.setViewportSize(desktopViewport);
    await expect(track).toBeVisible();
    await scrollExperienceTo(page, track, 0.9);
    await expect(track).toHaveAttribute("data-phase", "back");
    await expect(track.getByTestId("experience-card")).toHaveCount(3);
  });

  test("preserves the timeline phase through a desktop resize", async ({ page }) => {
    const { track } = await openDesktopExperience(page);
    await scrollExperienceTo(page, track, 0.66);
    const phase = await track.getAttribute("data-phase");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(400);
    await expect(track).toHaveAttribute("data-phase", phase!);
    await expect(track.getByTestId("experience-card")).toHaveCount(3);
  });

  test("shows static three-column backs for Reduced Motion", async ({ page }) => {
    const { track } = await openDesktopExperience(page, "reduce");
    await expect(track).toHaveAttribute("data-phase", "back");
    const initial = await cardGeometry(track);
    expect(initial.map((card) => card.state)).toEqual(["back", "back", "back"]);
    await scrollExperienceTo(page, track, 0.8);
    const later = await cardGeometry(track);
    expect(later.map((card) => card.transform)).toEqual(initial.map((card) => card.transform));
    for (const company of ["网易互娱", "bilibili", "姚基金"]) {
      await expect(track.getByRole("heading", { name: company })).toBeVisible();
    }
  });
});

test("retains the existing Tabs below the desktop breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/", { waitUntil: "networkidle" });
  const section = page.getByTestId("experience-section");
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByTestId("experience-track")).toBeHidden();
  await expect(section.getByRole("tab")).toHaveCount(3);
  await section.getByRole("tab", { name: /bilibili/ }).click();
  await expect(section.getByTestId("experience-mobile-panel")).toContainText("赛事版权");
  await expect(section.getByTestId("experience-mobile-panel")).toContainText("2026.5-2026.7");
});

test("allows direct navigation to Featured Work without changing the URL", async ({ page }) => {
  await page.setViewportSize(desktopViewport);
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "networkidle" });
  const initialUrl = page.url();
  const projects = page.locator("#projects");
  await projects.scrollIntoViewIfNeeded();
  await expect.poll(() => projects.evaluate((element) => element.getBoundingClientRect().top)).toBeLessThan(desktopViewport.height);
  expect(page.url()).toBe(initialUrl);
});
