---
description: Record the operator review of a source and its reuse rights.
---
# review-evidence

Record the operator review of a source and its reuse rights.

Read CLAUDE.md and docs/cli.md. Use the operator's values in the command below. Never execute placeholder values. Resolve ambiguous names by listing candidates and asking which record was meant.

```bash
node scripts/intelligence.mjs review-evidence "<id>" --rights=public_link --due=<YYYY-MM-DD> --actor="<operator>"
```

If the record contains personal information, require an operator-set future retention review with --retention=YYYY-MM-DD. Public links do not confer permission to copy content. Record rights only after the operator confirms the basis.

Show the returned facts and dates. Read commands support --json. Mutations require --actor, and database mutations support --dry-run. An actor label is not authentication. Nothing sends, publishes or changes an external system. Drafts stay in drafts/.
