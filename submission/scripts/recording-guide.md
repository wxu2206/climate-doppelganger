# Extended supporting walkthrough: recording guide

**This recording is optional EXTENDED SUPPORTING material, not the required Project Demo.** The owner-supplied Project Submission Guide permits up to seven slides including the title/intro **or** a video no longer than 30 seconds. The selected required demo is the seven-slide PDF in `../presentation/climate-doppelganger.pdf`. No short video needs to be created.

The existing silent browser recording is **100.64 seconds** and exceeds the guide's video-demo limit. Do not paste its link into the Project Demo field. If included as a supplementary repository resource, keep its supporting-only label visible. The guide text was owner-supplied; prior live challenge/resources requests returned HTTP 503.

## Optional supporting shot sequence

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

These are intended holds; loading, scrolling and capture add time. The encoded duration and stream metadata are in `../video/metadata.json`. Browser footage is captured, not synthesized. No voice, music, human likeness or generative imagery is included. Codex-assisted recording/layout code is disclosed as software assistance rather than falsely labelling authentic captured frames as generated video.

If a presenter explains the supporting walkthrough separately, say that both Lisbon/Reykjavík temperature slope intervals contain zero, neither is nominally significant at p<0.05, and the change match includes variability. Similarity does not show equal slopes, common causation or prediction. Do not record a minor's face or voice or add unlicensed media. Non-English spoken content would require English subtitles under the supplied guide.

## Recreate locally only if needed

Use existing Node 24 tools and repository-local dependencies:

```bash
npm ci
npm run data:check
npm run build
npm run preview -- --port 4190 --strictPort
```

In a separate terminal, `node submission/scripts/capture.mjs` captures screenshots. For supporting video, Playwright requires its user-space encoder. Use `PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright npx --no-install playwright install ffmpeg` in this cloud environment, or an existing writable local directory on your own computer, then run:

```bash
PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright RECORD=1 node submission/scripts/capture.mjs
ffmpeg -i submission/video/recording.webm -c:v libx264 -pix_fmt yuv420p -crf 23 -movflags +faststart -an submission/video/climate-doppelganger.mp4
```

Set `CHROMIUM_PATH` for another existing Chromium binary and `DEMO_URL` for the local preview. Do not install system packages. Preserve manually edited recordings before replacing them. Inspect the result, run ffprobe/full decoding, update truthful metadata and artifact hashes, and retain only the selected MP4 in Git rather than temporary raw recordings. These commands do not deploy, host or submit any media.
