# InHouseRx MVP Validation

Validation date: 2026-07-21

## Acceptance criteria results

1. **Brand:** Passed. Computed primary theme is `#337ab7`; the wordmark computes to white (`rgb(255, 255, 255)`).
2. **File selection:** Passed. Exam and multi-resource inputs support pickers and drag/drop for configured formats.
3. **Missing roles:** Passed. Black-box test confirms both role-specific and form-level messages.
4. **Invalid files:** Passed. Tests cover unsupported, empty, and over-20-MB files.
5. **Local analysis:** Passed. Full upload-to-report test uses local TXT extraction; application includes no upload or persistence endpoint.
6. **Report summary:** Passed. Report renders score, four metrics, and priority-sorted gaps.
7. **Gap explanation:** Passed. Gap cards show emphasis, coverage, detected evidence, point difference, and study action.
8. **Sample data:** Passed. Black-box test reaches a complete report from the sample action.
9. **Reset:** Passed. Black-box test returns from the report to a clean analysis view.
10. **Engineering checks:** Passed. Tests, lint, type-check, and production build succeed.

## Automated evidence

- `pnpm test`: 3 test files, 14 tests passed.
- Coverage: 81.36% statements and 84.40% lines overall; core analysis is 97.36% statements and 100% functions.
- `pnpm lint`: no errors or warnings.
- `pnpm build`: production output generated successfully with lazy-loaded document parser chunks.

## Browser evidence

Validated in headless Chromium at 1440×1100 and 390×844.

- Home desktop: no horizontal overflow.
- Report desktop: no horizontal overflow.
- Home mobile: no horizontal overflow.
- Report mobile: no horizontal overflow.
- Browser console: no errors across the home and sample-report flows.
- Visual inspection: hierarchy, contrast, wrapping, card alignment, and responsive stacking are intact.

Screenshots from the validation run are stored locally under `artifacts/visual-validation/` and intentionally ignored by Git.

## Known non-blocking limitations

- OCR is not available for scanned documents.
- PDF and DOCX adapters use proven upstream libraries but do not yet have binary fixture integration tests in this repository.
- The initial taxonomy needs expert review and curriculum expansion before a clinical production pilot.
