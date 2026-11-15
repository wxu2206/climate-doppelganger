# Selected Everything Claude Code skills

Source: https://github.com/affaan-m/ECC, commit `d2ef2680594f9a17526a6e1a2e18b3d242c5d17b`.
`manifest.json` records original paths and SHA-256 hashes. Skill text is copied unchanged from canonical `skills/`; existing official Codex interface metadata is retained for security-review, tdd-workflow and verification-loop. The other two skills use standard SKILL.md metadata plus small locally authored Codex interface labels. The package.json here is a local CommonJS compatibility boundary for upstream helper scripts inside this ESM project; it is not another ECC installation. The complete security-review support document is retained. MIT notices are in LICENSE here; the application's root license is unchanged.

ECC currently documents native `codex plugin marketplace add affaan-m/ECC` and `codex plugin add ecc@ecc`. This cloud image has CLI 0.167.0-alpha.4 with those commands, but its active Codex home is read-only and its remote catalog request failed. No native installation was attempted and no global Codex configuration was changed. This repository uses only the local skills fallback, without hooks, MCP servers, native plugin, legacy sync or global tools.

The small `scripts/` subtree is the transitive local dependency closure of ECC's TDD package-manager detector. Only `--detect` is intended; use the command in root AGENTS.md. No additional runtime packages are required for it.

Recognition was verified using Codex app-server `skills/list` with this repository as cwd and `forceReload: true`: all five skills were enabled with scope `repo` and no errors. A temporary isolated CODEX_HOME was required because the image's normal home cannot create the app-server SQLite state. This verifies the installed CLI's discovery, not hot-reloading the current hosted conversation. Start a new Codex task/session if its skill menu is stale; AGENTS.md links the files for direct reading.

Invoke explicitly with `$security-review`, `$tdd-workflow`, etc., or let Codex select a relevant workflow. These are instructions, not enforced CI checks, Claude slash commands or hook execution. Cloud network policy and permissions still apply. See root AGENTS.md for project-specific adaptations.

To update, review a single official ECC revision, replace these selected files and necessary supports, refresh manifest hashes, recheck discovery and diff. Do not layer a native ECC installation over this copy; remove the local layer first if deliberately migrating.
