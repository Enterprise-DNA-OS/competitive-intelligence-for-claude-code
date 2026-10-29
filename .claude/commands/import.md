---
description: Import a prepared local Crayon insights extract.
---
# import

Import a prepared local Crayon insights extract.

Read CLAUDE.md and docs/cli.md. Use the operator's values in the command below. Never execute placeholder values. Resolve ambiguous names by listing candidates and asking which record was meant.

```bash
node scripts/intelligence.mjs import crayon "<file.csv>" --owner="<owner>" --actor="<operator>" --dry-run
```

Read docs/replace-crayon.md first. This accepts a prepared extract, not an undocumented vendor response. Run the dry run and compare counts, source IDs and source links. Only then run without --dry-run. Imported records remain unreviewed.

Show the returned facts and dates. Read commands support --json. Mutations require --actor, and database mutations support --dry-run. An actor label is not authentication. Nothing sends, publishes or changes an external system. Drafts stay in drafts/.
