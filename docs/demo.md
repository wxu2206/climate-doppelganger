# NASA Space Apps demonstration

The demonstration now operates on the included authentic NASA POWER snapshot, without runtime NASA requests. Start with `npm ci`, `npm run data:check`, then `npm run dev`. The scientific data gate passes. Official 2026 challenge-page requirements still need confirmation because that page returned HTTP 503; no submission, award or NASA endorsement is claimed.

## Two-minute walkthrough

1. **The problem:** places with similar climates may be changing differently, while different climates may share patterns of change.
2. **Start near home:** select Vancouver, then Langley/Vancouver. Explain that the 10 supported points use NASA POWER/MERRA-2 gridded estimates. Vancouver's returned source elevation is 565.27 m, so this is not an airport or neighbourhood weather-station series.
3. **Show the distinction:** select Lisbon, period **1991–2024**, temperature weight **70**, precipitation weight **30**, minimum separation **1,500 km**. Choose **Climate twins**. The top match is **Cape Town**, 8,562 km away, standardized distance **0.187706**.
4. Switch to **Change twins** with those same controls. The top match becomes **Reykjavík**, 2,951 km away, distance **0.460964**. Lisbon and Reykjavík differ in mean temperature by **12.224°C**, yet their estimated temperature trends are relatively similar under the selected change fingerprint. This demonstrates the concept without asserting a shared cause.
5. **Read the uncertainty:** Lisbon's temperature slope is **+0.0981°C/decade**, 95% CI **[−0.0329, +0.2291]**, nominal p **0.137**. Reykjavík's is **+0.0769°C/decade**, CI **[−0.0794, +0.2331]**, p **0.324**. Neither provides nominal evidence of a nonzero temperature trend at p<0.05. Similar estimates do not establish warming in both places.
6. Explore annual histories, anomalies, seasonal cycles and the accessible data table. Move the historical-year slider; distinguish its displayed year from the period used to fit trends. Change the period or weights and observe rankings recompute.
7. Export the analysis. The JSON records period, weights, source provenance, fingerprints and feature contributions. Open the methodology dialog and explain serial correlation, multiple comparisons and sparse sampling.

## Supporting example: similar warming estimates, different rainfall trends

With the same full period and default weights, London selects Santiago as its top Change Twin among the sampled distant candidates (distance **0.621198**, 11,673 km). Their temperature slopes are **+0.3426** and **+0.3559°C/decade**, with nominal p-values **0.000525** and **0.000156**. However, precipitation slopes differ: London **+8.579 mm/decade**, CI **[−27.731, +44.889]**, versus Santiago **−94.298 mm/decade**, CI **[−139.127, −49.469]**. Use this to explain why a weighted multivariable match does not mean every variable agrees.

## Reproduction and evidence

- Dataset version: `power-1991-2024-v1`; exact snapshot hash and provenance are in [data sources](data-sources.md).
- Regression tests reproduce the Lisbon rankings and compare annual values, slopes, intervals and p-values for all 10 points against independent NumPy/SciPy reference calculations.
- Browser tests exercise the actual included data, both modes, changing periods, all chart views, JSON export and accessibility at mobile/tablet/desktop sizes. The fixture-based suite remains separate and explicitly labelled.
- `npm run data:check` validates the production snapshot and rejects explicitly labelled synthetic data.

Distances depend on this 10-point cohort and the selected features/weights. They are not percentages, probabilities, forecasts or worldwide nearest-neighbour claims. P-values assume independent residuals; no autocorrelation or multiple-testing correction is applied. Annual means hide extremes. The application describes environmental patterns and does not establish causation.
