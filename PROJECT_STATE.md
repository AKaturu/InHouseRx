# PROJECT_STATE

## Project Overview

### Project Name
InHouseRx

### Goal
Build a privacy-first application that compares an in-house medical-school exam with third-party study resources and identifies missing or underrepresented topic coverage.

### Current Status
Expanded MVP complete, MIT-licensed, and ready to publish from branch `codex/inhouse-rx-mvp`.

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

---

## Current Work

### Active Feature
None. The MVP is ready for product feedback.

### Progress
Requirements, research, architecture, implementation, automated testing, code review, production build, and visual validation are complete.

### Remaining Work
No work remains within the documented MVP scope.

---

## Next Actions

1. Gather feedback from medical students using the sample and OCR-assisted flows.
2. Select an initial curriculum/block and have a subject-matter expert review the taxonomy.
3. Decide whether the next increment should prioritize semantic matching, objective imports, or saved accounts.

---

## Risks

### Open Questions
- Which curricula and third-party resources should shape the first production taxonomy?
- Should a future version analyze only blueprints/review material or also completed student answer data?

### Known Issues
No critical defects are known. OCR and speech availability depend on the optional companion's installed local engines/models.

### Technical Concerns
- MVP matching is lexical and cannot identify every paraphrase.
- Hosted HTTPS builds may need an explicitly configured secure-context strategy before they can call an HTTP loopback companion consistently across browsers; the validated workflow is local development/desktop use.

---

## Resume Instructions

Read `README.md`, `companion/README.md`, and the documents under `docs/`. Run `pnpm test`, `pnpm test:companion`, `pnpm lint`, and `pnpm build` to verify the baseline. Start with `src/services/localTranscriberClient.ts` and `companion/server.py` for extraction integration, `src/services/analysisEngine.ts` for analysis changes, or `src/components/` for product-flow changes. The next concrete step is to collect student feedback and choose the second milestone.
