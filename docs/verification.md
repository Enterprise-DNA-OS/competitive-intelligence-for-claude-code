# Verification

The smoke suite uses a new temporary PGlite database on every run. Ordinary runs blank DATABASE_URL so test data cannot reach a configured remote database. A separate CI job supplies an explicit TEST_POSTGRES_URL for a fresh PostgreSQL 16 service. The suite only accepts that option in CI, on localhost, with the database named ci_test. It ignores ordinary database settings. It exercises migrations twice, seed twice, all domain operations, ten analytical questions, stale evidence, claim approval, source-rights and retention rules, separate currency totals, ambiguous names, invalid dates, imports, rollback, exports, HTML escaping and restricted database roles.

The CLI and HTML renderers are executed as child processes after closing the embedded database handle. GitHub Actions runs npm ci, npm test and npm run demo on Node 22 under Windows and Linux. Local execution is Linux. See the GitHub check for hosted Windows status. The dedicated Postgres service is ephemeral. No live Crayon account or business database is used, and no vendor response schema is claimed verified.

## Run recorded 29 October 2026

Local Linux npm test: PASS. npm run demo: PASS. Three real command outputs captured in docs/demo-output.md. Read-only reports and the comparison page were inspected in a headless browser at desktop and mobile widths. The page passed its source and rendered-HTML gate.

The first hosted run did not execute any steps. GitHub reported that recent account payments failed or the spending limit needed increasing. Windows, hosted Linux and PostgreSQL checks remain unexecuted for that reason. Do not describe those checks as passed. Run: https://github.com/Enterprise-DNA-OS/competitive-intelligence-for-claude-code/actions/runs/40967783242
