# Climate Doppelgänger

**Different worlds. The same story.** A NASA Space Apps Challenge 2026 project exploring geographically distant places with similar climates—or similar environmental changes despite different climates.

> **Development status:** The application and analysis pipeline are implemented. NASA acquisition is blocked by this Codex Cloud instance's network policy. No verified NASA climate dataset has been obtained or committed yet; the normal app explicitly reports unavailable data. This checkout is not submission-ready until acquisition, schema verification and a real-data demonstration are completed. Synthetic data exists only in labelled automated tests.

## The problem

Average climate does not tell the whole story of environmental change. Two distant places can have different temperatures and rainfall yet experience comparable trends. Climate Doppelgänger makes that distinction visible, with interpretable statistical evidence rather than arbitrary similarity percentages or unsupported AI claims.

The user-supplied challenge is [Be An Earth System Trend Detective!](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/). Its live 2026 requirements remain unverified while the challenge site is blocked. This is an independent project, not endorsed by NASA.

## Implemented features

- **Climate twins:** compare average temperature, annual rainfall and seasonal amplitude.
- **Change twins:** compare per-decade trends and detrended interannual variability.
- **Global explorer:** MapLibre map with local public-domain land geometry, supported-point selection, twin highlights and connections. Accessible location search/selection works without WebGL.
- **Transparent matching:** adjustable temperature/rainfall weights, geographic separation filters and feature contributions to standardized distance.
- **Comparison dashboard:** annual temperature and precipitation histories, OLS fits, 95% slope intervals, nominal p-values, sample sizes and completeness.
- **Anomalies and seasonality:** annual anomalies, calendar-month anomalies and seasonal cycles with interactive charts and accessible data tables.
- **Discovery and timeline:** deterministic distant-pair discovery, selected-year values and selected-period recomputation.
- **Methodology explorer:** formulas, uncertainty, data sources and limitations; comparison JSON export includes provenance and parameters.
- **Static deployment architecture:** no backend, accounts, database, paid AI or runtime NASA request.
- **Python ingestion:** bounded sequential downloads, retries, local caching, strict validation, atomic compact export and raw-source hashes.

These features have been exercised using clearly labelled test fixtures. Actual NASA-derived findings and a verified demonstration are **pending**. No specific climate discovery, award or completed submission is claimed. Real-data screenshots will be added when available.

## Scientific approach

The intended source is NASA POWER monthly T2M (°C) and PRECTOTCORR (mm/day), requesting 1991–2024 at 17 proposed sample points including Langley/Vancouver, BC. Parameter schema, units and coverage must be confirmed against live responses before release.

Monthly temperatures are day-weighted into annual means; rainfall rates are multiplied by calendar-month days and summed into annual mm. OLS estimates per-decade trends, Student-t slope intervals and two-sided nominal p-values. Each matching feature is standardized across the selected-period sample cohort. A weighted Euclidean distance gives an explainable ranking; lower is closer and zero means identical selected features. It is not a probability or percent match.

See [methodology](docs/methodology.md) and [data sources](docs/data-sources.md) for formulas, parameter expectations, source attribution and regeneration. Similarity is not correlation, significance, causation or prediction. Serial correlation and multiple testing can overstate nominal significance. Curated points do not represent global coordinate coverage.

## Technology

React, strict TypeScript, Vite, Tailwind CSS, MapLibre GL JS, Recharts and Lucide React. Python preprocessing uses NumPy, Pandas and SciPy. Vitest, React Testing Library, Playwright, Pytest, Ruff and Mypy provide checks. Dependencies are repository-scoped; npm has an integrity lockfile and Python has a version-pinned requirements file.

## Get started

Use the existing Node.js 24 environment (NVM on Bazzite/KDE). Do not install global packages or modify the host OS.

```bash
npm ci
npm run dev
```

Without `public/data/climate.json`, the app shows an explicit dataset-unavailable state. To prepare data, use a local Python environment and a network policy allowing `power.larc.nasa.gov`:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-lock.txt
.venv/bin/python -m pip install --no-deps -e .
.venv/bin/python -m pipeline.generate --limit 1 --download-only  # inspect first real response
.venv/bin/python -m pipeline.generate            # validate the default 10 points
```

No credentials are expected. Never substitute generated numbers when retrieval fails. See [development](docs/development.md) for cloud cache settings and [data sources](docs/data-sources.md) for the precise remaining acquisition steps.

## Checks

```bash
npm test
npm run test:coverage
npm run typecheck
npm run lint
npm run build
.venv/bin/python -m pytest
.venv/bin/python -m ruff check pipeline tests
.venv/bin/python -m mypy pipeline
.venv/bin/python -m pip check
```

Browser tests use explicit synthetic fixtures and no live NASA call:

```bash
npx --no-install playwright install chromium
npm run test:e2e
# Codex Cloud already has Chromium:
CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e
```

Tests verify calculations, validation failures, changing modes/weights/periods, search, map rendering, charts, discovery, timeline, modal keyboard behavior and responsive width. Passing fixture tests does not validate real NASA observations. GitHub Actions is configured for Node 24 and Python 3.11/3.13; a hosted Actions run has not been performed. See [verification evidence](docs/verification.md).

## Architecture and deployment

`src/core` owns science and matching; `src/data` validates external data; `src/components` renders maps/charts; `src/hooks` loads the dataset; `pipeline` creates static observations; `tests` holds deterministic and browser checks. See [architecture](docs/architecture.md).

Cloudflare Pages can build with `npm run build` and serve `dist`. No deployment has been performed or authorized. Production headers are supplied in `public/_headers`. Commit the validated compact dataset before publishing a demonstration. Raw API caches and build outputs stay ignored.

## Security and limitations

No secrets belong in browser bundles. Inputs are validated, data is never evaluated as code, React renders text, and the basemap has no third-party tile requirement. See [security policy](SECURITY.md) for private reporting, dependency review and supply-chain boundaries.

This is exploratory analysis, not forecasting, attribution or policy advice. POWER grid cells may not represent local terrain/coasts; annual aggregation hides extremes. Only temperature and precipitation are implemented. Autocorrelation-aware inference, extra NASA variables and broader sampling are future work. The 17 proposed sample points become supported observations only after successful validation.

## Contributing and licensing

See [CONTRIBUTING.md](CONTRIBUTING.md), [AGENTS.md](AGENTS.md), the [Code of Conduct](CODE_OF_CONDUCT.md) and the [demo guide](docs/demo.md).

The application retains the [MIT License](LICENSE), Copyright (c) 2026 Will Xu. Selected official Everything Claude Code skills are vendored under `.agents/skills` with ECC's MIT notice and a revision/hash manifest in [.agents/ecc](.agents/ecc/README.md). Use them only when relevant; no hooks, MCPs or global ECC installation are configured. Natural Earth geometry is public domain. Credit NASA POWER, NASA Langley Research Center for any successfully acquired environmental data; preserve parameter-specific citations in response metadata. No NASA endorsement is implied.

See [the network diagnosis](docs/network-diagnosis.md) and [portable local acquisition/offline import](docs/local-data-transfer.md). The domains are already configured in the draft; the observed runtime revision differs. No duplicate allowlist entry is needed.
