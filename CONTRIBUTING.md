# Contributing to Climate Doppelgänger

Bug reports, feature ideas, documentation and code contributions are welcome. Follow the [Code of Conduct](CODE_OF_CONDUCT.md). Search existing issues first. Use the structured bug or feature form; include dataset version, selected locations, period, mode and reproducible steps. Keep private data and secrets out of attachments. Follow [SECURITY.md](SECURITY.md) for private vulnerability reporting.

## Your first contribution

1. Fork the repository and create a focused branch from main.
2. Use Node.js 24 through your existing NVM installation. Run `npm ci` then `npm run dev`.
3. For data work create a local environment: `python3 -m venv .venv`, then `.venv/bin/python -m pip install -e '.[dev]'`.
4. Keep calculations in `src/core`, validation in `src/data`, preprocessing in `pipeline` and rendering in React components.
5. Add deterministic tests for behavior changes; demonstrate a failing test before the fix where practical.
6. Run the checks below and open a focused pull request describing what changed and why. Beginners are welcome to ask for help.

## Required checks

```bash
npm test
npm run typecheck
npm run lint
npm run build
.venv/bin/python -m pytest
.venv/bin/python -m ruff check pipeline tests
.venv/bin/python -m mypy pipeline
.venv/bin/python -m pip check
```

Run browser checks for interaction or layout changes (`npm run test:e2e` after installing the Playwright Chromium browser or setting `CHROMIUM_PATH` to an existing browser). See [development](docs/development.md). CI uses committed data and deterministic fixtures, never live NASA availability. Document checks you could not run.

## Scientific and documentation expectations

Keep mathematical tests with known answers, stable sorting and explicit units. Preserve monthly observations and source URLs, retrieval dates and hashes. No synthetic observations may enter a production dataset. Explain normalization, uncertainty, missing-data decisions and baseline changes. Use small, explicitly labelled synthetic fixtures only for tests. Record data regeneration commands and review dataset diffs separately from code. Attribute NASA POWER and any additional source. Update methodology/architecture documentation for meaningful changes; include real screenshots for UI changes when available, clearly labelling test-fixture screenshots.

Do not commit caches, raw downloads, build output, credentials or large unnecessary artifacts. Never force-push or change unrelated repositories. A PR should explain tests, security, scientific effects, provenance changes and limitations. Contributions use the repository's [MIT License](LICENSE); third-party notices retain their original terms.
