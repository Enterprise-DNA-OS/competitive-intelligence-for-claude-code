---
description: Record approval of a substantiated internal comparison point.
---
# approve-claim

Record approval of a substantiated internal comparison point.

Read CLAUDE.md and docs/cli.md. Use the operator's values in the command below. Never execute placeholder values. Resolve ambiguous names by listing candidates and asking which record was meant.

```bash
node scripts/intelligence.mjs approve-claim "<id>" --due=<YYYY-MM-DD> --actor="<operator>"
```

Read the source itself and the exact proposed claim with the operator before approval. Approval is internal and does not authorise publication. Do not approve on the basis of a URL alone.

Show the returned facts and dates. Read commands support --json. Mutations require --actor, and database mutations support --dry-run. An actor label is not authentication. Nothing sends, publishes or changes an external system. Drafts stay in drafts/.
