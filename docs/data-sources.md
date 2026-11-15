# Data sources and regeneration

NASA POWER: https://power.larc.nasa.gov/
Monthly point API documentation: https://power.larc.nasa.gov/docs/services/api/temporal/monthly/

## Current acquisition status

**Blocked in this cloud instance:** requests to POWER and the supplied Space Apps challenge URL returned a proxy CONNECT HTTP 403 before reaching the destinations. No NASA response was obtained. Therefore current API metadata, parameter availability and coverage have NOT yet been independently confirmed against live NASA. No real climate dataset has been committed and no discovery is represented as verified. The parser's expected POWER schema must be confirmed against the first successful response before treating the application as submission-ready.

A cloud environment draft adds `power.larc.nasa.gov` and `www.spaceappschallenge.org` to the custom network allowlist, preserving package-manager presets. Saving a draft does not apply runtime access. Both domains are already configured in the saved draft. The observed running instance still reports an older revision without them. See network-diagnosis.md; adding the same domains again is not a remedy. No NASA credentials are expected for these public endpoints.

## Pipeline

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-lock.txt
.venv/bin/python -m pip install --no-deps -e .
# First inspect one response, units, fill_value and temporal metadata:
.venv/bin/python -m pipeline.generate --limit 1 --download-only
# Then generate the default 10 geographically diverse points, including Langley/Vancouver:
.venv/bin/python -m pipeline.generate
```

Default requested interval: 1991–2024 inclusive, 408 months per point. The 17 curated coordinates are in `pipeline/generate.py`. They are proposed sample points until NASA retrieval and validation succeed. Start with `--limit 2` or more for a frontend-loadable dataset; `--limit 1` is a schema probe only. The UI requires at least two locations and at least 10 years.

Raw responses and their integrity/retrieval receipts go to ignored `.cache/power/<id>-<start>-<end>.json` and `.receipt.json`. Downloads are sequential, separated by 1.2 seconds, with bounded retries on 429/transient HTTP errors and network failures. TLS verification stays enabled. `--refresh` explicitly replaces cached responses. Validation rejects missing keys, nonfinite/fill values, invalid coordinates, unexpected units and incomplete dates. Annual summary code uses Pandas/NumPy, and SciPy provides independent reference regressions.

The pipeline publishes `public/data/climate.json` atomically only after every chosen point validates. The compact JSON retains all monthly temperature and precipitation values, requested coordinates, returned elevation, source URL, retrieval timestamp, title and raw SHA-256. Raw responses are not committed. A cached response retains its receipt timestamp as retrieval time, independent of filesystem modification time. Repeated cached regeneration is reproducible. Derived annual series and fingerprints are recalculated in the browser, not stored as unauditable scores.

After successful acquisition, inspect the response `header`, `parameters`, `geometry`, and `properties.parameter`; confirm units and source product citations. Preserve a small genuine NASA fixture with attribution for deterministic parsing tests, update this status, run all checks, and record a verified discovery in docs/demo.md. Do not rename synthetic fixtures as NASA data.

## Attribution

Credit NASA POWER, NASA Langley Research Center. Cite the returned product-specific sources when obtained. Do not imply NASA endorses this independent project. Natural Earth supplies the public-domain land geometry (see `public/data/NOTICE.md`); it is not environmental observation data. NASA logos and awards are not used.

The user supplied the 2026 challenge “Be An Earth System Trend Detective!” at https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/. This title and URL are user-provided; live challenge details remain unverified while access is blocked.

See [the network diagnosis](network-diagnosis.md) and [portable local acquisition/offline import](local-data-transfer.md). The domains are already configured in the draft; the observed runtime revision differs. No duplicate allowlist entry is needed.
