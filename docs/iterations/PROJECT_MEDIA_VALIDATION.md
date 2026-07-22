# Project media validation

Validated July 21, 2026 (America/Denver).

## Capture result

`pnpm media:capture` completed successfully against the production Vite bundle. The capture used the repository's deterministic sample exam and two sample resources; no local user file or companion content was selected.

## Screenshots

All screenshots were inspected at original resolution for text legibility, crop quality, loading artifacts, private content, and brand consistency.

| File | Dimensions | Bytes | SHA-256 |
| --- | ---: | ---: | --- |
| `inhouserx-landing.png` | 1440×960 | 119,839 | `E91FAA6B22539C8E50BD38EC697DE191EC57C561A2562FEAC264215EE876BCE1` |
| `inhouserx-upload-workspace.png` | 1100×531 | 39,724 | `71FC12A266F16A4A7D74D70100312824199CDC7322E578F6B1C9BBB31F92967F` |
| `inhouserx-report-overview.png` | 1440×960 | 202,522 | `820E142F38C0A02F1A2E45A3B6879527B95CED19A37E4A3E803D9358BB4398D0` |
| `inhouserx-priority-gaps.png` | 1440×960 | 91,917 | `7B72F038F1D925897301BD49D3A052184BB7D0C8BB277466AAC739C781308576` |

Each public raw GitHub URL returned HTTP 200 with `image/png` and the expected byte count after publication.

## Demo video

FFmpeg container inspection reported:

- Duration: 29.92 seconds.
- Video: VP8 WebM, 1280×720, square pixels, 16:9, 25 fps.
- Streams: one video stream and no audio stream.
- Size: 2,465,396 bytes.
- SHA-256: `0620438A0EE3A38595FE6E7034226E8D6F4982386AF3FB24AC123F370801FFB7`.

Frames sampled at 2, 10, 20, and 28 seconds were inspected. They verify the branded landing page, captioned report summary, prioritized evidence cards, and closing return to the landing page.

## Regression verification

- 24 web tests passed.
- 4 Electron security tests passed.
- 3 companion tests passed.
- ESLint passed.
- Production build passed.
- Production dependency audit reported no known vulnerabilities.
- `git diff --check` passed.

## Publication

- The repository README displays the report poster, upload workspace, and priority-gap screenshots.
- [InHouseRx v0.2.0](https://github.com/AKaturu/InHouseRx/releases/tag/v0.2.0) contains the WebM and all four PNG files as release assets.
- The release notes link directly to the 30-second demo.

