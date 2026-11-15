# Verified NASA POWER data

The production snapshot `public/data/climate.json` now contains authentic observations obtained directly from the NASA POWER monthly point API over verified HTTPS. No synthetic observations are included.

- Dataset: `power-1991-2024-v1`, 1991–2024 inclusive.
- Coverage: 10 locations, 408 months per location, 8,160 temperature/precipitation values. All requested months passed validation; no missing values were imputed.
- Locations: Vancouver, Langley/Vancouver, London, Lisbon, Nairobi, Cape Town, Tokyo, Perth, Santiago and Reykjavík.
- Parameters: T2M, temperature at 2 metres, °C; PRECTOTCORR, corrected precipitation, mm/day.
- Source: NASA POWER, NASA Langley Research Center; meteorological inputs identified as MERRA-2 in every response.
- API: POWER Monthly and Annual API v2.10.0; response time standard LST.
- Retrieval: 2026-11-15 UTC; individual original timestamps, request URLs and raw SHA-256 hashes are embedded in each location's `source` object.
- Compact snapshot SHA-256: `bc79b9e103e350c035a9716ecd8baf6343bc18ee49acddd87cd3e12ae0a44254`.

The original response headers and parameter descriptions are retained alongside the observations. Raw downloads and integrity receipts remain in ignored `.cache/power`; the compact snapshot and one small genuine parsing fixture are included for offline use.

## Live schema and documentation verification

The new published instance reported a current, enforced unrestricted network policy. A minimal Vancouver request for 2024 returned HTTP 200, following a successful proxy CONNECT. The monthly API documentation was also fetched successfully:

https://power.larc.nasa.gov/docs/services/api/temporal/monthly/

It documents monthly point JSON requests using `start`/`end` years and meteorological source coverage from 1981 onward. The actual responses confirmed the parameter names, units, fill sentinel −999, coordinates, source, API version and requested 19910101–20241231 coverage. The parser accepts January–December keys only: NASA's additional `YYYY13` annual summary is not an extra month and is deliberately excluded. Annual temperature is day-weighted; precipitation rates are multiplied by calendar days, including leap years. Tests cover this using an unmodified genuine response.

NASA POWER: https://power.larc.nasa.gov/
MERRA-2: https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/

## Reproducible acquisition and import

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-lock.txt
.venv/bin/python -m pip install --no-deps -e .
.venv/bin/python -m pipeline.generate --limit 1 --download-only
.venv/bin/python -m pipeline.generate --download-only
.venv/bin/python -m pipeline.generate --offline
npm run data:check
```

Default period is 1991–2024; default count is 10. Seventeen curated coordinates are available with `--limit 17`, but only the first 10 are in this verified snapshot. Use identical count/period arguments for download and offline import. Downloads are sequential, rate-limited and bounded in size/retries; access denials are not retried. TLS validation stays enabled. `--refresh` explicitly obtains new raw responses and changes retrieval timestamps. Cached/offline import retains receipt timestamps and produces identical bytes for the same archive.

Validation checks units, finite numeric values, missing-value sentinels, requested coordinates and complete dates. Raw SHA-256/URL/time receipts are verified before offline import. A checksum is integrity evidence, not independent authentication; acquire responses from NASA, not an untrusted archive provider. Export is atomic after every selected location passes. See [local acquisition/transfer](local-data-transfer.md).

## Interpretation and attribution

These are gridded reanalysis-derived estimates at requested points, not city weather stations. In particular, the Vancouver point's returned source elevation is **565.27 m**, and Langley's is 148.97 m; terrain/coastal grid representation helps explain why nearby points can differ strongly. Do not interpret either as Vancouver airport or a neighbourhood's observed climate. No interpolation to arbitrary coordinates is offered.

Credit NASA POWER, NASA Langley Research Center, and the MERRA-2 source identified in the responses. This independent application is not endorsed by NASA. Natural Earth supplies public-domain map geometry; see `public/data/NOTICE.md`. It is not environmental measurement data.

The user supplied the 2026 challenge “Be An Earth System Trend Detective!” URL. The challenge page returned HTTP 503 during this session, so its current official requirements remain unverified. This is distinct from the now-successful NASA POWER acquisition. See [network history and resolution](network-diagnosis.md) and the [real-data demo](demo.md).
