# InHouseRx MVP Research

## Findings

### Application foundation

- Vite provides an official React + TypeScript template and a fast development/build pipeline. Vite transpiles TypeScript but does not type-check it, so the build must run `tsc` separately. Sources: [Vite Getting Started](https://vite.dev/guide/) and [Vite Features](https://vite.dev/guide/features.html).
- React is appropriate for the multi-state upload, processing, and report workflow while keeping the MVP as a static deployable client.

### Local document extraction

- PDF.js exposes a browser display API that can load a PDF, enumerate pages, and return text content asynchronously. It does not provide OCR, so image-only PDFs must be called out as unsupported in this version. Source: [PDF.js examples](https://mozilla.github.io/pdf.js/examples/).
- Mammoth accepts an `ArrayBuffer` in the browser and can extract raw text from `.docx` files. Raw text avoids the security risk of rendering unsanitized document HTML. Source: [Mammoth documentation](https://github.com/mwilliamson/mammoth.js/).
- PPTX files are ZIP containers. JSZip can load an `ArrayBuffer` and expose the slide XML entries for local text extraction. Password-protected and some unusually large ZIP variants are unsupported. Sources: [JSZip loadAsync](https://stuk.github.io/jszip/documentation/api_jszip/load_async.html) and [JSZip limitations](https://stuk.github.io/jszip/documentation/limitations.html).

### Analysis approach

A deterministic taxonomy is the best MVP fit because it is explainable, local, testable, and does not imply that a general-purpose model understands the proprietary learning objectives of every school. Each topic contains synonyms and evidence phrases. Coverage is normalized by document length, while gap priority combines exam emphasis, resource coverage, and clinical relevance.

## Technology decisions

- React + TypeScript + Vite for the application.
- Plain CSS with custom properties for a bespoke, lightweight design system.
- PDF.js, Mammoth, and JSZip for client-side extraction.
- Vitest, Testing Library, and jsdom for automated tests.
- Lucide React for consistent accessible icons.

## Constraints and risks

- Scanned PDFs require future OCR support.
- Keyword matching can miss paraphrases and cannot assess factual accuracy.
- Very long documents can consume significant browser memory; the MVP caps each file at 20 MB and resource count at six.
- Third-party resource licensing varies. The UI must remind users to upload only material they are authorized to use.
- NBME and NBOME are comparison contexts only; neither organization is affiliated with this software.

## Recommended evolution

Keep `AnalysisEngine` and `DocumentExtractor` behind explicit interfaces. A later backend can add OCR, embeddings, institution-specific objective maps, and encrypted persistence without rewriting the report UI.
