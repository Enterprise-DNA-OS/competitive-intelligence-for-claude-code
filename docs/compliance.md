# Evidence and personal-information checks

Checked 29 October 2026. These are limited records controls, not a certificate of compliance or a substitute for checking a claim. The database cannot establish whether a statement is true, whether use is lawful, or whether an operator is authorised to approve it.

| Check | Basis | Implemented behaviour |
|---|---|---|
| NZ-FTA-12A | NZ Fair Trading Act substantiation guidance | Flags claims without current reviewed evidence. Approval requires a matching competitor, source link, review, recorded rights and an unexpired review date. |
| AU-ACL | ACCC truthful claims guidance | The same evidence gate supports the review process. No automatic truth or legal assessment. |
| NZ-IPP9 | Privacy Act information privacy principle 9 | Personal evidence with a missing or elapsed retention review appears in compliance. Imported evidence defaults to needing this review. |
| AU-APP11 | APP 11.2, where applicable | The retention review supports deciding whether information is still needed, subject to retention exceptions. It does not delete records automatically. |
| LOCAL-RIGHTS | Local operating policy | Unknown rights block claims. public_link means reference a public source, not permission to reproduce it. |

Sources:

- https://www.comcom.govt.nz/__data/assets/pdf_file/0030/89850/Unsubstantiated-representations-Fact-sheet-July-2018.pdf
- https://www.accc.gov.au/consumers/advertising-and-promotions/false-or-misleading-claims
- https://www.privacy.org.nz/privacy-principles/9/
- https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-11-app-11-security-of-personal-information
- Crayon content ownership and use terms: https://www.crayon.co/terms

Review intervals are set by the operator, not represented as statutory deadlines. A due date only records when a person must review necessity and accuracy. Retention review includes source extracts, raw fields, drafts, activity detail and archives. If deletion or de-identification is necessary, plan it explicitly with the owner, including backups and related records. The normal CLI does not erase data.

Actor names are labels, not verified identities. The local database is for trusted operators of one business. Row security and revoked public grants block incidental public access, but the database owner bypasses row security. Do not expose it to a client portal or shared public API. Database owners can alter the schema and history. Activity is append-only through ordinary operations, not tamper-proof against an owner. Use separate authenticated access controls for a wider team.
