# Final submission-readiness review

The authentic data and application have a verified engineering baseline for a reproducible demonstration. This guideline-compliance pass preserves them. The owner has now supplied the Project Submission Guide, which resolves the eight form fields, slide/video limits, team-identification requirements, SI disclosure rules and applicable submission window. The supplied text has not been independently authenticated against a reachable official page; prior challenge/resources requests returned HTTP 503. Challenge-specific additions, legal terms, participant acceptance and final portal submission remain unverified.

## Challenge alignment

Official challenge URL supplied in the project brief:
https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/

Both that page and https://www.spaceappschallenge.org/resources/ returned HTTP 503 during the earlier official-source review. The owner-supplied Project Submission Guide is the working general submission source, clearly distinguished from independently retrieved challenge wording. No older challenge text or inferred scientific requirement is substituted as 2026 authority.

| Capability identified in the brief | Verified implementation                                                                                                | Official 2026 alignment                                                            |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Choose environmental variables     | Temperature and precipitation groups; weights may be zero to exclude a group, with at least one positive weight        | Functionally verified; precise official parameter/variable requirements unverified |
| Explore geographical locations     | Ten validated point coordinates, map/search, geographic separation and matched connections                             | Functionally verified; no claim of arbitrary-coordinate or global coverage         |
| Visualize historical time series   | 1991–2024 annual histories, anomalies, seasonal cycles, monthly anomalies, data table and adjustable analysis interval | Functionally verified; precise official visualization requirements unverified      |
| Show trend magnitude               | OLS slopes in °C/decade and annual precipitation mm/decade, with sample sizes and fitted lines                         | Scientifically checked against independent NumPy/SciPy calculations                |
| Assess statistical significance    | Student-t 95% slope CIs and two-sided nominal p-values; uncertainty and autocorrelation caveats                        | Implemented; no assumption that OLS alone satisfies an unknown official rubric     |
| Identify distant similarities      | Separate baseline-climate and change-feature distances with adjustable weights and contributions                       | Reproduced on authentic observations; not causal or predictive evidence            |

## Verified Lisbon demonstration

Snapshot `power-1991-2024-v1`; 1991–2024; weights temperature 70, precipitation 30; minimum separation 1,500 km; all ten points included in normalization.

| Point     | Mean temperature °C | Temperature slope °C/decade | 95% slope CI           | Nominal p |
| --------- | ------------------: | --------------------------: | ---------------------- | --------: |
| Lisbon    |           16.620882 |                   +0.098093 | [−0.032894, +0.229080] |  0.136979 |
| Cape Town |           17.020721 |                   −0.133178 | [−0.240764, −0.025592] |  0.016863 |
| Reykjavík |            4.397027 |                   +0.076879 | [−0.079381, +0.233139] |  0.323787 |

Lisbon selects Cape Town as its Climate Twin (distance **0.1877064181**, separation **8,562.2898 km**) and Reykjavík as its Change Twin (distance **0.4609641831**, separation **2,950.6269 km**). This is verified against the exact prepared snapshot, SHA-256 `bc79b9e103e350c035a9716ecd8baf6343bc18ee49acddd87cd3e12ae0a44254`, and independently recomputed from the original NASA responses.

Lisbon and Reykjavík's temperature intervals include zero. Similar positive estimates do not imply either is significant, that the slopes are statistically equivalent, or that the locations share a cause. Change Twins compares four features; detrended variability contributes substantially to this pair's distance. Serial correlation and multiple testing remain uncorrected. Cape Town's nominally negative temperature slope is not a causal attribution finding.

## Licensing, attribution and official-source audit

- Root MIT notice preserves Copyright (c) 2026 Will Xu. NASA data and third-party material retain their own provenance/terms rather than being presented as original MIT-authored data.
- All 15 copied official ECC files still match their pinned hashes and retain ECC's MIT notice. No installation or hook/MCP change was made.
- All 70 locked runtime dependency records have been reviewed against installed package notices. One omission was corrected: the full murmurhash-js MIT notice, Copyright (c) 2011 Gary Court, was embedded in its README and missing from the aggregate. It is now retained in `public/THIRD_PARTY_NOTICES.txt` and the build output.
- Contributor Covenant 3.0's CC BY-SA 4.0 attribution is retained. Natural Earth's map geometry remains credited as public domain.
- NASA POWER/MERRA-2, API version, units, coordinates, retrieval timestamps, raw hashes and source URLs are documented and embedded. No missing values were invented. The snapshot contains 8,160 validated monthly parameter values, not weather-station observations.
- NASA's official [Images and Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/) returned HTTP 200. They call for source acknowledgment and prohibit implied endorsement, with separate protections for NASA identifiers and third-party materials. The project uses its own interface and no NASA logo or generative NASA imagery; non-endorsement text is present. This general guidance is not substituted for unavailable 2026 submission rules or dataset-specific legal certification.
- Official POWER [data FAQ](https://power.larc.nasa.gov/docs/faqs/data/) returned HTTP 200 and confirms community-specific API units and distribution guidance. The original responses and [monthly API documentation](https://power.larc.nasa.gov/docs/services/api/temporal/monthly/) remain the primary data/schema evidence. No invented dataset DOI or publication citation is supplied.

This is an engineering attribution review, not a legal opinion. The supplied guide requires credits and SI assistance disclosure in descriptive text and code/data metadata. Codex assisted implementation, tests, documentation and presentation layout/generation; authentic NASA observations, captured screenshots and browser footage are not SI-generated. No generative images, video or audio are used. Package metadata and final media checks are part of the current guideline review. The original user brief supplied the Climate Twins/Change Twins concept and solution requirements. Applicable permissions, current legal terms and personal original-work declarations remain the owner's responsibility; no extra idea-origin restatement is needed.

## Local checks and hosted CI

The earlier application review and [draft PR #2](https://github.com/wxu2206/climate-doppelganger/pull/2) are historical evidence. The owner reported that [hosted Actions for commit `e79b1ff`](https://github.com/wxu2206/climate-doppelganger/actions/runs/43672371721) passed. They do not establish hosted success for the new `submission/guideline-compliance` revision.

The prior local baseline passed 39 frontend tests, 18 Python tests, 11 Chromium/browser tests including tested accessibility states, the authentic-data gate, strict types, ESLint, production build, Ruff, Mypy and dependency consistency. The current local rerun also passed: 39 frontend tests, 18 Python tests on local Python 3.12.14, and 11 browser tests in 49.5 s including authentic-data 390/768/1440 px states and axe scans. Data gate, strict types, ESLint, production build, Ruff, Mypy, pip consistency and npm audit (zero known vulnerabilities) passed. Artifact/public-link and hosted validation remain tracked separately in [the final checklist](../submission/final-checklist.md); no new hosted result is claimed until the final commit is tested.

The workflow uses Node 24/npm ci and Python 3.11/3.13, pinned action SHAs, read-only permissions, bounded jobs and cancellation. It uses committed authentic data without live NASA requests and has no deployment job. Review the exact final revision's PR checks; older green runs and local checks cannot substitute for current hosted evidence. A PR is a review artifact, not a merge or an official Space Apps submission.

## Cloudflare Pages compatibility

Verified static build configuration: **Node 24**, command **`npm run build`**, output directory **`dist`**, repository root as build root. Python is needed for regeneration/tests, not for serving the site. No backend, account system, database, secrets, external tiles/fonts or NASA runtime request is required.

The output includes `index.html`, local JS/CSS, MapLibre worker, climate data, Natural Earth geometry, `_headers`, and complete runtime notices. Current navigation uses hashes, so an SPA rewrite is unnecessary. The exact Pages CSP was exercised in the earlier local production-bundle smoke check without errors. The existing large lazy MapLibre chunk advisory remains a performance limitation, not a failed build. This review does not deploy or establish actual Pages target acceptance.

## Supplied-guide submission route

Owner-supplied team information is **Team Name Team — William Xu**, **Universal Event**, residence timezone **America/Vancouver**. The deadline on that confirmed Universal basis is **2026-11-15 23:59 America/Vancouver = 2026-11-16 06:59 UTC**. The UTC conversion uses IANA `America/Vancouver` tzdata 2026b (UTC−07:00 on this date), rather than the older seasonal offset. The applicable portal-local cutoff is authoritative. Accepted-participant status is still an owner check.

Use the [seven-slide PDF](https://github.com/wxu2206/climate-doppelganger/blob/submission/guideline-compliance/submission/presentation/climate-doppelganger.pdf) as the required Project Demo. The supplied guide permits up to seven slides including the title/intro or video no longer than 30 seconds. The 100.64-second video is **EXTENDED SUPPORTING material only**, excluded from that field. No short video or deployment is necessary for the selected route. The [public repository](https://github.com/wxu2206/climate-doppelganger) is the Final Project; the [review branch](https://github.com/wxu2206/climate-doppelganger/tree/submission/guideline-compliance) holds this package.

The final deck must show the supplied team/member names and **Be An Earth System Trend Detective!**, use English and public anonymous links, preserve source/SI attribution and contain no minor's likeness. Current-pass artifact and public-link checks remain recorded separately rather than inferred from older outputs. [Exact-field answers and the slide handoff](submission-form.md) supersede the earlier suggested two-minute video script.

## Submission checklist

- [x] Preserve application/ECC/source data and existing test coverage.
- [x] Record prior successful data gate and independently reproduced demonstration.
- [x] Distinguish similarity, significance, slope equivalence, causation and prediction.
- [x] Review licenses/citations and retain embedded third-party notices.
- [x] Prepare English copy under all eight supplied-guide field names.
- [x] Select the seven-slide PDF, exclude the long supporting video from the required demo, and document the confirmed Universal deadline.
- [x] Record the owner's original-work statement and original concept brief, without inferring accepted status, authenticated permissions or Terms & Conditions acceptance.
- [x] Pass current local application/data/browser/accessibility checks; retain current results separately from historical/hosted evidence.
- [x] Complete metadata/layout/media checks and artifact manifest; all seven pages, twelve image hashes and full video decoding pass. Public-link checks require publication.
- [ ] Publish/review the final revision and check its exact hosted Actions results; older green runs are insufficient.
- [ ] Owner recheck final PDF/repository links in a private browser and review all seven slides in the final viewer.
- [ ] Confirm every participant's accepted status at the same event, permissions, current portal terms/limits and any live challenge-specific additions.
- [ ] Personally accept portal declarations, click **Submit for Judging** before the confirmed deadline, and verify success. Saving is not submission.

The [package checklist](../submission/final-checklist.md) is the current handoff for final-pass evidence and owner actions. Chromium/accessibility coverage establishes tested states, not complete WCAG or all-browser certification. Statistical limitations and Vancouver's 565.27 m source elevation remain documented. No merge, deployment, official submission, award or NASA endorsement is claimed.

Source/disclosure records: [owner-supplied guide](../submission/sources/project-submission-guide.json), [team/event facts](../submission/team.json), [SI assistance](../submission/si-disclosure.json). The guide source is not an independently authenticated live-page response.

Final local production preview checks at 390/768/1440 px also reproduce both Lisbon matches, with zero page errors, external runtime requests, horizontal overflow or tested axe violations. [Structured evidence](../submission/verification.json) and the [read-only package gate](../submission/scripts/check_package.py) preserve these checks separately from hosted CI and official portal acceptance.
