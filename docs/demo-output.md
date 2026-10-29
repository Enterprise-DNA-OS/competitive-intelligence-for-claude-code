# Real fictional-demo command runs

Captured 29 October 2026. All company names and deals below are fictional.

## Evidence needing a review

Which competitor observations need checking?

```text
node scripts/intelligence.mjs evidence-inbox
  Competitor       Observation               Review state    Review due
  ---------------  ------------------------  --------------  ----------
  Alpine Reports   Integration announcement  unreviewed                
  Alpine Reports   Buyer interview note      unreviewed                
  Harbour Metrics  Export format changed     current         2026-11-18
  Harbour Metrics  Old package comparison    review overdue  2026-10-24
```

## Claims withheld from use

Which comparison points can we use today?

```text
node scripts/intelligence.mjs battlecard-review
  Competitor       Comparison point                 Usable today
  ---------------  -------------------------------  ------------
  Alpine Reports   Alpine setup requirements        false       
  Harbour Metrics  Harbour offers workbook exports  true        
  Harbour Metrics  Harbour package comparison       false
```

## Prepare the next deal

Which live deals have no reviewed comparison points?

```text
node scripts/intelligence.mjs deal-prep
  Deal                  Competitor       Reviewed points
  --------------------  ---------------  ---------------
  Coastal data renewal  Harbour Metrics  1              
  Southern analytics    Alpine Reports   0
```
