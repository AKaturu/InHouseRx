# InHouseRx

InHouseRx is a privacy-first medical study coverage analyzer. It compares an in-house exam or blueprint with third-party study resources, identifies topics that are missing or underrepresented, and turns those differences into a prioritized study plan.

## What the MVP includes

- Local extraction for PDF, DOCX, PPTX, TXT, and Markdown files.
- A transparent, versioned medical-topic taxonomy.
- Exam-emphasis and resource-coverage scoring with evidence terms.
- Prioritized critical and moderate gaps, system-level coverage, and study actions.
- A built-in sample report for exploring the product without private files.
- Responsive, accessible UI branded with the `#337ab7` InHouseRx theme.

Uploaded content is analyzed in the browser and is not transmitted or persisted.

## Run locally

Prerequisites: Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite. Choose **View sample report** for the fastest product tour.

## Verify

```bash
pnpm test
pnpm lint
pnpm build
```

Coverage can be inspected with `pnpm test:coverage`.

## Project map

- `src/services/documentExtractor.ts` — local format adapters and validation.
- `src/services/analysisEngine.ts` — deterministic coverage and priority calculations.
- `src/domain/topicTaxonomy.ts` — current topic/alias definitions.
- `src/components/` — upload, processing, and report experiences.
- `docs/requirements.md` — accepted MVP scope and criteria.
- `docs/architecture.md` — components, data flow, and failure modes.

## Current limitations

- Image-only/scanned PDFs require OCR and are rejected with guidance.
- Matching is lexical, so paraphrases can be missed.
- Coverage measures textual representation, not teaching quality or factual correctness.
- The taxonomy is an initial pre-clinical set and should be reviewed with curriculum experts before production use.

InHouseRx is educational study-planning software. It does not predict scores and is not affiliated with NBME or NBOME.
