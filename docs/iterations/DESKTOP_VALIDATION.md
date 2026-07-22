# Cross-platform desktop validation

Validated July 21, 2026 (America/Denver) for InHouseRx `v0.2.0`.

## Automated verification

- `pnpm test`: 24 tests passed across four Vitest files.
- `pnpm test:desktop`: four Electron security tests passed.
- `pnpm test:companion`: three Python companion configuration tests passed.
- `pnpm lint`: passed without errors.
- `pnpm audit --prod`: no known vulnerabilities.
- `pnpm build`: TypeScript and Vite production build passed.
- `git diff --check`: passed.

The same test, lint, and build suite passed from a clean Ubuntu GitHub runner before native packaging.

## Packaged Windows smoke check

The unpacked Windows x64 executable was started with the internal `--smoke-test` flag. The check confirmed that:

- the production `inhouserx://app` document loaded;
- the document title and React root were present;
- the sandboxed preload exposed the constrained desktop bridge; and
- the process exited successfully with code 0.

The final package archive was also inspected and contained zero `node_modules` entries. Its main and preload processes rely only on built-in Node/Electron APIs, while renderer dependencies are already bundled by Vite.

## Native build matrix

[GitHub Actions run 29885519860](https://github.com/AKaturu/InHouseRx/actions/runs/29885519860) completed successfully on native Windows, macOS, and Linux runners. The tag-triggered [release run 29885947954](https://github.com/AKaturu/InHouseRx/actions/runs/29885947954) reproduced every package and published the release successfully.

## Published release

[InHouseRx v0.2.0](https://github.com/AKaturu/InHouseRx/releases/tag/v0.2.0) is public and contains:

| Artifact | Bytes |
| --- | ---: |
| `InHouseRx-0.2.0-win-x64.exe` | 100,171,059 |
| `InHouseRx-0.2.0-mac-universal.dmg` | 216,915,388 |
| `InHouseRx-0.2.0-mac-universal.zip` | 216,845,142 |
| `InHouseRx-0.2.0-linux-x86_64.AppImage` | 127,737,634 |
| `InHouseRx-0.2.0-linux-amd64.deb` | 99,784,688 |

## Known release constraint

The preview packages are not certificate-signed or notarized. Windows SmartScreen and macOS Gatekeeper may warn users. The release notes and README disclose this explicitly; signing requires developer certificates and associated secrets that were outside this increment.

