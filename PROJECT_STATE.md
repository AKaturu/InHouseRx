# PROJECT_STATE

## Project Overview

### Project Name
InHouseRx

### Goal
Build a privacy-first application that compares an in-house medical-school exam with third-party study resources and identifies missing or underrepresented topic coverage.

### Current Status
MVP complete and validated on branch `codex/inhouse-rx-mvp`.

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

1. Gather feedback from medical students using the sample report.
2. Select an initial curriculum/block and have a subject-matter expert review the taxonomy.
3. Decide whether the next increment should prioritize OCR, semantic matching, or saved accounts.

---

## Risks

### Open Questions
- Which curricula and third-party resources should shape the first production taxonomy?
- Should a future version analyze only blueprints/review material or also completed student answer data?

### Known Issues
No critical defects are known. Scanned/image-only PDFs are intentionally unsupported and return guidance.

### Technical Concerns
- MVP matching is lexical and cannot identify every paraphrase.
- Image-only PDFs need a future OCR adapter.

---

## Resume Instructions

Read `README.md` and the documents under `docs/`. Run `pnpm test && pnpm lint && pnpm build` to verify the baseline. Start with `src/services/analysisEngine.ts` and `src/domain/topicTaxonomy.ts` for analysis changes, or `src/App.tsx` and `src/components/` for product-flow changes. The next concrete step is to collect feedback on the sample report and choose the second milestone.
