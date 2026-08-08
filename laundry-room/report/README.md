# Zone-by-zone report

`Laundry-Room-Zone-Report.pdf` — 10 pages, A4 landscape. Seven zones, each pairing the room as
it is now against the specific interventions proposed for that area, with the matched concept
render, the priority chip and the budget line.

| File | What it is |
|---|---|
| `Laundry-Room-Zone-Report.pdf` | The report. |
| `build_pdf.py` | Regenerates it. Paths point at the session scratchpad — repoint `SC` to `frames/` to rebuild here. |
| `frames/zone01–07.jpg` | The "current" photographs. Zones 01–04, 06, 07 are frames from `IMG_6722.mov`; zone 05 is an upright site photograph. None are retouched. |

## The five render panels are empty on purpose

Each zone page carries a dashed panel naming its matched render and the exact PNG filename. The
images could not be embedded: the session that produced this report had the image host blocked
by network policy. Drop the five PNGs into those panels, or re-run `build_pdf.py` with the files
present and an `ImageReader` call in place of the placeholder.

Render filenames and links are in [`../renders/LINKS.md`](../renders/LINKS.md).

## Zone → render mapping

| Zone | Area | Render |
|---|---|---|
| 01 | Electrical board and the document wall | 5 — Signage and standards kit |
| 02 | Fire door, exit route and second board | 1 — Hero |
| 03 | The dark store alcove | 4 — The lit store alcove |
| 04 | Main machine line | 2 — Machine line detail |
| 05 | Staging side | 3 — Trolley bays and linen staging |
| 06 | Far end and the overhead bulk tank | 1 — Hero |
| 07 | Stacked machines and rear corner | none — out of scope |
