"""Tests for the dependency-free companion security configuration."""

from __future__ import annotations

import unittest

from companion.config import DEFAULT_ORIGINS, allowed_origins, normalize_origin


class CompanionOriginTests(unittest.TestCase):
    def test_defaults_are_loopback_only(self) -> None:
        self.assertEqual(allowed_origins(), list(DEFAULT_ORIGINS))
        self.assertTrue(all("localhost" in origin or "127.0.0.1" in origin for origin in DEFAULT_ORIGINS))

    def test_explicit_origin_is_normalized_and_deduplicated(self) -> None:
        result = allowed_origins("https://AKaturu.github.io/,http://localhost:5173")
        self.assertEqual(result.count("http://localhost:5173"), 1)
        self.assertIn("https://AKaturu.github.io", result)

    def test_credentials_paths_and_non_http_schemes_are_rejected(self) -> None:
        for value in ("file:///tmp/app", "http://user:pass@localhost:3000", "https://example.com/app"):
            with self.subTest(value=value):
                with self.assertRaises(ValueError):
                    normalize_origin(value)


if __name__ == "__main__":
    unittest.main()
