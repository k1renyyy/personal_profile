# Featured Work Redesign Design

**Status:** Implemented and verified

## Scope

Redesign only the home-page Featured Work section for the first desktop, light-theme release. Preserve Next.js App Router, React, Tailwind, static export, the section mounting point, `ScrollSection`, global scrolling and Shoot Mode ownership, adjacent sections, and all existing `/projects` routes. Mobile and dark-theme redesigns are deferred; their existing fallback must remain operational.

The home section uses four neutral placeholder projects. Existing repository project facts, images, technical labels, and links are not shown in this redesign and are not deleted. Sanity supplies final content in a later phase.

## Approved Composition

- Keep the left title block: `SELECTED PROJECTS`, `FEATURED WORK`, and the introductory paragraph.
- Remove `VIEW ALL` from Featured Work.
- Replace the four left thumbnails with project-selection buttons containing a two-digit sequence and visible placeholder project name. Retain the status dot.
- Mark the selected button with a left border, filled dot, and subtle warm-gray background; selection cannot rely on color alone.
- Keep the existing desktop split and pinned scroll-scrub ownership.
- Replace the right image gallery with one warm-gray text stage. It contains exactly one visible project article.
- Stage order: typed project sequence and title; project type, role and time; summary; numbered outcomes; capability tags; four progress bars and `Scroll to explore · Select a project`.
- The home Featured Work stage and selectors never navigate. Existing project listing/detail routes remain unchanged.
- Desktop stage height is `height: clamp(700px, 84vh, 900px)` and must contain its content without an internal scrollbar.

## Motion and Accessibility

- Clicking a selector updates the active project and scroll position through the existing section-owned ScrollTrigger.
- Scroll scrub updates the same active project state.
- Sequence and title restart their typing effect on each selection. Rapid selection cancels the previous timer.
- Summary, outcomes, and tags enter together with a lightweight opacity and small vertical transition on a node separate from the GSAP pin owner.
- Under `prefers-reduced-motion: reduce`, sequence and title render immediately and content uses no spatial movement.
- Selectors are real buttons with visible names, `aria-pressed`, keyboard focus, and at least one non-color selected cue.
- Exactly one project article is visible and announced. Project changes do not change the URL.

## Visual Decision Sheet

1. `Surface`: narrative/inspection-led portfolio section; a visitor selects and reads one project story.
2. `P1 / P2 / P3 / Action`: active project title; summary/metadata; numbered outcomes/tags; select or scrub.
3. `Content truth`: neutral placeholders only; no invented claims, metrics, clients, or screenshots.
4. `Composition`: desktop `[title + selectors] [warm-gray text stage]`; mobile remains the pre-existing fallback and is deferred.
5. `System`: existing page tokens and type roles; warm-gray raised surface, restrained borders, square/low-radius controls, existing mono orientation labels.
6. `Signature`: causal typing of project sequence/title tied to selection.
7. `Cliche budget`: one oversized editorial heading already inherited; no image, glass, glow, bento, or fake telemetry.
8. `Failure risks`: stage becomes empty/oversized at wide viewports; pin/selection desynchronizes. Verify at 1440, 1920, and 2560 plus switched state.

## Requirement-to-Evidence Matrix

| Requirement | Automated evidence |
| --- | --- |
| Four named selectors; no thumbnail or View All | DOM assertions and image/link absence inside `#projects` desktop layout |
| Selected border, dot, background and keyboard operation | `aria-pressed`, computed styles, focus and Enter/Space selection |
| Exactly one visible article | visible article count and active title assertions |
| Warm-gray text stage and 84vh clamp | computed background, CSS height bounds at 1440×900 and 1920×1080 |
| No home-stage navigation | URL and scroll invariants after stage/selector interactions |
| Typed sequence/title with cancelation | fake clock after two rapid selections |
| Reduced motion | emulated reduced motion with immediate full title and transform-none content |
| Scroll scrub synchronization | scroll to pinned progress and assert selected button/article |
| No internal scrolling | `scrollHeight <= clientHeight + 1` for stage |
| Deferred surfaces remain safe | existing mobile, theme, route, Shoot Mode, and full E2E suite |

## Rollback

Pre-change rollback SHA: `1042c20c11beacdb8323807b9ebf5caf65de7d22`.

The scoped rollback is to revert only the Featured Work implementation/test/evidence commits produced by its plan, newest first. A complete branch rollback can return to the SHA above. Neither path deletes existing project data or routes.
