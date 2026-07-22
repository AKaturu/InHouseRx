# PROJECT_STATE

## Project Overview

### Project Name
InHouseRx

### Goal
Build a privacy-first application that compares an in-house medical-school exam with third-party study resources and identifies missing or underrepresented topic coverage.

### Current Status
Phase 3 (Architecture Design) — requirements, research, and architecture completed; implementation next.

---

## Completed Features

No implementation features are complete yet.

---

## Current Work

### Active Feature
Branded upload and gap-analysis MVP.

### Progress
MVP requirements, technical research, and system architecture are documented in `docs/`.

### Remaining Work
Implement, test, visually verify, review, and validate the web application.

---

## Next Actions

1. Scaffold the React + TypeScript application.
2. Implement extraction and deterministic analysis services with tests.
3. Build and visually verify the upload and report experiences.

---

## Risks

### Open Questions
- Which curricula and third-party resources should shape the first production taxonomy?
- Should a future version analyze only blueprints/review material or also completed student answer data?

### Known Issues
None yet.

### Technical Concerns
- MVP matching is lexical and cannot identify every paraphrase.
- Image-only PDFs need a future OCR adapter.

---

## Resume Instructions

Read `docs/requirements.md`, `docs/research.md`, and `docs/architecture.md`. The next step is to scaffold the React app and implement the domain services before presentation components.
