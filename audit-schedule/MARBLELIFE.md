# MARBLELIFE audit schedule — August 2026

`Audit_Schedule_JuLY_2026_MARBLELIFE.xlsx` — the `JOINT` and `EMAAR` sheets populated from
`SFM_TEAM_DUTY_ROSTER__Aug.xlsx`, so audits only fall on days the team is on morning duty.

`INSTRUCTION` and `ZONE` are untouched, as are the zone column, headers and merged ranges on
both audit sheets.

## Reading the roster

Both audit sheets say *"AM Shift to do the JA and EA"*, so only the morning codes count:

| Code | Hours | Counts as AM |
|---|---|---|
| `MS`  | 08:00–17:30 | yes |
| `MS.` | 06:00–15:30 | yes |
| `Mid` | 11:00–20:30 | no |
| `PM`  | 14:30–00:00 | no |
| `N`   | 21:00–06:30 | no |
| `Off` / `AL` / `PH` / `AB` / `PO` / `SL` | — | no |

This matches the roster's own summary block: row 17 totals `MS` + `MS.` as the AM line, while
row 18 groups `Mid` + `PM` as PM.

Every day in August has AM cover, ranging from 2 to 6 people. Two absences shape the month:
**Angelica is on annual leave all month** (till 30 Sep) and **Nabeela is on leave until the
16th**, which is why the first fortnight is thin.

## Rules applied

- Each zone is audited once in the month on each sheet.
- A day takes at most as many audits (Joint + Emaar combined) as it has AM staff on duty.
- A zone's Joint and Emaar audits are at least 7 days apart — every zone landed on exactly 15.
- Both passes are spread across the whole month; all 31 days carry at least one audit.

25 Joint audits (Z1–Z24 plus Z26) and 24 Emaar audits (Z1–Z24) against 98 AM person-days.

## Z26

The `JOINT` sheet has a `Z26` row that the `ZONE` sheet does not define — there is no `Z25`,
and `EMAAR` stops at `Z24`. It has been given a Joint audit (31 Aug) on the basis that the
sheet's own guideline is to cover every zone listed. It has no Emaar counterpart, so it is
the one zone with no pairing and no gap. Worth correcting at source if it is a typo.

## Days that use the full AM cover

On these dates the audits take every AM person on duty: **2, 15, 16, 22 and 30 August** — all
2-person days, mostly weekends. They satisfy the agreed cap but leave no AM slack.

## Sheet repairs

Both day-total rows were wrong before any scheduling:

- `JOINT` row 29 counted `B4:B27`, which **stops one row short of the Z26 row at 28**, so a
  Z26 audit was never counted. Now `B4:B28` across all 31 day columns, and the two missing
  cells (`AE29`, `AF29` — days 30 and 31) were added.
- `JOINT` `AI20` counted `C20:AG20`, missing column B, so a day-1 audit on Z17 would not have
  registered. Now `B20:AG20` like every other row.
- `EMAAR` row 27 was missing `AE27` (day 30).
- A stale `AU` sat in `JOINT!AH10`, outside the day grid and outside every total. Cleared.

## How the file was written

openpyxl **cannot** round-trip this workbook: it silently drops `xl/media/image1.png`, all
three `xl/drawings/*` parts (the sheet logos) and the printer settings. So the package is
copied through byte-for-byte and only `sheet2.xml` (JOINT), `sheet3.xml` (EMAAR) and
`workbook.xml` are edited in place. `ml_verify.py` confirms the other 27 parts are
bit-identical and the logo image is unchanged.

Editing the XML meant dissolving the shared-formula groups in the totals row and the `AI`
column into plain per-cell formulas; the verifier checks no follower is left pointing at a
master that no longer exists.

## Reproducing

```bash
python3 scripts/ml_solve.py    # roster -> min-cost flow -> ml_assign.json
python3 scripts/ml_apply.py    # patches the sheet XML inside the workbook
python3 scripts/ml_verify.py   # package integrity + schedule + formula checks
```

> LibreOffice is non-functional in this container, so formula values could not be cached. The
> workbook is saved with `fullCalcOnLoad`, so Excel recalculates on open; `ml_verify.py`
> evaluates each `COUNTA`/`SUM` directly to confirm the values Excel will produce.
