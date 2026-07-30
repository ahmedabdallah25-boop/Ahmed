/**
 * Geometry for both orientations — the single source of truth.
 *
 * `make-plates.mjs` builds the plates from this AND generates `src/layouts.ts` from it,
 * so the beat components animate against exactly the numbers the plates were drawn with.
 * Previously the two were mirrored by hand and nothing checked them.
 *
 * Every value is in the orientation's own pixel space. Add a field here, re-run
 * `npm run plates`, and it appears typed in src/layouts.ts.
 */

/** 16:9 — YouTube long-form. */
const landscape = {
  w: 1920,
  h: 1080,

  vault: { size: 820, ring: 880, border: 30 },
  door: { size: 780, spoke: 265, hub: 140, rings: [300, 220, 140] },
  arch: { width: 380, height: 380, top: 200 },
  grid: { cols: 10, rows: 3, cellW: 150, cellH: 250, gap: 22, inset: 10 },
  tiers: { count: 5, width0: 620, widthStep: 95, top0: 110, pitch: 190, bar: 28, centerX: 620 },
  rainPeriod: 540,

  // Beat 1-2: phone in the left third, balance figure in the right two thirds.
  phone: { left: 230, top: 135, w: 400, h: 810, radius: 46, pad: 12, rows: 6, fontSize: 21 },
  phoneGlow: '22% 38% at 22% 50%',
  counter: {
    left: 900, top: 330, width: 900,
    size: 124, row: 136, wheelW: 78,
    barWidth: 760, barHeight: 10,
    labelSize: 32, heldSize: 38,
    onDark: true, // figure sits on the void, not on the phone's white screen
  },
  push: 1.06,

  // Beat 4: cascade left, chain right — no scrim needed, they don't overlap.
  chain: {
    left: 1010, right: 50, top: 0, bottom: 0,
    align: 'flex-start', justify: 'center',
    fontSize: 38, depositWidth: 168, gap: 14, scaleStep: 0.9,
    start: 40, stagger: 26, connectorIndent: 100,
    scrim: null,
  },

  // Beat 5: bottom band, all 30 squares on one row.
  tally: {
    edge: 'bottom', padding: '30px 0 96px',
    scrim: 'linear-gradient(0deg, rgba(4,8,15,.94) 0%, rgba(4,8,15,.88) 62%, transparent)',
    labelSize: 28, countSize: 104, believeSize: 34, believeHeight: 46,
    squareCols: 30, square: 24, squareGap: 9,
  },

  // Beat 6
  facade: {
    height: 740, cols: 7, colW: 78, colGap: 100, colTop: 100, colH: 480,
    entabW: 1500, entabTop: 40, entabH: 60,
    styloTop: 580, styloW: 1560, styloH: 36,
    stepsTop: 616, stepW: 1540, stepGrow: 90, stepH: 40,
  },
  crowd: { count: 40, pitch: 51, spread: 2020, head: 78, bodyW: 138, bodyH: 225, rowGap: 46, areaH: 360, bleed: 60 },
  archRim: '26% 34% at 50% 72%',

  // Beat 7: vault pushed left, the three things stacked down the right.
  vaultCam: { scale: 1.2, x: -180, y: 0 },
  crane: -80,
  blueprints: {
    scale: 0.62,
    slots: [[1480, 250], [1480, 540], [1480, 830]],
    mouth: [960, 800],
    arcLift: 140,
  },

  // Beat 8
  kicker: { top: 300, size0: 128, size1: 78, gap: 30, lowerThird: 210, wordmark: 130, wordmarkSize: 44 },
};

/** 9:16 — Shorts. Not the landscape cut cropped: every stack is re-composed. */
const vertical = {
  w: 1080,
  h: 1920,

  vault: { size: 820, ring: 880, border: 34 },
  door: { size: 780, spoke: 265, hub: 140, rings: [300, 220, 140] },
  arch: { width: 440, height: 460, top: 430 },
  grid: { cols: 5, rows: 6, cellW: 150, cellH: 250, gap: 22, inset: 10 },
  tiers: { count: 5, width0: 760, widthStep: 120, top0: 250, pitch: 320, bar: 34, centerX: 540 },
  rainPeriod: 960,

  // Beat 1-2: the tall frame stacks instead of splitting — phone up, figure under it.
  phone: { left: 280, top: 130, w: 520, h: 940, radius: 52, pad: 14, rows: 9, fontSize: 25 },
  phoneGlow: '38% 22% at 50% 27%',
  counter: {
    // Ends by ~1560 so the bottom ~18% stays clear of the Shorts title/CTA/action rail.
    left: 110, top: 1250, width: 900,
    size: 138, row: 150, wheelW: 86,
    barWidth: 860, barHeight: 12,
    labelSize: 34, heldSize: 42,
    onDark: true,
  },
  push: 1.08,

  // Beat 4: nowhere to put the chain beside the cascade, so it overlays with a scrim.
  chain: {
    left: 0, right: 0, top: 'auto', bottom: 300,
    align: 'center', justify: 'flex-end',
    fontSize: 44, depositWidth: 200, gap: 18, scaleStep: 0.88,
    start: 40, stagger: 26, connectorIndent: 0,
    scrim: 'linear-gradient(180deg, transparent, rgba(4,8,15,.90) 16%, rgba(4,8,15,.90) 84%, transparent)',
  },

  // Beat 5: top band; 30 squares won't fit on one row at this width, so 10 x 3.
  tally: {
    edge: 'top', padding: '28px 0 34px',
    scrim: 'linear-gradient(180deg, rgba(4,8,15,.92) 0%, rgba(4,8,15,.88) 70%, transparent)',
    labelSize: 30, countSize: 150, believeSize: 38, believeHeight: 50,
    squareCols: 10, square: 26, squareGap: 10,
  },

  // Beat 6
  facade: {
    height: 1240, cols: 5, colW: 84, colGap: 62, colTop: 144, colH: 700,
    entabW: 880, entabTop: 70, entabH: 74,
    styloTop: 844, styloW: 920, styloH: 40,
    stepsTop: 884, stepW: 900, stepGrow: 70, stepH: 44,
  },
  crowd: { count: 30, pitch: 79, spread: 1160, head: 104, bodyW: 186, bodyH: 330, rowGap: 96, areaH: 820, bleed: 60 },
  archRim: '46% 24% at 50% 62%',

  // Beat 7: vault pushed UP, the three things in a row along the bottom.
  vaultCam: { scale: 1.2, x: 0, y: -180 },
  crane: -60,
  blueprints: {
    // Row sits at 1430, not 1560: the bottom ~18% of a Short is covered by the title,
    // CTA and action rail, so anything load-bearing has to clear it.
    scale: 0.6,
    slots: [[230, 1430], [540, 1430], [850, 1430]],
    mouth: [540, 800],
    arcLift: 200,
  },

  // Beat 8
  kicker: { top: 700, size0: 118, size1: 84, gap: 34, lowerThird: 300, wordmark: 150, wordmarkSize: 44 },
};

export const LAYOUTS = { landscape, vertical };

/** Derived values both the generator and the components need. */
export const derive = (L) => ({
  /** vault-door.png is centred, so the hinge is the door's left edge. */
  doorHinge: { x: (L.w - L.door.size) / 2, y: L.h / 2 },
  arch: { ...L.arch, left: (L.w - L.arch.width) / 2 },
  gridOrigin: {
    left: (L.w - (L.grid.cols * L.grid.cellW + (L.grid.cols - 1) * L.grid.gap)) / 2,
    top: (L.h - (L.grid.rows * L.grid.cellH + (L.grid.rows - 1) * L.grid.gap)) / 2,
  },
  // Overwrites the raw `tiers` spec with the resolved list, so the bar height and pitch
  // are re-exported alongside it — otherwise they vanish in the spread.
  tiers: Array.from({ length: L.tiers.count }, (_, i) => ({
    width: L.tiers.width0 - i * L.tiers.widthStep,
    top: L.tiers.top0 + i * L.tiers.pitch,
    centerX: L.tiers.centerX,
  })),
  tierBar: L.tiers.bar,
  tierPitch: L.tiers.pitch,
});
