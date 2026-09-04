# Personal Portfolio Development Roadmap

> **For agentic workers:** Execute this roadmap phase by phase. Keep each phase independently reviewable, verify its acceptance criteria, and commit it separately before continuing.

**Goal:** Turn the imported `portfolio-v3` baseline into a desktop-first, light-theme personal portfolio while preserving its approved visual design, motion, and interaction quality.

**Architecture:** Continue using the existing Next.js App Router application and its current component boundaries. Use Sanity as the approved editor-managed content source while Next.js retains ownership of routing, structure, styling, motion, and static export. Separate content replacement, project rebuilding, visual refinement, and deployment so every material change remains comparable with the original baseline.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, GSAP/ScrollTrigger, Lenis, Motion/Framer Motion, Anime.js, Three.js/React Three Fiber, Sanity, Vercel.

## Global constraints

- Complete the CMS work on `cms_build`, integrate the approved result into `personal-development`, and keep `main` as the comparison baseline until Preview verification passes.
- Version 1 targets the desktop-style layout at `1024px` and wider in the light theme. Mouse and keyboard are the formally supported input methods; touch-only behavior is deferred even when a touch device uses that layout.
- Dark-theme refinement and mobile/tablet responsive design are explicitly assigned to Version 2 and are not Version 1 visual-parity gates.
- Version 1 must not expose a control that switches visitors into an unapproved dark theme. Preserve the underlying theme capability for Version 2 instead of deleting it.
- Below `1024px`, retain the current layout as best-effort compatibility. The minimum Version 1 safety check is: no blank page, no horizontal page overflow, and usable navigation and contact links. Mobile/tablet visual refinement, touch interaction, and real-device acceptance remain Version 2 work.
- Preserve the original desktop visual composition, DOM hierarchy, animation hooks, Shoot Mode, sound, transitions, and light-theme design unless a later requirement explicitly changes them.
- Replace personal content separately from structural or interaction changes.
- Remove Supabase only in its dedicated phase; do not mix that work into content commits.
- Avoid unrelated refactors, dependency replacements, and speculative features.
- Keep text geometry, image aspect ratios, card counts, and animation selectors stable while establishing visual parity.
- Verify permission before publicly distributing copied source code or third-party assets.

## Design change, refactor, and approval workflow

Any change to layout, interaction, navigation, responsive composition, motion,
or component structure must follow this workflow. Replacing values through
Sanity without changing presentation is content work; changing how content is
organized, revealed, navigated, or animated is design work and requires the
full workflow below.

### Step 1: Classify and constrain the change

- Identify whether the request is content-only, visual, interaction,
  responsive, route/navigation, or structural refactoring work.
- Record the real content volume, required states, affected components,
  breakpoints, animation hooks, routes, and accessibility requirements.
- State which reference behavior must remain unchanged and which intentional
  difference is required by the approved personal content or product decision.
- Do not expand one approved section change into a full-site redesign.

### Step 2: Audit the existing design framework

- Inspect the repository and reference site for an existing pattern that can
  solve the problem, including cards, disclosures, navigation, focus, scroll,
  transition, responsive composition, and motion.
- Preserve the established typography, spacing, grid, color, border, radius,
  easing, timing, and interaction language whenever they remain usable.
- Search for outside interaction references only when the existing framework
  cannot satisfy a documented content, usability, responsive, or accessibility
  requirement. External references may inform behavior but may not replace the
  approved visual system without separate authorization.

### Step 3: Produce a reviewable design specification

The design package must use the final reviewed content and include:

- Desktop composition at the supported Version 1 breakpoints.
- Default, hover, focus, active, expanded, collapsed, loading, empty,
  overlong-content, and missing-optional-content states where applicable.
- Mouse, keyboard, focus movement, scroll-position, browser-back,
  light-theme, and reduced-motion behavior.
- Motion trigger, duration, easing, interruption, and layout-shift behavior.
- Sanity-field-to-interface mapping and ownership boundaries between Sanity
  content and Next.js presentation state.
- At least one constrained alternative when a material interaction decision is
  unresolved, together with its tradeoffs and a recommended option.

The specification may be a written interaction spec, annotated screenshots,
or a local prototype. A production implementation is not a substitute for the
pre-implementation design review.

### Step 4: Obtain pre-implementation design approval

- Present the intended differences from the baseline and the recommended
  desktop behavior to the owner.
- Record the selected option, rejected alternatives, and any open conditions.
- Do not modify production components, routes, or interaction code until the
  owner explicitly approves the design specification.
- Approval of content, CMS fields, or a roadmap phase does not implicitly
  approve an unresolved layout or interaction design.

### Step 5: Implement the approved design surgically

- Change only the components, styles, tests, routes, and Sanity mappings needed
  for the approved result.
- Reuse existing components and animation hooks where practical; structural
  refactoring is permitted only when required to implement or test the approved
  design cleanly.
- Keep unrelated cleanup, library replacement, and speculative flexibility out
  of the design commit.
- If implementation reveals a material behavior not covered by the approved
  specification, stop and return to Step 3 rather than deciding silently.

### Step 6: Verify and obtain implementation acceptance

- Compare the implementation with the approved specification and retained
  baseline behavior using the real Sanity content.
- Verify desktop layouts in the light theme, mouse, keyboard, focus,
  scrolling, motion, reduced motion, overflow, and missing-content
  behavior in proportion to the change.
- Record intentional baseline differences, test results, screenshots or
  recordings, and any documented rendering tolerances.
- Present the verified implementation for owner review. A design-changing
  phase is not complete until both the pre-implementation design approval and
  the post-implementation acceptance are recorded.

### Approval record required for every design refactor

- [ ] Change classification and preserved baseline behavior are documented.
- [ ] Existing framework patterns are audited before outside references are considered.
- [ ] Desktop light-theme interaction, motion, and accessibility states are specified with real content.
- [ ] The owner explicitly approves the design before production implementation.
- [ ] The implementation stays within the approved design and passes its verification checks.
- [ ] The owner accepts the verified implementation before the phase is marked complete.

## Progress

- [x] Phase 1: Lock and verify the source baseline
- [x] Phase 1.5: Stabilize the imported baseline
- [x] Phase 2: Commit repository guidelines
- [x] Phase 3E: Sanity technical PoC and local signed-webhook verification
- [x] Phase 3F: Establish the production Sanity content foundation and website query layer
- [x] Phase 4: Replace identity information through Sanity
- [ ] Phase 5: Replace homepage content through Sanity
- [ ] Phase 6: Build the Sanity project system with inline project-card expansion
- [ ] Phase 7: Build Sanity Testimonials with authentic publication authorization
- [ ] Phase 8: Verify CMS content completeness and operational readiness
- [ ] Phase 9: Verify desktop light-theme visuals, motion, and interaction
- [ ] Phase 10: Verify engineering quality, performance, SEO, and accessibility
- [ ] Phase 11: Verify Vercel Preview and the real Sanity webhook flow
- [ ] Phase 12: Integrate `cms_build` into `personal-development`, then merge into `main`
- [ ] Phase 13: Deploy Production and connect the personal domain
- [ ] Phase 14: Run post-release production regression checks

Deferred Version 2 scope (not a Version 1 completion gate):

- [ ] Version 2A: Design and implement the dark theme
- [ ] Version 2B: Design and implement mobile/tablet responsive layouts
- [ ] Version 2C: Verify touch interactions and real devices
- [ ] Version 2D: Verify Preview, deploy Version 2, and run post-release regression

Current development boundary:

- Continue approved page-design work on `personal-development`; keep `main` unchanged.
- Treat `studio/` as an independent Sanity project. The root Next.js TypeScript build excludes it, while Studio keeps its own install, lint, typecheck, test, and build commands.
- Defer new CMS feature work until page-design work is ready for integration. Before CMS work resumes, run the complete root and Studio quality gates and resolve any Studio dependency, schema, environment, webhook, or deployment failures in that dedicated phase.

---

## Phase 1: Lock and verify the source baseline

### Work

- Confirm the working tree and current branch before making source changes.
- Preserve commit `dae2155` as the imported local baseline.
- Fetch and compare the audited upstream baseline commit `b945ba21f41fde05bdb440c2c24e68d5e4337030` when available.
- Run the unmodified application and verify `/`, `/projects`, and every existing `/projects/[slug]` route.
- Capture repeatable desktop and mobile screenshots in a pinned Chromium environment.
- Record theme switching, navigation, scrolling, hover/focus states, page transitions, Testimonials motion, Shoot Mode, sound, WebGL, and reduced-motion behavior.

### Acceptance criteria

- [x] A recoverable baseline commit or tag exists.
- [x] Baseline source differences are documented.
- [x] All existing routes have been checked.
- [x] Reference screenshots and interaction notes are retained outside production assets.
- [x] The baseline builds without relying on undocumented local state.

### Commit

```text
chore: capture and document portfolio baseline
```

## Phase 1.5: Stabilize the imported baseline

Follow the approved design in
`docs/superpowers/specs/2026-08-30-baseline-stabilization-design.md` before
personal-content work begins.

### Work

- Preserve the Phase 1 visual and interaction evidence as the comparison baseline.
- Remove the planned Supabase chat, presence, and collaborative-cursor features without changing Navbar composition or unrelated interactions.
- Resolve every ESLint error and warning in source; do not disable rules, add ignores, or retain suppression comments merely to pass lint.
- Repair impure rendering, render-time ref reads, synchronous effect-derived state, stale Hook dependencies, and the Contact animation's self-referential initialization.
- Remediate every direct, development, and transitive dependency advisory through supported upgrades or removal of demonstrably unused dependencies.
- Verify each risk category independently before combining it with later work.

### Acceptance criteria

- [x] `npm run lint -- --max-warnings=0` exits successfully with zero errors and zero warnings.
- [x] `npm audit --audit-level=low` exits successfully with zero known vulnerabilities.
- [x] `npm run build` exits successfully from a clean install.
- [x] `/`, `/projects`, and every project-detail route pass route checks.
- [x] Browser Console and Network checks show no unexplained errors, broken assets, or Supabase traffic.
- [x] Desktop/mobile layout, themes, motion, Shoot Mode, audio, WebGL, keyboard, touch, and reduced-motion behavior match the approved baseline within documented tolerances.

### Commit sequence

```text
docs: add baseline stabilization plan
refactor: remove supabase realtime features
fix: resolve deterministic lint violations
fix: stabilize react rendering behavior
chore: remediate dependency vulnerabilities
test: verify stabilized portfolio baseline
```

## Phase 2: Commit repository guidelines

### Work

- Review and commit the root `AGENTS.md`.
- Keep permanent coding, verification, security, and commit conventions in `AGENTS.md`.
- Keep this time-bound implementation roadmap in `docs/development-roadmap.md`.

### Acceptance criteria

- [x] Repository guidance is tracked by Git.
- [x] The guidelines do not contain temporary personal content.
- [x] The roadmap and permanent agent instructions have distinct responsibilities.

### Commit

```text
docs: add repository guidelines
```

## Phase 3: Prepare content and evaluate a CMS

Phase 3 determines what the site will publish and whether an external content
management system is justified. CMS adoption is not predetermined: research,
the proof of concept, and explicit approval must precede production integration.

### Phase 3A: Audit page content consumers

Audit artifact: `docs/content/content-consumer-audit.md`.

Inspect the existing Phase 4–7 routes, components, data files, metadata, and
media placements without changing them. Record every content consumer, its
current data shape, visible length and wrapping constraints, media geometry,
ordering behavior, animation selector, and fallback behavior.

The audit defines what the site needs to publish, but does not ask for personal
information and does not select a CMS. It must distinguish content from
presentation: Next.js components continue to control layout, styling, motion,
Shoot Mode, audio, WebGL, and responsive behavior.

### Phase 3B: Research and shortlist CMS and no-CMS options

Perform a read-only, source-backed comparison of hosted, self-hosted, Git-based,
and hybrid CMS options. At minimum, evaluate Sanity, Storyblok, Contentful,
Payload, Strapi, Directus, DatoCMS, Hygraph, Prismic, and Decap CMS.

Compare current official evidence for:

- Next.js 16, React 19, App Router, Server Components, static generation, ISR, Draft Mode, preview, webhooks, and typed queries.
- Content modeling, validation, media handling, localization, roles, and editing experience.
- Authentication, token scope, draft isolation, webhook verification, security advisories, backups, and operational responsibility.
- Free and paid limits, commercial-use terms, seats, API requests, storage, bandwidth, and realistic total cost.
- Data, schema, rich-text, and original-media export; vendor lock-in and exit paths.
- Vercel Hobby compatibility, client-bundle impact, build behavior, caching, and failure modes.

Reduce the longlist to no more than two proof-of-concept candidates. The report
must also compare the no-CMS alternative of typed repository content managed
through Git. Do not create accounts, install packages, or modify application
code during research.

### Phase 3C: Define and approve the platform-neutral content model

Use the consumer audit and shortlisted platforms' field capabilities to define
typed content models for:

- Site settings and SEO.
- Profile and biographies.
- Navigation and social links.
- Skills and work experience.
- Projects, summaries, detailed descriptions, highlights, ordering, and publication status.
- Testimonials, relationship context, placeholder status, and publication authorization.
- Reusable image metadata, including alternative text and rights status.

Define required fields, uniqueness, validation, references, ordering, draft and
publication rules, field help text, and the boundary between content and
presentation. Keep the canonical model platform-neutral so it remains usable
with either a CMS or typed repository content. Obtain explicit approval of the
field model before requesting the full personal-content inventory.

### Phase 3D: Build the reviewed content inventory

After the field model is approved, prepare one source of truth covering:

- Name and English name.
- Professional title and positioning.
- City, timezone, availability, and collaboration status.
- Biography and short introductions of appropriate lengths.
- Technology stack.
- Portrait, logo, favicon, and social sharing image.
- Email and social links.
- Project data without project media or detail-page SEO.
- Work experience.
- Authentic client or colleague testimonials.
- SEO title, description, canonical site URL, and Open Graph content.
- Usage rights and attribution requirements for fonts, images, models, audio, and copied source code.

Collect information against the approved fields. Record missing content
explicitly instead of inventing it. For every media asset, record dimensions,
aspect ratio, intended placement, source, and usage rights.

### Phase 3E: Run an isolated CMS proof of concept

After the research report, shortlist, and field model are approved, create a
dedicated branch in an isolated worktree from the completed Phase 2 revision.
Use the same bounded scope for each approved candidate:

- One site-settings record.
- One profile record.
- Two project records.
- One managed image with alternative text.
- Draft preview and publication.
- Signed publish webhook that triggers a complete Vercel static rebuild.
- CMS-unavailable behavior that preserves the last published site.
- Complete content, schema, and original-media export.

The proof of concept must not migrate all content, remove the repository source
data, redesign components, or become production integration implicitly. Secret
tokens remain server-only; public clients cannot access drafts or write APIs.

Phase 3E status (2026-08-30):

- [x] The isolated Sanity Studio, bounded public `poc` dataset, schema validation, published build-time query, and repository-default adapter are complete on `cms_build`.
- [x] Draft isolation, secret scanning, CMS-failure behavior, dataset/media export integrity, repository rollback, and local visual/interaction gates are verified.
- [x] An official-format signed webhook was verified locally: invalid signatures are rejected, valid signatures trigger the real static build, and failed builds preserve the previous artifact.
- [x] No production content source, deployment, Vercel project, payment method, or paid plan was changed.
- [ ] During the approved deployment stage, verify real Sanity-to-host webhook delivery and atomic hosted deployment switching.
- [x] The owner selected Sanity as the CMS after reviewing the PoC results.
- [ ] Write and approve a separate Sanity production-integration design before any merge or production content-source replacement.

### Phase 3F: Establish the production Sanity content foundation and website query layer

Sanity is the approved CMS. Convert the bounded PoC into the reviewed content
foundation required before any Phase 4–7 content replacement begins. This phase
does not deploy the website or create a hosted webhook.

### Work

- Approve the production-integration design before replacing the repository content source.
- Finalize Sanity schemas for site settings, profile, education, experience, capabilities, projects, testimonials, social links, SEO, and managed media.
- Make the Studio editing workflow understandable to the owner, including field labels, validation, ordering, publication controls, and missing-content guidance.
- Define the intended dataset boundary, public-read behavior, draft isolation, API date, environment variables, and server-only secret rules.
- Implement the typed Next.js query and validation layer while preserving a documented repository rollback source.
- Keep layout, DOM, routing, animation, responsive behavior, Shoot Mode, audio, and WebGL owned by Next.js rather than Sanity.
- Record dependency maintenance, Free-plan limits, failure behavior, export requirements, and the later Vercel webhook boundary.
- Do not merge `cms_build` into `personal-development` until this foundation is approved and its gates pass.

### Acceptance criteria

- [x] Every Phase 4–7 content consumer, constraint, media placement, and fallback is recorded without changing production pages.
- [x] The research report uses current first-party evidence and includes a scored shortlist plus the no-CMS alternative.
- [x] No more than two CMS candidates proceed to proof of concept (Sanity is the sole approved Phase 3E candidate after confirming the owner's no-code editing requirement).
- [x] A platform-neutral field model and validation rules cover every retained consumer and receive explicit approval before full information collection.
- [x] The production-integration design and final Sanity schemas receive explicit approval.
- [ ] Required copy, links, claims, and rights information are collected in one reviewed source of truth.
- [ ] Image dimensions, aspect ratios, intended placements, sources, and usage rights are recorded.
- [x] Missing content is explicitly marked as missing rather than invented.
- [x] Any approved proof of concept is isolated from the main working directory and limited to the defined test content.
- [x] Draft isolation, server-only secrets, CMS failure behavior, and complete export remain verified after the production schema and query changes.
- [x] The website can load validated published Sanity content without exposing draft or write access.
- [x] `npm run lint -- --max-warnings=0`, `npm audit --audit-level=low`, and `npm run build` pass for the selected content foundation.
- [x] Visual and interaction checks show no unintended changes to the approved baseline.
- [x] The selected CMS or no-CMS outcome and its rationale receive explicit approval before Phase 4.
- [x] No page structure or production content source has changed before that approval.

### Commit sequence

```text
docs: audit portfolio content requirements
docs: evaluate portfolio cms options
docs: define portfolio content model
docs: collect portfolio content inventory
test: validate cms proof of concept
docs: approve portfolio content foundation
```

## Phase 4: Replace global identity

### Primary scope

- `app/layout.tsx`
- `app/components/navbar/app-navbar.tsx`
- `app/components/floating-socials.tsx`
- `app/components/sections/contact.tsx`
- `app/components/footer.tsx`
- `app/components/hero/`
- Global icons, portrait, logo, and sharing assets under `app/` and `public/`

### Acceptance criteria

- [x] The owner can enter and update identity content through Sanity Studio without editing source code.
- [x] The website reads the published identity values through the approved query layer.
- [x] Available Metadata fields use the new identity and remain `noindex, nofollow` while the launch assets and production domain are missing.
- [x] Final portrait, favicon/logo, Open Graph image, and canonical production domain remain explicit Phase 13 launch gates rather than blockers to Phase 4 identity integration.
- [x] Navbar, Hero, Contact, Footer, and social links contain no old personal information.
- [x] External links point to the intended accounts and use safe behavior.
- [x] New copy does not break the approved desktop wrapping or composition.
- [x] Existing animation hooks and Shoot Mode attributes remain functional.

Owner acceptance recorded on 2026-08-31. This accepts the Phase 4 identity integration only; it does not authorize Phase 5, branch integration, Preview, or deployment.

### Commit

```text
feat: personalize global identity
```

## Phase 5: Personalize homepage sections

### Order

1. Hero
2. Marquee
3. Stats / About and Tech Stack
4. Work Experience
5. Skills
6. Project Experience
7. Contact
8. Footer

Testimonials are handled separately in Phase 7.

### Interaction-design gate for Experience and Projects

The reviewed Experience and Project content is materially longer and more
structured than the reference content, and the approved project navigation
removes `/projects/[slug]` detail pages. Before implementing either section,
complete and approve a constrained interaction design. This is not permission
to redesign the full site.

1. Audit the existing repository and reference site for reusable accordion,
   card, disclosure, tabs, focus, scroll, transition, and desktop patterns.
2. Prefer the existing visual system, spacing, typography, borders, radii,
   animation hooks, easing, and interaction language. Review external portfolio
   patterns only when the existing framework cannot solve a documented content
   or usability problem.
3. Produce desktop light-theme specifications for default, hover, focus,
   expanded, collapsed, content-overflow, and missing-optional-content states.
4. Define mouse, keyboard, focus movement, scroll-position, single-open-state,
   reduced-motion, light-theme, and animation-duration behavior.
5. Map every visible value and ordering control to its approved Sanity field;
   keep interface labels and interaction state in Next.js.
6. Review the specifications against the real approved content lengths, not
   placeholder copy, and obtain explicit owner approval before implementation.

The starting Experience concept reuses the existing desktop master-detail
composition: a left-side company selector with logo, company name, and dates
controls a right-side text panel containing the selected role, location,
introduction, and verified outcomes. Exactly one experience is selected, with
the first visible record selected by default.

The starting Project concept keeps three summary cards on desktop. Only one
project may be open at a time. The design review must
compare a shared full-width detail panel below the desktop card row with
in-card expansion, then select the option that best preserves reading order,
layout stability, focus behavior, and the reference visual language. Modal,
carousel, and 3D-flip treatments are excluded
unless a later approved requirement demonstrates a need.

### Design-gate acceptance criteria

- [ ] Existing interaction patterns and reusable animation hooks are documented before proposing new behavior.
- [ ] Experience desktop light-theme state specifications use the full approved introductions and outcome lists.
- [ ] Project desktop light-theme state specifications use all three approved descriptions and highlight lists.
- [ ] Mouse, keyboard, focus, scroll position, single-open behavior, light theme, and reduced motion are explicitly specified.
- [ ] The owner approves the Experience and Project interaction specifications before their implementation begins.

### Working rules

- Enter owner-managed content in Sanity; do not duplicate it as new hard-coded production content.
- Keep fixed interface labels and presentation behavior in Next.js unless the approved content model says otherwise.
- Preserve existing DOM hierarchy and animation selectors where possible.
- Keep replacement copy close to the original visual length until the layout is verified.
- Control heading line breaks deliberately at supported breakpoints.
- Preserve media ratios and item counts unless a documented design decision requires a change.
- When real Experience content is connected, enforce card-safe Sanity limits for company, role/location/date metadata, highlight count, and highlight length. Validate the longest approved record in the UI and provide a visible overflow fallback; fixed-height cards must never silently clip published content.
- Modify, verify, and commit coherent sections without mixing unrelated cleanup.

### Acceptance criteria

- [ ] The owner can enter and reorder homepage content through Sanity Studio without editing source code.
- [ ] Every visible homepage section uses reviewed personal content.
- [ ] Work Experience follows the approved company-selector and text-panel interaction specification.
- [ ] Exactly one experience is selected at a time.
- [ ] Desktop light-theme composition remains consistent with the approved design.
- [ ] Published Experience content fits every supported card size; Sanity validation and the UI fallback prevent silent clipping. This is a launch-blocking requirement.
- [ ] Scroll triggers, hover states, keyboard behavior, and reduced-motion behavior remain operational.
- [ ] Commented or unused sections are not enabled without an explicit requirement.

### Commit

```text
feat: update homepage content
```

## Phase 6: Rebuild project data and inline card content

### Primary scope

- `app/data/projects.ts`
- `app/data/project-descriptions.ts`
- `app/components/sections/projects.tsx`
- Sanity project schema, query, validation, ordering, and publication controls
- Removal of project-detail navigation and generated `/projects/[slug]` routes from the personalized design

### Required project fields

- Name, personal role, and year.
- Summary and detailed description.
- Ordered, verifiable highlights or outcomes.
- Stable order and publication status as internal management fields.

### Acceptance criteria

- [ ] The approved Project interaction specification identifies the desktop expansion treatment before implementation.
- [ ] Desktop shows the three approved projects in a three-column layout.
- [ ] Each card shows year, role, name, and summary before expansion.
- [ ] Each card expands in place to show its detailed description and highlights.
- [ ] No card navigates to or generates a project-detail route.
- [ ] Only one project is expanded at a time, and expanded content remains readable without breaking the page composition.
- [ ] Mouse, keyboard, and reduced-motion behavior work correctly on supported desktop viewports.
- [ ] Project claims are accurate and use no unapproved media.

### Commit

```text
feat: replace portfolio projects
```

## Phase 7: Replace Testimonials and add its anchor

### Primary scope

- `app/components/sections/testimonials.tsx`
- Footer or navigation links that target Testimonials
- Authorized testimonial portraits under `public/`

### Work

- Replace name, role, organization or working relationship, portrait, and quote.
- Preserve the existing infinite horizontal-scroll composition and item geometry.
- Add a stable `testimonials` section anchor and connect the corresponding navigation link.
- Hide the section until authentic testimonials and explicit publication authorization are available; never publish placeholder recommendations.

### Acceptance criteria

- [ ] No testimonial implies a fabricated endorsement.
- [ ] The infinite loop has no visible seam or unexpected jump.
- [ ] Footer navigation reaches the correct section.
- [ ] Keyboard and reduced-motion behavior are verified in the desktop light theme.

### Commit

```text
feat: update testimonials
```

## Phase 8: Verify CMS content completeness and operational readiness

### Work

- Verify that all required identity, homepage, project, testimonial, social, SEO, and media fields are complete or explicitly deferred.
- Verify links, claims, ordering, publication state, alternative text, image rights, and content fallbacks.
- Confirm that incomplete drafts and unpublished records cannot enter the static production build.
- Verify that missing optional content does not break layout or generation.
- Export the dataset, schema, and original media; document retention and perform an approved restore drill against a disposable target.
- Review editor access, dataset visibility, token scope, secret storage, quota monitoring, build-failure handling, and rollback to the last successful static artifact.
- Define hosted webhook idempotency, duplicate-build suppression, failure reporting, and secret-rotation procedures for Phase 11.

### Acceptance criteria

- [ ] Published Sanity content matches the reviewed source of truth and contains no PoC or reference-person content.
- [ ] Required records pass schema and build-time validation; deferred content is handled intentionally.
- [ ] Drafts, private credentials, and write capabilities are absent from public output.
- [ ] Dataset, schema, and original media have a documented export and restore path.
- [ ] Operational ownership, quota behavior, webhook handling, failure recovery, and rollback are documented.
- [ ] The CMS content foundation is approved before final visual and engineering acceptance.

### Commit

```text
test: verify sanity content readiness
```

## Phase 9: Verify desktop light-theme visuals, motion, and compatibility

### Viewports

- `1024x768`
- `1440x900`
- `1920x1080`

### Coverage

- Light theme only.
- Desktop navigation, closed and open states.
- Homepage sections, `/projects`, and all project-card collapsed and expanded states.
- Initial and scrolled navigation.
- Section start, middle, and end states, including pinned and marquee regions.
- Hover, focus, click, transition, and back-navigation behavior.
- Project-card expand, collapse, single-open-state, mouse, and keyboard behavior.
- Testimonials infinite scrolling.
- Shoot Mode entry, aiming, firing, and exit.
- Sound under browser autoplay policies.
- 3D models and WebGL fallback.
- Reduced-motion behavior.
- Continuous decorative motion, including the Experience breathing loop, is reviewed with all other site motion. Adopt one consistent pause/stop policy or document why a bounded alternative satisfies the accessibility requirement; `prefers-reduced-motion` must continue to disable it.
- Text wrapping, image cropping, overflow, mouse, and keyboard interaction.

### Acceptance criteria

- [ ] Intentional visual differences are documented.
- [ ] Stable regions match the approved baseline within documented rendering tolerances.
- [ ] Representative motion has been inspected for timing, easing, continuity, and dropped frames.
- [ ] The site-wide motion review resolves the Experience breathing loop's pause/stop behavior without adding a section-specific control that conflicts with the approved interface.
- [ ] Chromium visual checks pass; Safari and Firefox compatibility issues are resolved or documented.
- [ ] The dark-theme switch is not exposed in Version 1.
- [ ] At representative widths below `1024px`, the minimum safety check passes: no blank page, no horizontal page overflow, and usable navigation and contact links. This is not mobile visual-parity acceptance.

### Commit

```text
fix: refine desktop layouts
```

## Phase 10: Run engineering quality, Lighthouse, and accessibility checks

### Required commands

```bash
npm run lint
npm run build
```

### Additional checks

- Browser console errors and warnings.
- Broken internal routes, external links, and assets.
- Image dimensions, formats, and loading strategy.
- Desktop scrolling smoothness.
- WebGL loading and fallback behavior.
- Metadata, canonical URL, Open Graph, and icons.
- Semantic structure, keyboard navigation, visible focus, labels, contrast, and reduced motion.
- Lighthouse performance, accessibility, best-practices, and SEO findings.

### Acceptance criteria

- [ ] Lint exits successfully.
- [ ] Production build exits successfully.
- [ ] No unexplained console error, broken route, or missing production asset remains.
- [ ] Material accessibility issues are fixed or explicitly documented.
- [ ] Performance changes preserve the approved visual and interaction design.

## Phase 11: Create and verify a Vercel Preview

### Work

- Push the development branch to the private GitHub repository.
- Connect the repository to Vercel and create a Preview deployment.
- Configure `NEXT_PUBLIC_SITE_URL` for the intended environment.
- Verify fonts, images, icons, 3D models, audio, project-card expansion, Metadata, and sharing assets.
- Configure the server-side Sanity webhook secret in the Preview environment.
- Create the approved Sanity-to-Preview webhook and verify signature rejection, valid publish delivery, complete static rebuilding, duplicate-trigger behavior, build failure handling, and atomic deployment switching.
- Publish a controlled Sanity change and confirm that the Preview site updates only after a successful build.
- Repeat critical desktop light-theme interaction checks against the Preview URL.

### Acceptance criteria

- [ ] Preview deployment succeeds from a clean remote commit.
- [ ] Preview behavior matches the verified local production build.
- [ ] No private credential or obsolete Supabase variable is required.
- [ ] All critical routes and assets work over HTTPS.
- [ ] A real Sanity publish event reaches the hosted signed endpoint and produces the expected Preview update.
- [ ] Invalid signatures cannot trigger a build, and a failed rebuild leaves the previous successful Preview available.

### Commit

```text
chore: prepare vercel deployment
```

## Phase 12: Integrate `cms_build` into `personal-development`, then merge into `main`

### Preconditions

- Phase 10 checks pass.
- Phase 11 Preview is approved.
- `cms_build` contains only the approved CMS implementation and documentation.
- `personal-development` contains only intended, reviewed portfolio changes after CMS integration.

### Acceptance criteria

- [ ] The approved `cms_build` revision is integrated into `personal-development` with a reviewable history.
- [ ] `main` contains the approved personal portfolio.
- [ ] The merge preserves a clear, reviewable history.
- [ ] The merged commit builds successfully.
- [ ] The original baseline remains recoverable through a documented tag or offline backup.

## Phase 13: Deploy Production and connect the personal domain

### Work

- Promote the approved revision to Production.
- Bind the personal domain after the production deployment is stable.
- Supply the approved owner portrait, favicon/logo, social sharing image, canonical production domain, and their required rights metadata before enabling indexing.
- Enable indexing only after the four launch assets/domain requirements are present and the generated Metadata has been verified on Preview.
- Verify DNS, HTTPS, canonical domain behavior, and `www`/apex redirects.
- Verify Metadata, favicon, Open Graph image, fonts, project-card interactions, 3D assets, and audio on the production origin.

### Acceptance criteria

- [ ] Production uses the approved `main` revision.
- [ ] The personal domain resolves over HTTPS without redirect loops.
- [ ] Canonical URLs and social previews use the production domain.
- [ ] No source map, secret, private asset, or unintended environment value is exposed.

## Phase 14: Run post-release regression checks

### Production checklist

- `/`, `/projects`, and all project-card collapsed and expanded states.
- Expected 404 behavior for invalid routes.
- Light theme and desktop navigation.
- Page transitions, browser back navigation, and scroll restoration.
- Testimonials infinite scrolling.
- Shoot Mode, sound, mouse and keyboard behavior, 3D model, and WebGL fallback.
- Email, social, GitHub, and demo links.
- Page title, description, favicon, canonical URL, and social sharing image.
- Browser console and Network requests, including confirmation that Supabase traffic is absent.
- HTTPS and `www`/apex redirect behavior.
- At least one supported desktop viewport in Chromium, Firefox, and Safari.
- At representative mobile/tablet widths, verify only the Version 1 safety boundary: the page renders, does not overflow horizontally, and keeps navigation and contact links usable.

### Acceptance criteria

- [ ] Every critical production path has been checked after release.
- [ ] Any release issue is fixed through the approved development branch, verified in Preview, and promoted through the same release path.
- [ ] The final production revision and verification date are recorded.

## Deferred Version 2: Dark theme and responsive/mobile release

Version 2 begins only after Version 1 is released and a separate design package is approved. It must not delay Version 1 completion.

### Version 2A: Dark theme

- Define and approve dark-theme color, contrast, media, WebGL, motion, focus, hover, and reduced-motion states.
- Restore the theme switch only after the dark theme passes visual and accessibility verification.
- Verify every retained route and interaction in the approved desktop viewports.

### Version 2B: Mobile and tablet responsive design

- Define and approve layouts at `390x844`, `430x932`, and `768x1024`, plus boundary behavior around `1024px`.
- Specify navigation, typography, wrapping, spacing, Experience selection, Project expansion, Testimonials, media cropping, scroll regions, and missing/overlong content states.
- Preserve the approved Version 1 desktop layout unless a separately approved cross-viewport change is required.

### Version 2C: Touch and real-device verification

- Verify touch targets, focus behavior, scrolling, route transitions, browser back, single-open interactions, Shoot Mode, sound policy, 3D/WebGL fallback, and reduced motion.
- Test at least one real iOS device and one real Android device, with browser-console and network evidence where available.

### Version 2D: Preview, deployment, and regression

- Run the full root and Studio quality gates, publish a Version 2 Preview, and repeat Sanity webhook verification.
- Obtain owner acceptance before promotion, then deploy through the same approved branch and Preview path.
- Run post-release regression for both themes, desktop/mobile navigation, mouse, keyboard, touch, and the supported real-device matrix.

## Commit sequence

```yaml
# Existing baseline
chore: import portfolio-v3 baseline

# Planned commits
chore: capture and document portfolio baseline
docs: add baseline stabilization plan
refactor: remove supabase realtime features
fix: resolve deterministic lint violations
fix: stabilize react rendering behavior
chore: remediate dependency vulnerabilities
test: verify stabilized portfolio baseline
docs: add repository guidelines
feat: personalize global identity
feat: update homepage content
feat: replace portfolio projects
feat: update testimonials
test: verify sanity content readiness
fix: refine desktop layouts
chore: prepare vercel deployment
```

## Version 1 completion definition

Version 1 is complete when the light-theme, desktop-first portfolio is running on the production domain, the Phase 14 regression checklist and the below-`1024px` safety boundary pass, the original personal information and Supabase realtime behavior are absent, and the approved Version 1 design and interactions remain intact within documented browser and rendering tolerances. Version 2 dark-theme, responsive/mobile, touch, and real-device work is explicitly outside this completion gate.
