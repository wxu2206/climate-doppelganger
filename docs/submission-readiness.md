# Final submission-readiness review

The authentic data and application are verified for a reproducible demonstration and pull-request review. **Official 2026 challenge compliance is not certified:** the supplied challenge and resources pages return HTTP 503, so their exact wording, eligibility, license requirements, form limits, media requirements and deadline cannot be confirmed. The assessment below separates implemented capability from official-rule verification.

## Challenge alignment

Official challenge URL supplied in the project brief:
https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/

Both that page and https://www.spaceappschallenge.org/resources/ returned HTTP 503 in this final review. No older challenge text, third-party summary or inferred rule was substituted as 2026 authority.

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

This is an engineering attribution review, not a legal opinion. Submission-specific licensing/AI-disclosure/media rules still require the current official portal.

## Local checks and hosted CI

The final local verification runs the data gate, full frontend suite, strict typecheck, ESLint, production build, full Python suites plus Ruff/Mypy/dependency consistency, and the full Chromium/browser/accessibility suite. See the final PR check results for the exact committed revision, rather than assuming local checks establish hosted success. The earlier commit `78df8ad` had successful hosted runs, but those runs did not include the then-staged authentic dataset:
https://github.com/wxu2206/climate-doppelganger/actions/runs/43670480470

The workflow uses Node 24/npm ci and Python 3.11/3.13, pinned action SHAs, read-only permissions, bounded jobs and cancellation. It uses the included data without live NASA access. No deployment job exists. The final review commit includes the authentic dataset, regression fixtures and source attribution; publishing that feature commit permits Actions to test the current revision. A draft PR is a review artifact, not a merge or an official Space Apps submission.

## Cloudflare Pages compatibility

Verified static build configuration: **Node 24**, command **`npm run build`**, output directory **`dist`**, repository root as build root. Python is needed for regeneration/tests, not for serving the site. No backend, account system, database, secrets, external tiles/fonts or NASA runtime request is required.

The output includes `index.html`, local JS/CSS, MapLibre worker, climate data, Natural Earth geometry, `_headers`, and complete runtime notices. Current navigation uses hashes, so an SPA rewrite is unnecessary. The exact Pages CSP was exercised in the earlier local production-bundle smoke check without errors. The existing large lazy MapLibre chunk advisory remains a performance limitation, not a failed build. This review does not deploy or establish actual Pages target acceptance.

## Submission checklist

- [x] Preserve application/ECC/source-data hashes and existing tests.
- [x] Pass the authentic-data gate and independently reproduce the demonstration.
- [x] Distinguish similarity, significance, slope equivalence and causation.
- [x] Review licenses/citations and retain the missing embedded MIT notice.
- [x] Prepare [project description, methodology summary and spoken demo](submission-form.md).
- [x] Prepare a static Pages-compatible build and review-only PR contents.
- [ ] Confirm exact official 2026 challenge requirements once the page is available.
- [ ] Check the latest review commit's hosted Actions results in the draft PR; older green runs are insufficient.
- [ ] Human review of submission copy, contributor attribution and final repository/demo links.
- [ ] Supply any portal-required video/media, declarations, eligibility details and deadline confirmation.
- [ ] Complete the official portal submission; no submission or deployment has been performed.

The browser/accessibility evidence covers tested states, not complete WCAG certification. Statistical limitations and Vancouver's 565.27 m source elevation remain visible in the methodology and demo guide. Source links targeting `main` become available there only after the normal review/merge process; the feature-branch files are available during PR review.
