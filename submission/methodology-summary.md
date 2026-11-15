# Methodology

## Data and aggregation

Input parameters are NASA POWER monthly T2M (°C, 2 m air temperature) and PRECTOTCORR (mm/day, corrected precipitation). The pipeline requires those units explicitly and stops if the response schema changes. POWER is gridded environmental estimation, not a station at a city center. Sample coordinates identify requested points; city names are orientation labels. No interpolation to arbitrary clicked coordinates is offered.

For each complete year, with monthly days d and monthly values T and P:

- Annual temperature = Σ(T × d) / Σd.
- Annual precipitation = Σ(P × d), in mm/year.
- Leap-year February is treated as 29 days.
- Incomplete years are omitted from analysis; at least 10 complete years are required. The current export policy is stricter and rejects any incomplete monthly response.
- Completeness = present valid monthly observations / expected months in the selected interval.

NASA monthly responses also contain `YYYY13` annual summaries. These are excluded; this application derives annual values from the twelve calendar months rather than counting a thirteenth month.

Annual anomalies subtract the selected-period annual mean. Monthly anomalies subtract the selected-period mean for the corresponding calendar month. Changing the analysis interval recomputes all means, seasonal characteristics, regressions, normalization scales, anomalies and matches. Moving the time-machine slider shows the actual chosen year's annual values; it does not change the trend-fitting interval.

## Trends and significance

Fit y = a + b × year by ordinary least squares. Report 10b in °C/decade for temperature and mm/decade for annual precipitation. n is the number of complete years; residual variance uses n−2 degrees of freedom. SE(b) = sqrt[Σresidual² / ((n−2)Σ(year−meanYear)²)]. The 95% slope interval is 10[b ± t(0.975,n−2)SE(b)]. Two-sided Student-t p tests b=0. TypeScript uses a continued-fraction regularized incomplete beta implementation; deterministic regression fixtures are independently computed with SciPy and compared to 9 decimal places.

A zero-residual, nonzero slope has p=0 numerically; a perfectly constant series is assigned p=1. Real observations generally do not have zero residuals. The plot's shaded ribbon visualizes only slope uncertainty about the midpoint; it is explicitly NOT a full fitted-mean or prediction interval. Numerical intervals above the chart are the primary confidence-interval display.

Inference assumes independent, approximately normally distributed residuals and a linear trend. Climate time series may have autocorrelation, changing variance and nonlinear responses. No effective-sample-size, autocorrelation, spatial-dependence or multiple-testing correction is applied. Therefore p<0.05 is labelled **nominal** evidence, not a definitive attribution finding. Regression is descriptive and does not predict future weather.

## Climate versus change fingerprints

Climate twins compare:

1. Mean annual temperature.
2. Monthly climatological temperature range (max−min).
3. Mean annual precipitation total.
4. Population standard deviation of monthly climatological precipitation rates.

Change twins compare:

1. Temperature slope per decade.
2. Population standard deviation of detrended annual temperature residuals.
3. Annual precipitation slope per decade.
4. Population standard deviation of detrended annual precipitation residuals.

The feature set is intentionally small and interpretable. Seasonal amplitude is phase-independent, so it can compare northern and southern hemispheres but cannot tell whether wet seasons occur in the same months. Monthly profiles are available in the seasonal chart. Anomalies are visualized as supporting evidence; they are not extra double-counted dimensions in the distance.

## Normalization, weights and distance

For each feature j calculate the population standard deviation s_j across ALL supported locations for the selected period, with a numerical floor of 10⁻⁶ in that feature's units to avoid amplifying floating-point noise in constant features. Geographic filtering happens after calculating these scales. z_j = (feature_A − feature_B)/s_j.

Temperature and precipitation weights are nonnegative, with at least one positive. Each group's two features share its normalized group weight equally. D = sqrt[Σ_j w_j z_j²]. The displayed feature contributions are w_j z_j² and sum to D². D=0 means identical selected features. Lower is closer. D is not a probability, confidence, correlation coefficient, global ranking, calibrated percentage or claim that the locations are interchangeable. Changing the cohort can change scores. Geographic separation uses a 6,371 km spherical-Earth haversine distance; default minimum 1,500 km.

Surprise me cycles deterministic, distant (at least 5,000 km or the selected larger threshold) best-change-match pairs, ranked by the same calculated distance. It never invents a discovery. Pairs can repeat in reverse direction. The display explains distance, selected weights and uncertainty; investigation of causes remains outside this tool.

## Limits and future work

Only temperature and precipitation at curated points are implemented. Gridded coastal and mountain estimates may poorly represent local conditions. Annual aggregation hides extremes. No vegetation, land cover, ocean or causal attribution analysis is implemented. Future work may add autocorrelation-aware inference, richer seasonal distance, additional NASA parameters and more points after data review. Similarity, correlation, causation, significance and prediction answer different questions and are never interchangeable.
