# Acquire on Bazzite, validate and import offline

Use the existing NVM Node 24 and a Python 3.11+ virtual environment. No system packages, sudo, global installs or API credentials are needed. Run everything from this repository.

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-lock.txt
.venv/bin/python -m pip install --no-deps -e .
# Low-volume schema probe: one point; no frontend dataset is overwritten.
.venv/bin/python -m pipeline.generate --limit 1 --download-only
```

Inspect the raw response and receipt in `.cache/power`. Check header title/source citations/fill value, geometry, T2M units (C) and PRECTOTCORR units (mm/day), and all requested dates. The schema has now been verified against NASA POWER API v2.10.0; see data-sources.md, so investigate any validation failure against NASA documentation instead of weakening checks blindly.

Then acquire ten geographically diverse points, including Vancouver proper and Langley:

```bash
.venv/bin/python -m pipeline.generate --download-only
# No network calls; generate the static dataset from the validated archive.
.venv/bin/python -m pipeline.generate --offline
npm ci
npm run data:check
npm run dev
```

Default period: 1991–2024. Default sample count: 10. All 17 curated points can be acquired with `--limit 17`; use the same `--limit`, `--start` and `--end` when importing. Frontend export needs at least two points and ten years. Use `--download-only` for smaller probes. Data acquisition is sequential and rate-limited; `--refresh` explicitly obtains new responses, and cannot be combined with `--offline`.

Each `<id>-<start>-<end>.json` raw file has a corresponding `.receipt.json` recording the exact constructed NASA URL, raw-byte SHA-256 and timezone-aware retrieval timestamp. Offline import verifies URL, hash, timestamp, coordinates, finite JSON numbers, expected units, missing-value sentinels and complete dates. Moving files preserves receipt timestamps; filesystem modification time is not used as provenance. Hashes detect accidental modification, **not** source authenticity: obtain files directly from NASA over verified HTTPS, never from an unknown archive provider. Receipts cannot prove an arbitrary file came from NASA.

To move data between your computers, transfer the raw files and their receipt files together using your existing trusted file-transfer method. Keep them in an ignored directory, then:

```bash
.venv/bin/python -m pipeline.generate --offline --raw-dir /path/to/transferred/power
```

`--output /path/to/climate.json` supports isolated validation before replacing the frontend file. Export is atomic after all selected locations pass; corruption must not replace the previous dataset. Raw downloads and receipts remain uncommitted in `.cache`; commit only the compact validated `public/data/climate.json` after review. Do not commit test fixtures as NASA observations.

The offline workflow is integration-tested using explicitly synthetic temporary test archives, including repeated-byte reproducibility and tampering rejection. Authentic acquisition has also succeeded in the new published instance. For a refreshed archive, run all quality checks, verify the UI with authentic observations, preserve a small genuine NASA parsing fixture, record a calculated discovery and update the submission status. `npm run data:check` intentionally fails while the production dataset is absent or labelled synthetic.
