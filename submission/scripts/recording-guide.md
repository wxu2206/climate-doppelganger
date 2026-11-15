# Reproducible recording and speaker handoff

No official duration limit could be verified (official pages returned HTTP 503). The supplied silent browser recording is a rehearsal, not a claim of format compliance. Confirm the actual limit before uploading; the owner may add their own narration using the spoken script in ../submission-answers.md.

## Shot sequence

| Approximate capture hold | Real application state                    |
| ------------------------ | ----------------------------------------- |
| 0–6 s                    | Main interface and authentic-data badge   |
| 6–12 s                   | Lisbon selected on the map                |
| 12–22 s                  | Climate Twins, Cape Town first            |
| 22–32 s                  | Change Twins, Reykjavík first             |
| 32–42 s                  | Temperature history                       |
| 42–50 s                  | Precipitation history                     |
| 50–60 s                  | Confidence intervals and nominal p-values |
| 60–70 s                  | Methodology dialog                        |
| 70–76 s                  | Mobile view                               |
| 76–82 s                  | Seasonal chart                            |
| 82–88 s                  | Return to the top                         |

These are intended hold durations; loading, scrolling and capture add time. The exact encoded duration is recorded in ../video/metadata.json. The actual frame sequence is recorded, not synthesized. No voice, music or generative imagery is included. Explain in narration that both Lisbon/Reykjavík temperature intervals contain zero and the match includes variability.

## Recreate locally

Use the existing Node 24 environment, npm ci, npm run data:check, npm run build, then npm run preview -- --port 4190 --strictPort. Run `node submission/scripts/capture.mjs` for screenshots. For video, Playwright requires its own user-space encoder; use `PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright npx --no-install playwright install ffmpeg` in this cloud environment, or a writable local directory on your computer, then run:

```bash
PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright RECORD=1 node submission/scripts/capture.mjs
ffmpeg -i submission/video/recording.webm -c:v libx264 -pix_fmt yuv420p -crf 23 -movflags +faststart -an submission/video/climate-doppelganger.mp4
```

Set CHROMIUM_PATH for a different existing Chromium binary and DEMO_URL for the local preview. Do not install system packages if unavailable. Do not overwrite a manually edited recording without preserving it. After conversion, inspect the video and run ffprobe; retain only the selected final MP4 in Git, not temporary raw recordings. There is no official upload, deployment or media hosting action in this workflow.
