# Verification evidence

**Historical record:** The former NASA acquisition blocker is resolved in the new published instance. Authentic data is included and the data gate passes; see [current acquisition and verification](authentic-data-verification.md). The text below records the earlier instance, not current readiness.

This document records the initial implementation baseline. For the newer continuation audit and current counts, see [audit follow-up](audit-followup.md).

## Outcome

ECC repository integration and the application implementation are prepared on local branch `feat/climate-explorer`. All changes are staged for review, not committed, pushed, merged or deployed. The project is **not submission-ready**: the required real NASA dataset and real-data demonstration are blocked by cloud egress policy. No synthetic fixture is installed as production observations.

## Executed checks

| Check                                              | Actual result                                                                                                                                              |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci --cache /workspace/.npm-cache`             | PASS, clean lockfile installation, including patched minimatch override                                                                                    |
| `npm test`                                         | PASS, 23 tests across science, validation and UI                                                                                                           |
| `npm run test:coverage`                            | PASS, 94.41% statements, 90.75% branches, 100% functions, 97.95% lines for configured core/validation scope; not whole-app or scientific-validity coverage |
| `npm run typecheck`                                | PASS, strict TypeScript                                                                                                                                    |
| `npm run lint`                                     | PASS, no errors or warnings after removing an obsolete suppression                                                                                         |
| `npm run build`                                    | PASS; MapLibre's lazy chunk remains about 1.06 MB minified plus its worker; Vite reports a chunk-size advisory                                             |
| `CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e` | PASS, 2 browser tests with explicit synthetic fixture or missing-data response                                                                             |
| axe browser accessibility audit                    | PASS, zero detected violations in the tested mobile explorer state; not a full manual screen-reader certification                                          |
| Pytest on Python 3.11.18                           | PASS, 8 tests                                                                                                                                              |
| Pytest on Python 3.12.14                           | PASS, 8 tests                                                                                                                                              |
| Pytest on Python 3.13.5                            | PASS, 8 tests                                                                                                                                              |
| Ruff on Python 3.11 / 3.12 / 3.13                  | PASS after correcting a long error-message line                                                                                                            |
| Mypy on Python 3.11 / 3.12 / 3.13                  | PASS, pipeline strict typing                                                                                                                               |
| `pip check` / `uv pip check`                       | PASS, installed dependencies consistent in all three test environments                                                                                     |
| `compileall`                                       | PASS for pipeline/tests                                                                                                                                    |
| Full `npm audit`                                   | PASS, zero known vulnerabilities after minimatch 11.0.8 override; dependency audit is not a security guarantee                                             |
| GitHub Actions YAML                                | PASS against SchemaStore GitHub workflow schema                                                                                                            |
| Hosted GitHub Actions run                          | NOT RUN; workflow has not been pushed or dispatched                                                                                                        |
| Saved install script                               | PASS when executed end to end in this cloud instance                                                                                                       |
| Development server                                 | PASS HTTP entry-point response; browser confirms missing-data behavior and fixture interactions                                                            |
| `git diff --cached --check`                        | PASS after trimming trailing generated-notice whitespace                                                                                                   |
| Root MIT notice / reference repositories           | Preserved; no license diff, no changes in either inspected reference checkout                                                                              |

Browser checks exercise map initialization/rendering and zoom/reset, modes, location selection, period changes, timeline, calculated discovery, annual/seasonal/monthly chart controls, accessible table, Escape dismissal and 390px responsive width. Desktop/mobile screenshots were visually inspected. Images under ignored `test-results` are **synthetic test fixture artifacts**, not NASA findings or submission screenshots. The shared desktop tools were not exposed; testing used the available local Chromium through Playwright. No live authenticated session was needed.

Independent SciPy regression fixtures check TypeScript slopes, two-sided Student-t probabilities and slope intervals to nine decimal places for noisy short/long series. Tests also cover leap-year rainfall totals, incomplete years, zero variance, geographic filtering, weights, source/schema/unit rejection, caching and bounded retry behavior. Initial RED evidence included missing ingestion-module failures and a matching failure caused by near-zero variance amplifying floating-point noise; the implementation and numerical scale floor corrected these before the final passing runs. Browser/a11y failures for map worker loading, collapsed canvas height, distance-label contrast and table focus were fixed and rechecked.

## ECC recognition

Official source: https://github.com/affaan-m/ECC at `d2ef2680594f9a17526a6e1a2e18b3d242c5d17b`. All 15 copied upstream files match the recorded SHA-256 hashes. Five skills were returned by Codex app-server `skills/list` as enabled, scope `repo`, with no errors. Local interface labels for the two skills lacking official labels and a CommonJS helper-package boundary are documented separately from upstream copies.

The CLI supports native plugin commands, but the active hosted home is read-only and its remote catalog request failed. Local skill discovery was verified using an isolated temporary CODEX_HOME; no native/legacy ECC layer, hooks, global settings or MCP server was installed. The active hosted session may need a new task to refresh its menu; direct file guidance is available now. ECC workflows are used only where relevant.

## Required unresolved acquisition

`curl` against POWER and the challenge site, and `.venv/bin/python -m pipeline.generate --limit 1`, failed with proxy tunnel HTTP 403. The download never reached NASA; no schema, product metadata, units, coverage or real observations were verified remotely. `public/data/climate.json` is absent. The application intentionally reports this instead of presenting invented data. Consequently a real-data discovery, production dataset test, real-data screenshot and final challenge compliance cannot be claimed.

The saved cloud draft adds `power.larc.nasa.gov` and `www.spaceappschallenge.org`, preserving package-manager presets, and saves tested `install_script` plus `start_skill` instructions. Draft persistence was confirmed; runtime application/publication was not. Review and save the network settings, then publish the environment as directed by the platform. Once access propagates, inspect one actual response, generate/validate all 16 points, add a genuine small parsing fixture, run a real-data browser walkthrough, and update the acquisition/demo status. See [data sources](data-sources.md).

## Review and remaining limitations

Review the staged diff on `feat/climate-explorer`; use the repository PR template when the required data work is finished. No pull request or remote mutation was performed. `npm run dev` starts the frontend locally; in the current checkout it displays the honest data-unavailable state. For fixture-only visual review run the browser suite; do not promote its synthetic screenshots as scientific evidence.

Application limits include sparse point sampling, gridded rather than station observations, only temperature/precipitation, phase-independent seasonal matching, uncorrected autocorrelation/multiple testing, and descriptive rather than causal/predictive results. No deployment or release is authorized. Cloud network review and enabling private vulnerability reporting if unavailable are user-controlled actions; no credentials are requested.
