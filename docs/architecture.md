# InHouseRx MVP Architecture

## System overview

InHouseRx is a static single-page application. Files are selected by the browser, converted to text on-device, analyzed against a versioned topic taxonomy, and rendered as a report. No document content crosses a network boundary.

```text
File selection -> validation -> local extraction -> topic analysis -> report model -> dashboard
                                      |                  |
                                format adapters      taxonomy v1
```

## Components

- `App`: owns the workflow state (`upload`, `processing`, `report`) and coordinates services.
- `Header`: persistent product identity and privacy status.
- `Hero`: concise value proposition and entry point.
- `UploadWorkspace`: exam/resource drop zones, selected-file state, validation, and sample mode.
- `ProcessingView`: communicates local extraction and analysis stages.
- `AnalysisReport`: summary score, metrics, gap cards, coverage overview, and next actions.
- `DocumentExtractor`: routes files by extension to text, PDF, DOCX, or PPTX adapters.
- `AnalysisEngine`: maps text to taxonomy topics and creates a deterministic report.
- `topicTaxonomy`: versioned medical systems, topics, aliases, and relevance metadata.

## Core interfaces

```ts
interface SourceDocument {
  id: string;
  name: string;
  role: 'exam' | 'resource';
  text: string;
  size: number;
}

interface DocumentExtractor {
  extract(file: File, role: SourceDocument['role']): Promise<SourceDocument>;
}

interface AnalysisEngine {
  analyze(exam: SourceDocument, resources: SourceDocument[]): AnalysisReportModel;
}
```

## Analysis contract

For every taxonomy topic:

1. Count alias/evidence occurrences in the exam and combined resources.
2. Normalize coverage per 1,000 words, with a small document-presence boost across multiple resources.
3. Convert normalized counts to 0-100 emphasis and coverage scores.
4. Calculate gap severity from exam emphasis minus resource coverage, weighted by relevance.
5. Include topics mentioned by the exam; classify as critical, moderate, covered, or strong.
6. Derive readiness from the weighted proportion of exam emphasis covered by the resources.

## Failure modes

- Missing exam or resources: prevent analysis and point to the incomplete drop zone.
- Unsupported/oversized file: reject before extraction.
- Encrypted/corrupt file: return a role-specific extraction error.
- Empty or image-only file: explain that selectable text or OCR is required.
- No recognized medical topics: ask for richer source material instead of fabricating a report.
- Partial resource failure: fail the run with the file name so the user can remove or replace it.

## Accessibility and responsive behavior

- Native buttons and inputs remain keyboard accessible.
- Drop zones have explicit labels and keyboard-triggerable file selection.
- Status and errors use live regions.
- Desktop uses a two-column upload/report layout; mobile collapses to one column without horizontal scrolling.

## Security and privacy boundary

- Use raw text extraction only; never inject document HTML.
- Never persist document text in local storage.
- Avoid analytics in the MVP.
- Revoke any temporary object URLs if introduced later.
