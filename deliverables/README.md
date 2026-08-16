# Money Mechanics — Week 1 deliverables

| File | What it is |
|---|---|
| `money-mechanics-week1-scripts.pdf` | Voiceover-ready scripts, one page per video. Beat-labelled, on-screen text inline, verified-sources box per script. |
| `money-mechanics-week1-scene-packs.xlsx` | Shot-by-shot production grid. Three sheets: READ ME, Week Plan (with production-tracking columns), Scene Packs (58 shots). |
| `build_scene_packs.py` | Source of truth for all script and shot data. Edit here and re-run to regenerate the workbook. |
| `build_scripts_pdf.py` | Reads the same data and builds the PDF, so the two deliverables can't drift apart. |

## Regenerating

```bash
pip install openpyxl reportlab
python3 build_scene_packs.py     # -> xlsx
python3 build_scripts_pdf.py     # -> pdf
```

## How timings work

Every shot duration is the VO word count divided by **3.0 words per second** — the measured
delivery rate of the 9.8M-view *Survivorship Bias* short (62 words in 18 seconds). Edit a VO
line in `build_scene_packs.py` and re-run; the whole grid re-flows.

Timing columns are written as computed values rather than spreadsheet formulas, so they
display correctly in every viewer without needing a recalculation pass.

## Week at a glance

| Day | Script | Runtime | Words |
|---|---|---|---|
| Mon | Wells Fargo took your biggest payment first | 33s | 98 |
| Tue | Elon Musk borrowed $12.5B instead of selling one share | 33s | 99 |
| Wed | United's loyalty programme was worth more than United | 30s | 91 |
| Thu | Banks have a word for people who pay on time | 28s | 84 |
| Fri | The 0% offer that ends in a $1,200 bill | 34s | 101 |
| Sat | Warren Buffett didn't buy insurance for the insurance | 35s | 105 |
| Sun | Toys R Us was profitable when it died | 35s | 105 |

All seven sit in the 28–36s band, well under the 180s Shorts cap — so none need a 16:9
thumbnail. Full research and sourcing: `../shorts-market-research-2026-08.md`.
