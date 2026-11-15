# NASA Space Apps submission copy

These drafts describe verified behavior in the included snapshot. The official 2026 challenge and resources pages returned HTTP 503 during the final review, so field names, character limits, video duration and submission-specific requirements are not confirmed. Adapt these drafts to the live form before submission; do not treat the suggested two-minute script as an official time limit.

## Project name

Climate Doppelgänger

## Concise project description

Climate Doppelgänger reveals unexpected connections between distant places using authentic NASA POWER/MERRA-2 gridded temperature and precipitation estimates. Its Climate Twins mode compares average conditions and seasonal characteristics, while Change Twins compares trends and year-to-year variability. Users explore ten locations from 1991–2024, adjust weights and periods, compare histories and anomalies, and inspect confidence intervals and nominal significance. A reproducible example connects Lisbon with Cape Town for similar baseline climate features, but with Reykjavík for selected change features. The application works from an included static dataset without accounts, a backend or paid services, and explains why similarity does not establish statistical significance or causation.

## Scientific methodology summary

We use NASA POWER monthly T2M (°C) and PRECTOTCORR (mm/day), sourced from MERRA-2, at ten curated coordinates for 1991–2024. The pipeline validates units, coordinates, finite values, missing-value sentinels and complete monthly coverage, retaining request URLs, timestamps, raw-response hashes and source metadata. Annual temperature is weighted by calendar days; annual precipitation multiplies monthly daily rates by month lengths. NASA's `YYYY13` annual summaries are excluded from monthly aggregation.

Ordinary least squares estimates per-decade trends with Student-t 95% slope intervals and two-sided nominal p-values. Climate Twins uses mean temperature, annual precipitation and two seasonal characteristics. Change Twins uses temperature/precipitation slopes and detrended annual variability. Feature differences are standardized across the selected-period sample cohort and combined with normalized user weights into an explainable Euclidean distance. Lower means closer, not a probability or percentage. Anomalies use each location's selected-period baseline.

Inference assumes independent residuals; serial correlation and multiple comparisons are not corrected. Similarity is not a test of equal slopes, a causal explanation or a prediction. Coastal/terrain grid representation and the small sample network limit interpretation.

## Suggested demonstration script, approximately two minutes

**0:00–0:20: the idea**

“Two places can have similar climates but change differently. They can also have different climates while sharing selected patterns of change. Climate Doppelgänger separates these questions using NASA data.”

**0:20–0:40: the evidence**

“Here are ten supported locations, including Vancouver and Langley, with 34 years of NASA POWER temperature and precipitation estimates. These are gridded reanalysis data, not individual city weather stations. Every location retains its source and retrieval information.”

**0:40–1:05: Climate Twins**

“Select Lisbon, 1991–2024, temperature weight 70, precipitation weight 30 and minimum separation 1,500 kilometres. Climate Twins selects Cape Town, about 8,562 kilometres away. Its standardized distance is 0.188, not an 18.8 percent match.”

**1:05–1:30: Change Twins**

“Switch to Change Twins. Reykjavík becomes the closest sampled match, despite a mean-temperature difference of about 12.2 degrees Celsius. This score compares both trend estimates and year-to-year variability. It does not show that the trends are statistically equal or have the same cause.”

**1:30–1:50: uncertainty**

“Lisbon's estimated temperature trend is about +0.098 degrees Celsius per decade; Reykjavík's is +0.077. Both 95 percent intervals include zero. Neither provides nominal evidence of a nonzero trend at the five percent threshold. Similar estimates do not make either trend significant.”

**1:50–2:00: explore and reproduce**

“Explore the histories, anomalies and seasonal cycles, change the weights or period, and export the analysis. The included real dataset makes this demonstration reproducible without contacting NASA at runtime.”

## Data and software credit text

Environmental estimates: NASA Prediction Of Worldwide Energy Resources (POWER), NASA Langley Research Center; meteorological source MERRA-2. Dataset `power-1991-2024-v1`, retrieved 2026-11-15 UTC. Parameter descriptions, original request URLs, retrieval timestamps and raw SHA-256 hashes are retained in the dataset. See [data sources](../docs/data-sources.md) for exact citations and [methodology](methodology-summary.md) for analysis assumptions.

Code: MIT License, Copyright (c) 2026 Will Xu. Selected ECC guidance retains its separate MIT notice. Runtime library licenses are reproduced in `public/THIRD_PARTY_NOTICES.txt`. Natural Earth supplies public-domain land geometry. Contributor Covenant 3.0 retains CC BY-SA 4.0 attribution. The application's MIT license does not relabel NASA data or third-party material as the author's own work.

Development disclosure: AI tools assisted implementation and documentation. Scientific calculations are deterministic and tested against independent NumPy/SciPy results. No AI-generated observations are used. The project is independent and is not endorsed by NASA.

## Complete in the live portal

Confirm the official challenge title/year and rubric; team members and contributor permissions; final repository/PR or release link; any required demonstration/video URL and duration; source-credit fields; license selections; AI-assistance declarations; and the current submission deadline/timezone. None of these portal-specific requirements, team details or submission actions is asserted to be complete here. A deployed site is not claimed, and deployment remains a separate authorized action.

## Full project description

See project-description.md for the complete ready-to-copy description. The application includes ten validated NASA points, both comparison modes, interactive histories, anomalies, seasonal views, uncertainty displays and reproducible exports. These are implemented; wider coverage and additional environmental variables remain future work.

## Problem statement

Average climate conditions alone do not explain how an environment is changing. Geographic distance and different temperature baselines can hide useful similarities in selected change features. At the same time, visually similar trends can be statistically uncertain. Users need an accessible way to compare both conditions and change without treating similarity as causation.

## Proposed solution and originality

The project makes a deliberate distinction between Climate Twins and Change Twins within one transparent comparison workflow. It combines a geographic explorer, adjustable feature weights, explicit statistical evidence and preserved NASA provenance. Its original contribution is the interaction and interpretation of these two questions, not a claim to have invented regression or climate analog analysis.

## How the application works

A Python pipeline downloads and validates monthly point responses, preserves provenance, and exports compact JSON. The browser aggregates by calendar days, fits annual regressions, derives climate/change features, standardizes across the selected ten-point cohort, and ranks geographically eligible points by weighted feature distance. The interface renders maps, charts and tables; users can change the interval/weights and download an analysis report. See methodology-summary.md for formulas and assumptions.

## NASA datasets used

NASA POWER monthly T2M and PRECTOTCORR, meteorological source MERRA-2, API v2.10.0. Coverage: 1991–2024, 408 months per location, ten curated points including Vancouver and Langley. Snapshot SHA-256 and full acknowledgments appear in credits.md and the dataset itself. Temperature is °C; precipitation is a mean daily rate in mm/day before annual aggregation.

## Technologies used

React, strict TypeScript, Vite, Tailwind CSS, MapLibre GL JS, Recharts and Lucide React; Python, NumPy, Pandas and SciPy for preprocessing and independent reference calculations. Vitest, React Testing Library, Pytest, Ruff, Mypy, Playwright and axe support validation. Hosting output is a static Cloudflare Pages-compatible site, not an account-dependent service.

## Verified discoveries

At 1991–2024, temperature/precipitation weights 70/30 and minimum separation 1,500 km, Lisbon's Climate Twin is Cape Town (distance 0.187706; 8,562 km away), whereas its Change Twin is Reykjavík (0.460964; 2,951 km). Lisbon and Reykjavík differ by 12.2239°C in mean temperature. Their temperature slope estimates are +0.0981 and +0.0769°C/decade, with nominal p-values 0.137 and 0.324. Neither is significant at 0.05. Variability contributes substantially to the change distance, which is not a test of equal slopes or shared causation.

## Real-world applications

Students and educators can explore environmental patterns and learn how uncertainty affects interpretation. Researchers could use the interface as an exploratory starting point for more rigorous comparison, not as a substitute for attribution analysis, forecasting or site-specific decisions. No measured educational, policy or research impact is claimed.

## Limitations

Only ten curated points and two variable groups are included. Gridded reanalysis estimates may poorly represent local terrain/coasts; Vancouver's returned source elevation is 565.27 m. Annual aggregation hides extremes. Seasonal amplitude does not compare phase across hemispheres. OLS assumptions, autocorrelation and multiple comparisons limit nominal significance. Distances depend on the cohort, interval, features and weights. No causal or predictive inference is established.

## Future development

Add independently validated locations/variables, autocorrelation-aware inference, phase-aware seasonal analysis and further accessibility/browser coverage. These are proposed improvements, not available features.

## Team contributions

[OWNER INPUT REQUIRED: actual team member names, roles, contributions, permissions and any required declarations.] Do not infer a participant's role from the repository owner or copyright notice.

## Open-source licensing and attribution

Application code uses MIT, Copyright (c) 2026 Will Xu. Third-party dependencies, ECC guidance, Contributor Covenant and Natural Earth retain their respective notices; NASA data is acknowledged separately and not relabelled as original application code. See credits.md and public/THIRD_PARTY_NOTICES.txt.

## AI-assisted development disclosure

AI coding tools assisted application implementation, tests and documentation. Deterministic calculations were checked against independent NumPy/SciPy results and authentic observations. No AI-generated images, footage, satellite data or scientific measurements are included. Existing licensed vector library icons appear only as part of the real interface. The owner should adapt this factual disclosure to the portal's verified question.

## Source code link

https://github.com/wxu2206/climate-doppelganger (public repository, verified by GitHub API).

## Live demonstration link

No verified live deployment URL is available. Supply one only after an authorized deployment and HTTPS/browser verification; see deployment.md.

## Video or presentation link

The actual artifacts are presentation/climate-doppelganger.pptx, presentation/climate-doppelganger.pdf and video/climate-doppelganger.mp4 in this package. Repository links become public when this branch is pushed; the final checklist records the PR. No external video-hosting URL has been published. [OWNER ACTION: upload the approved media or use verified repository artifact links according to the live portal's rules.]

### Verified repository artifact URLs

- Presentation: https://github.com/wxu2206/climate-doppelganger/blob/2193922/submission/presentation/climate-doppelganger.pptx
- PDF: https://github.com/wxu2206/climate-doppelganger/blob/2193922/submission/presentation/climate-doppelganger.pdf
- Actual recording: https://github.com/wxu2206/climate-doppelganger/blob/2193922/submission/video/climate-doppelganger.mp4

These reference the published package commit, not a deployed application or external video host. Confirm that the portal accepts repository downloads before using them as submission links.
