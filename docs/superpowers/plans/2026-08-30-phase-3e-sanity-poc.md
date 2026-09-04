# Phase 3E Sanity Proof-of-Concept Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify an isolated Sanity Studio and build-time content path that proves the approved CMS requirements without replacing the portfolio's repository content source or changing its production deployment.

**Architecture:** Keep the existing statically exported Next.js application at the repository root and add a separately runnable Sanity Studio under `studio/`. A narrow server-only adapter selects `repository` by default and fetches validated published data from the `poc` dataset only when `CONTENT_SOURCE=sanity-poc`; CMS errors fail the experimental build while the last successful static deployment and repository rollback source remain intact.

**Tech Stack:** Next.js 16.3.3, React 19.2.3, TypeScript 5, Sanity Studio/CLI, `@sanity/client`, GROQ, Vitest, Playwright, static export, npm workspaces kept separate through nested package manifests.

**Spec:** `docs/superpowers/specs/2026-08-30-phase-3e-sanity-poc-design.md`

## Global Constraints

- Work only on `cms_build`; do not merge the PoC into `personal-development` without explicit approval.
- Sanity project name is `Kiren Portfolio CMS PoC`; project ID is `foow59ov`; dataset name is exactly `poc`.
- The Studio lives in `studio/`; it is not mounted in the Next.js route tree and is not part of the portfolio static export.
- Default `npm run build` uses repository content and must not require Sanity credentials or availability.
- Only `CONTENT_SOURCE=sanity-poc` enables published Sanity reads during a PoC build.
- No read/write token, preview token, webhook secret, or other credential may enter Git history or a client bundle.
- Do not migrate the complete Phase 3D inventory, delete repository data, redesign components, create a Vercel project, add payment information, or accept a paid plan.
- The bounded cloud dataset contains one site-settings document, one profile document, two project documents, and one managed image only.
- Do not transmit personal content or upload media to Sanity without action-time user confirmation.
- Before editing Next.js code, install the locked dependencies and read the relevant current guides generated under `node_modules/next/dist/docs/`; if that directory is still unavailable, stop and record the missing generated documentation instead of relying on remembered APIs.
- Every task preserves strict lint, `npm audit --audit-level=low`, production build, and relevant Playwright gates.

---

### Task 1: Record the clean baseline and exact tool constraints

**Files:**
- Create: `docs/content/phase-3e-evidence.md`
- Modify: none
- Test: existing repository gates only

**Interfaces:**
- Consumes: approved design and clean `cms_build` branch at commit `7d8d423`.
- Produces: evidence headings and exact version/compatibility decisions referenced by every later task.

- [ ] **Step 1: Verify isolation and install the locked root dependencies**

Run:

```bash
git status --short --branch
git merge-base --is-ancestor 7d8d423 HEAD
npm ci
node --version
npm --version
```

Expected: branch is `cms_build`, the worktree is clean before `npm ci`, the ancestor check exits 0, and installation does not modify tracked manifests or lockfiles.

- [ ] **Step 2: Read the repository-bundled Next.js guidance before planning API usage**

Run:

```bash
rg --files node_modules/next/dist/docs | rg 'static-export|environment|metadata|data-fetch|server.*client'
```

Open and read the matching static export, environment variable, metadata, and server-side data-fetching guides in full. Record any Next.js 16.3.3 constraint that changes this plan in the evidence document before editing source.

- [ ] **Step 3: Capture the pre-PoC quality baseline**

Run:

```bash
npm run lint -- --max-warnings=0
npm audit --audit-level=low
npm run build
npm run test:e2e
```

Expected: all commands exit 0. If any gate fails before Sanity changes, stop and record the pre-existing failure rather than mixing its repair into Phase 3E.

- [ ] **Step 4: Create the evidence skeleton with concrete recorded values**

Create `docs/content/phase-3e-evidence.md` with these headings and fill the baseline fields from Steps 1–3:

```markdown
# Phase 3E Sanity PoC Evidence

## Scope and identifiers
## Baseline versions and gates
## Sanity CLI and dependency compatibility
## Cloud dataset and bounded records
## Schema validation
## Draft isolation and secret audit
## Repository and Sanity build modes
## CMS-unavailable behavior
## Export and restore evidence
## Trial, cost, and operational notes
## Visual and interaction regression
## Deferred Vercel webhook validation
## Phase 3F open issues
```

- [ ] **Step 5: Commit the baseline evidence**

```bash
git add docs/content/phase-3e-evidence.md
git commit -m "docs: record phase 3e baseline"
```

### Task 2: Scaffold the isolated Sanity Studio and `poc` dataset

**Files:**
- Create: `studio/package.json`
- Create: `studio/package-lock.json`
- Create: `studio/sanity.config.ts`
- Create: `studio/sanity.cli.ts`
- Create: `studio/tsconfig.json`
- Create: `studio/schemaTypes/index.ts`
- Modify: `.gitignore`
- Modify: `docs/content/phase-3e-evidence.md`
- Test: Studio typecheck/build and dependency audit

**Interfaces:**
- Consumes: Sanity project ID `foow59ov` and authenticated Sanity account created during onboarding.
- Produces: independently runnable Studio configured for project `foow59ov`, dataset `poc`, and a schema registry ready for Task 3.

- [ ] **Step 1: Inspect the current CLI instead of executing the website's generated agent prompt**

Run:

```bash
npx sanity@latest init --help
```

Record the resolved CLI version and supported non-interactive flags in `docs/content/phase-3e-evidence.md`. Do not continue if the current CLI cannot target an existing project, an explicit dataset, TypeScript, and an explicit output path.

- [ ] **Step 2: Initialize the Studio against the existing cloud project**

Run the current CLI's equivalent of:

```bash
npm create sanity@latest -- --project-id foow59ov --dataset poc --template clean --typescript --output-path studio
```

Select the free/no-payment path if the CLI asks about plans. Do not enable hosted Studio deployment, example schemas, or automatic Vercel integration. If creating `poc` is the final cloud-side confirmation, stop immediately before submission and request user confirmation.

- [ ] **Step 3: Inspect and minimize the generated diff**

Run:

```bash
git status --short
git diff -- .gitignore
sed -n '1,220p' studio/package.json
sed -n '1,220p' studio/sanity.config.ts
sed -n '1,160p' studio/sanity.cli.ts
```

Keep only the clean Studio, required configuration, and generated lockfile. Remove generated sample content or deployment configuration using `apply_patch`; do not rewrite unrelated root files.

- [ ] **Step 4: Verify Studio independently**

Run:

```bash
npm --prefix studio run build
npm --prefix studio audit --audit-level=low
```

Expected: both exit 0. Record exact Sanity, React, and CLI versions plus any trial-dependent behavior in the evidence document.

- [ ] **Step 5: Commit the isolated scaffold**

```bash
git add .gitignore studio docs/content/phase-3e-evidence.md
git commit -m "chore: scaffold isolated sanity studio"
```

### Task 3: Implement the bounded schemas and pure validation rules

**Files:**
- Create: `studio/schemaTypes/blockContent.ts`
- Create: `studio/schemaTypes/mediaRecord.ts`
- Create: `studio/schemaTypes/profile.ts`
- Create: `studio/schemaTypes/project.ts`
- Create: `studio/schemaTypes/siteSettings.ts`
- Create: `studio/schemaTypes/validation.ts`
- Create: `studio/structure.ts`
- Modify: `studio/schemaTypes/index.ts`
- Modify: `studio/sanity.config.ts`
- Modify: `studio/package.json`
- Modify: `studio/package-lock.json`
- Create: `studio/tests/validation.test.ts`
- Test: `studio/tests/validation.test.ts`

**Interfaces:**
- Consumes: `schemaTypes` array from the clean scaffold.
- Produces: `schemaTypes`, `isHttpsUrl(value: string): boolean`, `isFourDigitYear(value: string): boolean`, `uniqueOrder(values: Array<{order?: number}>): true | string`, and Sanity document types `siteSettings`, `profile`, `project`, `mediaRecord`.

- [ ] **Step 1: Add a Studio-local test runner**

Run:

```bash
npm --prefix studio install --save-dev vitest
```

Add scripts to `studio/package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

- [ ] **Step 2: Write failing tests for the pure validators**

Create `studio/tests/validation.test.ts`:

```ts
import {describe, expect, it} from "vitest"
import {isFourDigitYear, isHttpsUrl, uniqueOrder} from "../schemaTypes/validation"

describe("schema validators", () => {
  it("accepts HTTPS and rejects non-HTTPS URLs", () => {
    expect(isHttpsUrl("https://example.com")).toBe(true)
    expect(isHttpsUrl("http://example.com")).toBe(false)
    expect(isHttpsUrl("not-a-url")).toBe(false)
  })

  it("accepts only four-digit years", () => {
    expect(isFourDigitYear("2026")).toBe(true)
    expect(isFourDigitYear("26")).toBe(false)
    expect(isFourDigitYear("20260")).toBe(false)
  })

  it("requires unique integer order values", () => {
    expect(uniqueOrder([{order: 1}, {order: 2}])).toBe(true)
    expect(uniqueOrder([{order: 1}, {order: 1}])).toBe("Order values must be unique")
    expect(uniqueOrder([{order: 1}, {}])).toBe("Every record must have an integer order")
  })
})
```

- [ ] **Step 3: Run the test and verify the expected failure**

Run:

```bash
npm --prefix studio test -- tests/validation.test.ts
```

Expected: FAIL because `schemaTypes/validation.ts` does not exist.

- [ ] **Step 4: Implement the minimal pure validators**

Create `studio/schemaTypes/validation.ts` with the three exported signatures from the Interfaces block. `isHttpsUrl` must parse with `new URL` and require `protocol === "https:"`; `isFourDigitYear` must use `/^\d{4}$/`; `uniqueOrder` must reject missing/non-integer values before checking a `Set` for duplicates.

- [ ] **Step 5: Implement the five approved schema modules**

Use `defineType`, `defineField`, and Sanity validation rules to encode the exact field names and constraints from the approved design:

- `blockContent`: only paragraph/heading blocks, ordered/bullet lists, links, strong, and emphasis; no arbitrary HTML or embeds.
- `mediaRecord`: required asset, label, source, rights status, and placements; required alt for content placements; attribution required for `licensed` where applicable; `unknown` and `restricted` produce validation errors for publishable records.
- `profile`: required name, professional title, non-empty locations, short biography, full biography, and portrait reference.
- `project`: required name, role, four-digit year, summary, controlled description, non-empty highlights, integer order, and publication state.
- `siteSettings`: singleton-shaped SEO fields with HTTPS canonical URL, required share-image reference, indexing flag, and social name.

Create `studio/structure.ts` exporting `structure: StructureResolver`. It must expose fixed document IDs `siteSettings` and `profile` as singleton list items, filter those schema types out of the automatic document-type list, and leave `project` and `mediaRecord` as collections. Pass `structure` to `structureTool({structure})` in `sanity.config.ts`. Do not add schemas for the remaining Phase 3C content types.

- [ ] **Step 6: Run unit, type, build, and audit gates**

Run:

```bash
npm --prefix studio test
npm --prefix studio run typecheck
npm --prefix studio run build
npm --prefix studio audit --audit-level=low
```

Expected: all exit 0.

- [ ] **Step 7: Commit the bounded schema**

```bash
git add studio
git commit -m "feat: define sanity poc schemas"
```

### Task 4: Add the typed published-content query and fail-closed adapter

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `lib/content/types.ts`
- Create: `lib/content/sanity-query.ts`
- Create: `lib/content/load-content.ts`
- Create: `lib/content/repository-content.ts`
- Create: `lib/content/load-content.test.ts`
- Create: `vitest.config.ts`
- Modify: `app/layout.tsx`
- Test: `lib/content/load-content.test.ts`

**Interfaces:**
- Consumes: published Sanity documents named `siteSettings`, `profile`, `project`, and `mediaRecord`.
- Produces: `ContentSource = "repository" | "sanity-poc"`, `SanityQueryClient = {fetch<T>(query: string, params?: Record<string, unknown>): Promise<T>}`, `PortfolioContent`, `loadPortfolioContent(options?: {source?: ContentSource; client?: SanityQueryClient}): Promise<PortfolioContent>`, and `generateMetadata(): Promise<Metadata>` backed by the selected source.

- [ ] **Step 1: Install the smallest root dependencies**

Run:

```bash
npm install @sanity/client
npm install --save-dev vitest
```

Add root script `"test:unit": "vitest run"`. Do not install `next-sanity`, visual editing, preview toolbars, or presentation plugins.

- [ ] **Step 2: Write failing adapter tests with an injected fake client**

Create `lib/content/load-content.test.ts` covering these exact behaviors:

```ts
import {describe, expect, it, vi} from "vitest"
import {loadPortfolioContent} from "./load-content"

describe("loadPortfolioContent", () => {
  it("does not query Sanity in repository mode", async () => {
    const fetch = vi.fn()
    const content = await loadPortfolioContent({source: "repository", client: {fetch}})
    expect(fetch).not.toHaveBeenCalled()
    expect(content.siteSettings.siteTitle).toBeTruthy()
  })

  it("returns validated published content in sanity-poc mode", async () => {
    const fetch = vi.fn().mockResolvedValue(validSanityFixture)
    const content = await loadPortfolioContent({source: "sanity-poc", client: {fetch}})
    expect(content.projects).toHaveLength(2)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it("fails the PoC build when Sanity is unavailable", async () => {
    const fetch = vi.fn().mockRejectedValue(new Error("offline"))
    await expect(loadPortfolioContent({source: "sanity-poc", client: {fetch}})).rejects.toThrow(
      "Sanity PoC content could not be loaded",
    )
  })

  it("rejects drafts, wrong record counts, and unsafe canonical URLs", async () => {
    const fetch = vi.fn().mockResolvedValue(invalidSanityFixture)
    await expect(loadPortfolioContent({source: "sanity-poc", client: {fetch}})).rejects.toThrow(
      "Invalid Sanity PoC content",
    )
  })
})
```

Define `validSanityFixture` and `invalidSanityFixture` in the same test file with one settings record, one profile, two ordered projects, and one media record. The invalid fixture includes a `drafts.` ID and an `http:` canonical URL.

- [ ] **Step 3: Run the adapter test and verify the expected failure**

Run:

```bash
npm run test:unit -- lib/content/load-content.test.ts
```

Expected: FAIL because `load-content.ts` does not exist.

- [ ] **Step 4: Implement focused content types and repository fallback**

Define the minimal `PortfolioContent` shape used by the PoC. `repository-content.ts` must construct the current metadata values and two representative existing project records without deleting or modifying `app/data/projects.ts`. It is the default source and requires no environment variables.

- [ ] **Step 5: Implement one published GROQ query and injected client boundary**

`sanity-query.ts` must:

- create a client only on the server with project ID `foow59ov`, dataset `poc`, `useCdn: false`, and a pinned current API date recorded in evidence;
- query only IDs that do not match `drafts.**`;
- order projects by explicit `order asc`;
- resolve required media metadata without fetching secret fields;
- never set a token for published build-time reads.

`load-content.ts` must parse `CONTENT_SOURCE`, accept only `repository` or `sanity-poc`, validate record counts and HTTPS metadata, and wrap CMS errors with the exact messages asserted above. Do not silently fall back from `sanity-poc` to repository mode.

- [ ] **Step 6: Connect only metadata generation to the adapter**

Replace the static metadata export in `app/layout.tsx` with an async `generateMetadata` function that calls `loadPortfolioContent()` and maps `siteSettings` fields. Keep the rendered layout, fonts, providers, Navbar, Shoot Mode, scrolling, and children markup unchanged. In default repository mode the generated metadata must equal the current values byte-for-byte.

- [ ] **Step 7: Run unit, lint, audit, and both build modes with a fake-client test boundary**

Run:

```bash
npm run test:unit
npm run lint -- --max-warnings=0
npm audit --audit-level=low
npm run build
```

Expected: all exit 0; default build makes no Sanity request. The real `sanity-poc` build is deferred until Task 5 has valid published records.

- [ ] **Step 8: Commit the build-time adapter**

```bash
git add package.json package-lock.json vitest.config.ts lib/content app/layout.tsx
git commit -m "feat: add sanity poc content adapter"
```

### Task 5: Create and publish the bounded cloud records

**Files:**
- Create: `studio/fixtures/poc-content.ndjson`
- Modify: `docs/content/phase-3e-evidence.md`
- Test: Sanity query results and Studio validation

**Interfaces:**
- Consumes: schemas from Task 3 and query contract from Task 4.
- Produces: exactly one settings record, one profile, two projects, and one media record in dataset `poc`; one intentionally unpublished draft revision for isolation testing.

- [ ] **Step 1: Prepare a non-secret import fixture without uploading it**

Create deterministic document IDs `siteSettings`, `profile`, `project-poc-1`, `project-poc-2`, and `media-poc-1`. Use only content explicitly approved in Phase 3D or clearly label non-production strings with `PoC`. Do not include tokens, email, phone number, unpublished resume data, or a reference-site asset.

- [ ] **Step 2: Request action-time confirmation for the exact outbound data**

Show the user the five document summaries and the exact local image proposed for upload. State that this will transmit those values and the image to Sanity project `foow59ov`, dataset `poc`. Do not import or upload until the user confirms.

- [ ] **Step 3: Import documents and upload one approved image**

Use the authenticated Studio CLI from `studio/` to import the fixture and upload the approved image. Patch the resulting asset reference into `media-poc-1`, then link the same media record from the settings/profile test documents as needed. Do not create additional records.

- [ ] **Step 4: Create one draft-only change through Studio**

Change a clearly labeled PoC text field without publishing it. Record the published value, draft value, and document IDs in the evidence document; do not include tokens or private URLs.

- [ ] **Step 5: Verify bounded counts and draft isolation**

Run authenticated CLI queries that separately count published IDs and `drafts.**` IDs. Then run the public published query from Task 4 without a token. Expected: the public result contains exactly the bounded published records and never contains the draft-only value.

- [ ] **Step 6: Run the real Sanity PoC build**

Run:

```bash
CONTENT_SOURCE=sanity-poc npm run build
```

Expected: exit 0, metadata comes from the published settings record, and no token is required for the published query.

- [ ] **Step 7: Commit only safe fixtures and evidence**

Inspect `studio/fixtures/poc-content.ndjson` for personal data, asset tokens, and generated secrets. Commit it only if it contains the approved non-secret bounded fixture; otherwise add the fixture path to `.gitignore` and commit only reproducible redacted instructions and evidence.

```bash
git add studio/fixtures .gitignore docs/content/phase-3e-evidence.md
git commit -m "test: verify bounded sanity content"
```

### Task 6: Prove failure behavior, secret isolation, export, and recovery

**Files:**
- Create: `scripts/verify-client-secrets.mjs`
- Modify: `package.json`
- Modify: `docs/content/phase-3e-evidence.md`
- Modify: `.gitignore`
- Test: offline build, client bundle scan, Sanity export and restore check

**Interfaces:**
- Consumes: both content-source modes and the populated `poc` dataset.
- Produces: `npm run test:secrets`, documented fail-closed behavior, and a verified export artifact outside Git.

- [ ] **Step 1: Write the failing client-secret scanner test**

Create `scripts/verify-client-secrets.mjs` to scan `.next/static`, `out`, and emitted client manifests for the values of `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`, and `SANITY_PREVIEW_TOKEN`. It must exit 1 if any defined secret value is found and exit 0 when none are present. Add `"test:secrets": "node scripts/verify-client-secrets.mjs"`.

- [ ] **Step 2: Verify default and PoC builds contain no secrets**

Run:

```bash
npm run build
npm run test:secrets
CONTENT_SOURCE=sanity-poc npm run build
npm run test:secrets
```

Expected: all exit 0. Also run `rg -n "SANITY_.*TOKEN|foow59ov" out .next/static`; the project ID may appear, but token names and token values must not.

- [ ] **Step 3: Prove CMS-unavailable behavior**

Run the already deployed static `out/` with `npm run start`, then make the Sanity endpoint unavailable only for a new `CONTENT_SOURCE=sanity-poc` build using an injected fake client test or a deliberately invalid local endpoint supported by the adapter. Expected: the existing served static site remains healthy, while the new PoC build exits nonzero with `Sanity PoC content could not be loaded`. Do not alter DNS, system proxy, firewall, or the cloud project.

- [ ] **Step 4: Export the dataset and original media outside Git**

Create a temporary directory with `mktemp -d`, then use the current authenticated Sanity CLI export command with asset export enabled for dataset `poc`. Add any repository-local export path to `.gitignore`. Record CLI version, command shape, document count, asset count, archive size, and checksum in evidence; do not record credentials.

- [ ] **Step 5: Verify restore into a disposable local check without changing `poc`**

Inspect the export manifest/NDJSON and asset files. If Sanity requires a cloud dataset for an actual restore, do not create it without separate user approval; instead perform the CLI-supported dry run or import validation and record that limitation explicitly. Verify all five stable document IDs, references, controlled-rich-text structures, and the original asset are present.

- [ ] **Step 6: Verify repository rollback**

Run:

```bash
unset CONTENT_SOURCE
npm run build
npm run test:e2e
```

Expected: both exit 0 with no Sanity availability or credentials required.

- [ ] **Step 7: Commit recovery tooling and evidence**

```bash
git add scripts/verify-client-secrets.mjs package.json .gitignore docs/content/phase-3e-evidence.md
git commit -m "test: verify sanity failure and recovery"
```

### Task 7: Run the full local Phase 3E verification and prepare the Phase 3F handoff

**Files:**
- Modify: `docs/content/phase-3e-evidence.md`
- Modify: `docs/development-roadmap.md`
- Test: root and Studio complete gates

**Interfaces:**
- Consumes: all local PoC deliverables and evidence.
- Produces: a review-ready Phase 3E result with Vercel webhook work explicitly deferred or separately approved.

- [ ] **Step 1: Run every root quality gate from a reproducible install**

Run:

```bash
npm ci
npm run test:unit
npm run lint -- --max-warnings=0
npm audit --audit-level=low
npm run build
npm run test:secrets
npm run test:e2e
```

Expected: all exit 0.

- [ ] **Step 2: Run every Studio quality gate from its locked install**

Run:

```bash
npm --prefix studio ci
npm --prefix studio test
npm --prefix studio run typecheck
npm --prefix studio run build
npm --prefix studio audit --audit-level=low
```

Expected: all exit 0.

- [ ] **Step 3: Re-run the real published PoC build and focused browser checks**

Run:

```bash
CONTENT_SOURCE=sanity-poc npm run build
npm run test:secrets
npm run test:e2e -- --project=chromium
```

Compare the required stabilized desktop/mobile screenshots and inspect console, network, theme, navigation, Shoot Mode, audio, WebGL, Testimonials, touch, keyboard, and reduced-motion behavior. Metadata may differ only by the approved PoC settings; DOM geometry and interactions must not regress.

- [ ] **Step 4: Complete the evidence and roadmap status without claiming adoption**

Document dependency diffs, environment variables, trial limitations, operating duties, failure recovery, export contents, rollback steps, and every observed difference. Mark Phase 3E local PoC checks complete in `docs/development-roadmap.md`, but leave Vercel webhook validation unchecked and Phase 3 overall incomplete until the user explicitly approves the temporary Vercel resource and Phase 3F decision.

- [ ] **Step 5: Commit the local Phase 3E handoff**

```bash
git add docs/content/phase-3e-evidence.md docs/development-roadmap.md
git commit -m "docs: report local sanity poc results"
```

- [ ] **Step 6: Stop for the Vercel resource decision**

Present the completed local evidence and ask whether to create a temporary Vercel test project for the signed publish-webhook/full-static-rebuild test. Do not create it, deploy, merge, or proceed into Phase 3F without explicit approval.
