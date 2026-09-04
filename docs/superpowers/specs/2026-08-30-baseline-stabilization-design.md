# Portfolio Baseline Stabilization Design

## Purpose

Stabilize the imported portfolio before personal-content work begins. The stabilized baseline must retain the approved visual design, responsive composition, motion, and browser interactions while eliminating all known lint, dependency-security, and planned realtime-backend risks.

## Success criteria

The stabilization phase is complete only when all of the following are true:

- `npm run lint -- --max-warnings=0` exits successfully with zero errors and zero warnings.
- `npm audit --audit-level=low` exits successfully with zero known vulnerabilities, including development and transitive dependencies.
- `npm run build` exits successfully from a clean install without undocumented environment state.
- `/`, `/projects`, and every generated `/projects/[slug]` route render successfully.
- The approved desktop and mobile design remains unchanged except for documented and approved differences.
- Theme switching, scrolling, transitions, hover and focus states, Testimonials motion, Shoot Mode, sound, WebGL, and reduced-motion behavior remain operational.
- Chat, online presence, collaborative cursors, Supabase source code, Supabase runtime dependencies, and Supabase network requests are absent.
- No ESLint rule is disabled and no ignore entry or suppression comment is added merely to pass a quality gate.

## Selected approach

Insert an independently reviewable Phase 1.5 after the unmodified source baseline is captured and before repository-guideline and personal-content work. This preserves a trustworthy comparison point while keeping engineering stabilization separate from identity and content changes.

The rejected alternatives were postponing stabilization until the former Phase 10 and combining all fixes with an immediate bulk dependency upgrade. Both would mix unrelated visual, behavioral, and dependency changes and make regressions difficult to isolate.

## Constraints

- Work on `personal-development`; retain `main` and tag `portfolio-v3-import-baseline` as recoverable comparison points.
- Do not use `npm audit fix --force`.
- Necessary dependency upgrades are allowed, including framework upgrades, only with proportional regression verification.
- Do not replace the established application libraries or restructure unrelated components.
- Preserve DOM hierarchy, animation selectors, dimensions, text geometry, media ratios, and browser interaction hooks unless a verified fix requires a narrow change.
- Keep every risk category in a separate commit so it can be reviewed and reverted independently.
- Do not update visual baselines merely to make a comparison pass. Review and document every intentional difference.

## Workstreams

### 1. Reproducible quality baseline

Record the exact Node.js, npm, framework, lint-plugin, and dependency versions. Retain the original lint and audit findings, the clean production-build result, all generated routes, and the prescribed desktop/mobile screenshots and interaction notes outside production assets.

The permanent quality gate is:

```bash
npm run lint -- --max-warnings=0
npm audit --audit-level=low
npm run build
```

These commands remain separate because Next.js 16 no longer runs ESLint as part of `next build`.

### 2. Deterministic source-quality repairs

Repair issues that should not alter visible behavior before changing React state flow:

- Replace explicit `any` types with library types or `unknown` plus narrowing.
- Replace the Rubik logo-key suppression with a correctly typed key set; do not retain `@ts-ignore` or substitute another suppression.
- Escape JSX entities without changing visible copy.
- Remove only genuinely unused imports, parameters, and variables.
- Use `const` for values that are never reassigned.
- Evaluate each raw `<img>` usage. Move it to `next/image` when that preserves the external or local image behavior; otherwise use a documented component-level solution that satisfies the rule without disabling it.
- Resolve every Hook dependency warning by stabilizing callbacks or correcting dependencies after checking animation setup and cleanup semantics.

### 3. React behavior repairs

Treat each behavior risk as its own change and verification unit:

- Initialize Rubik random animation targets once so renders remain deterministic.
- Move Navbar values that affect rendered identity, avatars, and participant counts from mutable refs into render-driving state.
- Replace synchronous effect-derived state with direct derivation, lazy initialization, subscription callbacks, or explicit external-system synchronization as appropriate.
- Remove the Contact section's self-referential ref initialization while preserving the GSAP ScrollTrigger element and timing.
- Make the custom `useGSAP` hook type-safe and ensure animation callbacks and dependency changes cannot retain stale closures.

The relevant regression checks cover Rubik/Shoot Mode behavior, Navbar identity display, project-title typing, route-transition scroll locking, portal mounting, Contact reveal timing, and reduced-motion behavior.

### 4. Early Supabase removal

Move the former Phase 8 scope into Phase 1.5 instead of repairing code that the final portfolio must remove. Delete only the realtime features that the roadmap already excludes:

- collaborative cursors;
- online presence;
- Navbar chat state, requests, subscriptions, storage, and presentation;
- Supabase browser client, migrations, dependency, and environment requirements;
- helpers that become unused solely because of this removal.

Preserve Navbar dimensions, navigation, theme controls, Shoot Mode controls, and responsive balance. Verify that browser Network logs contain no Supabase traffic.

### 5. Dependency-security remediation

Use `npm audit` dependency paths to remediate one dependency family at a time:

1. Apply compatible patched versions and regenerate the lockfile through npm.
2. Upgrade Next.js and related framework packages to patched compatible releases.
3. Determine whether face-recognition/TensorFlow dependencies are reachable from application code. Upgrade and test reachable dependencies; remove unreachable dependencies and only the dead code made obsolete by that removal.
4. Resolve remaining development and transitive advisories through supported parent-package upgrades.
5. After every dependency family, run the strict lint gate, audit, production build, route smoke checks, and the relevant visual/interaction subset.

Do not accept an audit exception, severity threshold above `low`, or production-only audit as completion.

### 6. Full regression evidence

Run the complete viewport matrix at `390x844`, `430x932`, `768x1024`, `1024x768`, `1440x900`, and `1920x1080`, in both themes where applicable. Cover the homepage, projects index, every project detail route, desktop and mobile navigation states, initial and scrolled navigation, pinned and marquee regions, transitions and back navigation, Testimonials looping, Shoot Mode, audio policy behavior, WebGL fallback, reduced motion, touch, keyboard, focus, console, and network behavior.

Chromium supplies deterministic visual comparisons. Safari and Firefox are compatibility checks rather than exact-pixel comparison targets. Representative time-based motion is inspected directly or recorded; static screenshots are not accepted as proof of animation quality.

## Change and commit boundaries

The intended commit sequence is:

```text
chore: capture and document portfolio baseline
docs: add baseline stabilization plan
refactor: remove supabase realtime features
fix: resolve deterministic lint violations
fix: stabilize react rendering behavior
chore: remediate dependency vulnerabilities
test: verify stabilized portfolio baseline
```

If investigation shows that two entries cannot be separated without duplicating or destabilizing work, combine only those entries and document the reason in the commit message or baseline report.

## Failure handling

- If a source repair changes stable pixels or motion, stop, identify whether the difference is required for correctness, and obtain approval before accepting it.
- If an upgrade introduces a regression, revert that dependency-family change and investigate the supported migration path rather than stacking unrelated fixes.
- If zero audit findings cannot be achieved with maintained compatible packages, stop and present the exact dependency chain and replacement/removal options. Do not waive the strict standard silently.
- If a browser-specific difference is caused by font rasterization, GPU/WebGL output, refresh rate, or autoplay policy, document the observable tolerance and verify that behavior remains functionally correct.

## Out of scope

- Personal identity, copy, projects, and assets.
- New product features, backend replacements, CMS work, or realtime substitutes.
- Broad component rewrites unrelated to a demonstrated lint, security, accessibility, or regression issue.
- Changes to the approved visual design.
