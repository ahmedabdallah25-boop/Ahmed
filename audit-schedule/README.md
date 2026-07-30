# Audit schedule — August 2026

`Audit_Schedule_JuLY_2026_TRANSGUARD_DM.xlsx` — the `JOINT AUDIT` and `EMAAR AUDT` sheets
rebuilt from `Aug_2026_PPM.xlsx`, so audits fall on days the zone is actually deep-cleaned.

`INSTRUCTION` and `ZONE` are untouched. On both audit sheets the zone list, auditor names,
headers, merged ranges and freeze panes are unchanged — only the day grid and the day-total
row were rewritten.

## Rules applied

Common to both sheets:

- Every one of the 84 zones is marked `AU` exactly once in the month.
- No day carries more than 4 audits.

`JOINT AUDIT` — a zone in the Aug PPM is placed on one of *its own* PM dates; where it has
several (a zone is cleaned row-by-row over several nights) the date chosen is the one that
keeps the daily load most even. The 33 zones absent from the PPM keep the day they had in
the July sheet.

`EMAAR AUDT` — never the same day as the Joint Audit. Where the PPM offers any Aug PM date
other than the Joint Audit's, the Emaar audit uses it, picking the one furthest from the
Joint Audit. Where the PPM offers no alternative, it falls on a free day at least 7 days
from the Joint Audit.

## The week-gap limit

A ≥7-day gap between the two audits **cannot** be met while keeping both on PPM dates. Of
the 51 PPM-driven zones:

- **16 have exactly one PM date all month** (Z1, Z01a, Z30, Z32, Z37, Z45, Z49, Z50, Z51a,
  Z52, Z53, Z54, ZB6, FV4, FV9, CT1) — there is no second PPM date to choose.
- **30 have other PM dates, but all within 1–5 days**, because a zone is cleaned on
  consecutive nights.
- **Only 5 have PM dates ≥7 days apart**: Z31, Z33, Z35, FV5, FV6.

This is a property of the PPM, not of the Joint Audit dates — those same 5 zones are the only
ones whose PM dates span ≥7 days at all, so no pairing of dates could widen the rest.

Resolution chosen: **the PPM date wins**. 35 Emaar audits sit on a real PM date; 30 of those
end up 1–5 days from the Joint Audit. The other 49 zones clear a full week. Overall 54 of 84
zones have a gap of ≥7 days; median gap 7, max 25.

One zone yields: **Z31** takes 11 Aug (gap 10) rather than 12 Aug (gap 11), because five
zones want 12 Aug and the cap is 4. Z48 and ZB7 have no other option, and Z41 and FV13 are
already under a week, so Z31 — still 10 days clear — is the one that gives way.

## Zone tag mapping

Three PPM tags don't match the audit sheets' labels verbatim:

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

Row 89 columns C–AG now all hold `=COUNTA(<col>5:<col>88)` on both sheets. Previously:

- `JOINT AUDIT` — G89 and I89 were hardcoded `4`, AF89 was empty.
- `EMAAR AUDT` — AF89 was a hardcoded `0`, and AG89 read `=AG93`, pointing at an empty row.

Those five totals would not have tracked the new dates.

## Reproducing

```bash
python3 scripts/solve.py        # JOINT AUDIT  : min-cost flow -> assignment.json
python3 scripts/apply.py        # writes the JOINT AUDIT sheet
python3 scripts/emaar_apply.py  # solves and writes the EMAAR AUDT sheet
python3 scripts/verify_both.py  # re-derives the PPM truth table and checks both sheets
```

`verify_both.py` rebuilds the zone→date table straight from the PPM rather than trusting the
solvers, then confirms the one-mark-per-zone and 4-per-day rules on both sheets, that no zone
is audited twice on one day, that every anchored Emaar audit is on a genuine PM date that is
not its Joint Audit date, that any zone not on its furthest PM date was forced off it by a
full day, that the other sheets are unchanged, and that every formula evaluates to the
expected number.

> LibreOffice is non-functional in the build container (it cannot open even a trivial
> workbook), so `recalc.py` could not cache formula values. The workbook is saved with
> `fullCalcOnLoad`, so Excel recalculates on open; `verify_both.py` evaluates each
> `COUNTA`/`SUM` directly to confirm the values Excel will produce.
