# A competitive intelligence desk without a front end

The weekly work is reading source observations, reviewing comparison points, preparing a deal and recording what the buyer decided. Ask for that work through Claude Code, Codex, OpenCode or Cursor. The agent runs the same deterministic CLI. No model calls or external credentials are built into it.

npm run view creates three local read-only dashboards. npm run docs creates internal battlecards, source registers and deal briefs. Change brand.json for your business name, logo path and six-digit colours. Those documents are the desk's working paperwork, not statutory forms. They remain private.

A screen can offer mobile access, offline capture, rich editing, drag and drop and collaboration. This base provides none of those. It also does not crawl competitor sites, buy external datasets, send alerts or synchronize a CRM. It is useful with your own source notes and prepared historical records. Where your business needs those services, Enterprise DNA scopes them in your version or connects the services you retain.

The default database is local PGlite. DATABASE_URL selects Postgres with remote TLS verification. Keep credentials private, restrict database access, and back up your data. Generated HTML is a readable artifact, never a public application.
