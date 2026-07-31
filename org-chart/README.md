# Team Allocation — Organisation & Reporting Chart

Deliverables built from the `Team_Allocation.docx` source allocation.

| File | What it is |
|---|---|
| `Team_Allocation_Org_Chart.pptx` | 4-slide PowerPoint deck (editable shapes, 16:9 widescreen) |
| `Team_Allocation_Org_Chart.pdf` | Same 4 pages as PDF |
| `build-org-chart.js` | Generator script (pptxgenjs) — edit and re-run to regenerate |

## Structure captured

**Winnie (Manager)** — own areas: FAE · District & Mall FF · LG
- Ahmed — FAE, FF Mall, FP, LB 2 & 4, Garbage Room — *providers:* Marblelife, Rezaroma
- Yadab — LG, Stores, GP, LB 3 & 1 — *providers:* Stores

**Inam (Manager)** — own areas: Zabeel · FV · CT · Mall GF · SF
- Shah — Zabeel, Zabeel Parking, External, Pest Control — *providers:* Pest Free\*
- Anjie — FV, CT, LB — *providers:* Al Qasr, Serve U
- Dauson — SF, Metro Link, FC, Cinema Parking Level 6–10, Garbage Room — *providers:* Avalon
- Lilian — GF, District, Cinema Carpark Level 1–5 — *providers:* Green Arabia

**Fatima** — ERG. Stands alone between Winnie and Inam, supported by both (shown with dashed
support links rather than a solid reporting line).

**Shared:** Transguard covers all teams on both reporting lines. Other contractors as per SOW.

\* Pest Free sits with Shah, who reports to Inam, but the source allocation lists Winnie as the
manager alongside it. Flagged on every slide — confirm which is intended.

## Regenerating

```bash
npm install pptxgenjs
node build-org-chart.js
soffice --headless --convert-to pdf Team_Allocation_Org_Chart.pptx
```
