# Climate Doppelgänger

**Different Worlds. The Same Story.**

Climate Doppelgänger helps people investigate geographically distant locations using authentic NASA POWER/MERRA-2 temperature and precipitation estimates. The project distinguishes Climate Twins, which share selected average conditions and seasonal characteristics, from Change Twins, which share selected trends and interannual variability. This separation makes the analysis useful for education without confusing similar climates with similar environmental change.

The static web application includes ten validated points and 408 months per point, covering 1991–2024. Users explore a map, choose locations, adjust variable weights and historical periods, inspect histories, anomalies and seasonal cycles, and export the analysis with its provenance. Confidence intervals, nominal p-values, completeness and sample sizes accompany the results. No account, backend, paid AI service or runtime NASA request is required.

For example, Lisbon selects Cape Town as its closest Climate Twin at default settings, with standardized distance 0.188. Change Twins instead selects Reykjavík, with distance 0.461, despite a mean-temperature difference of about 12.2°C. These rankings compare selected features within a ten-point cohort; they are not percentage similarities or global nearest-neighbour claims. Lisbon's and Reykjavík's estimated temperature slopes have nominal p-values 0.137 and 0.324. Neither is nominally significant at 0.05; the match does not establish equal slopes, causation or a forecast.

Future work could add more validated locations and variables, richer seasonal comparisons and autocorrelation-aware inference. These are planned extensions, not implemented claims. The code is open source under MIT, with separate NASA/source and third-party credits. AI tools assisted implementation and documentation; scientific calculations are deterministic and no AI-generated observations or images are used.

Source: https://github.com/wxu2206/climate-doppelganger

No verified deployed website is claimed. The exact official 2026 challenge and submission requirements remain to be confirmed; see requirements.md.
