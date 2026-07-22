# Security policy

## Supported version

The latest commit on the default branch is the supported development version.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting for the repository rather than opening a public issue with exploit details or private document content.

## Privacy boundary

InHouseRx has no cloud content API, analytics, or document persistence. Browser-supported documents are processed in the browser. Optional OCR/media processing is sent only to the configured HTTP loopback companion, and the client rejects non-loopback companion addresses.

The desktop build keeps renderer Node integration disabled, enables context isolation and sandboxing, denies browser permissions and unexpected navigation, and exposes only validated companion operations through its preload bridge. The companion destination is fixed to `127.0.0.1:8766` in packaged desktop builds.

Do not include real student records, protected health information, licensed exam content, or other sensitive source files in bug reports.
