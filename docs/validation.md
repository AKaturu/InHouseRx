# InHouseRx MVP Validation

Validation date: 2026-07-21 (updated for Local Content Transcriber integration)

## Acceptance criteria results

1. **Brand:** Passed. Computed primary theme is `#337ab7`; the wordmark computes to white (`rgb(255, 255, 255)`).
2. **File selection:** Passed. Exam and multi-resource inputs support pickers and drag/drop for configured formats.
3. **Missing roles:** Passed. Black-box test confirms both role-specific and form-level messages.
4. **Invalid files:** Passed. Tests cover unsupported, empty, and over-20-MB files.
5. **Local analysis:** Passed. Full upload-to-report test uses browser-local TXT extraction; companion traffic is restricted to loopback and neither path persists content.
6. **Report summary:** Passed. Report renders score, four metrics, and priority-sorted gaps.
7. **Gap explanation:** Passed. Gap cards show emphasis, coverage, detected evidence, point difference, and study action.
8. **Sample data:** Passed. Black-box test reaches a complete report from the sample action.
9. **Reset:** Passed. Black-box test returns from the report to a clean analysis view.
10. **Engineering checks:** Passed. Tests, lint, type-check, and production build succeed.

## Automated evidence

- Initial MVP run: 3 web test files, 14 tests passed.
- Expanded integration run: 4 web test files, 22 tests passed.
- `pnpm test:companion`: 3 loopback/CORS configuration tests passed.
- Coverage: 81.21% statements and 84.35% lines overall; core analysis is 97.43% statements and 100% functions.
- `pnpm lint`: no errors or warnings.
- `pnpm build`: production output generated successfully with lazy-loaded document parser chunks.
- `pnpm audit --prod`: no known vulnerabilities.
- Real companion bridge check against pinned Local Content Transcriber `0.2.0`: HTTP 200 health, 19 supported extensions, local privacy metadata, and the expected `http://localhost:5173` CORS origin.

## Browser evidence

Validated in headless Chromium at 1440×1100 and 390×844.

- Home desktop: no horizontal overflow.
- Report desktop: no horizontal overflow.
- Home mobile: no horizontal overflow.
- Report mobile: no horizontal overflow.
- Browser console: no errors across the home and sample-report flows.
- Connected companion state: OCR/media-ready capability indicator rendered successfully.
- Visual inspection: hierarchy, contrast, wrapping, card alignment, and responsive stacking are intact.

Screenshots from the validation run are stored locally under `artifacts/visual-validation/` and intentionally ignored by Git.

## Known non-blocking limitations

- OCR and speech require the optional companion plus installed local engines/models.
- PDF and DOCX adapters use proven upstream libraries but do not yet have binary fixture integration tests in this repository.
- The initial taxonomy needs expert review and curriculum expansion before a clinical production pilot.

## Publication evidence

- Public repository: `https://github.com/AKaturu/InHouseRx`
- Default branch: `main`
- GitHub license detection: MIT License
- Repository topics: `medical-education`, `ocr`, `privacy-first`, `study-tools`, `typescript`
