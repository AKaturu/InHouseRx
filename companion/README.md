# InHouseRx local companion

This optional loopback service composes [Local Content Transcriber](https://github.com/AKaturu/local-content-transcriber) so InHouseRx can analyze scanned documents, images, audio, and video without sending source content off the device.

## Set up

From the InHouseRx repository with Python 3.11+:

```powershell
python -m venv .venv-companion
.venv-companion\Scripts\Activate.ps1
python -m pip install -r companion\requirements.txt
python companion\server.py
```

Keep that terminal open, then start InHouseRx with `pnpm dev`. The upload workspace will change from **Browser-only mode** to the available local OCR/media capabilities.

The bridge binds only to `127.0.0.1:8766`. Uploaded files use Local Content Transcriber's request-scoped temporary storage and cleanup behavior.

Speech models are never silently downloaded during analysis. Follow the upstream model-installation instructions if media capability reports that setup is needed.

For a non-default frontend origin, provide an explicit comma-separated allowlist:

```powershell
$env:INHOUSERX_ALLOWED_ORIGINS = "http://127.0.0.1:3000"
python companion\server.py
```
