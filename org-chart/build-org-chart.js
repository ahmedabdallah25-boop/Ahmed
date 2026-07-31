const pptxgen = require("pptxgenjs");

/* ---------------- palette ---------------- */
const NAVY = "1B2A4A";
const NAVY_DK = "121D33";
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

/* ---------------- data ---------------- */
const WINNIE = {
  name: "Winnie",
  color: TEAL,
  tint: TEAL_TINT,
  areas: "FAE · District & Mall FF · LG",
};
const INAM = {
  name: "Inam",
  color: TERRA,
  tint: TERRA_TINT,
  areas: "Zabeel · FV · CT · Mall GF · SF",
};

const TEAM_W = [
  { name: "Ahmed", areas: ["FAE", "FF Mall", "FP", "LB 2 & 4", "Garbage Room"], sps: ["Marblelife", "Rezaroma"] },
  { name: "Yadab", areas: ["LG", "Stores", "GP", "LB 3 & 1"], sps: ["Stores"] },
];
const TEAM_I = [
  { name: "Shah", areas: ["Zabeel", "Zabeel Parking", "External", "Pest Control"], sps: ["Pest Free *"] },
  { name: "Anjie", areas: ["FV", "CT", "LB"], sps: ["Al Qasr", "Serve U"] },
  { name: "Dauson", areas: ["SF", "Metro Link", "FC", "Cinema Parking L6–10", "Garbage Room"], sps: ["Avalon"] },
  { name: "Lilian", areas: ["GF", "District", "Cinema Carpark L1–5"], sps: ["Green Arabia"] },
];

const ROSTER = [
  { name: "Ahmed", mgr: "Winnie", areas: "FAE, FF Mall, FP, LB 2 & 4, Garbage Room", sps: "Marblelife, Rezaroma" },
  { name: "Yadab", mgr: "Winnie", areas: "LG, Stores, GP, LB 3 & 1", sps: "Stores" },
  { name: "Shah", mgr: "Inam", areas: "Zabeel, Zabeel Parking, External, Pest Control", sps: "Pest Free *" },
  { name: "Anjie", mgr: "Inam", areas: "FV, CT, LB", sps: "Al Qasr, Serve U" },
  { name: "Dauson", mgr: "Inam", areas: "SF, Metro Link, FC, Cinema Parking Level 6–10, Garbage Room", sps: "Avalon" },
  { name: "Lilian", mgr: "Inam", areas: "GF, District, Cinema Carpark Level 1–5", sps: "Green Arabia" },
  { name: "Fatima", mgr: "Both", areas: "ERG", sps: "—" },
];

const PROVIDERS = [
  { sp: "Al Qasr", owner: "Anjie", mgr: "Inam" },
  { sp: "Serve U", owner: "Anjie", mgr: "Inam" },
  { sp: "Avalon", owner: "Dauson", mgr: "Inam" },
  { sp: "Green Arabia", owner: "Lilian", mgr: "Inam" },
  { sp: "Marblelife", owner: "Ahmed", mgr: "Winnie" },
  { sp: "Rezaroma", owner: "Ahmed", mgr: "Winnie" },
  { sp: "Stores", owner: "Yadab", mgr: "Winnie" },
  { sp: "Pest Free *", owner: "Shah", mgr: "Winnie", cross: true },
];

const mgrColor = (m) => (m === "Winnie" ? TEAL : m === "Inam" ? TERRA : SLATE);
const mgrTint = (m) => (m === "Winnie" ? TEAL_TINT : m === "Inam" ? TERRA_TINT : "EEF1F6");

const FOOTNOTE =
  "*  Cross-line by design: Pest Free is owned day to day by Shah (Inam's team), with Winnie holding manager oversight.";

/* ---------------- deck ---------------- */
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.author = "Team Allocation";
pres.title = "Team Allocation & Reporting Structure";

/* helpers */
function label(slide, text, x, y, w, color, size = 8) {
  slide.addText(text.toUpperCase(), {
    x, y, w, h: 0.18, fontFace: BODY, fontSize: size, bold: true,
    color, charSpacing: 1.2, margin: 0, valign: "middle",
  });
}

function spChip(slide, text, x, y, w) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h: 0.27, rectRadius: 0.06,
    fill: { color: GOLD_FILL }, line: { color: GOLD, width: 0.75 },
  });
  slide.addShape(pres.ShapeType.ellipse, {
    x: x + 0.09, y: y + 0.105, w: 0.06, h: 0.06, fill: { color: GOLD }, line: { width: 0 },
  });
  slide.addText(text, {
    x: x + 0.18, y, w: w - 0.24, h: 0.27, fontFace: BODY, fontSize: 8,
    bold: true, color: GOLD_TEXT, valign: "middle", margin: 0,
  });
}

/* =======================================================================
   SLIDE 1 — TITLE
   ======================================================================= */
{
  const s = pres.addSlide();
  s.background = { color: NAVY_DK };

  s.addShape(pres.ShapeType.ellipse, {
    x: 9.6, y: -1.9, w: 6.2, h: 6.2, fill: { color: NAVY, transparency: 35 }, line: { width: 0 },
  });
  s.addShape(pres.ShapeType.ellipse, {
    x: 11.2, y: 4.4, w: 3.4, h: 3.4, fill: { color: TEAL, transparency: 78 }, line: { width: 0 },
  });

  label(s, "Facilities Operations", 0.9, 1.55, 5, TEAL_TINT, 9);

  s.addText("Team Allocation &\nReporting Structure", {
    x: 0.85, y: 1.95, w: 8.6, h: 1.9, fontFace: HEAD, fontSize: 42, bold: true,
    color: WHITE, lineSpacing: 46, margin: 0,
  });

  s.addText("Who reports to Winnie, who reports to Inam, the areas each person owns, and the service providers sitting under them.", {
    x: 0.9, y: 3.95, w: 7.6, h: 0.7, fontFace: BODY, fontSize: 13.5, color: "AFBCCE",
    lineSpacing: 20, margin: 0,
  });

  const stats = [
    { n: "2", t: "Managers", c: TEAL_TINT },
    { n: "7", t: "Team members", c: TEAL_TINT },
    { n: "9", t: "Service providers", c: "F3DFB4" },
  ];
  stats.forEach((st, i) => {
    const x = 0.9 + i * 2.75;
    s.addText(st.n, {
      x, y: 5.15, w: 2.4, h: 0.72, fontFace: HEAD, fontSize: 40, bold: true, color: WHITE, margin: 0,
    });
    s.addText(st.t, {
      x, y: 5.87, w: 2.4, h: 0.28, fontFace: BODY, fontSize: 10.5, color: st.c,
      charSpacing: 0.6, margin: 0,
    });
  });

  s.addText("Source: Team Allocation", {
    x: 0.9, y: 6.72, w: 5, h: 0.28, fontFace: BODY, fontSize: 9.5, color: "7C8CA3", margin: 0,
  });

  s.addNotes("Overview of the two reporting lines (Winnie and Inam), Fatima's shared-support position, and the service providers assigned to each team member.");
}

/* =======================================================================
   SLIDE 2 — MASTER ORG CHART
   ======================================================================= */
{
  const s = pres.addSlide();
  s.background = { color: WHITE };

  s.addText("Organisation & Reporting Chart", {
    x: 0.5, y: 0.32, w: 7.4, h: 0.5, fontFace: HEAD, fontSize: 27, bold: true, color: NAVY, margin: 0,
  });
  s.addText("Solid line = direct report   ·   Dashed line = support relationship", {
    x: 0.5, y: 0.82, w: 7.4, h: 0.28, fontFace: BODY, fontSize: 11, color: MUTED, margin: 0,
  });

  // ---- legend (top right) ----
  const leg = [
    { c: TEAL, t: "Winnie's team" },
    { c: TERRA, t: "Inam's team" },
    { c: GOLD, t: "Service provider" },
  ];
  let lx = 8.35;
  leg.forEach((l) => {
    s.addShape(pres.ShapeType.roundRect, {
      x: lx, y: 0.47, w: 0.16, h: 0.16, rectRadius: 0.03, fill: { color: l.c }, line: { width: 0 },
    });
    s.addText(l.t, {
      x: lx + 0.24, y: 0.4, w: 1.35, h: 0.3, fontFace: BODY, fontSize: 9.5, color: NAVY,
      valign: "middle", margin: 0,
    });
    lx += 1.55;
  });

  /* ---- geometry ---- */
  const MGR_Y = 1.5, MGR_H = 1.0, MGR_W = 2.9;
  const WX = 1.45, IX = 8.95;                 // manager box x
  const WCX = WX + MGR_W / 2, ICX = IX + MGR_W / 2; // 2.90 / 10.40
  const BUS_Y = 2.95;
  const CARD_Y = 3.35, CARD_H = 2.65, CW = 1.82;
  const XS_W = [0.5, 2.54];                   // Winnie's 2 cards
  const XS_I = [4.86, 6.90, 8.94, 10.98];     // Inam's 4 cards
  const cen = (x) => x + CW / 2;

  /* manager box */
  function manager(m, x) {
    s.addShape(pres.ShapeType.roundRect, {
      x, y: MGR_Y, w: MGR_W, h: MGR_H, rectRadius: 0.07,
      fill: { color: m.color }, line: { width: 0 }, shadow: sh({ blur: 10, offset: 3, opacity: 0.22 }),
    });
    s.addText(m.name, {
      x: x + 0.22, y: MGR_Y + 0.09, w: MGR_W - 0.44, h: 0.36, fontFace: HEAD, fontSize: 20,
      bold: true, color: WHITE, margin: 0, valign: "middle",
    });
    s.addText("MANAGER", {
      x: x + 0.22, y: MGR_Y + 0.44, w: MGR_W - 0.4, h: 0.22, fontFace: BODY, fontSize: 7.5,
      bold: true, color: m.tint, charSpacing: 1.2, margin: 0, valign: "middle",
    });
    s.addText("Own areas:  " + m.areas, {
      x: x + 0.22, y: MGR_Y + 0.66, w: MGR_W - 0.36, h: 0.28, fontFace: BODY, fontSize: 7.5,
      color: WHITE, margin: 0, valign: "middle",
    });
  }
  manager(WINNIE, WX);
  manager(INAM, IX);

  /* Fatima — between the two managers, supported by both */
  const FW = 2.5, FX = 6.65 - FW / 2, FY = 1.62, FH = 0.76;
  s.addShape(pres.ShapeType.roundRect, {
    x: FX, y: FY, w: FW, h: FH, rectRadius: 0.07,
    fill: { color: CARD }, line: { color: SLATE, width: 1.25, dashType: "dash" },
  });
  s.addText("Fatima", {
    x: FX + 0.18, y: FY + 0.08, w: FW - 0.36, h: 0.3, fontFace: HEAD, fontSize: 15, bold: true,
    color: NAVY, margin: 0, valign: "middle",
  });
  s.addText("ERG", {
    x: FX + 0.18, y: FY + 0.4, w: FW - 0.36, h: 0.24, fontFace: BODY, fontSize: 9.5, color: SLATE,
    margin: 0, valign: "middle",
  });
  s.addText("Stands alone — supported by Winnie & Inam", {
    x: FX - 0.35, y: FY + FH + 0.05, w: FW + 0.7, h: 0.22, fontFace: BODY, fontSize: 8,
    italic: true, color: MUTED, align: "center", margin: 0,
  });

  // dashed support links into Fatima
  s.addShape(pres.ShapeType.line, {
    x: WX + MGR_W, y: 2.0, w: FX - (WX + MGR_W), h: 0,
    line: { color: SLATE, width: 1.25, dashType: "dash", endArrowType: "triangle" },
  });
  s.addShape(pres.ShapeType.line, {
    x: FX + FW, y: 2.0, w: IX - (FX + FW), h: 0,
    line: { color: SLATE, width: 1.25, dashType: "dash", beginArrowType: "triangle" },
  });

  /* connectors manager -> team bus */
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
    // header (rounded top, squared bottom)
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

    label(s, "Areas", x + 0.14, CARD_Y + 0.53, CW - 0.28, MUTED, 7);
    s.addText(p.areas.join("\n"), {
      x: x + 0.14, y: CARD_Y + 0.71, w: CW - 0.28, h: 0.92, fontFace: BODY, fontSize: 8,
      color: NAVY, lineSpacing: 11, margin: 0, valign: "top",
    });

    s.addShape(pres.ShapeType.line, {
      x: x + 0.14, y: CARD_Y + 1.67, w: CW - 0.28, h: 0, line: { color: BORDER, width: 0.75 },
    });
    label(s, "Service providers", x + 0.14, CARD_Y + 1.73, CW - 0.28, GOLD_TEXT, 6.5);
    p.sps.forEach((sp, i) => {
      spChip(s, sp, x + 0.14, CARD_Y + 1.93 + i * 0.32, CW - 0.28);
    });
  }
  TEAM_W.forEach((p, i) => card(p, XS_W[i], TEAL));
  TEAM_I.forEach((p, i) => card(p, XS_I[i], TERRA));

  /* shared provider band */
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.5, y: 6.2, w: 12.3, h: 0.62, rectRadius: 0.07,
    fill: { color: GOLD_FILL }, line: { color: GOLD, width: 1 },
  });
  s.addShape(pres.ShapeType.ellipse, {
    x: 0.75, y: 6.42, w: 0.18, h: 0.18, fill: { color: GOLD }, line: { width: 0 },
  });
  s.addText(
    [
      { text: "Transguard", options: { bold: true, color: GOLD_TEXT } },
      { text: "  — deployed across all teams, both reporting lines.        ", options: { color: NAVY } },
      { text: "Other contractors", options: { bold: true, color: GOLD_TEXT } },
      { text: "  — engaged as per SOW.", options: { color: NAVY } },
    ],
    { x: 1.03, y: 6.2, w: 11.6, h: 0.62, fontFace: BODY, fontSize: 10.5, valign: "middle", margin: 0 }
  );

  s.addText(FOOTNOTE, {
    x: 0.5, y: 6.94, w: 12.3, h: 0.26, fontFace: BODY, fontSize: 7.5, color: MUTED, margin: 0,
  });

  s.addNotes("Master chart. Winnie: Ahmed, Yadab. Inam: Shah, Anjie, Dauson, Lilian. Fatima (ERG) stands alone between the two and draws support from both. Gold chips mark the service providers each person owns; Transguard covers all teams.");
}

/* =======================================================================
   SLIDE 3 — ALLOCATION TABLE
   ======================================================================= */
{
  const s = pres.addSlide();
  s.background = { color: WHITE };

  s.addText("Area & Provider Allocation", {
    x: 0.5, y: 0.32, w: 8, h: 0.5, fontFace: HEAD, fontSize: 27, bold: true, color: NAVY, margin: 0,
  });
  s.addText("Every person, the areas they hold, and the providers they manage.", {
    x: 0.5, y: 0.82, w: 8, h: 0.28, fontFace: BODY, fontSize: 11, color: MUTED, margin: 0,
  });

  // manager own-area cards
  [WINNIE, INAM].forEach((m, i) => {
    const x = 0.5 + i * 6.25, w = 6.05;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 1.3, w, h: 0.66, rectRadius: 0.07, fill: { color: m.tint }, line: { color: m.color, width: 1 },
    });
    s.addText(
      [
        { text: m.name + "  ", options: { bold: true, color: m.color, fontSize: 12 } },
        { text: "own areas:  ", options: { color: MUTED, fontSize: 9.5 } },
        { text: m.areas, options: { color: NAVY, fontSize: 9.5 } },
      ],
      { x: x + 0.22, y: 1.3, w: w - 0.44, h: 0.66, fontFace: BODY, valign: "middle", margin: 0 }
    );
  });

  // table
  const C = { name: 0.62, mgr: 2.2, areas: 3.75, sp: 8.95 };
  const CW2 = { name: 1.5, mgr: 1.4, areas: 5.05, sp: 3.6 };
  const HY = 2.16;

  label(s, "Team member", C.name, HY, CW2.name, MUTED, 7.5);
  label(s, "Reports to", C.mgr, HY, CW2.mgr, MUTED, 7.5);
  label(s, "Areas of responsibility", C.areas, HY, CW2.areas, MUTED, 7.5);
  label(s, "Service providers", C.sp, HY, CW2.sp, GOLD_TEXT, 7.5);
  s.addShape(pres.ShapeType.line, {
    x: 0.5, y: 2.42, w: 12.3, h: 0, line: { color: NAVY, width: 1 },
  });

  const RY = 2.52, RH = 0.52, RG = 0.08;
  ROSTER.forEach((r, i) => {
    const y = RY + i * (RH + RG);
    const isFat = r.mgr === "Both";
    s.addShape(pres.ShapeType.roundRect, {
      x: 0.5, y, w: 12.3, h: RH, rectRadius: 0.05,
      fill: { color: isFat ? "EEF1F6" : CARD },
      line: isFat ? { color: SLATE, width: 1, dashType: "dash" } : { color: BORDER, width: 0.75 },
    });
    s.addText(r.name, {
      x: C.name, y, w: CW2.name, h: RH, fontFace: HEAD, fontSize: 12.5, bold: true, color: NAVY,
      valign: "middle", margin: 0,
    });
    // reports-to chip
    s.addShape(pres.ShapeType.roundRect, {
      x: C.mgr, y: y + 0.12, w: isFat ? 1.32 : 0.95, h: 0.28, rectRadius: 0.06,
      fill: { color: mgrTint(r.mgr) }, line: { color: mgrColor(r.mgr), width: 0.75 },
    });
    s.addText(isFat ? "Winnie + Inam" : r.mgr, {
      x: C.mgr, y: y + 0.12, w: isFat ? 1.32 : 0.95, h: 0.28, fontFace: BODY, fontSize: 8.5,
      bold: true, color: mgrColor(r.mgr), align: "center", valign: "middle", margin: 0,
    });
    s.addText(r.areas, {
      x: C.areas, y, w: CW2.areas, h: RH, fontFace: BODY, fontSize: 10, color: NAVY,
      valign: "middle", margin: 0,
    });
    if (r.sps === "—") {
      s.addText("—", {
        x: C.sp, y, w: CW2.sp, h: RH, fontFace: BODY, fontSize: 10, color: MUTED,
        valign: "middle", margin: 0,
      });
    } else {
      s.addShape(pres.ShapeType.ellipse, {
        x: C.sp, y: y + 0.24, w: 0.09, h: 0.09, fill: { color: GOLD }, line: { width: 0 },
      });
      s.addText(r.sps, {
        x: C.sp + 0.18, y, w: CW2.sp - 0.18, h: RH, fontFace: BODY, fontSize: 10, bold: true,
        color: GOLD_TEXT, valign: "middle", margin: 0,
      });
    }
  });

  s.addText(
    [
      { text: "Transguard", options: { bold: true, color: GOLD_TEXT } },
      { text: " supports every person above.  Other contractors as per SOW.", options: { color: MUTED } },
    ],
    { x: 0.62, y: 6.85, w: 6.3, h: 0.24, fontFace: BODY, fontSize: 8.5, margin: 0 }
  );
  s.addText(FOOTNOTE, {
    x: 7.1, y: 6.8, w: 5.7, h: 0.36, fontFace: BODY, fontSize: 7, color: MUTED, align: "right", margin: 0,
  });

  s.addNotes("Full allocation reference. Fatima is the only person supported by both managers.");
}

/* =======================================================================
   SLIDE 4 — SERVICE PROVIDER MAP
   ======================================================================= */
{
  const s = pres.addSlide();
  s.background = { color: WHITE };

  s.addText("Service Providers & Accountability", {
    x: 0.5, y: 0.32, w: 9, h: 0.5, fontFace: HEAD, fontSize: 27, bold: true, color: NAVY, margin: 0,
  });
  s.addText("Each provider, the team member who runs it day to day, and the manager accountable.", {
    x: 0.5, y: 0.82, w: 9, h: 0.28, fontFace: BODY, fontSize: 11, color: MUTED, margin: 0,
  });

  // Transguard feature card
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
  s.addText("Shared across the whole operation", {
    x: 1.32, y: 1.99, w: 4.6, h: 0.28, fontFace: BODY, fontSize: 10, color: "AFBCCE",
    valign: "middle", margin: 0,
  });
  s.addText("ALL TEAM  —  BOTH REPORTING LINES", {
    x: 7.2, y: 1.42, w: 5.3, h: 1.05, fontFace: BODY, fontSize: 11, bold: true, color: GOLD,
    charSpacing: 1.4, align: "right", valign: "middle", margin: 0,
  });

  // provider grid 4 x 2
  const GX = [0.5, 3.65, 6.8, 9.95], GW = 2.85;
  const GY = [2.82, 4.32], GH = 1.34;
  PROVIDERS.forEach((p, i) => {
    const x = GX[i % 4], y = GY[Math.floor(i / 4)];
    const col = mgrColor(p.mgr);
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
        { text: "Owner   ", options: { color: MUTED, fontSize: 8.5 } },
        { text: p.owner, options: { color: NAVY, fontSize: 11, bold: true } },
        ...(p.cross ? [{ text: "   (Inam's team)", options: { color: MUTED, fontSize: 8.5 } }] : []),
      ],
      { x: x + 0.22, y: y + 0.66, w: GW - 0.44, h: 0.28, fontFace: BODY, valign: "middle", margin: 0 }
    );
    s.addText("Manager", {
      x: x + 0.22, y: y + 0.96, w: 0.75, h: 0.28, fontFace: BODY, fontSize: 8.5, color: MUTED,
      valign: "middle", margin: 0,
    });
    s.addShape(pres.ShapeType.roundRect, {
      x: x + 1.0, y: y + 0.98, w: 0.92, h: 0.26, rectRadius: 0.06,
      fill: { color: mgrTint(p.mgr) }, line: { color: col, width: 0.75 },
    });
    s.addText(p.mgr, {
      x: x + 1.0, y: y + 0.98, w: 0.92, h: 0.26, fontFace: BODY, fontSize: 8.5, bold: true,
      color: col, align: "center", valign: "middle", margin: 0,
    });
  });

  // SOW band
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
  s.addText(FOOTNOTE, {
    x: 0.5, y: 6.74, w: 12.3, h: 0.26, fontFace: BODY, fontSize: 7.5, color: MUTED, margin: 0,
  });

  s.addNotes("Nine named providers. Transguard is shared across all teams; the rest sit with a single owner and manager.");
}

pres.writeFile({ fileName: "Team_Allocation_Org_Chart.pptx" }).then((f) => console.log("wrote", f));
