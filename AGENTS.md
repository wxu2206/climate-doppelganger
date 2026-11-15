# Climate Doppelgänger repository guidance

## Environment and scope

Local development uses Bazzite Linux, KDE, NVM-managed Node.js 24 and Python virtual environments. In Codex Cloud use the provided tools. Use repository-local dependencies only. Never use sudo, dnf, rpm-ostree, global package installations, host OS modifications or privilege escalation. Report missing system capabilities instead.

Work only in this repository. Inspect dependencies before adding packages. Preserve unrelated work. Avoid destructive Git commands, never force-push, change visibility, merge, release or deploy without authorization. Use the existing checkout; cloud tasks are isolated, so do not create worktrees unless requested.

## Architecture and scientific integrity

Keep statistical calculations and matching in `src/core`, data validation in `src/data`, UI in `src/components`, and preprocessing in `pipeline`. Preserve NASA provenance, units, retrieval dates and raw-response hashes. Never fabricate or silently substitute NASA observations. Synthetic fixtures belong only in explicitly labelled tests. Do not commit credentials, caches, raw downloads or large build artifacts.

Document scientific assumptions and meaningful architectural changes. Recompute fingerprints for the selected period. Distinguish similarity, significance, correlation, causation and prediction. Missing evidence must stay visible.

## Selected ECC workflows

Use the vendored ECC skills in `.agents/skills` only when relevant; they are guidance, not automatic hooks. Read the relevant SKILL.md before applying it.

- `tdd-workflow`: feature implementation, bugs and scientific calculations; demonstrate RED/GREEN using deterministic behavior tests.
- `security-review`: external responses, validation, dependencies, secrets and security reviews.
- `frontend-a11y`: interactive controls, charts, navigation and keyboard/focus review.
- `verification-loop`: final build, types, lint, tests, security and diff review; report actual results and inapplicable checks.
- `production-audit`: release readiness when an application exists and a readiness review is requested.

Project adaptations take precedence over generic ECC examples: detect actual project commands; do not run npm update/audit fix, install scanners, add hooks/MCPs, or make commits merely because an example suggests it. Keep test-stage evidence in a report rather than automatic checkpoint commits. Optional related skills are not installed. For the TDD package-manager detector, use `CLAUDE_PLUGIN_ROOT="$PWD/.agents/ecc" node .agents/ecc/scripts/setup-package-manager.js --detect` from the repository root; never use its global/project mutation flags. Skill examples are patterns, not production-ready implementations or authorization for external changes.

## Verification and delivery

For application changes run `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`. Run `.venv/bin/python -m pytest`, `.venv/bin/python -m ruff check pipeline tests`, `.venv/bin/python -m mypy pipeline`, and `.venv/bin/python -m pip check` for Python changes. CI must be independent of live NASA and paid services. Add deterministic scientific tests and UI regression tests. Review keyboard accessibility and responsive layouts in a browser where available. Report commands actually executed, failures, skipped checks and limitations. Never claim CI or browser verification without evidence.
