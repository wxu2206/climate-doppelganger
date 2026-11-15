# Security policy

This project is pre-release. Security fixes target the latest default-branch code.

Report vulnerabilities through [this repository’s private reporting form](https://github.com/wxu2206/climate-doppelganger/security/advisories/new). Do not disclose exploit details in public issues. Include the affected commit, impact, reproduction steps and a minimal safe example. Remove credentials and personal information. Maintainer response depends on availability; no guaranteed response time is claimed.

GitHub Private Vulnerability Reporting must be enabled in repository settings if the private form is unavailable. Until then, check the Security page for an updated private channel; do not publish the vulnerability. This task does not enable repository settings.

Relevant concerns include dependency vulnerabilities, supply-chain compromise, malicious or malformed datasets, untrusted API responses, XSS, leaked credentials, integrity/provenance errors and unsafe external resources. NASA data must be validated for expected schema, finite values, units, geographic coordinates, complete dates and missing-value sentinels. Never execute downloaded data. Raw response SHA-256 hashes record provenance; they do not authenticate a malicious source. Use HTTPS and retain TLS validation.

The frontend uses static local data without a backend, accounts, secrets or user HTML injection. React renders text. Map geometry is bundled; no external tile server, analytics or third-party font is required. Keep dependencies locked, inspect updates, run npm audit, and review build/CI permissions. Do not run automatic dependency fixes without reviewing their impact. Store secrets only in appropriate local/environment settings; never commit them, print their values or put credentials in client bundles.

Scientific disagreement is not automatically a security vulnerability. Report calculation errors through the bug form unless they expose a security issue. This exploratory tool is not a source of emergency, engineering or policy advice.
