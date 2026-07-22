# Local Content Transcriber Integration Requirements

## Goal

Extend InHouseRx with the optional local OCR and media capabilities already implemented in `AKaturu/local-content-transcriber`, without weakening InHouseRx's on-device privacy model or making the companion mandatory for ordinary text-bearing documents.

## Functional requirements

- Preserve browser-native extraction for PDF, DOCX, PPTX, TXT, and Markdown.
- Detect a Local Content Transcriber companion on loopback and show its readiness in the upload workspace.
- Route PNG, JPEG, TIFF, BMP, WebP, WAV, MP3, M4A, FLAC, OGG, MP4, MOV, MKV, and WebM through the companion.
- Fall back to the companion when browser extraction finds too little selectable text in a PDF, DOCX, or PPTX.
- Convert the companion's sectioned response into the existing `SourceDocument` contract so the analysis engine remains unchanged.
- Preserve recoverable error messages from the companion without exposing filesystem paths or internal exception details.
- Keep the existing sample and browser-only workflows fully usable when the companion is unavailable.
- Provide a small loopback-only CORS bridge that composes the upstream Local Content Transcriber FastAPI application.
- Document one-command companion setup and startup.

## Non-functional requirements

- Security: only loopback companion URLs are accepted; no arbitrary remote transcription endpoint.
- Privacy: files sent to the companion remain on the same device and are handled by its request-scoped temporary-directory lifecycle.
- Compatibility: pin the tested Local Content Transcriber Git revision.
- Resilience: capability detection must time out quickly and must never block the upload interface.
- Maintainability: isolate the HTTP contract in one client adapter and keep the existing analyzer unaware of extraction origin.

## Acceptance criteria

1. With no companion running, the workspace loads normally and reports browser-only mode.
2. A successful capability response reports local OCR/media readiness in the UI.
3. Companion-only file formats pass validation and route to `/api/transcriptions`.
4. A sectioned transcription response becomes stable plain text in a `SourceDocument`.
5. A scanned/empty browser extraction attempts the companion before showing OCR guidance.
6. Non-loopback endpoint configuration is rejected before any network request.
7. Companion errors become concise, user-facing extraction errors.
8. Existing browser extraction and analysis tests continue to pass.
9. The production build, lint, and full test suite pass.

## Scope boundaries

- The companion remains optional and separately installable; heavyweight OCR and speech models are not bundled into the web build.
- InHouseRx does not silently download OCR or speech models.
- No cloud transcription or remote content API is added.
- No changes to the upstream Local Content Transcriber repository are required for this integration.
