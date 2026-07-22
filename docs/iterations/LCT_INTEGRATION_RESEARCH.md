# Local Content Transcriber Integration Research

## Repository reviewed

- Repository: [AKaturu/local-content-transcriber](https://github.com/AKaturu/local-content-transcriber)
- Reviewed revision: `a7e8ed6f03e79a7cc49ee424114753cd36a8d57c`
- Application version at review: `0.2.0`

## Relevant capabilities

The project already implements the capabilities InHouseRx lacks:

- searchable and scanned PDF extraction with page-level OCR fallback;
- DOCX paragraphs/tables and PPTX text, table, group, and embedded-image extraction;
- image OCR through local RapidOCR or Tesseract;
- audio/video transcription through an optional local faster-whisper provider;
- request-scoped temporary staging and cleanup;
- stable capability and error contracts.

Its `POST /api/transcriptions` endpoint accepts one multipart `file` plus an optional `ocr_engine` and returns:

```json
{
  "filename": "lecture.pdf",
  "media_type": "application/pdf",
  "sections": [{ "label": "Page 1", "text": "..." }],
  "warnings": [],
  "text": "## Page 1\n\n..."
}
```

`GET /api/capabilities` reports supported extensions, maximum size, OCR engines, speech readiness, and the local privacy statement.

## Integration constraint

The upstream FastAPI application intentionally serves its own UI and does not enable cross-origin requests. A separately hosted InHouseRx frontend therefore cannot call it directly from a browser. Rather than weakening upstream defaults, InHouseRx will provide a tiny local bridge that creates the upstream application and adds CORS only for explicit localhost development origins. It still binds to `127.0.0.1`.

## Decision

Use Local Content Transcriber as a pinned optional Python dependency behind a TypeScript client adapter. This approach:

- reuses the tested OCR/speech implementation instead of duplicating it;
- keeps large native/ML dependencies out of the web bundle;
- leaves browser-native document extraction fast and zero-setup;
- maintains a single `SourceDocument` input contract for analysis;
- makes the network boundary explicit and loopback-only.

## Risks

- The companion requires Python 3.11+ and optional native/model setup for OCR or speech.
- A Git dependency depends on the referenced revision remaining available; the commit is pinned for reproducibility.
- Browser mixed-origin rules require the included bridge rather than the upstream launcher.
- Media files can be large; InHouseRx retains its conservative 20 MB MVP cap.
