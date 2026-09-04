# Phase 3E Sanity Proof-of-Concept Design

## Purpose

Validate whether Sanity can provide a safe, understandable editing workflow for the existing statically exported portfolio without turning the proof of concept into production integration. The PoC must preserve the current repository content source, visual structure, motion, routes, and deployed-site behavior until Phase 3F makes an explicit adoption decision.

The isolated Sanity cloud project is `Kiren Portfolio CMS PoC` with project ID `foow59ov`. It is a test resource, not the production content system. Vercel resource creation is deferred until the local CMS path, draft isolation, static build, fallback, and export checks pass.

## Success criteria

Phase 3E is ready for Phase 3F review only when all of the following are demonstrated:

- A versioned Sanity Studio exists under `studio/` on the isolated `cms_build` branch.
- An isolated `poc` dataset contains exactly the bounded validation set: one site-settings document, one profile document, two project documents, and one managed image with alternative text and rights metadata.
- The schemas enforce the relevant approved Phase 3C field rules, stable ordering, controlled rich text, publishing restrictions, and media metadata requirements.
- Draft content is visible only through an authenticated preview path and is absent from public/build-time published queries.
- The Next.js application can read published PoC content at build time without adding a public write token or a draft token to the client bundle.
- A missing or unavailable Sanity service does not damage the currently published site; repository content remains the rollback source throughout the PoC.
- Content, schema source, dataset records, and original media can be exported in a documented, restorable form.
- The repository can return to its original content source by reverting the PoC changes and without reconstructing lost data.
- Strict lint, low-severity audit, production build, route, console, network, visual, and interaction checks remain green for the portion of the site touched by the PoC.
- Only after the preceding checks pass, a separate temporary Vercel project may validate a signed Sanity publish webhook and complete static rebuild. No production deployment is modified.

## Selected architecture

### Repository layout

The Studio will be a separate Sanity application inside `studio/`, committed with the PoC branch. Keeping it inside the repository makes schemas, configuration, dependency changes, and export instructions reviewable and recoverable with the rest of the experiment. It will not be mounted into the Next.js route tree or deployed as part of the portfolio static export.

The existing Next.js application remains at the repository root. CMS access code will be a narrow build-time adapter rather than a new general content framework. Existing repository data remains present and usable until a later production-integration design explicitly approves migration.

### Dataset and environment boundary

The PoC uses a dedicated dataset named `poc`. It must not use a dataset named `production`, and it must not contain the full personal-content inventory. Public configuration may include the Sanity project ID and dataset name. Read/write tokens, preview tokens, webhook secrets, and other credentials remain in ignored local environment files or managed deployment secrets and must never enter the browser bundle or Git history.

The Sanity project currently shows a 30-day Growth Trial. Phase 3E must record which tested capabilities depend on the trial and what remains available after the trial; no paid upgrade or payment method is authorized by this design.

### Content model

The PoC implements only the smallest representative subset needed to test the approved platform-neutral model:

- `siteSettings`: site title, description, canonical URL, indexing flag, and default share-image reference.
- `profile`: name, professional title, locations, short biography, controlled rich-text biography, and portrait reference.
- `project`: the six owner-facing fields from Phase 3C plus internal stable order and publication state.
- `mediaRecord`: original image, label, alternative text, source, rights status, attribution, placements, and focal point where supported.

The content set is one site-settings record, one profile record, two projects, and one image. Missing final portrait, share image, formal domain, and testimonials will not be replaced with reference-site or invented production data. Clearly labeled PoC-only values may be used solely where a schema behavior cannot otherwise be exercised.

Sanity controls content values, order, publication state, media, and SEO metadata. Next.js remains the sole owner of DOM, Tailwind classes, breakpoints, page composition, routing, animation hooks, image rendering behavior, Shoot Mode, audio, and WebGL.

### Query, preview, and fallback behavior

Published queries use the Content Lake API at build time and explicitly exclude drafts. They are deterministic and ordered by explicit fields rather than creation timestamps.

Draft preview is a development-only authenticated path. It may use a server-only read token while running locally, but it must not require enabling Draft Mode, ISR, runtime CMS requests, or route handlers in the exported production site. If current Next.js constraints make an authenticated local preview incompatible with the existing application configuration, the PoC will keep preview as a separate development command or preview surface rather than weakening the static-export boundary.

The repository content source remains the default rollback source. CMS failure tests must distinguish two cases:

1. A previously successful static deployment remains available when Sanity is down.
2. A new build fails closed or uses an explicitly invoked PoC fallback without silently publishing stale drafts, partial content, or invented values.

The PoC will document the selected failure behavior after testing. It will not silently catch all CMS errors and claim success with ambiguous data.

### Export and recovery

The PoC must demonstrate export of the `poc` dataset and original media using supported Sanity tooling. The repository already retains the schema source. Export evidence must record commands, tool versions, resulting artifact contents, and a restoration check or dry-run that proves records and references are preserved.

Exports are review evidence and must not be committed if they contain personal data, credentials, or unnecessarily large binary media. The final report will identify the secure storage location and cleanup procedure for temporary export artifacts.

## Alternatives considered

### Separate sibling repository or directory

Sanity's onboarding recommends creating Studio beside an existing application. That keeps the two applications physically separate, but it would place the PoC schema outside the current branch's review and rollback boundary. For this isolated experiment, a nested `studio/` application is easier to audit and remove.

### Embedded Studio route inside Next.js

Embedding Studio into the portfolio would reduce the number of independently run applications, but it would mix an authenticated editing application with a static public export and increase production coupling before Sanity is approved. This is rejected for Phase 3E.

### Immediate production-style integration

Migrating all content, deleting repository data, creating the final Vercel project, or wiring production webhooks immediately would produce more realistic infrastructure but would make the PoC hard to reverse and exceed the approved scope. These actions remain out of scope until the bounded checks pass and Phase 3F approves adoption.

## Implementation boundaries

- Work only on `cms_build`; do not merge the PoC into `personal-development` without explicit approval.
- Do not run or paste Sanity's generated agent prompt without reviewing every proposed command and file change.
- Do not migrate all Phase 3D content or change production page copy during the PoC.
- Do not remove or rename current repository content files.
- Do not redesign components, change media geometry, or refactor unrelated application code.
- Do not create a Vercel project until the local acceptance gates pass and the user separately approves that external resource.
- Do not add payment information, accept a paid plan, or rely on trial-only behavior without documenting it.
- Do not create API tokens, webhook secrets, or access changes without action-time user confirmation.

## Verification strategy

Verification proceeds in bounded stages:

1. Confirm the branch and clean dependency baseline; record Node, npm, Next.js, React, and Sanity versions.
2. Scaffold the nested Studio and inspect the complete dependency diff before accepting it.
3. Test schema validation with valid and invalid documents, including singleton limits, stable order, controlled rich text, image metadata, and publication restrictions.
4. Create only the bounded test records and verify published-versus-draft query isolation.
5. Add the narrow Next.js build-time adapter and verify that no secret appears in client output.
6. Run static build and CMS-unavailable tests while preserving the repository rollback source.
7. Export content, schema, and original media and verify recoverability.
8. Run strict lint, audit, production build, route smoke checks, and focused desktop/mobile visual and interaction comparisons.
9. If all local gates pass and the user approves, create a temporary Vercel test project and validate signed webhook-triggered full rebuild behavior.

Every dependency or visual difference must be recorded for Phase 3F. Screenshot baselines are not updated merely to make comparisons pass.

## Failure handling

- If the Sanity SDK or Studio does not support the repository's exact Next.js 16, React 19, and Node combination, stop and document the supported version boundary rather than forcing dependency resolutions.
- If authenticated preview requires weakening static export or exposing a token, keep preview isolated or mark the requirement failed; do not change production architecture implicitly.
- If schema rules cannot prevent invalid publication, record the exact gap and enforce no silent client-side workaround as equivalent proof.
- If complete export omits relationships, structured rich text, metadata, or original assets, Phase 3E fails the exit requirement pending a documented remedy.
- If Sanity downtime can break the last successful deployed site, do not proceed to production integration.
- If any dependency, route, visual, motion, or interaction regression appears, stop at the responsible stage and repair or revert that isolated change before continuing.

## Deliverables

- Versioned `studio/` application and Sanity schemas on `cms_build`.
- Narrow build-time client/query adapter and bounded PoC content mapping.
- Automated schema/query/security tests where practical.
- Phase 3E evidence covering draft isolation, static build, failure behavior, export, rollback, dependency changes, environment variables, cost/trial implications, and any Vercel webhook test.
- A Phase 3F decision package that recommends adoption, repository content, or rejection without merging the PoC by default.

## Out of scope

- Full content migration or final personal-content publication.
- Production CMS adoption, production Vercel deployment, final domain configuration, or SEO launch.
- Draft Mode, ISR, targeted revalidation, or public runtime CMS requests.
- A page builder, CMS-controlled layout, arbitrary HTML, scripts, styles, or animation parameters.
- Final portrait, Open Graph image, testimonial authorization, or missing rights clearance.
- Removing project routes or implementing the later approved content-driven page redesign.
