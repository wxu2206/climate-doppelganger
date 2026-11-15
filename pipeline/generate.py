"""Download, validate and export monthly NASA POWER point observations.

The network stage is explicit. Tests and frontend builds never fetch NASA.
Raw responses are cached locally; compact validated monthly data is committed.
"""

from __future__ import annotations

import argparse
import calendar
import hashlib
import json
import math
import time
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import numpy as np
import pandas as pd
from scipy import stats

ROOT = Path(__file__).resolve().parents[1]
LOCATIONS = [
    ("vancouver", "Vancouver", "Canada", 49.2827, -123.1207),
    ("langley", "Langley / Vancouver", "Canada", 49.10, -122.66),
    ("london", "London", "United Kingdom", 51.51, -0.13),
    ("lisbon", "Lisbon", "Portugal", 38.72, -9.14),
    ("nairobi", "Nairobi", "Kenya", -1.29, 36.82),
    ("cape-town", "Cape Town", "South Africa", -33.92, 18.42),
    ("tokyo", "Tokyo", "Japan", 35.68, 139.69),
    ("perth", "Perth", "Australia", -31.95, 115.86),
    ("santiago", "Santiago", "Chile", -33.45, -70.67),
    ("reykjavik", "Reykjavík", "Iceland", 64.15, -21.94),
    ("seattle", "Seattle", "United States", 47.61, -122.33),
    ("marrakesh", "Marrakesh", "Morocco", 31.63, -7.98),
    ("singapore", "Singapore", "Singapore", 1.35, 103.82),
    ("sydney", "Sydney", "Australia", -33.87, 151.21),
    ("auckland", "Auckland", "New Zealand", -36.85, 174.76),
    ("buenos-aires", "Buenos Aires", "Argentina", -34.60, -58.38),
    ("mexico-city", "Mexico City", "Mexico", 19.43, -99.13),
]


def number(value: Any) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError("Expected a JSON number")
    if not math.isfinite(value):
        raise ValueError("Expected a finite number")
    return float(value)


def validate_response(
    data: dict[str, Any], start: int, end: int, lat: float, lon: float
) -> list[dict[str, Any]]:
    """Fail closed: require a complete monthly series and recognized units."""
    try:
        if data["parameters"]["T2M"]["units"] not in {"C", "degC", "°C"}:
            raise ValueError("Unrecognized T2M units")
        if data["parameters"]["PRECTOTCORR"]["units"] != "mm/day":
            raise ValueError("Expected PRECTOTCORR monthly average daily rate in mm/day")
        coordinates = [number(v) for v in data["geometry"]["coordinates"]]
        if len(coordinates) != 3:
            raise ValueError("Expected longitude, latitude and elevation")
        if not isinstance(data["header"]["title"], str):
            raise ValueError("Missing source title")
        if abs(float(coordinates[0]) - lon) > 0.02 or abs(float(coordinates[1]) - lat) > 0.02:
            raise ValueError("Response point does not match requested coordinates")
        values = data["properties"]["parameter"]
        fill = number(data["header"]["fill_value"])
        months = []
        for year in range(start, end + 1):
            for month in range(1, 13):
                key = f"{year}{month:02}"
                t, p = number(values["T2M"][key]), number(values["PRECTOTCORR"][key])
                if not all(math.isfinite(v) and v != fill for v in (t, p)):
                    raise ValueError(f"Missing or invalid observation at {key}")
                if not -100 <= t <= 65 or not 0 <= p <= 1000:
                    raise ValueError(f"Out-of-range observation at {key}")
                months.append({"date": f"{year}-{month:02}", "t": t, "p": p})
        return months
    except (KeyError, TypeError, IndexError, OverflowError) as exc:
        raise ValueError(f"Invalid POWER response schema: {exc}") from exc


def annual_summary(months: list[dict[str, Any]]) -> list[dict[str, Any]]:
    frame = pd.DataFrame(months)
    frame["year"] = frame["date"].str[:4].astype(int)
    frame["days"] = [calendar.monthrange(int(m["date"][:4]), int(m["date"][5:]))[1] for m in months]
    result = []
    for year, rows in frame.groupby("year"):
        if len(rows) != 12 or rows["date"].nunique() != 12:
            continue
        result.append(
            {
                "year": int(str(year)),
                "t": float(np.average(rows["t"], weights=rows["days"])),
                "p": float((rows["p"] * rows["days"]).sum()),
            }
        )
    return result


def trend(years: list[int], values: list[float]) -> dict[str, Any]:
    fit = stats.linregress(years, values)
    margin = float(stats.t.ppf(0.975, len(years) - 2) * fit.stderr)
    return {
        "decade": float(fit.slope * 10),
        "p": float(fit.pvalue),
        "ci": [float((fit.slope - margin) * 10), float((fit.slope + margin) * 10)],
    }


def download(url: str, cache: Path, refresh: bool = False) -> bytes:
    if cache.exists() and not refresh:
        if cache.stat().st_size > 8_000_000:
            raise ValueError("Cached response exceeds size limit")
        return cache.read_bytes()
    for attempt in range(4):
        try:
            request = Request(url, headers={"User-Agent": "ClimateDoppelganger/0.1 research"})
            with urlopen(request, timeout=90) as response:
                raw = bytes(response.read(8_000_001))
            if len(raw) > 8_000_000:
                raise ValueError("Response exceeds size limit")
            json.loads(raw)  # Do not cache a non-JSON error page.
            cache.parent.mkdir(parents=True, exist_ok=True)
            temporary = cache.with_suffix(".download.tmp")
            temporary.write_bytes(raw)
            temporary.replace(cache)
            return raw
        except HTTPError as exc:
            if exc.code not in {429, 500, 502, 503, 504} or attempt == 3:
                raise
        except URLError as exc:
            if "403" in str(exc.reason) or "407" in str(exc.reason) or attempt == 3:
                raise
        time.sleep(2 ** (attempt + 1))
    raise RuntimeError("Download failed")


def read_archive(cache: Path, expected_url: str) -> tuple[bytes, dict[str, Any]]:
    """Verify receipt before import; a checksum is integrity evidence, not authentication."""
    if cache.stat().st_size > 8_000_000:
        raise ValueError("Raw archive response exceeds size limit")
    raw = cache.read_bytes()
    receipt_path = cache.with_suffix(".receipt.json")
    if receipt_path.stat().st_size > 4096:
        raise ValueError("Archive receipt exceeds size limit")
    receipt = json.loads(receipt_path.read_text())
    if not isinstance(receipt, dict) or receipt.get("url") != expected_url:
        raise ValueError("Archive receipt does not match requested NASA query")
    if receipt.get("sha256") != hashlib.sha256(raw).hexdigest():
        raise ValueError("Archive checksum mismatch")
    if not isinstance(receipt.get("retrieved"), str):
        raise ValueError("Archive receipt needs a retrieval timestamp")
    timestamp = datetime.fromisoformat(receipt["retrieved"])
    if timestamp.tzinfo is None or timestamp > datetime.now(UTC):
        raise ValueError("Archive retrieval timestamp must be timezone-aware and not future")
    return raw, receipt


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", type=int, default=1991)
    parser.add_argument("--end", type=int, default=2024)
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--raw-dir", type=Path, default=ROOT / ".cache" / "power")
    parser.add_argument(
        "--offline", action="store_true", help="Validate a local raw archive without network"
    )
    parser.add_argument(
        "--download-only",
        action="store_true",
        help="Save validated raw responses and receipts only",
    )
    parser.add_argument("--output", type=Path, default=ROOT / "public/data/climate.json")
    parser.add_argument("--refresh", action="store_true")
    args = parser.parse_args()
    if not 1981 <= args.start <= args.end <= datetime.now(UTC).year - 1:
        parser.error("Choose complete historical years from 1981 onward")
    if not 1 <= args.limit <= len(LOCATIONS):
        parser.error("Invalid location limit")
    if args.offline and args.refresh:
        parser.error("--offline cannot be combined with --refresh")
    if not args.download_only and (args.end - args.start < 9 or args.limit < 2):
        parser.error(
            "Frontend export needs 2 locations and 10 years; use --download-only for probes"
        )
    locations = []
    for ident, name, country, lat, lon in LOCATIONS[: args.limit]:
        query = urlencode(
            {
                "parameters": "T2M,PRECTOTCORR",
                "community": "AG",
                "latitude": lat,
                "longitude": lon,
                "start": args.start,
                "end": args.end,
                "format": "JSON",
            }
        )
        url = f"https://power.larc.nasa.gov/api/temporal/monthly/point?{query}"
        cache = args.raw_dir / f"{ident}-{args.start}-{args.end}.json"
        print(f"Fetching {name}", flush=True)
        receipt_path = cache.with_suffix(".receipt.json")
        if args.offline:
            raw, receipt = read_archive(cache, url)
        else:
            # A previous cache without a receipt cannot establish retrieval time.
            fresh = args.refresh or not receipt_path.exists()
            raw = download(url, cache, fresh)
            if fresh:
                receipt = {
                    "url": url,
                    "sha256": hashlib.sha256(raw).hexdigest(),
                    "retrieved": datetime.now(UTC).isoformat(),
                }
            else:
                raw, receipt = read_archive(cache, url)
        response = json.loads(raw)
        months = validate_response(response, args.start, args.end, lat, lon)
        if not args.offline:
            temporary_receipt = receipt_path.with_suffix(".tmp")
            temporary_receipt.write_text(json.dumps(receipt, indent=2) + "\n")
            temporary_receipt.replace(receipt_path)
        locations.append(
            {
                "id": ident,
                "name": name,
                "country": country,
                "lat": lat,
                "lon": lon,
                "elevation": response["geometry"]["coordinates"][2],
                "source": {
                    "url": url,
                    "sha256": hashlib.sha256(raw).hexdigest(),
                    "retrieved": receipt["retrieved"],
                    "title": response["header"]["title"],
                    "header": response["header"],
                    "parameters": response["parameters"],
                },
                "months": months,
            }
        )
        if not args.offline:
            time.sleep(1.2)
    if args.download_only:
        print(f"Validated raw archive: {args.raw_dir}")
        return
    dataset = {
        "version": f"power-{args.start}-{args.end}-v1",
        "start": args.start,
        "end": args.end,
        "source": "NASA POWER monthly point API",
        "units": {"temperature": "C", "precipitation": "mm/day"},
        "locations": locations,
    }
    output = args.output
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix(".tmp")
    temporary.write_text(json.dumps(dataset, separators=(",", ":"), allow_nan=False) + "\n")
    temporary.replace(output)  # Publish only after ALL selected locations validate.
    print(f"Validated {len(locations)} locations -> {output}")


if __name__ == "__main__":
    try:
        main()
    except (URLError, ValueError, OSError) as exc:
        message = f"NASA ingestion failed; no substitute observations written: {exc}"
        raise SystemExit(message) from exc
