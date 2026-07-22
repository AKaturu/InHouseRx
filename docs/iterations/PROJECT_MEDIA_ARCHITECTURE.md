# Project media capture architecture

## Components

- `scripts/capture-project-media.mjs` — launches a local installed Chromium-family browser through Playwright, drives the sample flow, adds temporary demo captions, and writes media.
- Vite preview server — serves the production application bundle on loopback during capture.
- `docs/media/` — versioned, GitHub-visible screenshots and final demo video.
- `artifacts/media-capture/` — ignored temporary browser recording output.
- README — presents the screenshots and links the poster image to the full demo.
- GitHub Release `v0.2.0` — hosts the video as a release asset.

## Capture flow

```text
production build → loopback preview → Playwright context (1280×720)
  → landing screenshot
  → click sample report
  → processing state
  → report overview screenshot
  → smooth scroll to priority queue
  → priority screenshot
  → reset to landing
  → close context and flush WebM
```

## Interfaces

The capture script accepts:

- `INHOUSERX_MEDIA_URL` — loopback URL, default `http://127.0.0.1:4173`.
- `PLAYWRIGHT_BROWSER_PATH` — optional explicit Chromium-family executable.

It writes stable filenames:

- `docs/media/inhouserx-upload-workspace.png`
- `docs/media/inhouserx-report-overview.png`
- `docs/media/inhouserx-priority-gaps.png`
- `docs/media/inhouserx-demo.webm`

## Failure modes

- Missing browser executable: fail with setup guidance before capture.
- Server unavailable: fail on navigation without writing misleading final media.
- Product selectors changed: fail rather than silently capturing the wrong state.
- Existing final media: overwrite only the four explicit generated paths.
- Recording not flushed: context closure is awaited before copying the final WebM.

