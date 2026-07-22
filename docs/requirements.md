# InHouseRx MVP Requirements

## Product goal

Help a medical student identify topics emphasized by an in-house exam that are missing or underrepresented in the third-party study resources they use. The product name is **InHouseRx**.

## MVP users and workflow

The primary user is a medical student preparing for an in-house course exam.

1. The student uploads one in-house exam or exam blueprint.
2. The student uploads one or more third-party study resources.
3. InHouseRx extracts text locally in the browser.
4. The app maps the documents to a transparent medical-topic taxonomy.
5. The app reports resource gaps, strengths, and a prioritized study plan.

## Functional requirements

- Present a polished, responsive landing/dashboard experience branded with a `#337ab7` primary theme and a white **InHouseRx** wordmark.
- Accept `.pdf`, `.docx`, `.pptx`, `.txt`, and `.md` files.
- Keep uploaded file contents on the user's device for the MVP.
- Clearly distinguish the in-house exam from third-party resources.
- Validate missing files, unsupported file types, and unreadable/image-only documents.
- Extract selectable text from supported files.
- Detect topic coverage through an inspectable taxonomy rather than a hidden score.
- Calculate gaps from relative exam emphasis versus resource coverage.
- Return an overall readiness score, gap counts, prioritized topics, evidence terms, coverage bars, and next-study actions.
- Include a realistic sample analysis so the experience can be evaluated without private uploads.
- Allow the user to reset the workspace and start a new analysis.
- Explain that results are study-planning guidance and are not affiliated with or predictive of NBME or NBOME examinations.

## Non-functional requirements

- Accessibility: semantic landmarks, visible keyboard focus, labelled controls, and sufficient contrast.
- Privacy: no upload or network transmission of document contents in the MVP.
- Performance: analyze typical text-based course materials (up to 20 MB per file) without a page reload.
- Maintainability: separate file extraction, topic analysis, domain types, and presentation components.
- Testability: deterministic business logic with unit, integration, and user-facing component coverage.

## Scope boundaries

### Included

- A frontend-only web MVP.
- Deterministic topic matching for a curated pre-clinical medicine taxonomy.
- Text extraction for the listed formats.
- One in-house exam and up to six resource files per analysis.

### Deferred

- Accounts, cloud persistence, collaboration, payments, and institutional administration.
- OCR for scanned/image-only documents.
- Semantic embeddings, hosted LLM inference, and model training.
- Question-answer correctness analysis or personally identifiable student-performance records.
- Claims of NBME/NBOME affiliation, equivalence, or score prediction.
- Circumvention of DRM or ingestion of material the user is not licensed to use.

## Acceptance criteria

1. The initial view shows the white **InHouseRx** wordmark on a `#337ab7` brand surface and communicates the product purpose.
2. A user can select an exam and at least one resource using either file pickers or drag and drop.
3. Starting without both document roles shows a clear validation message and does not begin analysis.
4. Unsupported or oversized files are rejected with a specific message.
5. Valid text-bearing supported files produce an analysis without sending file contents to a server.
6. The report shows a readiness score, at least three summary metrics, and gap topics ordered by priority.
7. Each reported gap includes exam emphasis, resource coverage, evidence, and a recommended action.
8. The sample-data action produces a complete report without uploads.
9. Reset returns the application to a clean upload state.
10. Automated tests pass and the production build completes successfully.

## Product assumptions for this first build

- Uploaded exams are study copies, review sheets, or blueprints the student is authorized to analyze.
- Coverage means textual topic representation, not educational quality or factual correctness.
- Exact keyword matching is sufficient to validate the workflow; semantic models can replace the analysis adapter later.
