# Move the competitive records desk from Crayon

Crayon publishes an Insights API that exposes titles, summaries, dates, tagged competitors and additional source details. It does not publish an endpoint reference or a standard CSV schema on the announcement page. This importer accepts a prepared local extract of those concepts. It does not claim to consume an untouched vendor response or export every battlecard.

Source checked 29 October 2026: https://www.crayon.co/blog/insights-api

1. Have your Crayon administrator obtain an authorised extract using the documented account API and your customer success contact. Export while you still have access. This code never requests your Crayon credentials or scrapes its service.
2. Keep the original file private. Check your right to retain each item, including third-party material. Prepare one CSV row per source insight and competitor. If an insight has several competitor tags, split it and suffix the source ID with the competitor identity. Do not collapse several rivals into a single name.
3. Map your columns to id, competitor, title, summary, source_url, date, kind. id is a stable source identity. date is YYYY-MM-DD. kind is pricing, product, review, call, news or other. A --map=path.json file maps these canonical names to your actual headings. A JSON array of the same prepared records also works. examples/crayon.csv is synthetic and is not an original vendor export.
4. Run the import once with --dry-run. Check the counts and review any error. Run the same command without --dry-run after checking the mapping.

```bash
node scripts/intelligence.mjs import crayon imports/insights.csv --owner="Research lead" --actor="Operator" --dry-run
```

The whole import is one transaction. An identical source ID and record is skipped. A changed record with the same source ID stops the import for reconciliation. Duplicate IDs in one file are rejected. Every input column is kept in raw. Unknown kinds, malformed dates, missing source URLs and future observations fail before writing. New competitors are created with the named owner. No imported source is automatically approved and all imported records require a personal-information review.

One prepared file imports in one command. Preparing and checking the first extract is a separate migration step. Check source counts, all competitor tags, missing attachments and the earliest/latest observation dates before relying on the result. Work through /evidence-inbox and /compliance, then author comparison points from reviewed evidence. Keep both systems until those checks pass.

What is separate: raw battlecard layouts, usage analytics, CRM synchronization, notification settings, third-party feed rights, automated monitoring and attachments. Map your deals separately through add-deal and record-outcome. The free base does not acquire new competitor data or provide a search index. Enterprise DNA can scope data connections and document migration around what you are authorised to use. Do not cancel a monitoring source you still depend on.
