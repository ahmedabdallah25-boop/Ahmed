const pptxgen = require("pptxgenjs");

/* ---------------- palette ---------------- */
const NAVY = "1B2A4A";
const TEAL = "0F7B8A";          // Winnie branch
const TEAL_TINT = "E7F2F4";
const TERRA = "BF5A24";         // Inam branch
const TERRA_TINT = "FBEDE4";
const GOLD = "C8912A";          // service-provider accent
const GOLD_FILL = "FCF4E3";
const GOLD_TEXT = "8A5C0E";
const SLATE = "5B6B82";
const MUTED = "6E7D93";
const BORDER = "DCE3EC";
const CARD = "F7F9FC";
const WHITE = "FFFFFF";

const HEAD = "Cambria";
const BODY = "Calibri";

const sh = (o = {}) =>
  Object.assign({ type: "outer", color: "1B2A4A", blur: 8, offset: 2, angle: 90, opacity: 0.14 }, o);

const PRAYER = "All prayer rooms/washrooms";

/* ---------------- data ---------------- */
const WINNIE = { name: "Winnie", color: TEAL, tint: TEAL_TINT, areas: "LG · GF · FF" };
const INAM = {
  name: "Inam", color: TERRA, tint: TERRA_TINT,
  areas: "SF · CT · FV · Zabeel · Metro Link Bridge · Cinema Parking",
};

/* Winnie's line — Lilian moved across from Inam */
const TEAM_W = [
  {
    name: "Ahmed",
    areas: ["FAE", "Mall First Floor", "Fashion Parking", "LB 2 & 4", "Garbage Rooms", PRAYER],
    sps: ["Marblelife", "Rezaroma"],
  },
  {
    name: "Yadab",
    areas: ["LG/Promenade", "Stores", "Grand Parking", "LB 3 & 1", "Garbage rooms", PRAYER],
    sps: ["Stores", "Al Qasr"],
  },
  {
    name: "Lilian",
    areas: ["GF", "District", "Cinema Carpark L1–5", PRAYER],
    sps: ["Green Arabia"],
  },
];

/* Inam's line */
const TEAM_I = [
  {
    name: "Shah",
    areas: ["Zabeel", "Zabeel Parking", "Zabeel External", "LB/Garbage room", PRAYER],
    sps: ["Pest Free"],
  },
  {
    name: "Anjie",
    areas: ["FV", "CT", "FV Parking and LB/waste collection room", PRAYER],
    sps: ["Serve U"],
  },
  {
    name: "Dauson",
    areas: ["Second Floor", "Metro Link", "SFFC", "Cinema Parking L6–10", "Waste collection room"],
    sps: ["Avalon"],
  },
];

/* Providers grouped by accountable lead: Inam's row, then Winnie's row */
const PROVIDERS = [
  { sp: "Al Qasr", person: "Yadab", lead: "Inam", cross: "Winnie's team" },
  { sp: "Serve U", person: "Anjie", lead: "Inam" },
  { sp: "Avalon", person: "Dauson", lead: "Inam" },
  { sp: "Pest Free", person: "Shah", lead: "Inam" },
  { sp: "Marblelife", person: "Ahmed", lead: "Winnie" },
  { sp: "Rezaroma", person: "Ahmed", lead: "Winnie" },
  { sp: "Stores", person: "Yadab", lead: "Winnie" },
  { sp: "Green Arabia", person: "Lilian", lead: "Winnie" },
];

const leadColor = (m) => (m === "Winnie" ? TEAL : TERRA);
const leadTint = (m) => (m === "Winnie" ? TEAL_TINT : TERRA_TINT);

/* ---------------- deck ---------------- */
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "Team Allocation";
pres.title = "Team Allocation & Reporting Structure";

function label(slide, text, x, y, w, color, size = 8) {
  slide.addText(text.toUpperCase(), {
    x, y, w, h: 0.18, fontFace: BODY, fontSize: size, bold: true,
    color, charSpacing: 1.2, margin: 0, valign: "middle",
  });
}

/* =======================================================================
   SLIDE 1 — ORG CHART
   ======================================================================= */
{
  const s = pres.addSlide();
  s.background = { color: WHITE };

  const MGR_Y = 1.48, MGR_H = 1.05, MGR_W = 2.8;
  const BUS_Y = 2.95;
  const CARD_Y = 3.35, CARD_H = 2.74, CW = 1.82;
  const XS_W = [0.5, 2.54, 4.58];
  const XS_I = [6.9, 8.94, 10.98];
  const cen = (x) => x + CW / 2;
  const WCX = 3.45, ICX = 9.85;               // group centres
  const WX = WCX - MGR_W / 2, IX = ICX - MGR_W / 2;

  function manager(m, x) {
    s.addShape(pres.ShapeType.roundRect, {
      x, y: MGR_Y, w: MGR_W, h: MGR_H, rectRadius: 0.07,
      fill: { color: m.color }, line: { width: 0 }, shadow: sh({ blur: 10, offset: 3, opacity: 0.22 }),
    });
    s.addText(m.name, {
      x: x + 0.22, y: MGR_Y + 0.1, w: MGR_W - 0.44, h: 0.42, fontFace: HEAD, fontSize: 20,
      bold: true, color: WHITE, margin: 0, valign: "middle",
    });
    s.addText(m.areas, {
      x: x + 0.22, y: MGR_Y + 0.54, w: MGR_W - 0.36, h: 0.42, fontFace: BODY, fontSize: 8,
      color: WHITE, lineSpacing: 11, margin: 0, valign: "top",
    });
  }
  manager(WINNIE, WX);
  manager(INAM, IX);

  /* Fatima — alone between the two, supported by both */
  const FW = 2.3, FX = 6.65 - FW / 2, FY = 1.6, FH = 0.8;
  s.addShape(pres.ShapeType.roundRect, {
    x: FX, y: FY, w: FW, h: FH, rectRadius: 0.07,
    fill: { color: CARD }, line: { color: SLATE, width: 1.25, dashType: "dash" },
  });
  s.addText("Fatima", {
    x: FX + 0.18, y: FY + 0.11, w: FW - 0.36, h: 0.3, fontFace: HEAD, fontSize: 15, bold: true,
    color: NAVY, align: "center", margin: 0, valign: "middle",
  });
  s.addText("ERG/Skyview", {
    x: FX + 0.18, y: FY + 0.43, w: FW - 0.36, h: 0.26, fontFace: BODY, fontSize: 9.5, color: SLATE,
    align: "center", margin: 0, valign: "middle",
  });
  s.addText("supported by Winnie & Inam", {
    x: FX - 0.35, y: FY + FH + 0.05, w: FW + 0.7, h: 0.22, fontFace: BODY, fontSize: 8,
    italic: true, color: MUTED, align: "center", margin: 0,
  });
  s.addShape(pres.ShapeType.line, {
    x: WX + MGR_W, y: 2.0, w: FX - (WX + MGR_W), h: 0,
    line: { color: SLATE, width: 1.25, dashType: "dash", endArrowType: "triangle" },
  });
  s.addShape(pres.ShapeType.line, {
    x: FX + FW, y: 2.0, w: IX - (FX + FW), h: 0,
    line: { color: SLATE, width: 1.25, dashType: "dash", beginArrowType: "triangle" },
  });

  /* connectors */
  function bus(color, mgrCx, xs) {
    const first = cen(xs[0]), last = cen(xs[xs.length - 1]);
    s.addShape(pres.ShapeType.line, {
      x: mgrCx, y: MGR_Y + MGR_H, w: 0, h: BUS_Y - (MGR_Y + MGR_H), line: { color, width: 1.5 },
    });
    s.addShape(pres.ShapeType.line, { x: first, y: BUS_Y, w: last - first, h: 0, line: { color, width: 1.5 } });
    xs.forEach((x) => {
      s.addShape(pres.ShapeType.line, {
        x: cen(x), y: BUS_Y, w: 0, h: CARD_Y - BUS_Y, line: { color, width: 1.5 },
      });
    });
  }
  bus(TEAL, WCX, XS_W);
  bus(TERRA, ICX, XS_I);

  /* team cards */
  function card(p, x, color) {
    s.addShape(pres.ShapeType.roundRect, {
      x, y: CARD_Y, w: CW, h: CARD_H, rectRadius: 0.07,
      fill: { color: WHITE }, line: { color: BORDER, width: 1 }, shadow: sh(),
    });
    s.addShape(pres.ShapeType.roundRect, {
      x, y: CARD_Y, w: CW, h: 0.46, rectRadius: 0.07, fill: { color }, line: { width: 0 },
    });
    s.addShape(pres.ShapeType.rect, {
      x, y: CARD_Y + 0.23, w: CW, h: 0.23, fill: { color }, line: { width: 0 },
    });
    s.addText(p.name, {
      x: x + 0.14, y: CARD_Y, w: CW - 0.28, h: 0.46, fontFace: HEAD, fontSize: 13.5, bold: true,
      color: WHITE, valign: "middle", margin: 0,
    });

    label(s, "Areas", x + 0.14, CARD_Y + 0.52, CW - 0.28, MUTED, 7);
    s.addText(p.areas.join("\n"), {
      x: x + 0.14, y: CARD_Y + 0.7, w: CW - 0.28, h: 1.05, fontFace: BODY, fontSize: 7.5,
      color: NAVY, lineSpacing: 10, margin: 0, valign: "top",
    });

    s.addShape(pres.ShapeType.line, {
      x: x + 0.14, y: CARD_Y + 1.8, w: CW - 0.28, h: 0, line: { color: BORDER, width: 0.75 },
    });
    label(s, "Service providers", x + 0.14, CARD_Y + 1.86, CW - 0.28, GOLD_TEXT, 6.5);
    p.sps.forEach((spName, i) => {
      const cy = CARD_Y + 2.05 + i * 0.32;
      s.addShape(pres.ShapeType.roundRect, {
        x: x + 0.14, y: cy, w: CW - 0.28, h: 0.27, rectRadius: 0.06,
        fill: { color: GOLD_FILL }, line: { color: GOLD, width: 0.75 },
      });
      s.addShape(pres.ShapeType.ellipse, {
        x: x + 0.23, y: cy + 0.105, w: 0.06, h: 0.06, fill: { color: GOLD }, line: { width: 0 },
      });
      s.addText(spName, {
        x: x + 0.32, y: cy, w: CW - 0.46, h: 0.27, fontFace: BODY, fontSize: 8, bold: true,
        color: GOLD_TEXT, valign: "middle", margin: 0,
      });
    });
  }
  TEAM_W.forEach((p, i) => card(p, XS_W[i], TEAL));
  TEAM_I.forEach((p, i) => card(p, XS_I[i], TERRA));

  s.addNotes("Winnie: Ahmed, Yadab, Lilian. Inam: Shah, Anjie, Dauson. Fatima (ERG/Skyview) stands alone between the two and draws support from both. Gold chips mark the service providers each person runs.");
}

/* =======================================================================
   SLIDE 2 — SERVICE PROVIDERS
   ======================================================================= */
{
  const s = pres.addSlide();
  s.background = { color: WHITE };

  s.addText("Service Providers & Accountability", {
    x: 0.5, y: 0.32, w: 9, h: 0.5, fontFace: HEAD, fontSize: 27, bold: true, color: NAVY, margin: 0,
  });

  s.addShape(pres.ShapeType.roundRect, {
    x: 0.5, y: 1.42, w: 12.3, h: 1.05, rectRadius: 0.08,
    fill: { color: NAVY }, line: { width: 0 }, shadow: sh({ blur: 10, offset: 3, opacity: 0.2 }),
  });
  s.addShape(pres.ShapeType.ellipse, {
    x: 0.86, y: 1.79, w: 0.3, h: 0.3, fill: { color: GOLD }, line: { width: 0 },
  });
  s.addText("Transguard", {
    x: 1.32, y: 1.58, w: 3, h: 0.42, fontFace: HEAD, fontSize: 20, bold: true, color: WHITE,
    valign: "middle", margin: 0,
  });
  s.addText("Shared across all teams", {
    x: 1.32, y: 1.99, w: 4.6, h: 0.28, fontFace: BODY, fontSize: 10, color: "AFBCCE",
    valign: "middle", margin: 0,
  });
  s.addText("ALL TEAM  —  BOTH REPORTING LINES", {
    x: 7.2, y: 1.42, w: 5.3, h: 1.05, fontFace: BODY, fontSize: 11, bold: true, color: GOLD,
    charSpacing: 1.4, align: "right", valign: "middle", margin: 0,
  });

  const GX = [0.5, 3.65, 6.8, 9.95], GW = 2.85;
  const GY = [2.82, 4.32], GH = 1.34;
  PROVIDERS.forEach((p, i) => {
    const x = GX[i % 4], y = GY[Math.floor(i / 4)];
    const col = leadColor(p.lead);
    s.addShape(pres.ShapeType.roundRect, {
      x, y, w: GW, h: GH, rectRadius: 0.07,
      fill: { color: WHITE }, line: { color: BORDER, width: 1 }, shadow: sh(),
    });
    s.addShape(pres.ShapeType.ellipse, {
      x: x + 0.22, y: y + 0.26, w: 0.16, h: 0.16, fill: { color: GOLD }, line: { width: 0 },
    });
    s.addText(p.sp, {
      x: x + 0.48, y: y + 0.16, w: GW - (p.cross ? 1.55 : 0.7), h: 0.36, fontFace: HEAD,
      fontSize: 14, bold: true, color: NAVY, valign: "middle", margin: 0,
    });
    if (p.cross) {
      s.addShape(pres.ShapeType.roundRect, {
        x: x + GW - 1.07, y: y + 0.22, w: 0.85, h: 0.24, rectRadius: 0.05,
        fill: { color: GOLD_FILL }, line: { color: GOLD, width: 0.75 },
      });
      s.addText("CROSS-LINE", {
        x: x + GW - 1.07, y: y + 0.22, w: 0.85, h: 0.24, fontFace: BODY, fontSize: 6,
        bold: true, color: GOLD_TEXT, charSpacing: 0.4, align: "center", valign: "middle", margin: 0,
      });
    }
    s.addShape(pres.ShapeType.line, {
      x: x + 0.22, y: y + 0.6, w: GW - 0.44, h: 0, line: { color: BORDER, width: 0.75 },
    });
    s.addText(
      [
        { text: p.person, options: { color: NAVY, fontSize: 11, bold: true } },
        ...(p.cross ? [{ text: "   (" + p.cross + ")", options: { color: MUTED, fontSize: 8.5 } }] : []),
      ],
      { x: x + 0.22, y: y + 0.66, w: GW - 0.44, h: 0.28, fontFace: BODY, valign: "middle", margin: 0 }
    );
    s.addText("Lead", {
      x: x + 0.22, y: y + 0.96, w: 0.75, h: 0.28, fontFace: BODY, fontSize: 8.5, color: MUTED,
      valign: "middle", margin: 0,
    });
    s.addShape(pres.ShapeType.roundRect, {
      x: x + 1.0, y: y + 0.98, w: 0.92, h: 0.26, rectRadius: 0.06,
      fill: { color: leadTint(p.lead) }, line: { color: col, width: 0.75 },
    });
    s.addText(p.lead, {
      x: x + 1.0, y: y + 0.98, w: 0.92, h: 0.26, fontFace: BODY, fontSize: 8.5, bold: true,
      color: col, align: "center", valign: "middle", margin: 0,
    });
  });

  s.addShape(pres.ShapeType.roundRect, {
    x: 0.5, y: 6.02, w: 12.3, h: 0.6, rectRadius: 0.07,
    fill: { color: CARD }, line: { color: BORDER, width: 1 },
  });
  s.addText(
    [
      { text: "Other contractors", options: { bold: true, color: NAVY } },
      { text: "  —  engaged and managed as per SOW.", options: { color: MUTED } },
    ],
    { x: 0.78, y: 6.02, w: 11.7, h: 0.6, fontFace: BODY, fontSize: 10.5, valign: "middle", margin: 0 }
  );

  s.addNotes("Top row sits under Inam, bottom row under Winnie. Al Qasr is cross-line: run by Yadab on Winnie's team, with Inam as lead.");
}

pres.writeFile({ fileName: "Team_Allocation_Org_Chart.pptx" }).then((f) => console.log("wrote", f));
