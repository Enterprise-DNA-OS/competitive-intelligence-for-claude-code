---
description: Prepare the Monday evidence, deal and compliance review.
---
# weekly-review

Prepare the Monday evidence, deal and compliance review.

Read CLAUDE.md and docs/cli.md. Use the operator's values in the command below. Never execute placeholder values. Resolve ambiguous names by listing candidates and asking which record was meant.

```bash
node scripts/intelligence.mjs weekly-review
```

The command combines attention, win-loss and compliance. State what is overdue, what the evidence supports, and who owns each next step. Do not add currencies or infer causal revenue impact.

Show the returned facts and dates. Read commands support --json. Mutations require --actor, and database mutations support --dry-run. An actor label is not authentication. Nothing sends, publishes or changes an external system. Drafts stay in drafts/.
