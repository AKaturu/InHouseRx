# Cross-platform desktop architecture

## System shape

```text
React/Vite renderer
  |-- browser mode ------> browser extraction + loopback HTTP companion
  |-- desktop preload ---> validated IPC methods
                              |
Electron main process -------+
  |-- inhouserx://app ------> packaged dist assets
  |-- loopback proxy -------> 127.0.0.1:8766 companion
  `-- system browser -------> allowlisted GitHub HTTPS links
```

The React renderer stays platform-neutral. At runtime it detects the frozen `window.inHouseRxDesktop` API. Browser mode retains the existing HTTP client; desktop mode sends only the file bytes and metadata required by the companion operation.

## Components

### Main process

`electron/main.mjs` owns application lifecycle, the BrowserWindow, the custom protocol, permission policy, navigation policy, and companion IPC handlers. Production assets are resolved beneath `dist/`, with unknown client-side routes falling back to `index.html` and invalid/traversal paths rejected.

### Preload bridge

`electron/preload.mjs` exposes immutable, task-specific methods through `contextBridge`. It does not expose Electron, `ipcRenderer`, the filesystem, subprocesses, or an arbitrary channel argument.

### Pure security helpers

`electron/security.mjs` contains URL allowlisting, trusted-renderer checks, packaged-path resolution, and companion input validation as pure functions. Node's built-in test runner exercises these outside an Electron process.

### Renderer adapter

`src/services/localTranscriberClient.ts` chooses the desktop bridge when present and otherwise preserves the existing browser transport. Both paths normalize responses into the same application-level result types.

### Packaging and release

`electron-builder.yml` describes native artifacts and branded metadata. `.github/workflows/desktop-release.yml` runs verification and builds on native operating systems, uploads per-platform artifacts, and creates a GitHub Release for version tags.

## Security boundaries

- The renderer is treated as untrusted input even though its source ships with the app.
- Only a packaged `inhouserx://app` sender or the exact configured loopback Vite development origin may invoke companion handlers.
- Companion networking has a hard-coded loopback origin and bounded timeouts.
- External navigation is default-deny.
- Content Security Policy limits scripts, objects, base URLs, forms, and connections.

## Failure behavior

- If the companion is not running, the existing UI reports it as unavailable and document-only analysis remains usable.
- Invalid file payloads fail before network access.
- Invalid companion responses are converted into safe user-visible errors without exposing renderer privileges.
- A second desktop launch focuses the existing window.

## Release matrix

| Operating system | Architecture | Artifacts |
| --- | --- | --- |
| Windows | x64 | NSIS `.exe` installer |
| macOS | universal (arm64 + x64) | `.dmg`, `.zip` |
| Linux | x64 | `.AppImage`, `.deb` |

