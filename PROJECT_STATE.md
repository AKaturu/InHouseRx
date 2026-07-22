# PROJECT_STATE

## Project Overview

### Project Name
InHouseRx

### Goal
Build a privacy-first application that compares an in-house medical-school exam with third-party study resources and identifies missing or underrepresented topic coverage.

### Current Status
Expanded MVP and cross-platform desktop preview complete, MIT-licensed, and published at `https://github.com/AKaturu/InHouseRx` with `main` as the default branch. Version `v0.2.0` is available from GitHub Releases for Windows, macOS, and Linux.

---

## Completed Features

### Feature: Branded upload workspace

#### Validation
Responsive desktop/mobile browser inspection, no overflow, no console errors, and the exact `#337ab7`/white wordmark treatment verified.

#### Tests Added
`src/App.test.tsx` covers branding, required roles, unsupported files, actual text uploads, sample reports, and reset.

### Feature: Local document extraction

#### Validation
TXT and synthetic PPTX extraction paths pass, supported formats and size limits are enforced, and parser bundles load on demand.

#### Tests Added
`src/services/documentExtractor.test.ts` covers validation, empty text, TXT extraction, and slide-order PPTX extraction.

### Feature: Explainable coverage analysis

#### Validation
Deterministic sample results, stronger-resource comparison, unknown-topic failure behavior, and report rendering all pass.

#### Tests Added
`src/services/analysisEngine.test.ts` covers happy, improvement, unsupported-content, and missing-resource cases.

### Feature: Local Content Transcriber companion

#### Validation
The pinned upstream `0.2.0` API was composed through the loopback bridge and returned health, capabilities, privacy metadata, and the expected CORS origin. Desktop/mobile browser checks rendered the connected OCR/media-ready state without overflow or console errors.

#### Tests Added
`src/services/localTranscriberClient.test.ts`, the expanded extractor suite, and `companion/test_config.py` cover URL security, capability mapping, multipart transcription, structured failures, image routing, and origin validation.

### Feature: Open-source release readiness

#### Validation
MIT license, repository metadata, security policy, setup instructions, dependency audit, and clean Git history are present.

#### Tests Added
Release readiness uses the full web/companion suites, lint, production build, dependency audit, and `git diff --check`.

### Feature: Windows, macOS, and Linux desktop applications

#### Validation
The secure Electron shell passed a packaged Windows smoke check, the native GitHub Actions matrix built all documented targets successfully, and five unsigned packages were published in the public `v0.2.0` release. See `docs/iterations/DESKTOP_VALIDATION.md`.

#### Tests Added
`electron/security.test.mjs` covers external URL policy, trusted renderer origins, package path traversal, and companion payload limits. `src/services/localTranscriberClient.test.ts` now covers both desktop capability and transcription bridge paths.

---

## Current Work

### Active Feature
None. The desktop preview is published and ready for product feedback.

### Progress
Requirements, research, architecture, implementation, automated testing, native packaging, production validation, and GitHub publication are complete.

### Remaining Work
No work remains within the documented desktop preview and publication scope.

---

## Next Actions

1. Gather feedback from medical students using the browser and desktop flows.
2. Acquire Apple Developer ID and Windows code-signing credentials before promoting the preview as a broadly trusted download.
3. Select an initial curriculum/block and have a subject-matter expert review the taxonomy.
4. Decide whether the next increment should prioritize semantic matching, objective imports, saved accounts, or automatic desktop updates.

---

## Risks

### Open Questions
- Which curricula and third-party resources should shape the first production taxonomy?
- Should a future version analyze only blueprints/review material or also completed student answer data?

### Known Issues
No critical defects are known. Desktop packages are unsigned and may trigger operating-system security warnings. OCR and speech availability depend on the separately installed companion and its local engines/models.

### Technical Concerns
- MVP matching is lexical and cannot identify every paraphrase.
- Hosted HTTPS builds may need an explicitly configured secure-context strategy before they can call an HTTP loopback companion consistently across browsers; the validated workflow is local development/desktop use.

---

## Resume Instructions

Read `README.md`, `companion/README.md`, and the documents under `docs/`. Run `pnpm test`, `pnpm test:desktop`, `pnpm test:companion`, `pnpm lint`, and `pnpm build` to verify the baseline. Use `electron/main.mjs`, `electron/preload.cjs`, and `electron-builder.yml` for desktop work; start with `src/services/localTranscriberClient.ts` and `companion/server.py` for extraction integration, `src/services/analysisEngine.ts` for analysis changes, or `src/components/` for product-flow changes. The current release is `v0.2.0`; the next concrete step is to collect student feedback and choose the next product milestone or signing work.
