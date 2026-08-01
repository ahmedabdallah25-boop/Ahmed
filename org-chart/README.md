# Team Allocation — Organisation & Reporting Chart

| File | What it is |
|---|---|
| `Team_Allocation_Org_Chart.pptx` | 2-slide PowerPoint deck (editable shapes, 16:9 widescreen) |
| `Team_Allocation_Org_Chart.pdf` | Same 2 pages as PDF |
| `build-org-chart.js` | Generator script (pptxgenjs) — edit and re-run to regenerate |

Slide 1 is the org chart; slide 2 is the service-provider accountability map.

## Reporting structure

**Winnie** — oversees LG · GF · FF
- **Ahmed** — FAE, Mall First Floor, Fashion Parking, LB 2 & 4, Garbage Rooms, all prayer
  rooms/washrooms — *providers:* Marblelife, Rezaroma
- **Yadab** — LG/Promenade, Stores, Grand Parking, LB 3 & 1, Garbage rooms, all prayer
  rooms/washrooms — *providers:* Stores, Al Qasr
- **Lilian** — GF, District, Cinema Carpark L1–5, all prayer rooms/washrooms —
  *providers:* Green Arabia

**Inam** — oversees SF · CT · FV · Zabeel · Metro Link Bridge · Cinema Parking
- **Shah** — Zabeel, Zabeel Parking, Zabeel External, LB/Garbage room, all prayer
  rooms/washrooms — *providers:* Pest Free
- **Anjie** — FV, CT, FV Parking and LB/waste collection room, all prayer rooms/washrooms —
  *providers:* Serve U
- **Dauson** — Second Floor, Metro Link, SFFC, Cinema Parking L6–10, Waste collection room —
  *providers:* Avalon

**Fatima** — ERG/Skyview. Stands alone between Winnie and Inam, supported by both (dashed
support links rather than a solid reporting line).

## Service provider leads

| Provider | Run by | Lead |
|---|---|---|
| Al Qasr | Yadab *(Winnie's team)* | Inam — **cross-line** |
| Serve U | Anjie | Inam |
| Avalon | Dauson | Inam |
| Pest Free | Shah | Inam |
| Marblelife | Ahmed | Winnie |
| Rezaroma | Ahmed | Winnie |
| Stores | Yadab | Winnie |
| Green Arabia | Lilian | Winnie |

Transguard is shared across all teams on both reporting lines. Other contractors as per SOW.

Al Qasr is the only cross-line arrangement left: run day to day by Yadab on Winnie's team, with
Inam as lead. It is tagged "cross-line" on the provider card.

## Regenerating

```bash
npm install pptxgenjs
node build-org-chart.js
soffice --headless --convert-to pdf Team_Allocation_Org_Chart.pptx
```
