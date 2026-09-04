# Phase 3F Sanity Production Foundation Evidence

Date: 2026-08-30  
Branch: `cms_build`  
Sanity project: `foow59ov`

## Dataset boundary

- The installed CLI is `@sanity/cli/8.5.0` on Node.js `v24.15.0`.
- The installed command family is `sanity datasets`; `datasets create [NAME] --visibility public` is the documented non-interactive syntax.
- The pre-mutation dataset listing already contained both `production` and `poc`. Because `production` existed unexpectedly, no create, overwrite, visibility change, deletion, or import command was run.
- `sanity datasets visibility get production` returned `public`.
- An unauthenticated `@sanity/client` request using API date `2026-08-30`, `perspective: "published"`, and `useCdn: false` returned:
  - `count(*)`: `0`
  - `count(*[_id in path("drafts.**")])`: `0`
- `poc` remained present. No query or command wrote to it.

Commands used for the read-only verification:

```bash
cd studio
SANITY_STUDIO_PROJECT_ID=foow59ov SANITY_STUDIO_DATASET=production npx sanity dataset --help
SANITY_STUDIO_PROJECT_ID=foow59ov SANITY_STUDIO_DATASET=production npx sanity dataset create --help
SANITY_STUDIO_PROJECT_ID=foow59ov SANITY_STUDIO_DATASET=poc npx sanity dataset list
SANITY_STUDIO_PROJECT_ID=foow59ov SANITY_STUDIO_DATASET=production npx sanity dataset visibility get production
```

The anonymous count check used `@sanity/client` without a token. This proves public read access without granting draft, write, Studio-account, or project-management access.

## Studio smoke check

The Studio was started locally against `production`:

```bash
SANITY_STUDIO_PROJECT_ID=foow59ov SANITY_STUDIO_DATASET=production npm run dev -- --host 127.0.0.1 --port 3333
```

- `http://localhost:3333/` returned HTTP 200, title `Sanity Studio`, the `Kiren Portfolio CMS` login screen, and no browser-console errors.
- The isolated headless browser did not share the owner's Sanity login, so it could not inspect authenticated document lists. Chinese navigation and all three fixed singleton entries are instead covered by the passing Studio structure test.
- `http://127.0.0.1:3333/` prompted for an additional CORS origin. No CORS origin was added because that cloud configuration change is outside the approved Phase 3F mutation boundary; the approved `localhost` origin worked without that change.
- The server was stopped without creating or publishing any document.

## Resource-mutation statement

No content, fixture, token, webhook, CORS origin, Vercel project, deployment, payment method, or plan change was created during this verification. The required public, empty `production` dataset already existed and was therefore verified rather than recreated.

## Schema, Studio, and query foundation

- The production registry contains `blockContent`, `siteSettings`, `profile`, `homepage`, `education`, `experience`, `capabilityGroup`, `project`, `testimonial`, `socialLink`, and `mediaRecord` in the approved order.
- Studio labels, descriptions, validation messages, singleton entries, and list navigation are owner-facing Chinese while field names remain stable English identifiers.
- `siteSettings`, `profile`, and `homepage` use fixed singleton IDs. List documents use non-negative `order` and default `isVisible` to false.
- Visible Testimonials require `permissionStatus: "granted"`. Media with `unknown` or `restricted` rights fails validation. The first Project schema contains no slug, layout, component, animation, image, video, demo URL, or detail-page instruction.
- Studio configuration uses only `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`. The tracked example selects `foow59ov/production`; the README documents an explicit one-command `poc` override and the token/webhook-secret boundary.
- Root production queries use `@sanity/client` `8.4.0`, API date `2026-08-30`, `perspective: "published"`, and `useCdn: false`. Every domain excludes `drafts.**`; ordered lists require `isVisible == true`; Testimonials also require granted permission.
- `CONTENT_SOURCE` still defaults to `repository`. `sanity` is the explicit production source and requires root-only `SANITY_PROJECT_ID` and `SANITY_DATASET`; `sanity-poc` remains explicitly pinned to `foow59ov/poc` for Phase 3E regression checks.
- No page component, route, Tailwind file, project data file, public asset, animation, audio, Shoot Mode, or WebGL implementation changed in Phase 3F.

## Strict failure and explicit rollback

Focused tests prove that the production adapter rejects network failure, invalid records, draft IDs, duplicate orders, unsafe social links, invalid media rights, and visible Testimonials without granted permission. It does not merge repository values into invalid Sanity content.

Before running the mocked offline failure, SHA-256 checksums were recorded for `out/index.html` and `out/404.html`. Both checksums remained unchanged afterward. This models the deployment rule: a failed new build must not replace the last successful static output.

The explicit local rollback is:

```bash
unset CONTENT_SOURCE SANITY_PROJECT_ID SANITY_DATASET
npm run build
```

That command succeeded with the repository source and generated all `12/12` static pages. A hosted rollback remains a manual configuration/commit restoration followed by a complete build; Phase 3F does not add automatic fallback.

## Dataset exports and restoration boundary

The installed CLI exported both datasets to `/tmp/phase-3f-sanity-exports.GYb0X3`, outside Git:

- `production.tar.gz`: 209 bytes; 0 documents, 0 assets; contains empty `data.ndjson` and `assets.json` plus empty asset directories.
- `poc.tar.gz`: approximately 480 KiB; 6 documents and 1 original PNG asset; the archive contains `data.ndjson`, `assets.json`, and the exported image.

Commands:

```bash
SANITY_STUDIO_PROJECT_ID=foow59ov SANITY_STUDIO_DATASET=production npx sanity dataset export production /tmp/phase-3f-sanity-exports.GYb0X3/production.tar.gz
SANITY_STUDIO_PROJECT_ID=foow59ov SANITY_STUDIO_DATASET=poc npx sanity dataset export poc /tmp/phase-3f-sanity-exports.GYb0X3/poc.tar.gz
```

These temporary files are verification artifacts, not a durable owner backup. Once formal content is entered, Phase 8 must export the full dataset and original media to an owner-selected private persistent location. Restoration/import remains an explicit owner-authorized operation; no import was performed in Phase 3F.

## Dependency and plan observations

- Root: Next.js `16.3.3`, `@sanity/client` `8.4.0`, Vitest `4.1.11`.
- Studio: Sanity `6.11.0`, `@sanity/vision` `6.11.0`, Vitest `4.1.11`; CLI `8.5.0`.
- Both root and Studio low-severity audits reported 0 vulnerabilities.
- The Sanity project UI displayed a Growth Trial during setup, but this foundation uses only public dataset reads, authenticated Studio editing, schema validation, and export. No trial-only deployment, payment, hosted webhook, token, or premium workflow is a Phase 3F dependency. Current plan limits must be reviewed again before a future paid or production-operational decision.
- A real hosted Sanity-to-Vercel signed webhook and atomic Preview deployment remain deferred to Phase 11.

## Verification results

Root gates:

- `npm ci`: 572 packages installed; 0 vulnerabilities.
- `npm run lint -- --max-warnings=0`: passed with zero warnings.
- `npm audit --audit-level=low`: 0 vulnerabilities.
- `npm run test:unit`: 3 files, 21 tests passed.
- `npm run test:webhook`: 1 file, 3 tests passed.
- `npm run build` with Sanity source variables unset: compiled, type-checked, and generated 12/12 static pages.
- `npm run test:secrets`: passed after a fresh build with four unique read/write/preview/webhook sentinel values; all 4 configured values were absent from client and static output.
- `npm run test:e2e`: 6 passed, 6 skipped by the existing browser-specific test design, 0 failed. A Firefox route-probe false failure was traced to sequential navigation cancelling a deferred previous-page chunk; isolating each route in its own page removed that test-induced cancellation without changing application code or baselines.

Studio gates against `production`:

- `npm ci`: 1,244 packages installed; 0 vulnerabilities.
- `npm test`: 2 files, 20 tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed with zero warnings.
- `npm run build`: passed and bundled only the two public Studio identifiers.
- `npm audit --audit-level=low`: 0 vulnerabilities.

## Explicitly missing formal content

`production` remains intentionally empty. Formal portrait media, default social share image, canonical personal domain, and authentic authorized Testimonials are still missing. Full Phase 4–7 identity, homepage, Experience, capability, Project, and social content has not been migrated. Test fixtures are local validation data only and were never uploaded.

## Owner-acceptance boundary

The owner explicitly accepted the verified Phase 3F implementation on 2026-08-30. The Phase 3F progress checkbox is complete. This acceptance does not start Phase 4 automatically and does not authorize branch integration or deployment.
