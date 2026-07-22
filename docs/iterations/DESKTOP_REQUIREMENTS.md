# Cross-platform desktop requirements

## Goal

Ship InHouseRx as an installable desktop application for Windows, macOS, and Linux without removing or weakening the existing browser experience.

## Users and jobs

- A medical student can install InHouseRx on a supported desktop and run the same private, local-first comparison workflow as the web app.
- A student can optionally connect the separately installed Local Content Transcriber companion for OCR and media transcription.
- A maintainer can build each operating-system package on its native GitHub runner and publish the outputs in one GitHub Release.

## Functional requirements

1. The desktop shell must load the production React bundle locally and support the existing sample, upload, analysis, and reset flows.
2. The desktop app must use the InHouseRx blue `#337ab7` and the existing white InHouseRx wordmark.
3. Windows must receive a 64-bit installer.
4. macOS must receive a universal Apple Silicon/Intel disk image and ZIP archive.
5. Linux must receive 64-bit AppImage and Debian packages.
6. The optional Local Content Transcriber integration must continue to use loopback only. Desktop renderer code must access it through a narrowly scoped preload bridge.
7. GitHub Actions must run tests and produce all platform artifacts. A tagged release must be able to publish those artifacts.

## Security and privacy requirements

- Node.js APIs are unavailable to renderer code.
- Context isolation and Chromium sandboxing are enabled.
- Permission requests, unexpected navigation, and unexpected popup windows are denied.
- Packaged files are resolved through a privileged local application protocol with traversal protection.
- External links are restricted to known InHouseRx GitHub HTTPS destinations and open in the system browser.
- Companion requests are limited to `127.0.0.1:8766`, validate payload shape and file size, and never expose general IPC or networking primitives.
- Uploaded content remains local unless a user separately chooses and configures a future remote service.

## Acceptance criteria

- Existing web tests, companion tests, lint, and production web build pass.
- Desktop security helper and renderer bridge tests pass.
- A packaged Windows application launches and loads the production interface in a smoke check.
- Native CI jobs produce the documented Windows, macOS, and Linux artifacts.
- A public GitHub Release contains downloadable packages and clearly labels them unsigned.
- Installation and companion instructions cover all supported platforms.

## Out of scope for this increment

- Apple notarization, Developer ID signing, Windows Authenticode signing, and app-store submissions.
- Automatic updates.
- Bundling Python, OCR engines, Whisper models, or Local Content Transcriber into the desktop binary.
- Mobile applications.

