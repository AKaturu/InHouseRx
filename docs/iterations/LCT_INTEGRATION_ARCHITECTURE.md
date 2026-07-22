# Local Content Transcriber Integration Architecture

## Component model

```text
InHouseRx upload
      |
      +-- browser-readable document --> BrowserDocumentExtractor
      |                                      |
      |                                      +-- usable text --> SourceDocument
      |                                      |
      |                                      +-- text too sparse --+
      |                                                            |
      +-- image/audio/video ----------------------------------------+
                                                                   v
                                                   LocalTranscriberClient
                                                                   |
                                                loopback HTTP on 127.0.0.1
                                                                   |
                                                  InHouseRx companion bridge
                                                                   |
                                           Local Content Transcriber service
                                                                   |
                                                        OCR / speech / parser
                                                                   |
                                                              SourceDocument
```

## New components

- `localTranscriberClient.ts`: validates the loopback base URL, checks capabilities, posts multipart files, validates the JSON response, and maps stable API errors.
- `companion/server.py`: composes the upstream FastAPI app, adds a narrow localhost CORS allowlist, and launches on loopback port `8766`.
- `useLocalTranscriberStatus.ts`: performs non-blocking readiness detection for the upload UI.
- `CompanionStatus`: explains browser-only versus OCR/media-ready modes.

## Interfaces

```ts
interface LocalTranscriberCapabilities {
  supportedExtensions: string[]
  maxFileMb: number
  ocrReady: boolean
  speechReady: boolean
  detail: string
}

interface LocalTranscriberResult {
  filename: string
  mediaType: string
  text: string
  warnings: string[]
}
```

`extractDocument(file, role)` remains the public extraction entry point. The companion client is an implementation detail, preserving the Open/Closed boundary around the analysis engine.

## Security controls

- The client accepts only `http://127.0.0.1`, `http://localhost`, or IPv6 loopback endpoints.
- Capability checks and transcriptions have bounded timeouts.
- The bridge's CORS allowlist defaults to Vite's two loopback origins and can be explicitly extended with `INHOUSERX_ALLOWED_ORIGINS`.
- The bridge binds only to `127.0.0.1` and does not expose extracted content as static files.
- Returned JSON is runtime-validated before use.

## Failure handling

- Companion offline: browser-readable documents continue; companion-only formats show setup guidance.
- OCR installed but not ready: capability status explains setup; upstream structured error is preserved.
- Invalid/malformed response: fail closed with a generic local-companion response error.
- Browser parser finds sparse text and companion is offline: retain the existing OCR guidance.
- Abort/timeout: report that the local companion did not respond, without retrying large uploads automatically.
