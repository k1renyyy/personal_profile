# Repository Guidelines

This file records stable repository facts, architecture boundaries, and safety constraints. It does not define task workflows, mandatory skill chains, or feature-specific implementation steps.

## Project Context

This is a statically exported Next.js App Router portfolio written in TypeScript and React. Tailwind CSS is the existing styling system, Sanity is the content source, Vitest covers unit tests, and Playwright covers browser regression tests.

## Repository Structure

- Routes and layouts: `app/`
- Reusable page sections: `app/components/sections/`
- Project content definitions: `app/data/`
- Shared UI primitives: `components/ui/`
- General helpers: `lib/`
- Static assets: `public/`
- Dynamic project routes: `app/projects/[slug]/`
- Browser tests: `tests/`
- Review evidence: `docs/baseline/`
- Repository-specific skills: `.agents/skills/`

## Architecture Boundaries

- Do not replace the existing framework, router, styling system, content architecture, or testing stack for a local feature or section redesign.
- Prefer existing dependencies and components. Add a dependency only when the current stack cannot reasonably meet an explicit requirement.
- A change to one section must not alter other sections, shared interactions, global styling, routes, or content behavior unless the request explicitly includes them.
- Preserve existing behavior and visual structure outside the approved change. A user-approved redesign takes precedence over the historical reference implementation within its stated scope.
- Keep design implementation, placeholder content, production content, assets, and Sanity integration as separate scopes. Do not expand from one into another without an explicit request.

## Implementation Principles

- Make the smallest change that fully satisfies the current request.
- Do not refactor, reformat, rename, or remove unrelated code.
- Do not introduce abstractions or configurability for hypothetical future needs.
- Match the surrounding code style and reuse established patterns when they fit.
- Remove only unused code created by the current change. Report unrelated issues without modifying them.
- Preserve user-authored and pre-existing uncommitted changes.
- When requirements have materially different interpretations, surface the difference before choosing one.

## Validation

- Match validation effort to the changed behavior and its regression risk.
- Use focused checks for local content, styling, and component changes. Expand coverage when changing shared components, routing, dependencies, build configuration, data contracts, or other cross-cutting behavior.
- Full browser and route regression is a release or integration check, not the default requirement for every local design iteration.
- Validate only the viewports, themes, input modes, and interactions affected by the approved scope unless a shared change creates broader risk.
- Do not manipulate runtime DOM, styles, clocks, or scroll position solely to manufacture a passing visual result.
- Do not update approved screenshots or other baselines merely to make a comparison pass; intentional baseline changes require explicit scope.
- Dependency auditing is relevant when dependencies or the lockfile change. Unrelated existing advisories should be reported without automatically expanding the task.

## Commands

- `npm ci`: install the locked dependency set.
- `npm install`: intentionally install or update dependencies.
- `npm run dev`: start the development server.
- `npm run lint -- --max-warnings=0`: run strict linting.
- `npm audit`: inspect dependency advisories.
- `npm run build`: build the static export and run Next.js type checks.
- `npm run start`: serve the completed export from `out/`.
- `npm run test:unit`: run Vitest unit tests.
- `npm run test:e2e`: run the configured Playwright suite.

## Code Conventions

Use functional React components, two-space indentation, semicolons, and double-quoted imports. Use PascalCase for components, `use` prefixes for hooks, camelCase for utilities, and lowercase or kebab-case for route folders. Prefer the `@/` alias for cross-directory imports and keep Tailwind classes close to their markup.

## Security and Assets

- Never commit `.env*`, private keys, credentials, or other secrets.
- Keep secrets in local environment files or approved deployment settings.
- Do not introduce a new backend, analytics provider, external service, or network dependency without an explicit requirement and appropriate security consideration.
- Verify usage rights before publicly distributing copied code, reference implementations, logos, fonts, or other third-party assets.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
