# Optional Cloudflare Pages deployment handoff

**Deployment is optional for submission.** The owner-supplied Project Submission Guide expressly permits a public GitHub repository as the Final Project and a publicly linked document as the Project Demo. Use the seven-slide PDF and repository links in `submission-answers.md`; a hosted application is not required for that route. The 100.64-second browser recording is extended supporting material, not the required Project Demo.

No deployment, DNS change, account modification or paid resource was authorized or performed. No verified live URL is claimed. The repository API previously had no homepage configured; Cloudflare credentials/tools were unavailable, so an existing account/project was not inspected. That does not establish that the owner has no deployment elsewhere.

## Configuration for a separately authorized deployment

1. Review the submission-guideline changes through the normal pull-request process. Do not merge or deploy automatically.
2. In the owner's Cloudflare Pages account, connect `wxu2206/climate-doppelganger`.
3. Production branch: `main`. Framework preset: Vite, or none with explicit settings.
4. Build root: repository root. Node version: **24** (`NODE_VERSION=24` if an explicit variable is needed).
5. Build command: `npm run build`. Output directory: `dist`.
6. No API key, backend, Python service or NASA runtime connection is needed. Python is used for regeneration/testing.
7. Preserve `public/_headers` in the build: CSP, nosniff, referrer, framing and permissions policies. MapLibre's worker is bundled locally; chart/map layout uses inline styles, not inline scripts.
8. After a separately authorized deployment, verify its actual HTTPS URL, both twin modes, JSON/data assets, map worker, history charts, mobile layout, download, notice file and response security headers. Add a live URL to the form only after verifying it.

## Local production verification

```bash
npm ci
npm run data:check
npm run build
npm run preview -- --port 4190 --strictPort
```

In a separate terminal:

```bash
DEMO_URL=http://127.0.0.1:4190 node submission/scripts/capture.mjs
```

The production capture uses local static assets and authentic observations. Earlier desktop/tablet/mobile production/CSP smoke checks reported no external runtime requests, page errors or tested axe violations. Those are prior evidence; current-pass results must be recorded after running checks. Hash navigation needs no SPA rewrite. Firefox/Safari remain untested, and Chromium checks do not establish all-browser compatibility. The lazy MapLibre bundle advisory remains a performance limitation.

The guide recommends, but does not require, FortiGuard classification for a new site. No classification request is necessary for this repository-hosted handoff and none was made. Account connections, deployment, DNS/settings changes, purchases and a live-site publication need separate authorization. Official portal submission remains an owner action.
