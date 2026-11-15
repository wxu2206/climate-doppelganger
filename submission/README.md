# Climate Doppelgänger submission package

Guideline-compliance review on `submission/guideline-compliance`, preserving the existing application, ECC guidance, tests and authentic NASA snapshot. The team information supplied by the owner is **Team Name Team — William Xu**, registered for the **Universal Event**. Accepted-participant status remains an owner check.

## Selected required demo

Use the **seven-slide PDF**, including the title/intro slide, as the required Project Demo:

https://github.com/wxu2206/climate-doppelganger/blob/submission/guideline-compliance/submission/presentation/climate-doppelganger.pdf

The owner-supplied Project Submission Guide permits up to seven slides **or** a video no longer than 30 seconds. The existing **100.64-second video is an EXTENDED SUPPORTING walkthrough**, not the required Project Demo. No new short video is needed for the selected slide route. The deck must show Team Name Team, William Xu and **Be An Earth System Trend Detective!**

The guide text was supplied by the owner in conversation. It has not been independently authenticated against a reachable official page; the earlier live challenge/resources requests returned HTTP 503. [Requirements and evidence](requirements.md) distinguish the supplied guide's requirements from live-page and owner-only checks.

## Artifacts

- `requirements.md`: guide requirements, source limitations, deadline, exact portal fields and remaining owner checks. `sources/project-submission-guide.json` retains the supplied guide's hash/provenance.
- `team.json`, `si-disclosure.json`: supplied identity/event facts and factual assistance metadata; neither asserts participant acceptance or portal declarations.
- `presentation/climate-doppelganger.pdf`: the selected required demo, seven pages generated from the same layout/content source as the editable deck; not represented as an Office export.
- `presentation/climate-doppelganger.pptx`: seven editable source slides with native text/shapes and authentic screenshots.
- `presentation/font-license.txt`: font distribution/embedding notice for the PDF's DejaVu font.
- `screenshots/`: twelve authentic production-browser captures, with per-file hashes and source records in `provenance.json`. No synthetic fixture screenshots are used.
- `video/climate-doppelganger.mp4`: **extended supporting walkthrough only**, silent, 100.64 seconds. It contains actual browser footage, no generated footage/music, and must not populate the required Project Demo field. Stream details and SI assistance disclosure are in `video/metadata.json`.
- `project-description.md`, `methodology-summary.md`, `submission-answers.md`: evidence-based English text. Submission answers use the guide's eight exact portal field names.
- `credits.md`: data/software/image attribution and SI-development disclosure.
- `deployment.md`: optional Cloudflare Pages handoff. A public GitHub repository is an allowed final-project route; deployment is not a submission blocker under the supplied guide.
- `final-checklist.md`: verified evidence and remaining human actions.
- `scripts/capture.mjs`: reproducible screenshots/extended recording from the real app. Requires existing Chromium and repository-local Playwright; video needs a user-space Playwright encoder.
- `scripts/build_presentation.py`: reproducible editable-deck/PDF generator using existing python-pptx, reportlab, Pillow and DejaVu Sans files. These are artifact tools, not application dependencies.
- `scripts/check_package.py`: read-only artifact gate for slide counts/identification, SI metadata, deadline conversion, authentic-data/image hashes and final manifest. Run `python3 submission/scripts/check_package.py --manifest` using the existing artifact tools and ffprobe.
- `verification.json`: commands, versions and current local results, including production-browser checks at three widths. Hosted CI and portal acceptance are separate.
- `scripts/recording-guide.md`: optional extended walkthrough shot list and local commands, not the required demo format.

Screenshots and video frames originate from the unmocked production build with the authentic ten-point NASA POWER snapshot. Scientific diagrams use native editable text, shapes and lines. No generative image/video/audio service or NASA logo is used. Codex assisted code, tests, documentation and presentation layout/generation; descriptive notices and package metadata disclose this assistance. No human likeness or voice appears in the selected media.

## Review and reproduce

Run `npm ci`, `npm run data:check`, `npm run build`, then `npm run preview -- --port 4190 --strictPort`. `node submission/scripts/capture.mjs` captures screenshots; see the recording guide before recreating optional supporting footage. `python3 submission/scripts/build_presentation.py` generates both presentation formats using existing user-space tools or an optional local virtual environment. Do not install host packages or overwrite owner-edited media without preserving it.

The PDF and PPTX use shared content/layout primitives; viewer font rendering can differ. Check all seven pages/slides and rehearse in the final viewer. Recheck public anonymous access to the final PDF/repository after publishing the branch. GitHub-hosted documents/videos must be linked in the portal; image uploads accept JPG/PNG/GIF up to 10 MB, not document/video files.

## Owner completion

For the confirmed Universal residence timezone, submit by **2026-11-15 23:59 America/Vancouver = 2026-11-16 06:59 UTC**. Confirm all members' accepted status at the same event and applicable permissions; review the guide and live portal; complete the eight fields; personally accept Terms & Conditions and the original-work declaration; choose **Submit for Judging** and verify the success message. Saving a draft is insufficient. The UTC conversion uses IANA `America/Vancouver` tzdata 2026b (UTC−07:00 on this date); the portal's applicable 23:59 local cutoff is authoritative.

The owner stated “All work is original.” The original user brief supplied the Climate Twins/Change Twins concept and solution requirements. These provenance facts are recorded without inferring participant acceptance, independently authenticated permissions or portal checkbox acceptance. No official submission, deployment, account change, release or NASA endorsement is claimed. Deployment/DNS/purchases require separate authorization.
