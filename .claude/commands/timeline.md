---
description: Read the recorded activity before drafting.
---
# timeline

Read the recorded activity before drafting.

Read CLAUDE.md and docs/cli.md. Use the operator's values in the command below. Never execute placeholder values. Resolve ambiguous names by listing candidates and asking which record was meant.

```bash
node scripts/intelligence.mjs timeline
```



Show the returned facts and dates. Read commands support --json. Mutations require --actor, and database mutations support --dry-run. An actor label is not authentication. Nothing sends, publishes or changes an external system. Drafts stay in drafts/.
