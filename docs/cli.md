# Command reference

Use Node 22. Run npm run migrate first. All reads accept --json. Evidence inbox, battlecard review and deal preparation show a compact human summary by default. Use --json for every field and full IDs. Names match case-insensitively, IDs accept a prefix, and ambiguous matches list candidates and exit 1. Options use --name=value, not a space. Quote values with spaces.

Database mutations require --actor. Use --dry-run to run the same validation and roll back the transaction. Draft and export commands only write local private files.

### evidence-inbox

Review new and stale competitor observations.

```bash
node scripts/intelligence.mjs evidence-inbox
```

### battlecard-review

Find claims whose evidence is missing or expired.

```bash
node scripts/intelligence.mjs battlecard-review
```

### win-loss

Review won, lost and undecided deals separately by currency.

```bash
node scripts/intelligence.mjs win-loss
```

### deal-prep

Find open deals with no current comparison points.

```bash
node scripts/intelligence.mjs deal-prep
```

### research-queue

Assign the next competitor research work.

```bash
node scripts/intelligence.mjs research-queue
```

### attention

Show overdue research, evidence, claims and deal reviews.

```bash
node scripts/intelligence.mjs attention
```

### competitors

List competitors, owners and websites.

```bash
node scripts/intelligence.mjs competitors
```

### battlecard

Read the current points and withheld claims for a competitor.

```bash
node scripts/intelligence.mjs battlecard "<competitor>"
```

### timeline

Read the recorded activity before drafting.

```bash
node scripts/intelligence.mjs timeline
```

### compliance

Check source, review, reuse and retention exceptions.

```bash
node scripts/intelligence.mjs compliance
```

### insights

Answer ten questions across evidence and deals.

```bash
node scripts/intelligence.mjs insights
```

### weekly-review

Prepare the Monday evidence, deal and compliance review.

```bash
node scripts/intelligence.mjs weekly-review
```

### add-competitor

Register a competitor with an owner.

```bash
node scripts/intelligence.mjs add-competitor --name="<name>" --owner="<owner>" --website="<https URL>" --actor="<operator>"
```

### add-evidence

Record a source observation without claiming it is verified.

```bash
node scripts/intelligence.mjs add-evidence --competitor="<name>" --title="<title>" --summary="<summary>" --source="<https URL>" --date=<YYYY-MM-DD> --kind=product --actor="<operator>"
```

### review-evidence

Record the operator review of a source and its reuse rights.

```bash
node scripts/intelligence.mjs review-evidence "<id>" --rights=public_link --due=<YYYY-MM-DD> --actor="<operator>"
```

### add-claim

Create a draft comparison point linked to evidence.

```bash
node scripts/intelligence.mjs add-claim --competitor="<name>" --evidence="<id>" --statement="<claim>" --response="<response>" --actor="<operator>"
```

### approve-claim

Record approval of a substantiated internal comparison point.

```bash
node scripts/intelligence.mjs approve-claim "<id>" --due=<YYYY-MM-DD> --actor="<operator>"
```

### retire-claim

Withhold a comparison point from future briefs.

```bash
node scripts/intelligence.mjs retire-claim "<id>" --actor="<operator>"
```

### add-deal

Record a competitive deal and its next review.

```bash
node scripts/intelligence.mjs add-deal --competitor="<name>" --name="<deal>" --owner="<owner>" --cents=<integer> --currency=NZD --due=<YYYY-MM-DD> --actor="<operator>"
```

### record-outcome

Record the buyer reason for a won, lost or undecided deal.

```bash
node scripts/intelligence.mjs record-outcome "<deal>" --outcome=lost --reason="<buyer reason>" --date=<YYYY-MM-DD> --actor="<operator>"
```

### add-task

Assign competitor research with a due date.

```bash
node scripts/intelligence.mjs add-task --competitor="<name>" --name="<task>" --owner="<owner>" --due=<YYYY-MM-DD> --actor="<operator>"
```

### complete-task

Record completion of a research task.

```bash
node scripts/intelligence.mjs complete-task "<id>" --actor="<operator>"
```

### log

Record a note against the competitor.

```bash
node scripts/intelligence.mjs log --competitor="<name>" --note="<note>" --actor="<operator>"
```

### import

Import a prepared local Crayon insights extract.

```bash
node scripts/intelligence.mjs import crayon "<file.csv>" --owner="<owner>" --actor="<operator>" --dry-run
```

### export

Write a full private JSON record archive.

```bash
node scripts/intelligence.mjs export
```

### draft-battlecard

Draft a battlecard using current reviewed points only.

```bash
node scripts/intelligence.mjs draft-battlecard "<competitor>"
```

### draft-deal-brief

Draft a deal brief with the recorded context and current points.

```bash
node scripts/intelligence.mjs draft-deal-brief "<deal>"
```

### draft-weekly-brief

Draft an internal weekly competitive review.

```bash
node scripts/intelligence.mjs draft-weekly-brief
```

Evidence kinds: pricing, product, review, call, news, other. Add --personal to add-evidence for personal information. Evidence review requires rights=owned, licensed or public_link and a review due date. Personal records also require --retention. Dates use YYYY-MM-DD. Claims cannot outlast their evidence review. Retiring a claim does not erase it.

Deal amounts use integer cents and a three-letter currency. Closed outcomes require a reason and a non-future date. They cannot be overwritten by record-outcome. Win rate is wins divided by wins plus losses. No-decision records remain visible and are excluded from that denominator. Nothing converts currencies or claims attribution.

Exports hold full records, raw imports and activity, not a database restore bundle. Use private database backups for recovery. Raw imports can contain personal information. Review retention for the raw record and its archives too.
