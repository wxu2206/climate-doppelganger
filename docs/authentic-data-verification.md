# Authentic data acquisition and final verification

## Outcome

The primary submission data gate is **PASS**. `public/data/climate.json` now includes authentic NASA POWER/MERRA-2 observations for 10 locations over 1991–2024. Both Climate Twins and Change Twins were verified against the actual snapshot. The application implementation, ECC skills, dependency declarations and existing test coverage were preserved; this pass adds data, real-data regressions, provenance and documentation.

Final official challenge compliance remains **unverified**, because the supplied 2026 Space Apps challenge page returned HTTP 503. No application deployment, submission, merge, force-push or remote publication was performed. Hosted GitHub Actions results were not inspected and are not claimed to pass.

## Published-instance network evidence

The new instance reports its observations as current, with matching desired/observed instance revision 1 and **enforced unrestricted** networking. Its published source version is `cecfgver_6af921597fc48192ac449e7a6d8e845b`, distinct from the old restricted instance. Instance-local revision numbers must not be compared as globally increasing policy versions.

A minimal legitimate request for Vancouver, 2024, T2M/PRECTOTCORR, community AG, JSON returned successful proxy CONNECT and **upstream HTTP/2 200**, `content-type: application/json`, `x-app-version: v2.10.0`, `x-data-sources: merra2`. No proxy bypass, credential substitution or TLS-verification exception was used. The successful verified HTTPS response supersedes the prior pre-TLS Envoy 403 failure.

The official monthly API documentation returned successfully and documented the point endpoint, parameter list and yearly start/end format. The response itself confirmed Celsius, mm/day, fill value −999, LST, MERRA-2 and monthly/annual API v2.10.0. The separate challenge-page request returned HTTP 503, rather than establishing current challenge text.

## Dataset and provenance checks

- 10 requested points, 408 complete months each, **8,160 finite temperature/precipitation values**.
- Vancouver proper and Langley/Vancouver included; all records report coverage 19910101–20241231.
- All ten original raw-byte SHA-256 values match their embedded source hashes.
- URL, retrieval timestamp, API/source headers and parameter metadata accompany each point.
- Raw downloads and receipts stay ignored; compact data is 162,062 bytes, with hash `bc79b9e103e350c035a9716ecd8baf6343bc18ee49acddd87cd3e12ae0a44254`.
- Repeating `pipeline.generate --offline` produces **byte-identical** output.
- `npm run data:check` passes against the actual snapshot.
- One small unmodified genuine Vancouver response and a separate provenance notice are retained in `tests/fixtures`.
- NASA's `YYYY13` annual summary is excluded from monthly observations; aggregation uses actual calendar days. Vancouver's genuine 2024 response yields 2,242.28 mm annual precipitation.

These are gridded reanalysis estimates, not local station measurements. Vancouver's source elevation is 565.27 m, so terrain/coastal representation is an essential caveat. No missing monthly value was imputed and no synthetic observation entered production data.

## Scientific verification and discovery

All ten locations' annual values, temperature/precipitation slopes, Student-t confidence intervals and p-values match separately computed NumPy/SciPy reference results. The reference fixture records this exact dataset hash; dataset refreshes require an explicit review of values, provenance and the independent reference snapshot.

A reproducible example uses Lisbon, 1991–2024, temperature weight 70, precipitation weight 30 and minimum separation 1,500 km:

- Climate Twins selects **Cape Town**, distance **0.187706**, separation **8,562 km**.
- Change Twins selects **Reykjavík**, distance **0.460964**, separation **2,951 km**.
- Lisbon and Reykjavík differ in mean temperature by **12.224°C** while having relatively similar estimated temperature slopes in the selected change fingerprint.
- Their temperature p-values are **0.137** and **0.324**, so neither slope supplies nominal evidence against zero at p<0.05. This discovery concerns the distinction between matching baseline conditions and matching change features, not proof of warming, causation or a future prediction.

The [demo guide](demo.md) supplies exact controls, confidence intervals, a supporting London/Santiago example, and a two-minute presentation.

## Executed checks

| Check                                   | Result                                                                                                   |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `npm run data:check`                    | PASS, authentic 10-point snapshot                                                                        |
| `npm test`                              | PASS, **39 tests** in 4 files                                                                            |
| `npm run test:coverage`                 | PASS, 94.5% statements, 92.3% branches, 100% functions, 97.61% lines in configured core/validation scope |
| `npm run typecheck`                     | PASS                                                                                                     |
| `npm run lint`                          | PASS                                                                                                     |
| `npm run build`                         | PASS, with the existing lazy MapLibre chunk-size advisory                                                |
| Python/Pytest                           | PASS, **18 tests each** on Python 3.11, 3.12 and 3.13                                                    |
| Ruff / Mypy                             | PASS                                                                                                     |
| Python installed dependency consistency | PASS                                                                                                     |
| Chromium/Playwright                     | PASS, **11 browser tests**, including 3 unmocked authentic-data viewport cases                           |
| Axe accessibility                       | Zero detected violations in actual-data mobile/tablet/desktop test states                                |
| Full npm audit                          | Zero known vulnerabilities                                                                               |
| Offline regeneration / raw hashes       | PASS                                                                                                     |

Authentic-data browser checks exercise both ranking modes, changing periods, annual/anomaly/seasonal/monthly chart views, exact row counts, downloaded analysis contents and browser error monitoring at 390, 768 and 1440 pixels. They confirm zero external runtime requests. The existing labelled synthetic suite remains in place for error, missing-data and deterministic interaction regressions.

The optimized production bundle was also served locally and checked separately. Applying the exact Cloudflare Pages CSP from `public/_headers` to the document response produced **no page, console or CSP errors**; the local map worker and charts worked. Desktop/mobile axe scans had zero detected violations. This is a local production-bundle/header smoke test, not a deployed Cloudflare acceptance test or a full WCAG certification.

[Desktop screenshot](images/authentic-desktop.png) shows the authentic Lisbon/Cape Town climate comparison; [mobile screenshot](images/authentic-mobile.png) shows Lisbon/Reykjavík change comparison. Both were visually inspected.

## Review and next steps

Review the prepared branch changes, then run:

```bash
npm ci
npm run data:check
npm run dev
```

The included snapshot supports a complete offline demonstration. To refresh it, follow [data sources](data-sources.md) and [local acquisition/transfer](local-data-transfer.md), preserving raw receipts and reviewing changed scientific references. Before an official submission, confirm the challenge's current requirements and perform the human submission review. Deployment and remote publication remain separate authorized actions.
