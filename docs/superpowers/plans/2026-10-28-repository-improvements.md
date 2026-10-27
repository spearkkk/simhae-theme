# Simhae Repository Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve repository reliability and maintainability across port validation, documentation, website data ownership, source readability, hero asset delivery, and Vercel deployment readiness.

**Architecture:** Keep `palettes/palette.yaml` and `data/ports.json` as canonical data sources. Strengthen validation around those contracts, derive website port cards from the index, align docs with the current site, then handle formatting and image delivery as independent changes. Document and verify Vercel's `web/` root configuration and access to shared root files. Avoid changing palette values or the established visual contract.

**Tech Stack:** Node.js 24+, npm workspaces, Next.js 16, TypeScript, Node test runner, Playwright.

**Spec:** `AGENTS.md`, `web/DESIGN.md`, `docs/architecture.md`, `docs/maintenance.md`.

## Global Constraints

- `palettes/palette.yaml` is the only editable palette source; each variant keeps all 24 values.
- `data/ports.json` owns application links and availability; do not reuse Deep Oceanic Next marketplace IDs.
- `web/` supports Korean and English, and both locales stay aligned.
- Follow `web/DESIGN.md` for all web UI changes; use semantic palette tokens and existing shadcn components.
- Do not commit generated build output, caches, credentials, or screenshots of private code.
- Before delivery, run `npm test`, `npm run validate`, `npm run lint`, `npm run build`, `npm run typecheck`, and `npm run test:e2e`.

## Review Focus

- Malformed or incomplete port records should fail validation with a field-specific error.
- Optional screenshot fields should be accepted only when their local assets exist; omitted screenshots remain valid.
- UI cards must reflect the canonical port index and remain correct in both locales and on narrow screens.
- Documentation must not describe the current landing page as unfinished when it has shipped its design and copy.
- Image conversion must preserve the hero crop, readability, reduced-motion behavior, and acceptable visual quality.
- A Vercel build must install from the committed root lockfile and retain access to shared files outside `web/`.

---

### Task 1: Strengthen application port validation

**Files:**
- Modify: `scripts/validate.mjs`
- Modify: `tests/palette.test.mjs` or create `tests/ports.test.mjs`
- Reference: `data/ports.json`

**Deliverable:** Invalid port records fail `npm run validate` with errors that identify the record and field; the current port index passes.

- [x] Add failing cases for missing required fields, invalid field types, invalid/duplicate IDs, unsupported variants/statuses, malformed or non-HTTPS URLs, and duplicate or missing required port IDs.
- [x] Add cases proving an omitted screenshot is allowed and a supplied missing screenshot is rejected.
- [x] Refactor port checks into a small validation function with precise error messages; retain the intended three port IDs (`intellij`, `chrome`, `zen`) unless the canonical index contract is deliberately changed.
- [x] Run `npm test` and `npm run validate`; both pass, and each malformed fixture fails for the expected reason.

### Task 2: Align repository documentation with the current site

**Files:**
- Modify: `README.md`
- Modify: `web/README.md`
- Review: `docs/architecture.md`, `docs/maintenance.md`

**Deliverable:** Public and setup docs describe the currently implemented bilingual landing site accurately and do not contradict each other.

- [x] Replace the outdated “foundation/future design” status in `README.md` with a concise description of the current website and supported routes.
- [x] Update `web/README.md` to distinguish implemented site behavior from future deployment/setup work; retain accurate Vercel and build requirements.
- [x] Cross-check palette ownership, locale routing, deployment behavior, and deferred work against architecture and maintenance docs; change only statements that are stale or conflicting.
- [x] Review the rendered Markdown content and confirm all commands and linked paths still exist.

### Task 3: Drive the application showcase from the canonical port index

**Files:**
- Modify: `web/src/lib/content.ts`
- Modify: `web/src/components/AppShowcase.tsx`
- Modify: `web/src/messages/en.json`
- Modify: `web/src/messages/ko.json`
- Modify: `tests/e2e/landing.spec.ts` and/or add a focused content test
- If needed, modify: `data/ports.json`

**Deliverable:** App cards derive identity, links, availability, variants, and optional imagery from `data/ports.json`; localized presentation strings remain in locale messages.

- [x] Define and validate a typed port shape for the fields consumed by the site; enrich `data/ports.json` only for missing presentation data such as screenshot paths.
- [x] Add localized labels for port status/installation as needed, keeping English and Korean message keys identical.
- [x] Render cards from `ports`; preserve the existing gallery treatment and use image metadata only where an image exists.
- [x] Add coverage that checks each canonical port appears once, its repository/installation links match the data, and absent screenshots do not produce broken image elements.
- [x] Read `web/DESIGN.md` before editing UI; inspect desktop and 320–390px mobile renderings, keyboard focus, and reduced-motion behavior. Run targeted E2E checks.

### Task 4: Improve readability of validation, sync, and tests

**Files:**
- Modify: `scripts/validate.mjs`
- Modify: `scripts/sync-palette.mjs`
- Modify: `scripts/lib/palette.mjs`
- Modify: `tests/*.test.mjs`

**Deliverable:** Existing behavior remains unchanged while scripts and tests use consistent project formatting, named helpers, and readable failure messages.

- [x] Record baseline behavior with current test/validation commands before refactoring.
- [x] Format scripts and tests using the repository’s chosen formatter or established lint style; do not add a formatter dependency unless necessary.
- [x] Extract helpers only where they clarify a distinct validation, argument-parsing, or filesystem responsibility; preserve sync safety guarantees and messages.
- [x] Run `npm test` and `npm run validate`; verify the dirty-source and locally-modified-consumer sync cases still reject without overwriting data.

### Task 5: Reduce hero image transfer size

**Files:**
- Modify: `web/src/assets/ocean-hero.png` or add optimized asset(s) under `web/src/assets/`
- Modify: `web/src/app/[locale]/page.tsx` only if the chosen format requires it
- Possibly modify: `web/` image configuration only if a measured need exists

**Deliverable:** The hero uses a smaller production asset while preserving its current composition and browser behavior.

- [x] Measure the current image dimensions and file size; generate an optimized WebP/AVIF candidate from the existing source without overwriting the source before visual comparison.
- [x] Compare candidate quality at desktop and mobile crops, paying particular attention to the overhead light and diagonal current.
- [x] Adopt the candidate only if it materially reduces transfer size without visible quality loss; keep Next Image responsive sizing and preload behavior correct.
- [x] Verify production output references the intended asset and inspect desktop/mobile rendering, keyboard navigation, and reduced-motion behavior.

### Task 6: Full repository verification and handoff

**Files:**
- Review all files changed by Tasks 1–5

**Deliverable:** The repository passes its documented checks and the final diff contains only intentional changes.

- [ ] Run `npm test`.
- [ ] Run `npm run validate`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run test:e2e`.
- [ ] Review `git diff --check` and `git status`; confirm no build output, caches, credentials, or private-code screenshots were added.
- [ ] Inspect all changed web UI at desktop/mobile sizes, verify reduced motion and keyboard access, and check that the two locale message files remain structurally aligned.

### Task 7: Prepare and verify Vercel deployment

**Files:**
- Review/modify: `web/README.md`
- Review/modify: `docs/maintenance.md`
- Review: `package.json`, `package-lock.json`, `web/next.config.ts`, `web/src/app/[locale]/layout.tsx`, `web/src/app/route.ts`
- Create only if required: `vercel.json`

**Deliverable:** The project is configured and documented for a Vercel deployment from the `web/` workspace, and a production deployment can build and serve both locales and locale negotiation correctly.

- [ ] Confirm Vercel project settings use Root Directory `web`, enable **Include source files outside of the Root Directory in the Build Step**, use npm with the committed root `package-lock.json`, and retain the Next.js framework preset.
- [ ] Confirm install/build commands work in Vercel's `web/` root context and shared reads of `../palettes/`, `../data/`, and `../scripts/` are included; add explicit configuration only if dashboard defaults cannot express the required behavior.
- [ ] Set the production site URL as `NEXT_PUBLIC_SITE_URL` when a stable domain is assigned; verify canonical and Open Graph URLs resolve to the deployed host.
- [ ] Create a Vercel preview deployment and inspect `/`, `/en`, `/ko`, static assets, and palette data loading. Check locale preference/cookie redirects, metadata, and mobile layout.
- [ ] Promote the reviewed preview to production using Vercel and verify the production URL, HTTPS, locale routes, and app links. Record the project-specific dashboard settings in `web/README.md` or `docs/maintenance.md` without adding secrets.
- [x] Deployment is deferred for this handoff. The Vercel dashboard project settings, preview deployment and stable production domain remain external requirements; they were not available to verify from this checkout.

Local preparation is verified: `npm run build` succeeds from `web/`, canonical and Open Graph locale URLs resolve through `metadataBase`, and the repository docs identify the required Vercel settings. The checkout has no local Vercel project link or CLI, so dashboard settings and preview/production behavior remain unverified.
