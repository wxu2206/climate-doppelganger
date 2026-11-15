"""Synthetic fixtures test schema boundaries; never used as real observations."""

import calendar

import pytest

from pipeline.generate import annual_summary, validate_response


def fixture():
    return {
        "header": {"fill_value": -999, "title": "SYNTHETIC TEST ONLY"},
        "geometry": {"coordinates": [-122.66, 49.1, 0]},
        "parameters": {"T2M": {"units": "C"}, "PRECTOTCORR": {"units": "mm/day"}},
        "properties": {
            "parameter": {
                "T2M": {f"2000{m:02}": float(m) for m in range(1, 13)},
                "PRECTOTCORR": {f"2000{m:02}": 2.0 for m in range(1, 13)},
            }
        },
    }


def test_validate_and_aggregate():
    months = validate_response(fixture(), 2000, 2000, 49.1, -122.66)
    result = annual_summary(months)
    assert result[0]["p"] == 732
    expected = sum(m * calendar.monthrange(2000, m)[1] for m in range(1, 13)) / 366
    assert result[0]["t"] == pytest.approx(expected)


def test_reject_units_missing_coordinates_fill_and_nonfinite():
    for kind in ["units", "missing", "fill", "nan", "coordinate"]:
        data = fixture()
        if kind == "units":
            data["parameters"]["PRECTOTCORR"]["units"] = "mm/month"
        elif kind == "missing":
            del data["properties"]["parameter"]["T2M"]["200001"]
        elif kind == "coordinate":
            data["geometry"]["coordinates"] = [0, 0, 0]
        else:
            data["properties"]["parameter"]["T2M"]["200001"] = (
                -999 if kind == "fill" else float("nan")
            )
        with pytest.raises(ValueError):
            validate_response(data, 2000, 2000, 49.1, -122.66)


def test_annual_summary_omits_incomplete_year():
    months = validate_response(fixture(), 2000, 2000, 49.1, -122.66)
    assert annual_summary(months[:-1]) == []


def test_schema_rejects_malformed_and_nonphysical_values():
    for value in [None, {}, {"parameters": {}}]:
        with pytest.raises(ValueError):
            validate_response(value, 2000, 2000, 49.1, -122.66)
    for parameter, invalid in [("T2M", 100), ("PRECTOTCORR", -1)]:
        data = fixture()
        data["properties"]["parameter"][parameter]["200001"] = invalid
        with pytest.raises(ValueError):
            validate_response(data, 2000, 2000, 49.1, -122.66)


def test_download_uses_cache_without_network(tmp_path, monkeypatch):
    import pipeline.generate as module

    cache = tmp_path / "point.json"
    cache.write_bytes(b'{"test": "synthetic cache fixture"}')

    def forbidden(*args, **kwargs):
        raise AssertionError("Network should not run for cached data")

    monkeypatch.setattr(module, "urlopen", forbidden)
    assert module.download("https://example.invalid", cache) == cache.read_bytes()


def test_download_retries_transient_errors_without_disabling_tls(tmp_path, monkeypatch):
    from io import BytesIO
    from urllib.error import HTTPError

    import pipeline.generate as module

    calls = []
    delays = []

    def request(req, timeout):
        calls.append(req)
        if len(calls) < 3:
            raise HTTPError(req.full_url, 503, "temporary test error", {}, None)
        return BytesIO(b'{"test": "synthetic network fixture"}')

    monkeypatch.setattr(module, "urlopen", request)
    monkeypatch.setattr(module.time, "sleep", delays.append)
    cache = tmp_path / "point.json"
    raw = module.download("https://example.invalid", cache)
    assert cache.read_bytes() == raw
    assert len(calls) == 3
    assert delays == [2, 4]


def test_permanent_http_errors_do_not_retry(tmp_path, monkeypatch):
    from urllib.error import HTTPError

    import pipeline.generate as module

    def forbidden(req, timeout):
        raise HTTPError(req.full_url, 403, "test denial", {}, None)

    def no_wait(seconds):
        raise AssertionError("Permanent errors must not sleep or retry")

    monkeypatch.setattr(module, "urlopen", forbidden)
    monkeypatch.setattr(module.time, "sleep", no_wait)
    with pytest.raises(HTTPError):
        module.download("https://example.invalid", tmp_path / "none.json")


def test_independent_scipy_regression_reference():
    import json
    from pathlib import Path

    from pipeline.generate import trend

    cases = json.loads((Path(__file__).parent / "fixtures/regression-reference.json").read_text())
    for case in cases:
        result = trend(case["x"], case["y"])
        assert result["decade"] == pytest.approx(case["decade"])
        assert result["ci"] == pytest.approx(case["ci"])
        assert result["p"] == pytest.approx(case["p"])


@pytest.mark.parametrize("bad", [float("nan"), float("inf"), True, "49.1"])
def test_reject_non_numeric_or_nonfinite_coordinates(bad):
    data = fixture()
    data["geometry"]["coordinates"][1] = bad
    with pytest.raises(ValueError):
        validate_response(data, 2000, 2000, 49.1, -122.66)


def test_reject_boolean_observation():
    data = fixture()
    data["properties"]["parameter"]["T2M"]["200001"] = True
    with pytest.raises(ValueError):
        validate_response(data, 2000, 2000, 49.1, -122.66)


def test_archive_roundtrip_and_tamper_detection(tmp_path, monkeypatch):
    import json
    import sys

    import pipeline.generate as module

    monkeypatch.setattr(module, "LOCATIONS", module.LOCATIONS[:2])
    monkeypatch.setattr(module.time, "sleep", lambda _: None)

    def fake_download(url, cache, refresh=False):
        from urllib.parse import parse_qs, urlsplit

        query = parse_qs(urlsplit(url).query)
        data = fixture()
        data["geometry"]["coordinates"] = [
            float(query["longitude"][0]),
            float(query["latitude"][0]),
            0,
        ]
        for param in ["T2M", "PRECTOTCORR"]:
            data["properties"]["parameter"][param] = {
                f"{year}{month:02}": 2.0 for year in range(1991, 2001) for month in range(1, 13)
            }
        raw = json.dumps(data).encode()
        cache.parent.mkdir(parents=True, exist_ok=True)
        cache.write_bytes(raw)
        return raw

    monkeypatch.setattr(module, "download", fake_download)
    raw_dir = tmp_path / "raw"
    output = tmp_path / "climate.json"
    base = [
        "generate",
        "--start",
        "1991",
        "--end",
        "2000",
        "--limit",
        "2",
        "--raw-dir",
        str(raw_dir),
        "--output",
        str(output),
    ]
    monkeypatch.setattr(sys, "argv", base + ["--download-only"])
    module.main()
    assert not output.exists()
    monkeypatch.setattr(sys, "argv", base + ["--offline"])
    module.main()
    exported = output.read_bytes()
    data = json.loads(exported)
    assert len(data["locations"]) == 2
    assert data["locations"][0]["source"]["title"] == "SYNTHETIC TEST ONLY"
    # Repeated offline imports preserve bytes, including retrieval timestamps.
    module.main()
    assert output.read_bytes() == exported
    (raw_dir / "langley-1991-2000.json").write_text("{}")
    with pytest.raises(ValueError, match="checksum"):
        module.main()
    assert output.read_bytes() == exported


def test_proxy_access_denial_never_retries(tmp_path, monkeypatch):
    from urllib.error import URLError

    import pipeline.generate as module

    def denied(*args, **kwargs):
        raise URLError("Tunnel connection failed: 403 Forbidden")

    def no_wait(_):
        raise AssertionError("Must not retry proxy access denial")

    monkeypatch.setattr(module, "urlopen", denied)
    monkeypatch.setattr(module.time, "sleep", no_wait)
    with pytest.raises(URLError):
        module.download("https://example.invalid", tmp_path / "nothing")


def test_invalid_frontend_export_fails_before_network(monkeypatch):
    import sys

    import pipeline.generate as module

    def forbidden(*args, **kwargs):
        raise AssertionError("Invalid export must fail before downloading")

    monkeypatch.setattr(module, "download", forbidden)
    monkeypatch.setattr(sys, "argv", ["generate", "--limit", "1"])
    with pytest.raises(SystemExit) as error:
        module.main()
    assert error.value.code == 2
