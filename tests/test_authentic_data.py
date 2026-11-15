"""Offline regressions against genuine NASA responses and independent calculations."""

import hashlib
import json
from pathlib import Path

import pytest

from pipeline.generate import ROOT, annual_summary, validate_response

FIXTURES = Path(__file__).parent / "fixtures"


def test_genuine_power_response_and_month13_exclusion():
    path = FIXTURES / "nasa-power-vancouver-2024.json"
    receipt = json.loads(path.with_suffix(".provenance.json").read_text())
    assert hashlib.sha256(path.read_bytes()).hexdigest() == receipt["sha256"]
    raw = json.loads(path.read_text())
    months = validate_response(raw, 2024, 2024, 49.2827, -123.1207)
    assert len(months) == 12
    assert months[0] == {"date": "2024-01", "t": -1.09, "p": 11.84}
    assert all(not m["date"].endswith("-13") for m in months)
    year = annual_summary(months)[0]
    assert year["p"] == pytest.approx(2242.28)


def test_production_snapshot_matches_independent_reference_hash():
    reference = json.loads((FIXTURES / "nasa-analysis-reference.json").read_text())
    dataset = ROOT / "public/data/climate.json"
    assert hashlib.sha256(dataset.read_bytes()).hexdigest() == reference["dataset_sha256"]
