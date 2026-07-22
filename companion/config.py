"""Configuration helpers that do not require the transcriber runtime."""

from __future__ import annotations

from urllib.parse import urlsplit


DEFAULT_ORIGINS = (
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:4173",
    "http://localhost:4173",
)


def normalize_origin(value: str) -> str:
    """Validate and normalize one explicit browser origin."""
    parsed = urlsplit(value.strip())
    if (
        parsed.scheme not in {"http", "https"}
        or not parsed.netloc
        or parsed.username
        or parsed.password
        or parsed.path not in {"", "/"}
        or parsed.query
        or parsed.fragment
    ):
        raise ValueError(f"Invalid InHouseRx browser origin: {value}")
    return f"{parsed.scheme}://{parsed.netloc}".rstrip("/")


def allowed_origins(configured: str = "") -> list[str]:
    """Return default loopback origins plus explicit, validated additions."""
    extras = [normalize_origin(origin) for origin in configured.split(",") if origin.strip()]
    return list(dict.fromkeys((*DEFAULT_ORIGINS, *extras)))
