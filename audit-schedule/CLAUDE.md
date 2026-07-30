# Audit schedules — working notes

Monthly cleaning-audit schedules for Dubai Mall (TRANSGUARD DM and MARBLELIFE). Each
workbook has a Joint Audit sheet and an Emaar Audit sheet; a zone is marked `AU` on the day
it is to be audited. Source data arrives as separate uploads each month — a PPM (deep-clean
work orders) and/or the SFM team duty roster.

Scripts in `scripts/`, per-file write-ups in `README.md` (TRANSGUARD) and `MARBLELIFE.md`.

## Grid layouts — the column↔day offset differs per file

| Workbook / sheet | Zone rows | Day 1 col | Day 31 col | Row totals | Day totals row |
|---|---|---|---|---|---|
| TRANSGUARD `JOINT AUDIT ` (trailing space) | 5–88 (84 zones) | C | AG | AI | 89 |
| TRANSGUARD `EMAAR AUDT` | 5–88 (84 zones) | C | AG | AI | 89 |
| MARBLELIFE `JOINT` | 4–28 (25 zones) | B | AF | AI | 29 |
| MARBLELIFE `EMAAR` | 3–26 (24 zones) | B | AF | AI | 27 |

TRANSGUARD: `day = col - 2`. MARBLELIFE: `day = col - 1`. Columns past the last day column
(AH/AI on TRANSGUARD, AG/AH on MARBLELIFE) carry stray `31` headers — pre-existing, ignore.

## Zone tags

PPM descriptions end with the zone tag. Three don't match the audit sheets verbatim:

| PPM tag | Audit sheet zone | Why |
|---|---|---|
| `Z01`  | `Z1`   | "Loading Bay 02 (Fashion Parking)"; Z1 is the LB2 zone |
| `Z01A` | `Z01a` | case only |
| `E33`  | `Z33`  | both read "Cinema Parking Level 1"; ZONE sheet lists it as E33 |

The TRANSGUARD `ZONE` sheet uses `E30`–`E56` where the audit sheets use `Z30`–`Z54`.

MARBLELIFE `JOINT` has a **`Z26` row absent from the `ZONE` sheet and from `EMAAR`** (there is
no Z25). Decision: populate it on JOINT only. Flag it as a probable typo each time.

## Rules

Both files: one audit per zone per month **on each sheet**; a zone's Joint and Emaar audits
never share a day.

**TRANSGUARD** — max **4 audits/day**. A zone in the PPM goes on one of *its own* PM dates.
Zones absent from the PPM keep the day they held in the previous month's sheet.

**MARBLELIFE** — no PPM supplied so far; the roster is the only input. A day takes at most as
many audits (Joint + Emaar combined) as it has AM staff. Target ≥7 days between a zone's two
audits (achieved 15).

**AM shift = `MS` (08:00–17:30) and `MS.` (06:00–15:30) only.** `Mid` (11:00–20:30), `PM` and
`N` do not count — this matches the roster's own summary rows (row 17 totals MS + MS.; row 18
groups Mid + PM). Both audit sheets state "AM Shift to do the JA and EA".

## Settled decisions — do not re-litigate

- **The PPM date beats the week gap.** A ≥7-day gap between a zone's Joint and Emaar audit is
  impossible for 46 of 51 PPM-driven zones: 16 have a single PM date all month, 30 more have
  alternatives only 1–5 days away because a zone is cleaned row-by-row on consecutive nights.
  Only Z31, Z33, Z35, FV5 and FV6 have PM dates ≥7 days apart. This is a property of the PPM,
  not of the Joint Audit dates — re-doing the Joint pass cannot widen it. User chose to keep
  the real PM date and accept 1–5 day gaps for 30 zones.
- **Zones absent from the PPM are still scheduled**, not left blank.
- Deliver under the **same filename**, even though the content is the following month.
- The Aug 2026 PPM covers only carparks, Fountain Views, Zabeel, Promenade, loading bays and
  China Town. The 33 internal mall zones (Z2–Z25, Z27, Z28, ZB10–ZB12, ZB14, FV2, FV3, CT2)
  are **not in it** — verified by full-text search including hidden rows.

## Environment constraints — both cost real time to rediscover

- **LibreOffice is non-functional in this container.** It cannot open even a trivial two-cell
  workbook, so `scripts/recalc.py` from the xlsx skill always fails. Instead: save with
  `wb.calculation.fullCalcOnLoad = True` (or inject `fullCalcOnLoad="1"` into `<calcPr>`) and
  evaluate every `COUNTA`/`SUM` in Python to confirm the values Excel will show.
- **openpyxl cannot round-trip the MARBLELIFE workbook.** It silently drops
  `xl/media/image1.png`, all three `xl/drawings/*` parts (the sheet logos) and the printer
  settings. Patch the sheet XML inside the zip instead, copying every other part byte-for-byte
  (`ml_apply.py`). Doing so means dissolving the shared-formula groups in the totals rows and
  `AI` columns into plain per-cell formulas — check no follower is left pointing at a removed
  master. The TRANSGUARD workbook has no drawings and is safe to write with openpyxl.
- Always check `zipfile.namelist()` before and after saving any new workbook.

## Sheet defects already fixed (expect them again in fresh monthly files)

- TRANSGUARD `JOINT AUDIT `: G89/I89 hardcoded `4`, AF89 empty.
- TRANSGUARD `EMAAR AUDT`: AF89 hardcoded `0`, AG89 read `=AG93` (an empty row), so days 30–31
  always totalled zero.
- MARBLELIFE `JOINT`: row 29 counted `B4:B27`, one row short of the Z26 row at 28; `AI20`
  counted `C20:AG20`, missing column B; AE29/AF29 missing; stale `AU` in `AH10`.
- MARBLELIFE `EMAAR`: AE27 missing.

## Method

Assignment is a min-cost max-flow: zones → eligible days, with 4 parallel day→sink edges
carrying convex slot costs (`0, 1, 4, 9`) so audits spread before stacking. Make the real
objective (gap, PM-date proximity) outrank those slot costs, or load-balancing quietly trades
away days of separation.

Always verify with a script that **re-derives the truth table from the source upload** rather
than trusting the solver, and checks: one mark per zone, the daily cap, dates against source,
other sheets unchanged, and every formula's evaluated value.

## Workflow

Branch `claude/audit-schedule-july-2026-bhjud1`. Deliver the workbook with `SendUserFile`,
commit the file plus scripts, push. Ask before choosing between materially different
readings — this user wants to be consulted and has corrected premises before.
