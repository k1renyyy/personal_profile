# Featured Work Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the desktop home Featured Work image gallery with the approved four-project warm-gray text selector and stage while preserving the repository architecture and global interactions.

**Architecture:** Keep `Projects` as the owner of active index and the existing GSAP ScrollTrigger. Replace only the desktop child presentation, keep text transition motion on inner nodes, and use local placeholder display data so later Sanity content can replace it without changing layout. Existing project data and routes remain untouched.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS 4, GSAP ScrollTrigger, Framer Motion, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-31-featured-work-redesign-design.md`

## Global Constraints

- Desktop/light V1 only; do not redesign mobile or dark theme.
- Preserve Next.js, React, Tailwind, static export, `ScrollSection`, global tokens/scroll, Shoot Mode, adjacent sections, and routes.
- Do not add dependencies or modify existing project facts, images, or route behavior.
- Use four neutral placeholder projects in the home Featured Work desktop design.
- Stage height is exactly `clamp(700px, 84vh, 900px)`.
- Do not merge, push, or replace content with Sanity data.

---

### Task 1: Lock baseline and write failing Featured Work contract tests

**Files:**
- Create: `docs/baseline/featured-work-redesign/pre-implementation/baseline-commit.txt`
- Create: `docs/baseline/featured-work-redesign/pre-implementation/verification.txt`
- Create: `tests/featured-work.spec.ts`

**Interfaces:**
- Consumes: current `#projects`, Phase 4 SHA `4729cba`, rollback SHA `1042c20c11beacdb8323807b9ebf5caf65de7d22`.
- Produces: stable test IDs `featured-work-desktop`, `featured-work-selectors`, `featured-work-stage`, `featured-work-article`, `featured-work-title`, and `featured-work-content`.

- [x] Record branch, status, ancestor/divergence checks, rollback SHA, screenshots, and successful pre-change build in the two baseline text files.
- [x] Add Chromium desktop tests asserting four visible named selector buttons, no selector images, no `View all`, a single visible article, warm-gray stage, height bounds, no internal overflow, and unchanged URL.
- [x] Add selection tests for pointer, keyboard focus/activation, `aria-pressed`, visible non-color selected cues, and stage content change.
- [x] Add fake-clock typing cancelation and reduced-motion immediate-render tests; install the fake clock only after initial reveal settles.
- [x] Add scrub synchronization and switched-state screenshot assertions without mutating DOM/styles/scroll immediately before capture.
- [x] Run `npx playwright test tests/featured-work.spec.ts --project=chromium` and record the expected failures caused by missing redesign selectors/stage.
- [x] Commit only Task 1 files with `test: lock featured work redesign contract`.

### Task 2: Implement the desktop selector and warm-gray project stage

**Files:**
- Modify: `app/components/sections/projects.tsx`
- Test: `tests/featured-work.spec.ts`

**Interfaces:**
- Consumes: Task 1 IDs and existing `activeIndex`, `scrollToProject`, `viewportRef`, `trackRef`, and ScrollTrigger ownership.
- Produces: local `FeaturedProject` placeholder contract, four selectors, one visible article, cancelable typewriter, synchronized progress, and unchanged desktop pin.

- [x] Run the focused test once and confirm it remains RED before production edits.
- [x] Remove desktop-only `Image` rendering and stacked-track wiring made unused by this change. Retain the existing link/navigation, transition portal, and route-lock code exclusively for the deferred below-`lg` fallback.
- [x] Add four local neutral placeholder entries with `id`, `title`, `type`, `role`, `year`, `summary`, `outcomes`, and `capabilities`; do not copy repository project content.
- [x] Render left buttons as sequence + title + dot with `aria-pressed`, focus-visible ring, left-border/background selected cues, and `scrollToProject(index)`.
- [x] Render one warm-gray stage with `height: clamp(700px, 84vh, 900px)`, one visible article, ordered text hierarchy, numbered outcomes, tags, progress bars, and approved hint.
- [x] Implement cancelable sequence/title typing and simultaneous content entry; reduced motion immediately shows full text and removes spatial movement.
- [x] Preserve the existing GSAP desktop pin with a local `ScrollTrigger.create` using the same start/end/onUpdate contract, but no vertically translated image track. Ensure cleanup still cancels RAF and kills ScrollTrigger.
- [x] Run the focused Chromium test until GREEN, then run it three times to check switched-state stability.
- [x] Run `npm run lint -- --max-warnings=0`, `npm run build`, and the existing route/mobile compatibility tests.
- [x] Commit Task 2 with `feat: redesign featured work presentation`.

### Task 3: Browser evidence, regression gates, and handoff

**Files:**
- Modify: `tests/featured-work.spec.ts` only for honest wait/assertion fixes demonstrated by real rendered state
- Create: `tests/featured-work.spec.ts-snapshots/featured-work-1440x900-chromium-darwin.png`
- Create: `tests/featured-work.spec.ts-snapshots/featured-work-1920x1080-chromium-darwin.png`
- Create: `tests/featured-work.spec.ts-snapshots/featured-work-2560x1080-chromium-darwin.png`
- Create: `tests/featured-work.spec.ts-snapshots/featured-work-1440x900-project-two-chromium-darwin.png`
- Modify: `docs/superpowers/specs/2026-08-31-featured-work-redesign-design.md`
- Modify: `docs/superpowers/plans/2026-08-31-featured-work-redesign.md`

**Interfaces:**
- Consumes: completed Task 2 DOM and motion contract.
- Produces: reviewed desktop/light visual evidence and a reproducible handoff.

- [x] Capture and inspect raw 390×844, 768×1024, 1440×900, 1920×1080, and 2560×1080 renders; only desktop images become Featured Work golden snapshots.
- [x] Verify selected project two, keyboard path, rapid changes, scrub changes, reduced motion, Shoot Mode, console, URL, and adjacent Experience/Contact visibility.
- [x] Apply every visual review gate; fix only `projects.tsx` or honest observable waits if a gate fails, then recapture the same viewport.
- [x] Run `npm ci`, `npm run lint -- --max-warnings=0`, `npm audit --audit-level=low`, `npm run build`, `npm run test:unit`, and `npm run test:e2e`.
- [x] Inspect `git status --short`, exclude the two pre-existing untracked skill directories, mark spec and plan complete, and commit with `test: verify featured work redesign`.
- [x] Report branch, commits, divergence, rollback SHA, changed/deferred scope, preview URL, weakest remaining visual dimension, and verification results without merging or pushing.

## Fast Fallback

If the redesign is visibly unusable but keeping its files is useful, restore only the desktop `lg:flex` subtree and its old `ProjectsDesktopGallery` wiring from `1042c20`, leaving mobile/routes untouched. If the redesign must be removed entirely, revert its focused commits newest first and verify `git diff 1042c20 -- app/components/sections/projects.tsx tests/featured-work.spec.ts` is empty.
