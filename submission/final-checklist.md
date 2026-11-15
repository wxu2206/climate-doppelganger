# Final submission checklist

This guideline-compliance pass preserves the application and authentic dataset. Earlier application checks are a baseline, not evidence that a new revision has passed hosted CI. Current local verification results are recorded below; artifact, public-link and hosted checks remain separate.

## Scientific and engineering baseline

- [x] Preserve the application, ECC skills, existing tests and validated dataset; use `submission/guideline-compliance` for the guideline corrections.
- [x] Recorded snapshot SHA-256: `bc79b9e103e350c035a9716ecd8baf6343bc18ee49acddd87cd3e12ae0a44254`.
- [x] Prior verified data gate: ten locations × 408 months × two parameters, with NASA metadata/raw-response hashes intact.
- [x] Reproduced Lisbon climate → Cape Town (0.188) and change → Reykjavík (0.461), 1991–2024, 70/30 weights, 1,500 km minimum separation.
- [x] Lisbon/Reykjavík temperature slopes +0.098/+0.077°C per decade, nominal p 0.137/0.324; neither significant at 0.05. No equality, causation or prediction claim.
- [x] Prior application baseline: 39 frontend tests, 18 Python tests, 11 Chromium browser tests, tested axe states, types, lint, build, Ruff, Mypy and dependency consistency passed. This is historical evidence; see current-pass items below.
- [x] MIT, ECC, dependency, NASA POWER/MERRA-2, Natural Earth and PDF font notices retained.

## Supplied-guide alignment

- [x] Record guide provenance: supplied by the owner, not independently authenticated from the unavailable live pages. Prior challenge/resources requests returned HTTP 503.
- [x] Record exact owner-supplied identity: **Team Name Team — William Xu**, **Universal Event**, **America/Vancouver** residence timezone. Do not infer accepted-participant status.
- [x] Record deadline: **2026-11-15 23:59 America/Vancouver = 2026-11-16 06:59 UTC**, using IANA tzdata 2026b (UTC−07:00). The portal's applicable local cutoff is authoritative.
- [x] Choose the seven-slide PDF as the required Project Demo; no short video is needed.
- [x] Label the 100.64-second recording **EXTENDED SUPPORTING walkthrough**. It exceeds the 30-second video-demo limit and is excluded from the Project Demo field.
- [x] Prepare English answers under all eight exact portal field names, with NASA data and other references separate.
- [x] Use a public GitHub repository as Final Project; no deployed website is required by the supplied guide.
- [x] Disclose factual Codex code/test/documentation/layout assistance; distinguish authentic observations/screenshots/footage from generative media.
- [x] Record the owner's statement “All work is original” and the original user brief as the concept/solution source; do not substitute these facts for permissions or personal portal declarations.

## Current-pass artifact and local verification

- [x] Dataset SHA-256 is unchanged; current `npm run data:check` passes.
- [x] Current pass: 39 frontend tests; 18 Python tests on local Python 3.12.14; 11 Chromium/browser tests (49.5 s), including authentic-data 390/768/1440 px states and axe scans. Data gate, strict types, ESLint, build, Ruff, Mypy, pip consistency and npm audit (zero known vulnerabilities) passed.
- [x] Regenerated PDF/PPTX contain exactly seven pages/slides including title; the title was visually checked with **Team Name Team**, **William Xu** and **Be An Earth System Trend Detective!** visible.
- [x] Independently recheck all seven PDF layouts and editable PPTX content: readable identity, numeric annotations, units, intervals, caveats and citations; no clipping/overlap found.
- [x] All twelve PNG hashes match provenance and HEAD; each is below 10 MB. Visual review found no obstructing tooltips or human likenesses.
- [x] Factual SI assistance is documented in descriptive text and `si-disclosure.json`, plus presentation/video metadata. Authentic observations/screens/footage are not described as generated; no generative images/video/audio or generated NASA branding is used.
- [x] MP4 metadata and full FFmpeg decode pass; original footage bytes unchanged. H.264, 1440×1000, yuv420p, silent, 100.64 seconds, 2,645,380 bytes. Supporting-only status is explicit.
- [x] Artifact gate and complete manifest inventory/hashes pass. The gate also rejects the obsolete UTC−08 deadline conversion; current IANA2026b source confirms UTC−07.
- [ ] Owner review the clean pull-request diff and final revision's hosted Actions status. Publication-time results are reported through the PR; older green runs are insufficient.
- [ ] Owner recheck the final PDF and repository links in a private browser after publication. Documents/videos are linked, not uploaded to the image-only portal.

## Owner-only submission actions

- [ ] Confirm every team member is an accepted participant at the same Universal Event.
- [ ] Verify all applicable contributor/content permissions. The user-provided concept/solution brief and Codex implementation assistance are already recorded; no redundant idea-origin restatement is needed.
- [ ] Check current portal wording/limits, eligibility and legal terms. The supplied guide resolves media limits/fields/timezone, but live-page authentication and any challenge-specific additions remain unverified.
- [ ] Review final English text and seven-slide PDF in the final viewer.
- [ ] Personally accept the Terms & Conditions and original-work declaration; no checkbox acceptance is inferred from the owner's chat statement.
- [ ] Complete all eight fields and click **Submit for Judging** before the confirmed deadline; verify the success banner/message. Saving is not submission.

Optional deployment may be considered separately; no live website, DNS/account change, purchase, release, merge or official submission has been performed. Chromium/axe coverage does not establish all-browser compatibility or complete WCAG certification; scientific sampling and uncertainty limitations remain applicable.

Source records: [guide](sources/project-submission-guide.json), [owner identity/event facts](team.json), [SI assistance](si-disclosure.json). The guide source is user-supplied and not independently authenticated against the live page.

Additional current production-build checks at 390/768/1440 px reproduced both Lisbon matches with zero page errors, external runtime requests, axe violations or horizontal overflow. [Structured local evidence](verification.json) records commands, versions and tested states. Artifact checks use the existing optional user-space tools, not additional application dependencies.
