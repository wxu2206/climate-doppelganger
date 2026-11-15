# Continuation audit and submission gate

**Historical record:** The former NASA acquisition blocker is resolved in the new published instance. Authentic data is included and the data gate passes; see [current acquisition and verification](authentic-data-verification.md). The text below records the earlier instance, not current readiness.

Production audit: **40/100, blocked for scientific submission**, because authentic observations and a real-data walkthrough are missing. This is an engineering prioritization score, not a scientific measurement or formal security certification. The existing staged implementation and ECC installation were preserved. No remote repository, release, deployment or reference repository was modified.

## Acquisition outcome

Both requested domains are **already in the saved draft**. The current instance still reports observed revision 1 without those custom hosts. Valid documentation/API requests fail at HTTPS CONNECT with Envoy 403, before NASA TLS. Provider diagnostics contain no retained records. This supports a saved-policy/runtime mismatch; it does not establish the provider-side propagation cause, upstream DNS/TLS health or a NASA API error. See [network diagnosis](network-diagnosis.md). No duplicate allowlist request, credential request, direct-egress workaround or repeated denial loop was used. No compatible official alternate distribution was verified, and no non-equivalent product was substituted.

**There is still no real NASA dataset or verified climate discovery.** The live POWER schema and 2026 challenge text remain unverified. Fixture tests and screenshots are not scientific observations.

## Implemented fixes

- Reject nonfinite coordinates, booleans disguised as observations, unsupported numeric types and oversized cached responses; bound frontend metadata and reject invalid geography.
- Stop retrying proxy tunnel 403/407 access denials. Temporary network failures retain bounded retries.
- Add raw-data receipts with request URL, SHA-256 and original timezone-aware retrieval timestamp. Offline imports check receipts and responses, are byte-reproducible, and reject tampering without replacing a prior valid output. Downloads, receipts and frontend exports use atomic replacement. Receipt hashes establish integrity, not source authenticity.
- Add `--raw-dir`, `--offline`, `--download-only` and `--output`. Start with 10 diverse points, including Vancouver proper and Langley; expand deliberately to 17 via `--limit 17`. The local Bazzite procedure is documented and tested without requiring this cloud network.
- Remove an absolute standard-error threshold that incorrectly changed p-values when measurement units were rescaled. Seasonal fingerprints now exclude incomplete-year months, matching annual-series coverage.
- Cache sample-size Student-t critical values and reuse interval-specific fingerprints across UI matching/discovery; weights and date-range changes still recompute the appropriate results. A one-off fixture-only 17-source calculation measured 341.7 ms before reuse versus 37.3 ms including preparation afterward on this machine; these are diagnostic timings, not guaranteed benchmarks.
- Hide excluded comparisons, twin labels/connections and export when the separation filter yields no eligible location. Discovery text records its actual period and weights. Revoke downloaded JSON URLs after the browser has time to start downloading.
- Correct seasonal/monthly table headings. Keep the tour and test-data disclosure visible on mobile. Keep a science section available when the production dataset is unavailable, so navigation still works.
- Add `npm run data:check`, a submission gate that rejects absent or explicitly synthetic production data. CI runs it when a production dataset is present and explicitly reports missing data otherwise. Offline fixture checks do not depend on NASA availability.

## Executed validation

- TypeScript/Vitest: **28 passed**, no failures.
- Python/Pytest: **16 passed on each of Python 3.11, 3.12 and 3.13**, no failures.
- Type checking, ESLint, production build, Ruff, Mypy and installed-dependency consistency passed. Build retains the documented large lazy MapLibre chunk advisory.
- Chromium/Playwright: **8 passed**. Tested desktop (1440px), tablet (768px) and mobile (390px), actual rendered map-point selection, map zoom/reset, locations, both modes, relative weights, date bounds, annual/seasonal/monthly/anomaly views, timeline, discovery, table headings, JSON download contents, keyboard modal focus, tour, missing/malformed/loading data and empty match results.
- Axe reported **zero detected violations** in the tested desktop/tablet/mobile explorer states. This does not establish full WCAG compliance or manual screen-reader coverage.
- Full npm audit: **zero known vulnerabilities**; no new dependency was added in this continuation.
- GitHub Actions workflow validated against the GitHub workflow JSON schema. **Hosted Actions was not run**; no push/dispatch occurred.
- ECC official file hashes still match the pinned source. No reinstall, hooks or MCPs were added.
- `npm run data:check` currently **fails as intended** because `public/data/climate.json` is absent. This required scientific-readiness gate is distinct from passing application tests.

## Second review

A separate review pass after the first fixes checked pipeline failure atomicity, archive timestamps, consistent annual/seasonal sample selection, chart/control states, build configuration and submission claims. It found and fixed invalid frontend export arguments being rejected only after downloads; these now fail before network access, with a regression test. It also found and fixed hidden mobile demo controls and missing science navigation in the data-error state. Browser checks and relevant regressions were rerun after those corrections. The second pass was performed in this session; no independent reviewer or external audit is claimed.

The only remaining hard scientific blocker is authentic data acquisition and its downstream validation. Once the runtime policy is reconciled, or acquisition succeeds on Bazzite: inspect the real NASA schema and product metadata, generate/import the first 10 points, preserve a small genuine response fixture, run `npm run data:check` and a real-data browser walkthrough, then record an actual calculated discovery in the demo guide. Do not present the fixture rehearsal as a NASA result. Autocorrelation/multiple-testing limitations, sparse sampling and the large map dependency remain documented limitations.

## Review and local commands

```bash
npm ci
npm run dev
# On a machine with permitted NASA access:
.venv/bin/python -m pipeline.generate --limit 1 --download-only
.venv/bin/python -m pipeline.generate --download-only
.venv/bin/python -m pipeline.generate --offline
npm run data:check
```

See [local transfer](local-data-transfer.md) for environment setup and moving raw files plus receipts. Review the staged diff on `feat/climate-explorer`. No deployment, merge, release or force-push is authorized. Updated cloud startup instructions are saved as a draft; draft persistence does not reconcile the currently running policy or establish publication.
