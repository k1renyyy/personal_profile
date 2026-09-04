# Experience Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and mount the desktop, light-theme Experience master-detail design with three accessible vertical tabs, placeholder copy, a single animated detail panel, and Playwright coverage.

**Architecture:** Keep the current page, routing, Tailwind, `ScrollSection`, and static-export architecture intact. Add one local shadcn-style wrapper around Radix Tabs, replace only the internal implementation of `Experience`, and mount it in the existing home-page section sequence. Keep temporary display data local to the Experience component so a later Sanity query can replace the array without changing the visual component contract.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, `@radix-ui/react-tabs`, `framer-motion`, existing `useHydrationSafeReducedMotion`, Playwright

**Spec:** `docs/superpowers/specs/2026-08-31-experience-redesign-design.md`

## Global Constraints

- Do not change the existing Next.js App Router, React, Tailwind CSS, page routing, global layout, or static-export approach.
- Do not modify another page section's DOM, styles, scrolling, motion, or content.
- Preserve `ScrollSection` as the sole owner of the whole-section GSAP entrance animation.
- Remove Experience-internal GSAP; no Experience detail node may have `opacity` or `transform` controlled by both GSAP and Framer Motion.
- Use placeholder company, role, location, date, summary, and highlight copy only.
- Do not use the existing real Experience draft, the supplied company logos, or temporary download paths.
- Do not add a Sanity schema, query, client call, adapter, asynchronous state, or CMS-specific type.
- V1 acceptance covers light theme at `1024 × 768`, `1440 × 900`, and `1920 × 1080` only.
- Do not implement the later mobile horizontal-tabs design or dark-theme styling in this plan.
- Do not animate detail-panel height or change the URL/scroll position on selection.
- Use `framer-motion`; do not add new imports from `motion/react` in Experience.
- Keep every dependency and selector scoped to Experience or the local Tabs primitive.

## File Map

- `package.json`: add the exact Radix Tabs runtime dependency.
- `package-lock.json`: lock the installed Radix Tabs dependency and transitive versions.
- `docs/baseline/experience-redesign/pre-implementation/`: retain the pre-change commit, verification output, and three desktop screenshots used to prove rollback parity.
- `components/ui/tabs.tsx`: expose the project's local shadcn-style Tabs primitive without Experience-specific visual styling.
- `app/components/sections/experience.tsx`: own the placeholder display contract, three placeholder items, desktop layout, Logo fallback, active-state visuals, single panel, and Framer Motion transition.
- `app/page.tsx`: dynamically import and mount Experience at the already reserved location before Projects.
- `tests/experience.spec.ts`: verify the desktop/light layout, unique panel, pointer and keyboard selection, fallback Logo, URL/scroll stability, and reduced motion.
- `tests/experience.spec.ts-snapshots/`: store Chromium reference images generated only after visual review of all three approved desktop viewports.

---

### Task 1: Capture the pre-implementation rollback baseline

**Files:**
- Create: `docs/baseline/experience-redesign/pre-implementation/baseline-commit.txt`
- Create: `docs/baseline/experience-redesign/pre-implementation/verification.txt`
- Create: `docs/baseline/experience-redesign/pre-implementation/home-1024x768.png`
- Create: `docs/baseline/experience-redesign/pre-implementation/home-1440x900.png`
- Create: `docs/baseline/experience-redesign/pre-implementation/home-1920x1080.png`

**Interfaces:**
- Consumes: the untouched home page where Experience remains commented out and the current branch HEAD before implementation.
- Produces: an exact rollback anchor plus build, browser-regression, and visual evidence for the original visible page.

- [ ] **Step 1: Confirm the branch and preserve the exact rollback anchor**

Run:

```bash
mkdir -p docs/baseline/experience-redesign/pre-implementation
git status --short --branch
git rev-parse HEAD | tee docs/baseline/experience-redesign/pre-implementation/baseline-commit.txt
```

Expected: branch is `codex/experience-project-design`; only the two pre-existing project-local skill directories may be untracked; the text file contains the full commit hash immediately before implementation begins.

- [ ] **Step 2: Build and run the unmodified browser suite**

Run:

```bash
{
  npm run build
  npm run test:e2e
} 2>&1 | tee docs/baseline/experience-redesign/pre-implementation/verification.txt
```

Expected: the production build succeeds and the existing Playwright suite passes before any dependency, component, page, or test file is changed. Stop implementation if either command fails; diagnose the baseline failure separately rather than attributing it to Experience.

- [ ] **Step 3: Start the built baseline in a dedicated terminal**

Run in terminal A:

```bash
npm run start
```

Expected: the static export is served at `http://127.0.0.1:3000`. Keep this terminal running only through Step 4.

- [ ] **Step 4: Capture the original visible home page at all approved desktop viewports**

Run in terminal B:

```bash
npx playwright screenshot --browser=chromium --viewport-size="1024,768" --full-page http://127.0.0.1:3000/ docs/baseline/experience-redesign/pre-implementation/home-1024x768.png
npx playwright screenshot --browser=chromium --viewport-size="1440,900" --full-page http://127.0.0.1:3000/ docs/baseline/experience-redesign/pre-implementation/home-1440x900.png
npx playwright screenshot --browser=chromium --viewport-size="1920,1080" --full-page http://127.0.0.1:3000/ docs/baseline/experience-redesign/pre-implementation/home-1920x1080.png
```

Expected: three PNG files show the current page with no Experience section between Stats and Projects. Stop terminal A after capture.

- [ ] **Step 5: Inspect and commit the rollback evidence**

Open all three PNGs at 100% scale. Confirm they are readable, use the current page state, and contain no browser error page. Then run:

```bash
git add docs/baseline/experience-redesign/pre-implementation/
git commit -m "test: capture pre-experience baseline"
```

This evidence commit is intentionally part of the later full-revert range; the hash stored in `baseline-commit.txt` remains the exact pre-implementation destination.

---

### Task 2: Add the local Radix Tabs primitive

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `components/ui/tabs.tsx`

**Interfaces:**
- Consumes: `cn(...inputs: ClassValue[]): string` from `lib/utils.ts` and Radix Tabs component props.
- Produces: `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` React components with `data-slot` attributes and forwarded Radix props.

- [ ] **Step 1: Confirm the dependency is absent before changing the lockfile**

Run:

```bash
npm ls @radix-ui/react-tabs
```

Expected: non-zero exit with `(empty)` because the dependency is not installed yet.

- [ ] **Step 2: Install the exact Radix Tabs package through npm**

Run:

```bash
npm install @radix-ui/react-tabs@^1.1.13
```

Expected: `package.json` contains `"@radix-ui/react-tabs": "^1.1.13"`, `package-lock.json` records the resolved package, and npm completes without an install error.

- [ ] **Step 3: Create the unstyled local primitive**

Create `components/ui/tabs.tsx` with this complete public surface:

```tsx
"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
```

Do not copy shadcn's default pill, rounded panel, shadow, grid, dark-theme, or orientation classes into this primitive. Experience owns its local presentation.

- [ ] **Step 4: Verify the primitive type-checks inside the production build**

Run:

```bash
npm run build
```

Expected: build succeeds; there are no missing Radix modules, invalid ref types, or static-export errors.

- [ ] **Step 5: Commit the dependency and primitive together**

```bash
git add package.json package-lock.json components/ui/tabs.tsx
git commit -m "feat: add accessible tabs primitive"
```

---

### Task 3: Mount the Experience skeleton and establish the layout contract

**Files:**
- Modify: `app/components/sections/experience.tsx`
- Modify: `app/page.tsx`
- Create: `tests/experience.spec.ts`

**Interfaces:**
- Consumes: Task 2 exports `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent`; existing `ScrollSection` wrapping behavior in `app/page.tsx`.
- Produces: default export `Experience(): JSX.Element`, root test id `experience-section`, layout test id `experience-layout`, list test id `experience-tabs`, and panel test id `experience-panel`.

- [ ] **Step 1: Write a failing desktop structure test**

Create `tests/experience.spec.ts`:

```ts
import { expect, test, type Page } from "@playwright/test";

async function openExperience(
  page: Page,
  viewport = { width: 1440, height: 900 },
) {
  await page.setViewportSize(viewport);
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/", { waitUntil: "networkidle" });
  const section = page.getByTestId("experience-section");
  await section.scrollIntoViewIfNeeded();
  await expect(section).toBeVisible();
  return section;
}

test.describe("Experience desktop design", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "Desktop design assertions use pinned Chromium.");

  test("mounts three vertical tabs and one default detail panel", async ({ page }) => {
    const section = await openExperience(page);
    await expect(section.getByRole("heading", { name: "EXPERIENCE" })).toBeVisible();
    await expect(section.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
    await expect(section.getByRole("tab")).toHaveCount(3);
    await expect(section.getByRole("tab", { name: /Company One/ })).toHaveAttribute("aria-selected", "true");
    await expect(section.getByRole("tabpanel")).toHaveCount(1);
    await expect(section.getByTestId("experience-panel")).toContainText("Role One");

    const tabsBox = await section.getByTestId("experience-tabs").boundingBox();
    expect(tabsBox?.width).toBeCloseTo(320, 0);
  });
});
```

- [ ] **Step 2: Run the structure test and confirm it fails for the right reason**

Run:

```bash
npm run build && npx playwright test tests/experience.spec.ts --project=chromium
```

Expected: test fails because `experience-section` never becomes visible; the current page has Experience commented out.

- [ ] **Step 3: Replace the current example data with the local display contract**

At the top of `app/components/sections/experience.tsx`, remove GSAP, ScrollTrigger, Lucide icons, `useEffect`, and `useRef`. Define exactly this local contract and placeholder array:

```tsx
type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  location: string;
  dateRange: string;
  summary: string;
  highlights: string[];
  logo?: {
    src: string;
    alt: string;
  };
};

const experiences: ExperienceItem[] = [
  {
    id: "company-one",
    company: "Company One",
    role: "Role One",
    location: "Location One",
    dateRange: "20XX — Present",
    summary: "Placeholder summary describing the scope and focus of this experience.",
    highlights: [
      "Placeholder achievement describing a representative responsibility.",
      "Placeholder achievement demonstrating a measurable contribution.",
      "Placeholder achievement showing collaboration and decision support.",
    ],
  },
  {
    id: "company-two",
    company: "Company Two",
    role: "Role Two With a Longer Title",
    location: "Location Two",
    dateRange: "20XX — 20XX",
    summary: "Placeholder summary with enough copy to verify natural panel height and readable line length across desktop viewports.",
    highlights: [
      "Placeholder achievement covering research and synthesis.",
      "Placeholder achievement covering planning and prioritization.",
      "Placeholder achievement covering delivery and review.",
      "Placeholder achievement covering an additional outcome.",
    ],
  },
  {
    id: "company-three",
    company: "Company Three",
    role: "Role Three",
    location: "Location Three",
    dateRange: "20XX — 20XX",
    summary: "Placeholder summary for the third experience item.",
    highlights: [
      "Placeholder achievement for the third experience.",
      "Placeholder achievement confirming variable list length.",
    ],
  },
];
```

The strings must remain visibly generic. Do not import `lib/content/types.ts`, `lib/content/sanity-query.ts`, or the generated content draft.

- [ ] **Step 4: Implement the static desktop hierarchy before motion**

Use Task 2's primitives to implement the component with controlled state:

```tsx
const [activeId, setActiveId] = React.useState(experiences[0].id);
const activeExperience = experiences.find((item) => item.id === activeId) ?? experiences[0];

return (
  <section
    data-testid="experience-section"
    aria-labelledby="experience-heading"
    className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-28"
  >
    <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-44">
      <header className="mb-10 flex items-end gap-4 border-b border-border pb-5 lg:mb-14">
        <h2 id="experience-heading" className="text-[clamp(2.5rem,6vw,6rem)] font-black uppercase leading-none tracking-tight text-foreground">
          EXPERIENCE
        </h2>
        <span className="pb-1 font-mono text-xs uppercase tracking-[0.28em] text-foreground/45">
          工作经历
        </span>
      </header>

      <Tabs
        data-testid="experience-layout"
        value={activeId}
        onValueChange={setActiveId}
        orientation="vertical"
        activationMode="automatic"
        className="grid grid-cols-[320px_minmax(0,1fr)] gap-8 xl:gap-20"
      >
        <TabsList data-testid="experience-tabs" aria-label="Experience companies" className="flex w-80 flex-col">
          {experiences.map((experience, index) => (
            <TabsTrigger key={experience.id} value={experience.id} className="group relative grid min-h-24 w-full grid-cols-[48px_minmax(0,1fr)] items-center gap-4 border-l-2 border-transparent px-5 py-4 text-left outline-none transition-colors hover:bg-foreground/[0.035] focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=active]:border-foreground data-[state=active]:bg-foreground/[0.055]">
              <span aria-hidden="true" className="flex size-12 items-center justify-center border border-border bg-background font-mono text-sm font-semibold text-foreground/55">
                {experience.company.slice(0, 1)}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-3 text-base font-semibold text-foreground">
                  <span className="size-1.5 shrink-0 rounded-full border border-foreground/35 bg-transparent group-data-[state=active]:border-foreground group-data-[state=active]:bg-foreground" aria-hidden="true" />
                  {experience.company}
                </span>
                <span className="mt-1 block pl-[18px] font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/45">
                  {experience.dateRange}
                </span>
              </span>
              <span className="sr-only">Experience {String(index + 1).padStart(2, "0")}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="min-w-0">
          <TabsContent value={activeExperience.id} forceMount>
            <article data-testid="experience-panel" className="max-w-4xl">
              <h3 className="text-[clamp(2rem,4vw,4.5rem)] font-black leading-[0.95] tracking-tight text-foreground">
                {activeExperience.role}
              </h3>
              <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-foreground/50">
                {activeExperience.company} · {activeExperience.location} · {activeExperience.dateRange}
              </p>
              <p className="mt-8 max-w-3xl text-base leading-8 text-foreground/68">
                {activeExperience.summary}
              </p>
              <ol className="mt-10 border-t border-border">
                {activeExperience.highlights.map((highlight, index) => (
                  <li key={`${activeExperience.id}-${index}`} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-5 border-b border-border py-6 last:border-b-0">
                    <span aria-hidden="true" className="font-mono text-xs tracking-[0.18em] text-foreground/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="max-w-3xl text-base leading-7 text-foreground/75">{highlight}</p>
                  </li>
                ))}
              </ol>
            </article>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  </section>
);
```

Import React as `import * as React from "react";`. Do not add `min-width` to the two-column grid: at `1024px`, the existing container provides approximately `864px` after its desktop side padding, so the layout must use a `320px` left track, a `32px` gap, and a shrinking `minmax(0, 1fr)` detail track without clipping. Do not treat the page's `overflow-x-hidden` as a fix for an oversized child. Do not add a mobile selector or dark-theme variants.

- [ ] **Step 5: Mount Experience in the reserved home-page position**

In `app/page.tsx`, add:

```tsx
const Experience = dynamic(() => import("./components/sections/experience"));
```

Replace the existing commented line with:

```tsx
<ScrollSection>
  <Experience />
</ScrollSection>
```

Keep it between Stats and Projects. Do not move, wrap, or edit any neighboring section.

- [ ] **Step 6: Run the focused test and inspect the mounted section**

Run:

```bash
npm run build && npx playwright test tests/experience.spec.ts --project=chromium
```

Expected: the test passes with three tabs, only Company One selected, one mounted tabpanel, and a `320px` tabs column.

- [ ] **Step 7: Commit the static Experience layout**

```bash
git add app/components/sections/experience.tsx app/page.tsx tests/experience.spec.ts
git commit -m "feat: add experience master detail layout"
```

---

### Task 4: Add selection, keyboard, fallback, and navigation-stability coverage

**Files:**
- Modify: `app/components/sections/experience.tsx`
- Modify: `tests/experience.spec.ts`

**Interfaces:**
- Consumes: Task 3 test ids, the controlled `activeId` state, and `ExperienceItem`.
- Produces: Logo helper `ExperienceLogo({ item }: { item: ExperienceItem }): JSX.Element`, stable fallback test id `experience-logo-fallback`, and accessible Radix selection behavior.

- [ ] **Step 1: Add failing behavioral tests**

Append inside the existing `test.describe` block:

```ts
test("switches one panel by click and vertical keyboard navigation", async ({ page }) => {
  const section = await openExperience(page);
  const first = section.getByRole("tab", { name: /Company One/ });
  const second = section.getByRole("tab", { name: /Company Two/ });
  const third = section.getByRole("tab", { name: /Company Three/ });

  await second.click();
  await expect(second).toHaveAttribute("aria-selected", "true");
  await expect(section.getByRole("tabpanel")).toHaveCount(1);
  await expect(section.getByTestId("experience-panel")).toContainText("Role Two With a Longer Title");

  await second.press("ArrowDown");
  await expect(third).toHaveAttribute("aria-selected", "true");
  await third.press("Home");
  await expect(first).toHaveAttribute("aria-selected", "true");
  await first.press("End");
  await expect(third).toHaveAttribute("aria-selected", "true");
});

test("keeps URL, scroll position, visible names, and fallback logos stable", async ({ page }) => {
  const section = await openExperience(page);
  const beforeUrl = page.url();
  const beforeScroll = await page.evaluate(() => window.scrollY);

  await expect(section.getByTestId("experience-logo-fallback")).toHaveCount(3);
  for (const company of ["Company One", "Company Two", "Company Three"]) {
    await expect(section.getByRole("tab", { name: new RegExp(company) })).toContainText(company);
  }

  await section.getByRole("tab", { name: /Company Three/ }).click();
  expect(page.url()).toBe(beforeUrl);
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - beforeScroll)).toBeLessThanOrEqual(1);
});
```

- [ ] **Step 2: Run the behavioral tests and verify the fallback assertion fails**

Run:

```bash
npx playwright test tests/experience.spec.ts --project=chromium
```

Expected: the Logo fallback test fails because Task 3 has not added `experience-logo-fallback`; the Radix click and keyboard assertions already pass.

- [ ] **Step 3: Add a narrowly scoped Logo helper**

Add this helper above the default export in `experience.tsx`:

```tsx
function ExperienceLogo({ item }: { item: ExperienceItem }) {
  const [failed, setFailed] = React.useState(false);

  if (!item.logo || failed) {
    return (
      <span
        data-testid="experience-logo-fallback"
        aria-hidden="true"
        className="flex size-12 items-center justify-center border border-border bg-background font-mono text-sm font-semibold text-foreground/55"
      >
        {item.company.slice(0, 1)}
      </span>
    );
  }

  return (
    // A native img exposes onError without adding a new image-loader contract for temporary content.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.logo.src}
      alt={item.logo.alt}
      className="size-12 border border-border bg-background object-contain p-1.5"
      onError={() => setFailed(true)}
    />
  );
}
```

Replace the inline initial box in each trigger with:

```tsx
<ExperienceLogo item={experience} />
```

All three temporary records intentionally omit `logo`, so the design is evaluated with neutral fallbacks. The failure branch remains available when later data supplies a broken URL. Do not add an official asset in this task.

- [ ] **Step 4: Run the focused tests**

Run:

```bash
npx playwright test tests/experience.spec.ts --project=chromium
```

Expected: all structure, click, keyboard, fallback, URL, and scroll assertions pass.

- [ ] **Step 5: Commit behavior and fallback together**

```bash
git add app/components/sections/experience.tsx tests/experience.spec.ts
git commit -m "test: cover experience tab behavior"
```

---

### Task 5: Add the single-panel transition and reduced-motion behavior

**Files:**
- Modify: `app/components/sections/experience.tsx`
- Modify: `tests/experience.spec.ts`

**Interfaces:**
- Consumes: controlled `activeId`, `activeExperience`, and `useHydrationSafeReducedMotion(): boolean`.
- Produces: one keyed Framer Motion article with `data-reduce-motion="true|false"` and no animated height.

- [ ] **Step 1: Add a failing reduced-motion contract test**

Append inside `test.describe`:

```ts
test("removes spatial movement when reduced motion is requested", async ({ page }) => {
  const section = await openExperience(page);
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  const panel = section.getByTestId("experience-panel");

  await expect(panel).toHaveAttribute("data-reduce-motion", "true");
  await section.getByRole("tab", { name: /Company Two/ }).click();
  await expect(section.getByTestId("experience-panel")).toContainText("Role Two With a Longer Title");
  await expect(section.getByRole("tabpanel")).toHaveCount(1);
});
```

- [ ] **Step 2: Run the reduced-motion test and confirm the missing contract**

Run:

```bash
npx playwright test tests/experience.spec.ts --project=chromium -g "reduced motion"
```

Expected: failure because `experience-panel` does not have `data-reduce-motion`.

- [ ] **Step 3: Add Framer Motion without giving it panel-height ownership**

Add imports:

```tsx
import { AnimatePresence, motion } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/app/hooks/use-hydration-safe-reduced-motion";
```

Inside `Experience`, add:

```tsx
const reduceMotion = useHydrationSafeReducedMotion();
```

Replace the static `TabsContent`/article portion with:

```tsx
<TabsContent value={activeExperience.id} forceMount>
  <AnimatePresence mode="wait" initial={false}>
    <motion.article
      key={activeExperience.id}
      data-testid="experience-panel"
      data-reduce-motion={String(reduceMotion)}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-4xl"
    >
      <h3 className="text-[clamp(2rem,4vw,4.5rem)] font-black leading-[0.95] tracking-tight text-foreground">
        {activeExperience.role}
      </h3>
      <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-foreground/50">
        {activeExperience.company} · {activeExperience.location} · {activeExperience.dateRange}
      </p>
      <p className="mt-8 max-w-3xl text-base leading-8 text-foreground/68">
        {activeExperience.summary}
      </p>
      <ol className="mt-10 border-t border-border">
        {activeExperience.highlights.map((highlight, index) => (
          <li
            key={`${activeExperience.id}-${index}`}
            className="grid grid-cols-[3rem_minmax(0,1fr)] gap-5 border-b border-border py-6 last:border-b-0"
          >
            <span
              aria-hidden="true"
              className="font-mono text-xs tracking-[0.18em] text-foreground/40"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="max-w-3xl text-base leading-7 text-foreground/75">
              {highlight}
            </p>
          </li>
        ))}
      </ol>
    </motion.article>
  </AnimatePresence>
</TabsContent>
```

Do not add `layout`, `layoutId`, CSS height transitions, `min-height`, `position: absolute`, or GSAP calls.

- [ ] **Step 4: Run all Experience tests**

Run:

```bash
npx playwright test tests/experience.spec.ts --project=chromium
```

Expected: all tests pass; after every selection exactly one tabpanel and one `experience-panel` are present.

- [ ] **Step 5: Verify no internal animation ownership conflict was introduced**

Run:

```bash
rg -n "gsap|ScrollTrigger|motion/react|layoutId|\blayout=" app/components/sections/experience.tsx
```

Expected: no matches. The file may import only `framer-motion` for motion.

- [ ] **Step 6: Commit the transition**

```bash
git add app/components/sections/experience.tsx tests/experience.spec.ts
git commit -m "feat: animate experience detail switching"
```

---

### Task 6: Lock the approved desktop/light visual matrix, prove rollback safety, and run regressions

**Files:**
- Modify: `tests/experience.spec.ts`
- Create: `tests/experience.spec.ts-snapshots/experience-1024x768-chromium-darwin.png`
- Create: `tests/experience.spec.ts-snapshots/experience-1440x900-chromium-darwin.png`
- Create: `tests/experience.spec.ts-snapshots/experience-1920x1080-chromium-darwin.png`

**Interfaces:**
- Consumes: `openExperience`, stable Experience test ids, and the complete Task 5 design.
- Produces: three reviewed Chromium visual baselines and the final desktop overflow/layout regression test.

- [ ] **Step 1: Add the desktop viewport and screenshot test**

Append inside `test.describe`:

```ts
for (const viewport of [
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const) {
  test(`matches the light desktop design at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    const section = await openExperience(page, viewport);
    const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(pageWidth).toBe(viewport.width);

    const tabsBox = await section.getByTestId("experience-tabs").boundingBox();
    const layoutBox = await section.getByTestId("experience-layout").boundingBox();
    const panelBox = await section.getByTestId("experience-panel").boundingBox();
    expect(tabsBox?.width).toBeCloseTo(320, 0);
    expect(panelBox?.x ?? 0).toBeGreaterThan((tabsBox?.x ?? 0) + (tabsBox?.width ?? 0));
    expect((layoutBox?.x ?? 0) + (layoutBox?.width ?? 0)).toBeLessThanOrEqual(viewport.width);
    expect((panelBox?.x ?? 0) + (panelBox?.width ?? 0)).toBeLessThanOrEqual(viewport.width);

    await expect(section).toHaveScreenshot(
      `experience-${viewport.width}x${viewport.height}.png`,
      { animations: "disabled" },
    );
  });
}
```

- [ ] **Step 2: Run the visual test and confirm baselines are missing**

Run:

```bash
npx playwright test tests/experience.spec.ts --project=chromium -g "matches the light desktop design"
```

Expected: three failures reporting missing snapshots. Inspect the generated actual images before accepting any baseline.

- [ ] **Step 3: Generate candidate Chromium baselines**

Run:

```bash
npx playwright test tests/experience.spec.ts --project=chromium -g "matches the light desktop design" --update-snapshots
```

Expected: three macOS Chromium PNGs are created under `tests/experience.spec.ts-snapshots/` and the focused run passes.

- [ ] **Step 4: Review all three images rather than accepting them mechanically**

Open each generated PNG and verify:

- the page uses the light background;
- the header precedes the two columns;
- the left column is visually `320px` and all three company names/dates are readable;
- the first item shows line, dot, and background active cues;
- the right side contains exactly one role, metadata row, summary, and numbered list;
- the numbered list uses a separate number column and has no final divider;
- no content clips or overlaps at any approved viewport;
- no adjacent section has changed styling.

If an image fails any item, adjust only `experience.tsx`, rerun the full focused Experience suite, and regenerate all three candidates. Do not update a snapshot merely to hide a regression.

- [ ] **Step 5: Run strict repository verification**

Run in order:

```bash
npm run lint -- --max-warnings=0
npm audit --audit-level=low
npm run build
npm run test:e2e
```

Expected: lint has zero warnings, audit reports no vulnerability at low or higher severity, production build succeeds, and the complete Playwright suite passes in Chromium, Firefox, and WebKit. Existing mobile and dark-theme baseline tests must remain operational even though Experience-specific V1 assertions are desktop/light only.

- [ ] **Step 6: Inspect the final surgical diff**

Run:

```bash
git status --short
git diff --check
git diff --stat
git diff -- app/components/sections/experience.tsx app/page.tsx components/ui/tabs.tsx tests/experience.spec.ts package.json package-lock.json
```

Expected: only the planned Experience, local primitive, dependency, tests, and snapshot files are part of implementation. The two project-local skill directories and unrelated user files remain untouched unless they were committed separately before execution.

- [ ] **Step 7: Commit the reviewed visual baselines and final test**

```bash
git add tests/experience.spec.ts tests/experience.spec.ts-snapshots/
git commit -m "test: lock experience desktop design"
```

- [ ] **Step 8: Record final evidence for handoff**

Run:

```bash
git status --short --branch
git log --oneline -5
```

Expected: the branch contains the seven focused implementation commits from this plan; the only remaining untracked paths are pre-existing user-owned paths not included in this work. Report the exact verification commands and results without claiming mobile or dark Experience completion.

---

## Rollback Runbook

Use rollback only after resolving the exact target with the baseline file and `git log`. Never use `git reset --hard`, `git checkout --`, or delete a worktree to recover this design.

### Level 1: Emergency visual containment

Use this when Experience is visibly broken but retaining its dormant component, tests, and dependency is acceptable temporarily.

1. In `app/page.tsx`, remove only:

```tsx
const Experience = dynamic(() => import("./components/sections/experience"));
```

2. Replace only the mounted block between Stats and Projects:

```tsx
<ScrollSection>
  <Experience />
</ScrollSection>
```

with the original inert marker:

```tsx
{/* <ScrollSection><Experience /></ScrollSection> */}
```

3. Verify and commit containment:

```bash
npm run lint -- --max-warnings=0
npm run build
npx playwright test tests/baseline.spec.ts
git add app/page.tsx
git commit -m "fix: disable experience redesign"
```

This restores the original visible section sequence immediately. The unused Experience implementation and Radix dependency remain inert and can be removed in the complete rollback.

### Level 2: Complete recoverable rollback

Use this only when abandoning all seven implementation commits and when the read-only log proves no unrelated commit exists after the recorded baseline.

1. Resolve and inspect the exact range:

```bash
experience_baseline_commit=$(tr -d '\n' < docs/baseline/experience-redesign/pre-implementation/baseline-commit.txt)
git status --short --branch
git log --oneline "${experience_baseline_commit}..HEAD"
git diff --name-status "${experience_baseline_commit}..HEAD"
```

Expected before continuing: the range contains only the baseline-evidence commit and the seven Experience implementation/test commits from this plan. If it contains any unrelated work, stop and revert the known Experience commit hashes individually from newest to oldest.

2. Create recoverable revert commits for the validated range:

```bash
git revert --no-edit "${experience_baseline_commit}..HEAD"
```

3. Prove that tracked implementation state matches the pre-change anchor:

```bash
git diff --exit-code "${experience_baseline_commit}" -- package.json package-lock.json components/ui/tabs.tsx app/components/sections/experience.tsx app/page.tsx tests/experience.spec.ts tests/experience.spec.ts-snapshots docs/baseline/experience-redesign
npm run lint -- --max-warnings=0
npm run build
npm run test:e2e
```

Expected: the scoped Git diff is empty, the Radix dependency and new Tabs primitive are gone, `app/page.tsx` again contains the original commented Experience marker, and the complete pre-existing quality gates pass.
