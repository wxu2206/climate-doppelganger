# Space Apps demonstration

## Readiness

The interactive application is implemented, but this checkout is **not a complete Space Apps demonstration yet**: cloud policy currently blocks NASA retrieval, so `public/data/climate.json` does not exist. Browser tests use explicit synthetic fixtures solely to verify interactions. Those fixtures are not production data, evidence of a discovery, or appropriate submission screenshots. Complete acquisition and confirm the current challenge requirements first.

## Two-minute walkthrough after verified acquisition

1. Introduce the problem: environmental changes occur across different baseline climates; local conditions alone can hide shared patterns.
2. Select Langley / Vancouver. Explain the limited sample network and NASA POWER gridded estimates.
3. Compare Climate twins with Change twins. Show why average climate and rates of change are different questions.
4. Change temperature/precipitation weights and the date range. Rankings and statistical evidence recompute.
5. Use Surprise me. Read the calculated pair, geographic separation and feature contributions. Record the actual result and dataset version here after verification; no specific real discovery is claimed yet.
6. Compare annual histories, anomalies and seasonal cycles. Show confidence intervals, nominal significance, sample size and completeness. Move the time machine to inspect a measured year.
7. Open the science dialog. Explain assumptions, autocorrelation, sampling limitations and why the analysis does not establish causation or predict future climate.
8. Export the JSON analysis to preserve weights, period, provenance, fingerprints and score contributions.

The complete demonstration must use committed validated NASA data and work without contacting NASA at runtime. No deployment is authorized by this task.

## Offline preparation on Bazzite

Follow [local data transfer](local-data-transfer.md), run `npm run data:check`, and then rehearse with networking disabled. The domains are already in the saved cloud draft; the observed runtime has not reconciled them. See [network diagnosis](network-diagnosis.md). Do not label a fixture-driven rehearsal as a NASA discovery.
