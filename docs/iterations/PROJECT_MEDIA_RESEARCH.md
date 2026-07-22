# Project media research

Research performed July 21, 2026 against primary documentation.

## Browser capture

Playwright supports deterministic page screenshots and browser-context video recording. Its documentation notes that recorded video is finalized when the browser context closes and supports an explicit recording size. The capture workflow therefore uses a fixed viewport, waits for stable product states, saves screenshots from the real DOM, and closes the context before validating the video.

Sources:

- [Playwright screenshots](https://playwright.dev/docs/screenshots)
- [Playwright videos](https://playwright.dev/docs/videos)
- [Playwright browser context video options](https://playwright.dev/docs/api/class-browser)

## Publishing

GitHub Releases support additional binary assets alongside application packages. The demo video will be committed under `docs/media/` for source-level permanence and uploaded to the existing `v0.2.0` release as a directly downloadable asset.

Sources:

- [GitHub release assets](https://docs.github.com/en/rest/releases/assets)
- [About GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)

## Format decision

Playwright records VP8 WebM through its bundled minimal FFmpeg runtime. WebM avoids introducing a separate system codec or lossy re-encoding step and is supported by current Chromium, Firefox, and Edge browsers. A static report-overview screenshot acts as the README poster and links to the video for environments where Markdown does not embed video controls.

## Privacy decision

Only the deterministic sample exam and sample resources already shipped in the repository are used. The script neither selects local files nor calls the optional companion, so no private source material can enter the artifacts.

