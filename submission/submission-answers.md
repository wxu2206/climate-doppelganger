# Project page answers

English copy organized under the eight fields in the owner-supplied Project Submission Guide. The guide was provided in conversation, not independently retrieved from the unavailable live pages. No character limits were supplied; apply any limits shown by the actual portal without removing scientific caveats.

Team identification for the selected seven-slide demo: **Team Name Team — William Xu**. Selected challenge: **Be An Earth System Trend Detective!**

## Project Name

Climate Doppelgänger

## High-Level Project Summary

Climate Doppelgänger reveals connections between distant places using authentic NASA POWER/MERRA-2 temperature and precipitation estimates. Climate Twins compares average conditions and seasonal characteristics, while Change Twins compares selected trends and interannual variability. Users explore ten locations from 1991–2024, adjust weights and periods, inspect historical charts and uncertainty, and export reproducible comparisons. For Lisbon, the closest Climate Twin is Cape Town, while the closest Change Twin is Reykjavík at default settings. The application makes environmental comparisons accessible while explaining why similarity is not statistical significance, equal slopes, common causation or a forecast.

## Link to Project Demo

https://github.com/wxu2206/climate-doppelganger/blob/submission/guideline-compliance/submission/presentation/climate-doppelganger.pdf

**Use this seven-slide PDF for the required Project Demo.** It must include Team Name Team, William Xu and the selected challenge title. The editable PowerPoint is a source format, not an additional required demo. Confirm public anonymous access after the final branch assets are published.

Do not use the existing 100.64-second recording in this field: the supplied guide limits a video Project Demo to **30 seconds or less**. That longer recording is an extended supporting walkthrough only. A separate short video is unnecessary because the permitted slide-deck route is selected.

## Link to Final Project

https://github.com/wxu2206/climate-doppelganger

The public repository is the final-project source and includes validated NASA data and local run instructions. For review of the updated guideline-compliance package before merge:
https://github.com/wxu2206/climate-doppelganger/tree/submission/guideline-compliance

No deployed website is claimed or required for this repository-hosted route. Documents and videos must be linked from the public repository; do not attempt to upload them as document/video files to the Project page.

## Detailed Project Description

Climate Doppelgänger separates two questions that are often confused: which places have similar climate conditions, and which places have similar selected patterns of environmental change? The application supports transparent, educational exploration rather than automatic attribution or prediction.

The Python ingestion pipeline downloads monthly NASA POWER T2M and PRECTOTCORR responses, validates units, coordinates, finite values and complete dates, and preserves original source metadata, retrieval timestamps and raw-response hashes. The included snapshot contains ten points and 408 complete months per point for 1991–2024. Annual temperatures are weighted by calendar days; mean daily rainfall rates are multiplied by month length before summation. NASA's `YYYY13` annual summaries are excluded from monthly observations.

Ordinary least squares estimates annual trends in per-decade units. Student-t 95% slope intervals and two-sided nominal p-values accompany magnitudes and sample sizes. Climate Twins combines mean temperature, annual precipitation and seasonal characteristics. Change Twins combines slopes and detrended annual variability. Features are standardized across the selected-period cohort and combined using adjustable group weights into an explainable Euclidean distance. Lower means closer; a distance is not a probability or percentage similarity.

At 1991–2024, temperature/precipitation weights 70/30 and minimum separation 1,500 km, Lisbon selects Cape Town as its Climate Twin (distance 0.187706; 8,562 km away), while Change Twins selects Reykjavík (0.460964; 2,951 km). Lisbon and Reykjavík differ by approximately 12.224°C in mean temperature. Their estimated temperature slopes are +0.0981 and +0.0769°C per decade, with nominal p-values 0.137 and 0.324. Neither is significant at p<0.05. Variability contributes substantially to the change distance; it is not a test of equal slopes or common causation.

Users can select locations on a map, search supported points, alter weights and dates, inspect historical/anomaly/seasonal series and accessible tables, move a historical-year slider, discover distant pairs, and export an analysis with provenance. The static React/TypeScript application uses Vite, Tailwind CSS, MapLibre GL JS, Recharts and Lucide React. Python preprocessing and independent reference checks use NumPy, Pandas and SciPy. Vitest, React Testing Library, Playwright, axe, Pytest, Ruff and Mypy support verification. No account, backend, paid AI API or live NASA runtime request is required.

The project is useful for environmental education and exploratory investigation, not emergency, engineering or policy decisions. Only ten curated points and two variable groups are implemented. Gridded estimates may not represent local coastlines or terrain; Vancouver's returned source elevation is 565.27 m. Annual aggregation hides extremes, seasonal amplitude does not compare phase, and uncorrected temporal autocorrelation/multiple testing limit nominal significance. No causal or predictive result follows from a match. Future work could add validated locations/variables, phase-aware seasonal comparisons and autocorrelation-aware inference; these are proposals, not current capabilities.

Team information supplied by the owner is Team Name Team, participant William Xu. Exact personal contributions and permissions should be confirmed by the owner rather than inferred from repository ownership. No award, partner relationship or NASA endorsement is claimed. The code uses the MIT license, with NASA data and third-party materials credited separately.

## Use of Super Intelligence (SI)

Yes. OpenAI Codex/large-language-model coding assistance was used for implementation, test development, documentation, presentation layout/generation scripts and submission-text preparation. The software performs deterministic analysis; independently computed NumPy/SciPy references and authentic NASA observations are used to check results. Descriptive notices and `submission/si-disclosure.json` record this assistance; `submission/team.json` records the supplied team identity, while the guide source is documented in `submission/sources/project-submission-guide.json`.

No AI-generated images, footage, audio, satellite imagery or scientific observations are used. Screenshots and the extended supporting recording capture the actual application with authentic data; scientific diagrams use native editable shapes, lines and text. Existing licensed vector-library icons appear inside the real interface. NASA branding/design elements were not inserted into generated imagery.

The owner has stated “All work is original.” The original user brief supplied the Climate Twins/Change Twins concept and solution requirements; Codex helped implement and verify that brief. This factual provenance is recorded without requesting another restatement of the idea source. The owner must personally make the portal declarations and verify applicable permissions; Terms & Conditions acceptance is not claimed.

## NASA Data

NASA Prediction Of Worldwide Energy Resources (POWER), NASA Langley Research Center; meteorological source MERRA-2. Monthly API v2.10.0 parameters: T2M (temperature at 2 metres, °C) and PRECTOTCORR (corrected precipitation, mm/day). Coverage: 1991–2024 at ten curated points including Vancouver and Langley; 408 months per point, 8,160 finite parameter values. No missing monthly values were imputed and no synthetic data is included.

Snapshot: `power-1991-2024-v1`, retrieved 2026-11-15 UTC. SHA-256: `bc79b9e103e350c035a9716ecd8baf6343bc18ee49acddd87cd3e12ae0a44254`. Original request URLs, retrieval timestamps, parameter descriptions, source/API headers and raw-byte hashes accompany each location in `public/data/climate.json`. These are gridded reanalysis-derived estimates, not individual city weather-station observations.

NASA POWER: https://power.larc.nasa.gov/
Monthly API documentation: https://power.larc.nasa.gov/docs/services/api/temporal/monthly/
MERRA-2: https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/
Project provenance and methods: https://github.com/wxu2206/climate-doppelganger/tree/submission/guideline-compliance/docs

## Space Agency Partner Data and Other References

No additional Space Agency Partner dataset is claimed. NASA POWER/MERRA-2 is the environmental source; Natural Earth supplies public-domain land geometry, not satellite imagery. The application's own genuine screenshots and recorded browser footage are used in submission materials; their per-file hashes and source records are retained. No external photographs, stock imagery, music or generative media are included.

Software: React, TypeScript, Vite, Tailwind CSS, MapLibre GL JS, Recharts, Lucide React, Python, NumPy, Pandas and SciPy, with the testing tools listed in the Detailed Project Description. Existing ECC guidance is retained under its own MIT notice. Runtime license/copyright texts are reproduced in `public/THIRD_PARTY_NOTICES.txt`; the PDF's font notice accompanies the presentation. Contributor Covenant 3.0 retains its CC BY-SA 4.0 attribution. Application code is MIT, Copyright (c) 2026 Will Xu; that license does not relabel NASA data or third-party material as the author's original code.

Natural Earth terms: https://www.naturalearthdata.com/about/terms-of-use/
ECC source: https://github.com/affaan-m/ECC
Project credits, image provenance and dependency notices: https://github.com/wxu2206/climate-doppelganger/tree/submission/guideline-compliance/submission
AI/SI assistance is disclosed above and in package metadata. The project is independent and not endorsed by NASA. The owner must confirm any applicable third-party permissions and original-work declaration in the actual portal.
