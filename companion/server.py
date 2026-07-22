"""Loopback-only bridge between InHouseRx and Local Content Transcriber."""

from __future__ import annotations

import os

import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from local_transcriber.api import create_app
from companion.config import allowed_origins


app = create_app()
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins(os.environ.get("INHOUSERX_ALLOWED_ORIGINS", "")),
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


def main() -> None:
    """Start the private companion without opening a second product UI."""
    uvicorn.run(app, host="127.0.0.1", port=8766, log_level="warning")


if __name__ == "__main__":
    main()
