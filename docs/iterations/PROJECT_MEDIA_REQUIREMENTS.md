# Project media requirements

## Goal

Publish truthful, polished media that lets a prospective user understand InHouseRx before downloading it.

## Functional requirements

1. Capture the real application at a desktop viewport using only the built-in sample data.
2. Publish at least three screenshots covering the upload workspace, report overview, and prioritized gaps.
3. Publish a concise demo video showing the sample-analysis path from landing page to actionable results.
4. Add the screenshots and a clear video link to the repository README.
5. Attach the video to the existing `v0.2.0` GitHub Release.
6. Keep a reproducible capture script in the repository.

## Non-functional requirements

- No student, exam, licensed third-party, or protected health information may appear.
- Screenshots must be PNG and readable on GitHub without horizontal scrolling.
- The video must be a broadly browser-playable WebM at 1280×720, have no audio track, and remain short enough for repository/release use.
- The demo should contain visible captions so its purpose is understandable without narration.
- Generated media must use the actual `#337ab7` application interface without retouching or fabricated UI.

## Acceptance criteria

- Three PNG files render correctly and show distinct product states.
- The WebM has a valid video stream, 1280×720 dimensions, and a duration between 15 and 45 seconds.
- The video visibly transitions from landing page to processing, report summary, and priority gaps.
- README media links resolve from GitHub.
- The public release lists the demo video as an uploaded asset.
- Existing tests, lint, and build remain green.

## Scope boundary

This increment does not include voice-over, music, live student data, testimonial footage, a marketing trailer, or uploads to third-party video platforms.

