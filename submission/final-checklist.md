# Final package checklist

## Technical and scientific checks

- [x] Start from latest main, preserve the application and authentic dataset, use a separate submission branch.
- [x] Preserve snapshot SHA-256 `bc79b9e103e350c035a9716ecd8baf6343bc18ee49acddd87cd3e12ae0a44254`.
- [x] `npm run data:check` passes for ten locations × 408 months, with source metadata/hashes intact.
- [x] Lisbon climate → Cape Town (0.188); change → Reykjavík (0.461), at 1991–2024, 70/30 weights, 1,500 km minimum separation.
- [x] Lisbon/Reykjavík estimated temperature slopes +0.098/+0.077°C per decade, nominal p 0.137/0.324; neither significant at 0.05. No equality, causation or prediction claim.
- [x] 39 frontend tests; 18 Python tests; 11 browser tests passed in this pass, including authentic-data mobile/tablet/desktop and axe checks.
- [x] Typecheck, ESLint, build, Ruff, Mypy and dependency consistency passed. Full npm audit reports zero known vulnerabilities.
- [x] Static build served locally and real interactions captured without mocked data. Prior production CSP smoke evidence retained; no new application code or security policy changes introduced.
- [x] MIT, ECC, runtime dependencies, NASA POWER/MERRA-2 and Natural Earth notices preserved; PDF font notice included.

## Package review

- [x] Seven-slide editable presentation and matching PDF generated from shared layout primitives.
- [x] Fresh real screenshots captured; source hashes recorded. No AI-generated or fixture imagery used.
- [x] Ready-to-copy descriptions, methodology, evidence, limitations, credits and truthful AI-development disclosure prepared.
- [x] Exact deployment configuration documented; no deployment, DNS/account change, paid service, release or official submission performed.
- [x] Independent review identified slide overlap, missing readable interval values and tooltip/relative-link issues; fixes incorporated and media regenerated.

## Owner actions and unresolved requirements

- [ ] Confirm the exact official 2026 challenge, rubric, eligibility, deadline/timezone and global/local distinctions once official pages are available.
- [ ] Confirm whether video/presentation are required and their precise limits; the provided rehearsal is not certified against an unknown length rule.
- [ ] Supply actual team members, roles, contributor permissions and human declarations.
- [ ] Review submission text and rehearse the PDF/PPTX in the final viewer; approve the silent recording or add human narration and required hosting.
- [ ] Approve deployment separately if desired/required; then verify its actual HTTPS URL before adding it to the form.
- [ ] Review the submission branch PR and its exact-head hosted checks before merge.
- [ ] Complete the official portal submission and any media upload personally.

No awards, partners, NASA endorsement, deployed URL or official submission are asserted. Chromium coverage does not establish full cross-browser/WCAG certification; statistical and sampling limits remain applicable.

## Final artifact validation

- [x] PPTX opens with seven editable slides; PDF opens with exactly seven pages.
- [x] Corrected slide 5/6 layout, numeric annotations, workflow order and links independently rechecked.
- [x] Twelve screenshot files match the provenance hashes; no chart tooltips obstruct the selected captures.
- [x] Final MP4: H.264, 1440×1000, yuv420p, **100.64 seconds**, **2,645,380 bytes**, silent. Full decode succeeds; an actual frame was visually checked. This is a rehearsal with unverified official duration constraints.
- [x] All application checks passed in this pass; no application or validated-data modifications were needed.
- [ ] Check the final package commit's hosted Actions through its PR link; do not substitute older green runs.
