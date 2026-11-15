# Cloudflare Pages deployment handoff

No deployment, DNS change, account modification or paid resource was authorized or performed. No verified live URL is available. The repository API has no homepage configured; Cloudflare credentials/tools are not available in this session, so an existing account/project could not be inspected. Do not infer from that absence that the owner has no deployment elsewhere.

## Exact configuration for an authorized deployment

1. Review and merge the submission-preparation PR through the normal process. Do not deploy an unreviewed feature branch as production.
2. In the owner's Cloudflare Pages account, connect `wxu2206/climate-doppelganger`.
3. Production branch: `main`. Framework preset: Vite (or none with explicit settings).
4. Build root: repository root. Node version: **24** (`NODE_VERSION=24` if the account requires an explicit variable).
5. Build command: `npm run build`. Output directory: `dist`.
6. No API key, backend, Python service or NASA runtime connection is required. Python is only for data regeneration/testing.
7. Keep `public/_headers` in the build. It contains the CSP, nosniff, referrer, framing and permissions policies. The map worker is bundled locally; inline styles are permitted for chart/map layout, not inline scripts.
8. After an explicitly authorized deployment, verify the real HTTPS URL, both twin modes, JSON/data assets, map worker, history charts, mobile layout, download, notice file and response security headers. Add that verified URL to the submission only after these checks.

## Local production verification

```bash
npm ci
npm run data:check
npm run build
npm run preview -- --port 4190 --strictPort
DEMO_URL=http://127.0.0.1:4190 node submission/scripts/capture.mjs
```

The production browser capture uses only local static assets and authentic observations. The preceding production/CSP smoke check at desktop/tablet/mobile widths recorded no external runtime requests, page errors or axe violations. The final package verification reruns the production build and browser suite. Current hash navigation needs no SPA rewrite. Firefox/Safari have not been tested; Chromium checks do not establish all-browser compatibility. The large lazy MapLibre bundle advisory remains a documented performance limitation.

Human approval is required before connecting accounts, deploying, changing production settings/DNS, purchasing services or publishing a live site. Official portal submission is separate and was not performed.
