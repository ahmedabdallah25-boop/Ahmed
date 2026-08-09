# Render audit — 9 Aug 2026

Five images were returned for inspection. They are the **8 Aug 16:01 batch**, not the
9 Aug 07:51 batch generated against the measured layout. Verdicts below apply to the batch
inspected.

| # | Image | Verdict | Detail |
|---|---|---|---|
| 1 | Store alcove | **KEEP** | Shadow board with labelled tool silhouettes, PPE station, bunded chemical shelf signed NO DECANTING, framed DAILY CHECKS, mop bucket in a marked bay, resin floor with gully. The alcove is unaffected by the machine-side correction, so this render is still valid. Only quibble: the ceiling light reads as a recessed panel rather than the single batten specified. |
| 2 | Trolley bays | **SUPERSEDED** | Shows ten-plus wire trolleys. There are none in the room. Room proportions are also wrong — reads as a wide open hall, not 8.96 × 4.28 m with machines down both walls. |
| 3 | Hero room view | **SUPERSEDED** | The core error. Trolleys and bins down the left where the **three dryers** belong; washers on the right but **five or six of them, not four**; ducting drawn over the washers instead of the dryers. No dryers appear anywhere. |
| 4 | W1 / W2 detail | **FIX REQUIRED** | Machines, ID plates, tiled dado, coved trim and the yellow walkway line are all correct and usable. But the **LINT TRAP — CLEAN EVERY CYCLE bin is mounted between two washers.** Washers produce no lint. Lint bins belong between the **dryers**. Do not hand this to a contractor as a placement reference. |
| 5 | Signage kit | **KEEP, with a correction** | Flow key, four wall signs, W1/D1 plates and the floor-marking legend are all correct and usable as a print brief. The **DAILY CHECKS card text is garbled** — it contains "Flevor Removed" and repeats items. Retype the checklist before printing; treat the card as layout only. |

## Actions

- Use 1 and 5. Discard 2 and 3 — superseded by the 9 Aug batch.
- Item 4: regenerate with the lint bin between dryers, or crop the bin out and keep the rest.
- The 9 Aug batch (3 dryers left, 4 washers right, rigid duct, no trolleys) is still
  **unaudited** — the image host is blocked from this session, so it has not been inspected.

---

## Wall service station render — audited 9 Aug

Overall the strongest image in any batch: one aligned run, correct floor and skirting, batten
lighting, yellow hazard hatching on the floor at the extinguisher, framed DAILY CHECKS board,
PPE station and a bunded chemical shelf signed NO DECANTING. Usable as a fit-out reference.

Three defects:

| Defect | Severity | Action |
|---|---|---|
| **Shadow board labels do not match the silhouettes.** BROOM appears twice, LINT BRUSH appears twice, and there are two dustpan outlines but one DUSTPAN label. A shadow board's entire function is one tool, one outline, one label — duplicated labels defeat it. | **Fix before printing** | Retype the board artwork: broom, dustpan, rubber squeegee, lint brush — one each. |
| **Extinguisher looks like water or foam** (plain red body, no black CO₂ band). The room has two distribution boards and this station sits near them. | **Spec error** | Specify **CO₂** for electrical risk. Confirm against the site's fire assessment. |
| **No eyewash station.** The plan calls for eyewash within reach of the chemical store; the render omits it. | Omission | Add to the run when specifying. |

Minor: silhouettes are drawn as outlines rather than solid black — solid reads better at a
glance when a tool is missing. Chemical containers show coloured caps but no legible labels.

---

## Batch audit — 9 Aug, five images returned

Root cause of the mismatch: **room proportion.** The room is a narrow corridor, 8.96 x 4.28 m
with only **2.11 m between machine fronts**. Three renders drew a wide open hall with floor
area that does not exist. The two close-ups escaped the problem and are correct.

| Image | Verdict | Detail |
|---|---|---|
| Washer line W1–W4 | **CORRECT — keep** | Four washers, correct plates, stainless tops, red e-stops, tiled dado, yellow floor line. Accurate. |
| Dryer line D1–D3 | **CORRECT — keep** | Three dryers, correct plates, and the ducting is right: rigid rectangular header with short rigid drops into each machine. Only fault: two lint bins for three dryers — should be three. |
| Hero room view | **WRONG** | Room far too wide. **Five washers drawn, not four.** Drops read as flexible spiral and connect to no visible header. |
| Soiled receiving | **WRONG proportion, good content** | Tank, two red bays, fire exit and hazard hatching all correct, but the space reads as a wide hall. Tank mounted at mid-height rather than high in the corner. Some floor text mirrored. |
| Clean staging | **WRONG** | Room far too wide and open. Shows a **second doorway** — there is only one. |

## Regenerated 9 Aug 08:01

Four replacements with the corridor geometry stated as a hard constraint: walls 4.3 m apart,
machine fronts 2.1 m apart, machines filling both frame edges, no open floor beyond the
walkway. Washer and dryer close-ups were **not** regenerated — they were already correct.

Still unverified: the image host is blocked from this session, so the replacements were
specified but not inspected.

---

## Corridor batch audit — 9 Aug 08:01, four returned

Compared directly against the site top-view photograph.

| Image | Verdict | Detail |
|---|---|---|
| Hero from the doorway | **PASS on geometry, one miss** | Corridor proportion finally correct — machines crowd both frame edges, narrow floor strip between. 3 dryers left, 4 washers right, yellow lines, dado and ceiling all right. **But the dryers have no ducting at all** — no header, no drops. |
| Reverse view toward the door | **BEST OF THE SET** | Correct corridor. Rigid ducting rising to a header on the dryer side, white bulk tank on the wall, grey door with green FIRE EXIT sign, red/white hatching on the floor. Closely matches the real room's far end. Machine count on the right reads as five or six rather than three. |
| Wide machine view | **FAIL** | Reverted to the wide-hall error — blank distant far wall, floor opening out. Discard. |
| Clean staging | **FAIL** | Still too wide, and it invented a **second doorway** again. Discard. |

## Regenerated 9 Aug 08:08 — matched to the site photograph

Three images, the hero now shot from the **same elevated viewpoint as the site top-view photo**
so it pairs directly with it as a before/after. Clean staging and soiled receiving regenerated
with the single-door constraint stated explicitly.

Not inspected — image host blocked from this session.
