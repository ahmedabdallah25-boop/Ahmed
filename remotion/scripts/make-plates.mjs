/**
 * Renders the Part 15 plates as layered 1920x1080 PNGs.
 *
 * Landscape, not portrait: the compositions are laid out for a wide frame, not scaled
 * from a vertical original. Several beats use the extra width structurally — the phone
 * sits left of its balance figure, the lending cascade occupies the left half with the
 * multiplier chain beside it rather than on top of it.
 *
 * Layers are deliberately separate files: the Remotion beat components animate the
 * vault door, shutter, blueprints and coins independently of their backgrounds, so a
 * single flattened still would be unusable. Transparent layers are marked alpha:true.
 *
 *   npm run plates
 *
 * Output: remotion/public/plates/*.png
 */
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/plates');
const W = 1920;
const H = 1080;

// Series palette. Keep these in sync with src/theme.ts and the HyperFrames overlays.
const GOLD = '#D4A24C';
const TEAL = '#3E8E8C';
const NAVY = '#0B1A2E';

/**
 * Shared geometry. Anything the Remotion beats also need to know is duplicated in
 * src/theme.ts under LAYOUT — change both together, they are checked against each other
 * only by eye.
 */
const VAULT = { size: 820, ring: 880, cx: 960, cy: 540 };
const DOOR = 780; // hinge ends up at x = (W - DOOR) / 2
const ARCH = { width: 380, height: 380, top: 200 }; // doorway in bank-run
const GRID = { cols: 10, rows: 3, cell: [150, 250], gap: 22 };
const RAIN_PERIOD = 540;

const base = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:100vw; height:100vh; overflow:hidden; font-family:ui-sans-serif,system-ui,sans-serif; }
  .stage { position:absolute; inset:0; }
  .void {
    background:
      radial-gradient(90% 110% at 50% 14%, #16304f 0%, ${NAVY} 44%, #04080f 78%, #000 100%);
  }
  /* volumetric haze + gold key from upper right */
  .haze { background: radial-gradient(44% 60% at 80% 20%, rgba(212,162,76,.20), transparent 70%); }
  .rim  { background: radial-gradient(38% 55% at 10% 78%, rgba(62,142,140,.16), transparent 72%); }
  .grain { opacity:.055; mix-blend-mode:overlay; background-image:
      repeating-conic-gradient(#fff 0% 25%, #000 0% 50%); background-size:3px 3px; }
  .vig { box-shadow: inset 0 0 320px 120px rgba(0,0,0,.85); }
  .floor { position:absolute; left:0; right:0; bottom:0; height:40%;
    background:linear-gradient(180deg, transparent, rgba(255,255,255,.045) 40%, rgba(0,0,0,.6));
    transform:perspective(900px) rotateX(64deg); transform-origin:bottom; }
`;

/** Wrap plate markup in the shared lighting stack. */
const scene = (inner, { alpha = false } = {}) => `<style>${base}</style>
  ${alpha ? '' : '<div class="stage void"></div><div class="stage haze"></div><div class="stage rim"></div>'}
  ${inner}
  ${alpha ? '' : '<div class="stage grain"></div><div class="stage vig"></div>'}`;

/**
 * Deterministic PRNG (mulberry32). Plain `i * k % n` scatters band into visible
 * diagonal stripes, so anything placed "randomly" here goes through this instead.
 * Same seed => same plate on every run, which keeps the render reproducible.
 */
const rng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** A gold coin, edge-lit. size in px. */
const coin = (size, opacity = 1) => `
  <div style="width:${size}px;height:${size}px;border-radius:50%;opacity:${opacity};
    background:radial-gradient(circle at 34% 28%, #ffe9b0, ${GOLD} 46%, #8a5f1d 78%, #4a3210);
    box-shadow:0 0 ${size * 0.5}px rgba(212,162,76,.55), inset 0 -${size * 0.08}px ${size * 0.12}px rgba(0,0,0,.45);"></div>`;

/** The steel ring that frames the vault mouth — shared by empty-vault and real-assets. */
const vaultRing = () => `
  <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
      width:${VAULT.ring}px;height:${VAULT.ring}px;border-radius:50%;
      border:30px solid transparent;
      background:linear-gradient(140deg,#6b7686,#20262f 45%,#8a95a4) border-box;
      -webkit-mask:linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0);
      -webkit-mask-composite:xor; mask-composite:exclude;
      box-shadow:0 0 80px rgba(0,0,0,.8);"></div>`;

/** Wireframe blueprint as transparent SVG paths, drawn centred in the frame. */
const blueprint = (paths) => scene(
  `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
     <g fill="none" stroke="${TEAL}" stroke-width="4" stroke-linejoin="round"
        style="filter:drop-shadow(0 0 14px rgba(62,142,140,.85))">${paths}</g>
   </svg>`, { alpha: true });

const plates = {
  // ---- Beat 1-2 -----------------------------------------------------------
  // Phone sits in the LEFT third. The balance figure is an overlay in the right two
  // thirds, so the screen shows the statement only — no blank field to fill.
  'phone-balance': scene(`
    <div class="floor"></div>
    <div style="position:absolute;left:230px;top:135px;
        width:400px;height:810px;border-radius:46px;padding:12px;
        background:linear-gradient(160deg,#3a4453,#0d1118 55%,#242c38);
        box-shadow:0 50px 100px rgba(0,0,0,.75), 0 0 90px rgba(120,170,255,.10);">
      <div style="width:100%;height:100%;border-radius:36px;overflow:hidden;
          background:linear-gradient(180deg,#f7fbff,#dbe7f5);
          box-shadow:inset 0 0 60px rgba(90,130,190,.35);">
        <div style="padding:44px 34px 26px;color:#8b9bb2;font-size:21px;letter-spacing:.18em;">RECENT</div>
        <div style="margin:0 34px 6px;height:2px;background:#c3d2e4"></div>
        ${[['Deposit', '+ 1,200.00'], ['Card', '- 84.10'], ['Transfer', '- 320.00'],
    ['Deposit', '+ 640.00'], ['Card', '- 26.40'], ['Standing order', '- 910.00']]
      .map(([a, b]) => `<div style="display:flex;justify-content:space-between;margin:0 34px;
              padding:24px 0;color:#9aa9bd;font-size:21px;border-bottom:1px solid #e3ebf5;">
              <span>${a}</span><span>${b}</span></div>`).join('')}
      </div>
    </div>
    <div class="stage" style="background:radial-gradient(22% 38% at 22% 50%,rgba(150,190,255,.26),transparent 70%);"></div>`),

  // ---- Beat 3 ------------------------------------------------------------
  'empty-vault': scene(`
    <!-- interior: near-black, one shaft of light, single coin on the floor -->
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
        width:${VAULT.size}px;height:${VAULT.size}px;border-radius:50%;overflow:hidden;
        background:radial-gradient(circle at 50% 30%, #0a1420 0%, #05080d 55%, #000 100%);
        box-shadow:inset 0 0 160px 60px #000, 0 0 120px rgba(0,0,0,.9);">
      <div style="position:absolute;left:36%;top:-12%;width:150px;height:130%;
          transform:rotate(11deg);
          background:linear-gradient(180deg,rgba(255,232,180,.30),rgba(255,232,180,.02));
          filter:blur(16px);"></div>
      <div style="position:absolute;left:50%;bottom:120px;transform:translateX(-50%);">${coin(74)}</div>
      <div style="position:absolute;left:50%;bottom:100px;transform:translateX(-50%);
          width:220px;height:26px;border-radius:50%;
          background:radial-gradient(ellipse,rgba(212,162,76,.35),transparent 70%);filter:blur(8px);"></div>
    </div>
    ${vaultRing()}`),

  // transparent, hinge on the LEFT edge -> rotateY in Remotion
  'vault-door': scene(`
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
        width:${DOOR}px;height:${DOOR}px;border-radius:50%;
        background:radial-gradient(circle at 32% 26%, #8f9aa9, #3c444f 52%, #1a1f26);
        box-shadow:0 40px 90px rgba(0,0,0,.75), inset 0 0 60px rgba(0,0,0,.5);">
      ${[300, 220, 140].map((r) => `<div style="position:absolute;left:50%;top:50%;
          transform:translate(-50%,-50%);width:${r * 2}px;height:${r * 2}px;border-radius:50%;
          border:3px solid rgba(255,255,255,.10);"></div>`).join('')}
      <!-- spokes -->
      ${[0, 60, 120, 180, 240, 300].map((d) => `<div style="position:absolute;left:50%;top:50%;
          width:265px;height:16px;border-radius:8px;transform-origin:0 50%;
          transform:translateY(-50%) rotate(${d}deg);
          background:linear-gradient(90deg,#aab4c2,#4a525d);"></div>`).join('')}
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
          width:140px;height:140px;border-radius:50%;
          background:radial-gradient(circle at 36% 30%,#c9d2de,#59616c 60%,#2b3138);
          box-shadow:0 0 40px rgba(0,0,0,.6);"></div>
    </div>`, { alpha: true }),

  // ---- Beat 4 ------------------------------------------------------------
  // Five glass tiers in the LEFT half; the multiplier chain gets the right half, so it
  // never has to fight the coins for legibility. Coins are frame-pure divs in Remotion.
  'lending-cascade': scene(`
    ${[0, 1, 2, 3, 4].map((i) => {
    const w = 620 - i * 95, top = 110 + i * 190;
    const left = 620 - w / 2;
    return `<div style="position:absolute;left:${left}px;top:${top}px;
        width:${w}px;height:28px;border-radius:8px;
        background:linear-gradient(180deg,rgba(255,255,255,.26),rgba(160,200,255,.07));
        border:1px solid rgba(255,255,255,.28);
        box-shadow:0 20px 60px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.5);"></div>
      <div style="position:absolute;left:${left}px;top:${top + 28}px;
        width:${w}px;height:52px;
        background:linear-gradient(180deg,rgba(212,162,76,.16),transparent);filter:blur(10px);"></div>`;
  }).join('')}`),

  // tight 96x96 canvas so Remotion can drop it in at natural size (glow needs the margin)
  coin: scene(`<div style="position:absolute;left:24px;top:24px;">${coin(48)}</div>`, { alpha: true }),

  // ---- Beat 5 ------------------------------------------------------------
  // 10 x 3 in landscape (was 5 x 6). Screens are DARK here; Remotion staggers 30 glow
  // divs on top.
  'thirty-owners': scene(`
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
        display:grid;grid-template-columns:repeat(${GRID.cols},${GRID.cell[0]}px);
        grid-template-rows:repeat(${GRID.rows},${GRID.cell[1]}px);gap:${GRID.gap}px;">
      ${Array.from({ length: GRID.cols * GRID.rows }).map(() => `<div style="border-radius:20px;
          background:linear-gradient(165deg,#2c333f,#0b0e13);
          border:1px solid rgba(255,255,255,.07);
          box-shadow:0 18px 40px rgba(0,0,0,.6);">
          <div style="margin:10px;height:calc(100% - 20px);border-radius:13px;
            background:linear-gradient(180deg,#101823,#080c12);"></div></div>`).join('')}
    </div>`),

  'owners-coin': scene(`
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);">${coin(190)}</div>`,
    { alpha: true }),

  // ---- Beat 6 ------------------------------------------------------------
  'bank-run': scene(`
    <!-- stone facade: columns land on a stylobate + steps so nothing floats -->
    <div style="position:absolute;left:0;right:0;top:0;height:740px;
        background:linear-gradient(180deg,#333944,#191e26 74%,#0e1218);">
      <div style="position:absolute;left:50%;top:40px;transform:translateX(-50%);
          width:1500px;height:60px;background:linear-gradient(180deg,#586170,#2b313a);
          box-shadow:0 14px 30px rgba(0,0,0,.6);"></div>
      <div style="position:absolute;left:50%;top:100px;transform:translateX(-50%);
          display:flex;gap:100px;">
        ${[0, 1, 2, 3, 4, 5, 6].map(() => `<div style="width:78px;height:480px;
            background:linear-gradient(90deg,#2b313a,#5b6472 38%,#40474f 62%,#20252c);
            box-shadow:0 0 30px rgba(0,0,0,.45);"></div>`).join('')}
      </div>
      <div style="position:absolute;left:50%;top:580px;transform:translateX(-50%);
          width:1560px;height:36px;background:linear-gradient(180deg,#4c5462,#272d36);"></div>
      <!-- steps -->
      ${[0, 1, 2].map((i) => `<div style="position:absolute;left:50%;top:${616 + i * 40}px;
          transform:translateX(-50%);width:${1540 + i * 90}px;height:40px;
          background:linear-gradient(180deg,#434b57,#22272f);"></div>`).join('')}
    </div>
    <!-- arched doorway light leak (Remotion cuts this to 0 on the slam) -->
    <div style="position:absolute;left:50%;top:${ARCH.top}px;transform:translateX(-50%);
        width:${ARCH.width}px;height:${ARCH.height}px;
        border-radius:${ARCH.width / 2}px ${ARCH.width / 2}px 0 0;overflow:hidden;
        background:linear-gradient(180deg,rgba(255,232,182,.95),rgba(255,196,110,.55) 60%,rgba(255,176,88,.22));
        box-shadow:0 0 120px 30px rgba(255,205,130,.35);">
      <div style="position:absolute;inset:0;
          background:radial-gradient(70% 55% at 50% 8%,rgba(255,255,240,.9),transparent 70%);"></div>
    </div>
    <!-- crowd, from behind: silhouettes only, no faces. Sits ABOVE the darkening pass. -->
    <div style="position:absolute;left:-60px;right:-60px;bottom:0;height:360px;">
      ${(() => {
    const r = rng(67);
    return Array.from({ length: 40 }).map((_, i) => {
      const x = (i * 51) % 2020, s = 0.6 + r() * 0.42;
      const row = i % 3, y = row * 46;
      // back rows read darker and cooler, front row is near-black
      const tone = ['#141b25', '#0b1017', '#05070a'][2 - row];
      return `<div style="position:absolute;left:${x}px;bottom:${y}px;
          transform:scale(${s.toFixed(3)});transform-origin:bottom;">
          <div style="width:78px;height:78px;border-radius:50%;background:${tone};
            margin:0 auto 5px;"></div>
          <div style="width:138px;height:225px;border-radius:58px 58px 0 0;background:${tone};"></div>
        </div>`;
    }).join('');
  })()}
    </div>
    <!-- rim light on the crowd from the doorway -->
    <div class="stage" style="background:radial-gradient(26% 34% at 50% 72%,rgba(255,206,140,.22),transparent 72%);
        mix-blend-mode:screen;"></div>
    <div class="stage" style="background:linear-gradient(180deg,transparent 62%,rgba(0,0,0,.45));"></div>`),

  // sized to exactly the arched doorway above, so Beat6 can clip it to the arch
  shutter: scene(`
    <div style="position:absolute;inset:0;
        background:repeating-linear-gradient(180deg,#4e555f 0 16px,#2b3037 16px 32px);
        box-shadow:0 24px 60px rgba(0,0,0,.8), inset 0 0 40px rgba(0,0,0,.5);
        border-left:4px solid #1a1e24;border-right:4px solid #1a1e24;"></div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:14px;background:#12161b;"></div>`,
    { alpha: true }),

  // seamless vertical tile -> translateY(frame * 22 % RAIN_PERIOD)
  'rain-tile': scene(`
    ${(() => {
    const r = rng(19);
    // Each streak is drawn twice, RAIN_PERIOD apart, so the tile loops seamlessly.
    return Array.from({ length: 150 }).map(() => {
      const x = r() * W, y = r() * RAIN_PERIOD, len = 34 + r() * 64, a = 0.3 + r() * 0.35;
      const streak = (top) => `<div style="position:absolute;left:${x.toFixed(1)}px;top:${top.toFixed(1)}px;
          width:2px;height:${len.toFixed(0)}px;transform:rotate(9deg);
          background:linear-gradient(180deg,transparent,rgba(200,225,255,${a.toFixed(2)}),transparent);"></div>`;
      return streak(y) + streak(y + RAIN_PERIOD);
    }).join('');
  })()}`, { alpha: true }),

  // ---- Beat 7 ------------------------------------------------------------
  'real-assets': scene(`
    <!-- full vault: coins piled to the mouth -->
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
        width:${VAULT.size}px;height:${VAULT.size}px;border-radius:50%;overflow:hidden;
        background:radial-gradient(circle at 50% 24%, #2a1e08 0%, #120c03 60%, #000 100%);
        box-shadow:inset 0 0 140px 40px #000;">
      ${(() => {
    // Pile filling the lower two-thirds: rejection-sample inside the circle, bias
    // downward for density, then paint low-to-high so the front of the pile overlaps
    // the back and reads as depth rather than a flat sheet.
    const r = rng(7);
    const R = VAULT.size / 2;
    const coins = [];
    while (coins.length < 300) {
      const x = r() * VAULT.size, y = 200 + Math.sqrt(r()) * 600;
      const dx = x - R, dy = y - R;
      if (dx * dx + dy * dy > (R - 15) * (R - 15)) continue;
      coins.push({ x, y, s: 24 + r() * 28 });
    }
    return coins.sort((a, b) => a.y - b.y).map(
      ({ x, y, s }) => `<div style="position:absolute;left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;">${coin(s, 0.94)}</div>`,
    ).join('');
  })()}
      <div style="position:absolute;inset:0;
          background:radial-gradient(60% 45% at 50% 70%,rgba(212,162,76,.35),transparent 72%);"></div>
    </div>
    ${vaultRing()}`),

  // Drawn centred; Beat7 translates each one to its slot on the right.
  'blueprint-house': blueprint(`
    <path d="M820 610 L960 470 L1100 610 L1100 770 L820 770 Z"/>
    <path d="M820 610 L1100 610"/>
    <path d="M910 770 L910 690 L1010 690 L1010 770"/>
    <path d="M850 640 L890 640 L890 680 L850 680 Z"/>
    <path d="M1030 640 L1070 640 L1070 680 L1030 680 Z"/>`),

  'blueprint-panels': blueprint(`
    <path d="M810 640 L960 580 L1110 620 L960 682 Z"/>
    <path d="M860 622 L1010 662"/><path d="M910 604 L1060 644"/>
    <path d="M960 682 L960 740"/><path d="M900 740 L1020 740"/>`),

  'blueprint-truck': blueprint(`
    <path d="M810 560 L1000 560 L1000 660 L810 660 Z"/>
    <path d="M1000 590 L1060 590 L1110 640 L1110 660 L1000 660 Z"/>
    <circle cx="870" cy="690" r="30"/><circle cx="1060" cy="690" r="30"/>
    <path d="M1010 600 L1055 600 L1085 632 L1010 632 Z"/>`),
};

/** Plates that are not full-frame. Keyed by plate name -> [width, height]. */
const sizes = {
  coin: [96, 96],
  shutter: [ARCH.width, ARCH.height],
};

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--force-color-profile=srgb'],
});
await mkdir(OUT, { recursive: true });
const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
});

for (const [name, html] of Object.entries(plates)) {
  const alpha = html.includes('class="stage void"') === false;
  const [w, h] = sizes[name] ?? [W, H];
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(
    `<body style="background:${alpha ? 'transparent' : '#000'}">${html}</body>`,
    { waitUntil: 'load' },
  );
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    omitBackground: alpha,
  });
  console.log(`${name}.png  ${w}x${h}${alpha ? '  (transparent)' : ''}`);
}

await browser.close();
