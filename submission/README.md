# Climate Doppelgänger submission package

Prepared from latest main on `submission/preparation`. No AI-generated image, video, icon or observation is included. The application and validated dataset are preserved.

## Artifacts

- `requirements.md`: official-source checks and an explicit unverified-requirements matrix. The 2026 challenge/resources pages returned HTTP 503; compliance is not certified.
- `presentation/climate-doppelganger.pptx`: seven editable slides, with native text/shapes and authentic screenshots.
- `presentation/climate-doppelganger.pdf`: seven finished pages generated from the same layout/content source; not represented as an Office export.
- `presentation/font-license.txt`: font distribution/embedding notice for the PDF's DejaVu font.
- `screenshots/`: twelve authentic production-browser captures, with per-file hashes and source record in `provenance.json`. No synthetic fixture screenshots are used.
- `video/climate-doppelganger.mp4`: selected actual browser recording; silent, with no generated footage or music. Exact duration and stream metadata are in `video/metadata.json`. It is a rehearsal until the official length/format requirement is confirmed.
- `project-description.md`, `methodology-summary.md`, `submission-answers.md`: ready-to-copy evidence-based text, with only owner-dependent fields explicitly marked.
- `credits.md`: data/software/image attribution and development disclosure.
- `deployment.md`: exact Cloudflare Pages handoff; no deployment or account change was performed.
- `final-checklist.md`: performed checks and remaining human actions.
- `scripts/capture.mjs`: reproducible screenshots/recording from the real app. Requires existing Chromium and the repository's Playwright; video needs a user-space Playwright encoder.
- `scripts/build_presentation.py`: reproducible editable-deck/PDF generator. Requires existing python-pptx, reportlab, Pillow and DejaVu Sans font files. These are artifact-generation tools, not new application dependencies.
- `scripts/recording-guide.md`: shot list, speaker handoff and local commands.

All screenshots and video frames originate from the unmocked production build with the authentic ten-point NASA POWER snapshot. The presentation's statistical annotations and workflow are native editable scientific diagrams; no generative-image service was used. No external photos or satellite imagery are necessary.

## Review and reproduce

Run `npm ci`, `npm run data:check`, `npm run build`, and `npm run preview -- --port 4190 --strictPort`. Then `node submission/scripts/capture.mjs` captures screenshots. See the recording guide before creating video. `python3 submission/scripts/build_presentation.py` generates both presentation formats; use existing user-space tooling or an optional local virtual environment, never host package installation. Do not overwrite owner-edited media without preserving it.

The PDF and PPTX use shared content/layout primitives, so small font-rendering differences between viewers are possible. Both formats were opened, all seven pages/slides checked, and identified overlap/tooltip issues corrected. The owner should rehearse the editable deck in their final presentation viewer.

No live website or external video-hosting URL is claimed. Confirm 2026 rules, team information, final media suitability, eligibility and declarations, then perform the official portal submission personally. Deployment, DNS changes, releases and purchases require separate authorization.
