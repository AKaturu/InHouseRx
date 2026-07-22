# Cross-platform desktop research

Research performed July 21, 2026 against primary project documentation.

## Packaging approach

Electron can distribute a bundled web application as native desktop executables, while electron-builder supplies installer/package targets and GitHub-oriented artifact configuration. Electron's documentation recommends packaging application source into an executable and signing distributed applications. electron-builder documents that reliable multi-platform output should be built on the matching native operating system; macOS code signing in particular must run on macOS.

Selected approach:

- Electron for the narrowly scoped desktop runtime.
- electron-builder for Windows NSIS, macOS DMG/ZIP, Linux AppImage/deb.
- Native GitHub-hosted Windows, macOS, and Ubuntu runners instead of cross-compiling all artifacts from one host.
- A universal macOS artifact to cover Apple Silicon and Intel users.

Sources:

- [Electron application distribution](https://www.electronjs.org/docs/latest/tutorial/application-distribution/)
- [Electron distribution overview](https://www.electronjs.org/docs/latest/tutorial/distribution-overview)
- [electron-builder multi-platform builds](https://www.electron.build/multi-platform-build.html)
- [electron-builder configuration](https://www.electron.build/configuration.html)
- [electron-builder Linux targets](https://www.electron.build/linux.html)

## Security posture

Electron's security guidance calls for context isolation, process sandboxing, no Node integration for remotely influenced content, careful navigation handling, permission request handlers, and validation of IPC senders. Context isolation keeps preload privileges separate from page scripts, but safe APIs still need one-method-at-a-time exposure rather than raw IPC.

Selected controls:

- `nodeIntegration: false`, `contextIsolation: true`, and `sandbox: true`.
- Local application assets only, served with an `inhouserx://` scheme.
- No arbitrary navigation or child windows.
- All Chromium permission requests denied.
- An allowlist for HTTPS links that may leave the app.
- A preload API limited to companion capabilities and transcription.
- Main-process validation of renderer origin, loopback destination, metadata, response shape, timeout, and 20 MB size ceiling.

Sources:

- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron context isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)

## Release trust

Unsigned applications are usable for development and early open-source testing, but operating-system reputation and integrity protections will warn users. Apple distribution outside the Mac App Store normally requires Developer ID signing and notarization. Windows signing reduces SmartScreen friction. This increment therefore publishes explicitly labeled unsigned artifacts and leaves certificate-backed release automation for a later milestone.

## Local Content Transcriber decision

The companion remains separately installed because embedding Python plus optional OCR/speech engines would dramatically increase package size, platform variance, and update complexity. The desktop renderer does not call an insecure loopback URL directly from a privileged custom origin. Its constrained preload bridge asks the Electron main process to make the loopback call, preserving the companion's local-only design while avoiding mixed-content and browser CORS differences.

