# NASA Space Apps submission handoff

The canonical ready-to-copy English answers are in [submission/submission-answers.md](../submission/submission-answers.md), organized under the eight exact fields from the owner-supplied Project Submission Guide:

1. Project Name
2. High-Level Project Summary
3. Link to Project Demo
4. Link to Final Project
5. Detailed Project Description
6. Use of Super Intelligence (SI)
7. NASA Data
8. Space Agency Partner Data and Other References

The guide was supplied in conversation, not independently authenticated against a reachable live page; prior official challenge/resources requests returned HTTP 503. Use any character limits and additional terms shown in the actual portal. [Requirements and evidence](../submission/requirements.md) records what the supplied text resolves and what remains an owner/live-portal check.

## Identity, demo and deadline

- Team: **Team Name Team**. Participant supplied: **William Xu**. Accepted-participant status is not independently verified.
- Event: **Universal Event**. Confirmed Team Owner residence timezone: **America/Vancouver**.
- Selected challenge: **Be An Earth System Trend Detective!**
- Deadline: **2026-11-15 23:59 America/Vancouver = 2026-11-16 06:59 UTC**, using IANA tzdata 2026b (UTC−07:00 on that date). The applicable portal-local cutoff is authoritative.
- Required Project Demo: the [seven-slide PDF](https://github.com/wxu2206/climate-doppelganger/blob/submission/guideline-compliance/submission/presentation/climate-doppelganger.pdf), including the title/intro. The guide permits up to seven slides or a video no longer than 30 seconds.
- Final Project: the [public repository](https://github.com/wxu2206/climate-doppelganger); the [guideline-compliance branch](https://github.com/wxu2206/climate-doppelganger/tree/submission/guideline-compliance) contains the current review package. A deployed site is optional, not a blocker for the allowed repository route.

The existing 100.64-second recording is an **EXTENDED SUPPORTING walkthrough**. It exceeds the video-demo limit and must not be entered as the required Project Demo. No new short video is necessary. Publish/recheck the final public links without login or permission; link PDF/video documents rather than uploading them to the image-only portal.

## Concise scientific summary

Climate Doppelgänger uses authentic NASA POWER/MERRA-2 gridded temperature and precipitation estimates at ten curated points for 1991–2024. Climate Twins compares average conditions and seasonal characteristics; Change Twins compares selected trends and detrended interannual variability. Users adjust weights and periods, compare historical charts/anomalies and inspect uncertainty. The static application needs no backend, account or live NASA runtime connection.

The pipeline validates T2M (°C), PRECTOTCORR (mm/day), source coordinates, finite values and complete monthly coverage, retaining original request metadata, retrieval timestamps and raw hashes. Annual temperature is weighted by calendar days; rainfall rates are multiplied by month length before annual summation. `YYYY13` NASA annual summaries are excluded from monthly observations.

OLS estimates per-decade slopes with Student-t 95% slope intervals and nominal two-sided p-values. Cohort-standardized features and adjustable normalized weights produce an explainable Euclidean distance. Lower means closer, not probability or percentage similarity. Serial correlation/multiple testing are not corrected; ten points, gridded terrain representation and annual aggregation limit conclusions.

## Seven-slide demonstration handoff

1. Introduce **Team Name Team — William Xu**, the selected challenge, and the question: similar climates or similar selected changes?
2. Show the ten-point NASA POWER source, period, validation and provenance. These are gridded estimates, not city weather stations.
3. Explain Climate Twins versus Change Twins and transparent weighted feature distances.
4. Show Lisbon at 1991–2024, 70/30 weights and 1,500 km separation: Cape Town is its closest Climate Twin, distance 0.187706.
5. Show Reykjavík as Lisbon's closest Change Twin, distance 0.460964, despite approximately 12.224°C different mean temperature.
6. Show Lisbon/Reykjavík slopes +0.0981/+0.0769°C per decade and nominal p-values 0.137/0.324. Both temperature intervals include zero. Similarity is not statistical significance, equal slopes, common causation or a forecast; variability also contributes to the match.
7. Close with practical exploration, limitations, NASA/source credits, license information and truthful SI-development disclosure.

This is a slide presentation handoff, not an official timed-video script. Any additional spoken or recorded walkthrough is supporting material under [the recording guide](../submission/scripts/recording-guide.md).

## SI disclosure and final human actions

Codex assisted implementation, tests, documentation, submission copy and presentation layout/generation. NASA observations, authentic application screenshots and browser footage were not generated by SI; no generative images, video or audio are used. Descriptive notices and package metadata record software assistance. Do not falsely mark authentic captured media as generative content.

The owner stated “All work is original.” The original user brief supplied the Climate Twins/Change Twins concept and implementation requirements. Verify contributor/content permissions, every member's accepted status at the same Universal Event and the actual portal terms; no redundant restatement of the supplied idea source is needed. Personally complete the eight fields, accept the Terms & Conditions and original-work declaration, click **Submit for Judging** before the confirmed deadline, and verify the success message. Saving is insufficient. No submission, deployment, merge or NASA endorsement is claimed.

Machine-readable records: [supplied guide provenance](../submission/sources/project-submission-guide.json), [team/event facts](../submission/team.json), [SI assistance](../submission/si-disclosure.json).
