# Joint Audit schedule — August 2026

`Audit_Schedule_JuLY_2026_TRANSGUARD_DM.xlsx` — the `JOINT AUDIT` sheet rebuilt so each
zone's audit falls on a day the zone is actually deep-cleaned, per `Aug_2026_PPM.xlsx`.

Only the `JOINT AUDIT` sheet changed. `INSTRUCTION`, `EMAAR AUDT` and `ZONE` are untouched,
as are the zone list, auditor names, headers, merged ranges and freeze panes.

## Rules applied

- Every one of the 84 zones is marked `AU` exactly once in the month.
- No day carries more than 4 audits.
- A zone that appears in the Aug PPM is placed on one of *its own* PM dates; where a zone has
  several (a zone is cleaned row-by-row over several nights), the date chosen is the one that
  keeps the daily load most even.
- The 33 zones with no entry in the Aug PPM keep the day they already had in the July sheet.

## Zone tag mapping

Three PPM tags don't match the audit sheet's labels verbatim:

| PPM tag | Audit sheet zone | Why |
|---|---|---|
| `Z01`  | `Z1`   | "Loading Bay 02 (Fashion Parking)" — Z1 is the LB2 zone |
| `Z01A` | `Z01a` | case only |
| `E33`  | `Z33`  | both read "Cinema Parking Level 1"; the ZONE sheet lists it as E33 |

## Zones absent from the Aug PPM

These 33 are internal mall areas, which the Aug PPM (carparks, Fountain Views, Zabeel,
Promenade, loading bays) does not cover, so no PM date exists to anchor them to:

Z2–Z25, Z27, Z28, ZB10, ZB11, ZB12, ZB14, FV2, FV3, CT2

## Day-total row

Row 89 columns C–AG now all hold `=COUNTA(<col>5:<col>88)`. Previously G89 and I89 were
hardcoded `4` and AF89 was empty, so those three totals would not have tracked the new dates.

## Reproducing

```bash
python3 scripts/solve.py    # min-cost flow -> assignment.json
python3 scripts/apply.py    # writes the workbook
python3 scripts/verify.py   # re-derives the PPM truth table and checks the result
```

`verify.py` rebuilds the zone→date table straight from the PPM rather than trusting
`solve.py`, then confirms the one-mark-per-zone, 4-per-day and PM-date rules, that the other
sheets are unchanged, and that every formula evaluates to the expected number.

> LibreOffice is non-functional in the build container (it cannot open even a trivial
> workbook), so `recalc.py` could not cache formula values. The workbook is saved with
> `fullCalcOnLoad`, so Excel recalculates on open; `verify.py` evaluates each `COUNTA`/`SUM`
> directly to confirm the values Excel will produce.
