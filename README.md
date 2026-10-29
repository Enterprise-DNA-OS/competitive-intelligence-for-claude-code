# Competitive Intelligence for Claude Code

Know which competitor claims have evidence, which battlecards need review and what your buyers actually said. Your research, source links, comparison points and deal outcomes in a database you own. MIT licensed. Built by Enterprise DNA.

| Do it yourself | We customise it | We run it for you |
|---|---|---|
| Free. Install the base and prepare your historical records. | Your fields, review rules, reports, data mapping and connections. | Installed and operated through Omni by Enterprise DNA. One setup fee, then a retainer. |
| [Quick start](#quick-start) | [Get your version built](https://enterprisedna.co/omni/book/?offer=replace-software&utm_campaign=crayon&utm_medium=readme) | [Talk to Sam](https://enterprisedna.co/omni/book/?offer=replace-software&utm_campaign=crayon&utm_medium=readme) |

Crayon quotes pricing privately. This base replaces the curated records desk, not Crayon's proprietary monitoring feeds, search collection, CRM connections or seller engagement analytics. It runs with your existing research and prepared historical extracts. [Scope and selection evidence](docs/research.md).

## Quick start

```bash
git clone https://github.com/Enterprise-DNA-OS/competitive-intelligence-for-claude-code.git
cd competitive-intelligence-for-claude-code
npm install
npm test
npm run demo
```

Use Node 22. Tests and demo use temporary fictional data and ignore DATABASE_URL. To keep a fictional demo, run npm run migrate and npm run seed. For real work, migrate an empty private database without seeding. The shared database requires PostgreSQL 15 or later. Local PGlite stores records under .data/db. DATABASE_URL selects your own Postgres database. Keep access and backups private.

Open this folder in Claude Code, Codex, OpenCode or Cursor. All agents follow CLAUDE.md and the same 30 command recipes. The database is the product; the agent is the door. Agent subscriptions are separate and the code makes no model calls.

```bash
node scripts/intelligence.mjs evidence-inbox
node scripts/intelligence.mjs battlecard-review
node scripts/intelligence.mjs deal-prep
npm run view
npm run docs
```

Three dashboards show the week, evidence review and battlecard readiness. Three document types produce internal battlecards, source registers and deal briefs. Set your business name, logo path and colours in brand.json. /new-view adds another read-only report.

## Five weekly rituals

- /evidence-inbox: check new observations and stale sources.
- /battlecard-review: withhold claims without current evidence.
- /deal-prep: find live deals missing usable comparison points.
- /win-loss: read outcomes and buyer reasons, with currencies kept separate.
- /weekly-review: combine attention, win/loss and compliance into the Monday brief.

/compliance checks source review, reuse rights and personal-information retention exceptions. Rules cite NZ and Australian guidance in [docs/compliance.md](docs/compliance.md). /draft-battlecard, /draft-deal-brief and /draft-weekly-brief write local drafts and never send. Review intervals are your policies, not invented legal deadlines. Approval is a recorded internal review, not a legal clearance.

## Bring your history

Crayon's Insights API describes titles, summaries, observation dates and competitor tags. Obtain an authorised extract and map it to the prepared format. Its public announcement does not publish an exact endpoint or CSV schema, so this base does not claim untouched-export compatibility.

```bash
node scripts/intelligence.mjs import crayon examples/crayon.csv --owner="Research lead" --actor="Operator" --dry-run
```

After checking the dry run, omit --dry-run. Identical records skip, conflicting source IDs stop the transaction, and original columns are preserved. Imported material is unreviewed, with rights unknown and a personal-information review required. [Export, mapping and acceptance guide](docs/replace-crayon.md). A prepared file imports in one command; preparation and checking are separate work.

## Ten questions answered from your records

/insights runs each question today. These are useful joins across your own records, not an unsupported claim that Crayon cannot produce a comparable report.

1. Which live deals have no usable comparison points?
2. Which approved claims now depend on stale evidence?
3. Which observations still have unknown reuse rights?
4. Which rivals have no recorded evidence?
5. Which personal records need a retention review?
6. What reasons were recorded for losses?
7. What is the win rate excluding no-decisions?
8. Who owns overdue research?
9. Which active deals have no next review?
10. Which competitor observations are newest?

## Your first hour: ten things to ask for

1. Show new competitor observations.
2. Find approved claims whose evidence is stale.
3. Show open deals without a usable battlecard.
4. List unknown source reuse rights.
5. Show personal notes due for a retention review.
6. Record a buyer's loss reason and its real date.
7. Draft a battlecard from reviewed points.
8. Show the next research task for each owner.
9. Put our name and logo on the source register.
10. Add our comparison topic field through /customise.

## Access, evidence and verification

One private database serves one business's trusted operators. Actor labels are not authenticated identities. Row security is enabled and public privileges are revoked. Database owners bypass those controls. Activity is append-only in ordinary operations, not tamper-proof against an owner. A wider deployment needs authenticated access and an agreed retention process.

export writes a full private JSON archive. Use normal database backups and restore tests for disaster recovery. Review source extracts, raw fields, activity, drafts and archives when retaining or deleting personal information. Generated reports are local artifacts and must stay private.

npm test covers repeatable seed data, every domain command, expired evidence, claim approval, outcome rules, ambiguity, atomic imports, changed source IDs, role permissions and escaped HTML. GitHub Actions runs Node 22 on Windows and Linux. [Verification record](docs/verification.md), [CLI reference](docs/cli.md), [screen-free scope](docs/why-no-front-end.md).
