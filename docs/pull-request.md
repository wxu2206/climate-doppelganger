## What changed

Completes the authentic NASA POWER integration for Climate Doppelgänger while preserving the existing explorer, scientific engine and ECC skills. Includes ten locations with complete 1991–2024 monthly temperature and precipitation data, source metadata/hashes, genuine response fixtures, independent NumPy/SciPy reference checks, and real-data browser tests.

Documents a reproducible Lisbon example: Climate Twins selects Cape Town, while Change Twins selects Reykjavík. Adds real-data screenshots, submission-form drafts and a final readiness checklist. Corrects one omitted runtime MIT notice for murmurhash-js.

## Why

The previous implementation could only demonstrate interactions with labelled fixtures because its cloud policy blocked NASA. The published instance now reaches POWER successfully, allowing the submission data gate and the actual scientific demonstration to be verified.

## Verification

- `npm run data:check`: authentic 10-point snapshot passes.
- `npm test`: 39 passed.
- `npm run typecheck`, `npm run lint`, `npm run build`: pass; existing large MapLibre chunk advisory remains.
- Python: 18 tests each on 3.11, 3.12 and 3.13; Ruff, Mypy and dependency checks pass.
- Chromium: 11 browser tests pass, including authentic-data desktop/tablet/mobile checks and axe scans with zero detected violations in tested states.
- Full npm audit: zero known vulnerabilities.
- Hosted CI: consult this PR's checks for its exact head SHA; older commit results do not establish this revision passed.
- UI screenshots: `docs/images/authentic-desktop.png` and `docs/images/authentic-mobile.png`, both using authentic observations.

## Scientific and data review

- Data: NASA POWER/MERRA-2 T2M (°C) and PRECTOTCORR (mm/day), ten points × 408 months. Original API metadata, timestamps and raw hashes are retained. Raw caches are excluded from the commit.
- Snapshot SHA-256: `bc79b9e103e350c035a9716ecd8baf6343bc18ee49acddd87cd3e12ae0a44254`.
- No scientific algorithm changes or synthetic production observations were introduced by this integration.
- Lisbon/Reykjavík's positive temperature-slope estimates are individually not nominally significant. The four-feature change distance is not a test of equal slopes or common causation. Serial correlation/multiple testing remain uncorrected and documented.
- Exact official 2026 challenge and submission-rule compliance remains unverified because the official challenge/resources pages return HTTP 503. This PR does not claim a completed Space Apps submission.

## Review checklist

- [x] Changes are focused; existing work/data/licenses are preserved.
- [x] Scientific claims match the independently checked observations and limitations.
- [x] No fabricated observations, credentials or raw caches are included.
- [x] Dependency attribution and security implications were reviewed.
- [x] Relevant local automated checks passed.
- [x] Documentation, demo and attribution are updated.
- [ ] Confirm current-revision hosted Actions checks.
- [ ] Confirm official 2026 rules and human submission review.

No merge, force-push, release, deployment or official submission is requested by this draft PR.
