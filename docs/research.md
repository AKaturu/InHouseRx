# InHouseRx MVP Research

## Findings

### Application foundation

- Vite provides an official React + TypeScript template and a fast development/build pipeline. Vite transpiles TypeScript but does not type-check it, so the build must run `tsc` separately. Sources: [Vite Getting Started](https://vite.dev/guide/) and [Vite Features](https://vite.dev/guide/features.html).
- React is appropriate for the multi-state upload, processing, and report workflow while keeping the MVP as a static deployable client.

### Local document extraction

- PDF.js exposes a browser display API that can load a PDF, enumerate pages, and return text content asynchronously. It does not provide OCR, so image-only PDFs require the optional local companion. Source: [PDF.js examples](https://mozilla.github.io/pdf.js/examples/).
- Mammoth accepts an `ArrayBuffer` in the browser and can extract raw text from `.docx` files. Raw text avoids the security risk of rendering unsanitized document HTML. Source: [Mammoth documentation](https://github.com/mwilliamson/mammoth.js/).
- PPTX files are ZIP containers. JSZip can load an `ArrayBuffer` and expose the slide XML entries for local text extraction. Password-protected and some unusually large ZIP variants are unsupported. Sources: [JSZip loadAsync](https://stuk.github.io/jszip/documentation/api_jszip/load_async.html) and [JSZip limitations](https://stuk.github.io/jszip/documentation/limitations.html).

### Analysis approach

A deterministic taxonomy is the best MVP fit because it is explainable, local, testable, and does not imply that a general-purpose model understands the proprietary learning objectives of every school. Each topic contains synonyms and evidence phrases. Coverage is normalized by document length, while gap priority combines exam emphasis, resource coverage, and clinical relevance.

### Local OCR and media

The existing [Local Content Transcriber](https://github.com/AKaturu/local-content-transcriber) project supplies local scan OCR, image OCR, and audio/video transcription behind a stable FastAPI contract. InHouseRx composes reviewed revision `a7e8ed6f03e79a7cc49ee424114753cd36a8d57c` as an optional loopback companion rather than duplicating its Python/native dependencies in the browser bundle. Detailed findings are recorded in `docs/iterations/LCT_INTEGRATION_RESEARCH.md`.

## Technology decisions

- React + TypeScript + Vite for the application.
- Plain CSS with custom properties for a bespoke, lightweight design system.
- PDF.js, Mammoth, and JSZip for client-side extraction, with Local Content Transcriber as an optional scan/image/media adapter.
- Vitest, Testing Library, and jsdom for automated tests.
- Lucide React for consistent accessible icons.

## Constraints and risks

- OCR and media processing require the optional Local Content Transcriber companion.
- Keyword matching can miss paraphrases and cannot assess factual accuracy.
- Very long documents can consume significant browser memory; the MVP caps each file at 20 MB and resource count at six.
- Third-party resource licensing varies. The UI must remind users to upload only material they are authorized to use.
- NBME and NBOME are comparison contexts only; neither organization is affiliated with this software.

## Recommended evolution

Keep `AnalysisEngine` and `DocumentExtractor` behind explicit interfaces. A later service can add embeddings, institution-specific objective maps, and encrypted persistence without rewriting the report UI.
