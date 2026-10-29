---
description: Record the buyer reason for a won, lost or undecided deal.
---
# record-outcome

Record the buyer reason for a won, lost or undecided deal.

Read CLAUDE.md and docs/cli.md. Use the operator's values in the command below. Never execute placeholder values. Resolve ambiguous names by listing candidates and asking which record was meant.

```bash
node scripts/intelligence.mjs record-outcome "<deal>" --outcome=lost --reason="<buyer reason>" --date=<YYYY-MM-DD> --actor="<operator>"
```



Show the returned facts and dates. Read commands support --json. Mutations require --actor, and database mutations support --dry-run. An actor label is not authentication. Nothing sends, publishes or changes an external system. Drafts stay in drafts/.
