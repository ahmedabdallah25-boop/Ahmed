/**
 * Renders the Part 15 plates as layered 1080x1920 PNGs.
 *
 * Layers are deliberately separate files: the Remotion beat components animate the
 * vault door, shutter, blueprints and coins independently of their backgrounds, so a
 * single flattened still would be unusable. Transparent layers are marked alpha:true.
 *
 *   node remotion/scripts/make-plates.mjs
 *
 * Output: remotion/public/plates/*.png
 */
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/plates');
const W = 1080;
const H = 1920;

// Series palette. Keep these in sync with the HyperFrames overlays.
const GOLD = '#D4A24C';
const TEAL = '#3E8E8C';
const NAVY = '#0B1A2E';

const base = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:${W}px; height:${H}px; overflow:hidden; font-family:ui-sans-serif,system-ui,sans-serif; }
  .stage { position:absolute; inset:0; }
  .void {
    background:
      radial-gradient(120% 70% at 50% 18%, #16304f 0%, ${NAVY} 42%, #04080f 78%, #000 100%);
  }
  /* volumetric haze + gold key from upper right */
  .haze { background: radial-gradient(60% 40% at 78% 22%, rgba(212,162,76,.20), transparent 70%); }
  .rim  { background: radial-gradient(50% 40% at 12% 72%, rgba(62,142,140,.16), transparent 72%); }
  .grain { opacity:.055; mix-blend-mode:overlay; background-image:
      repeating-conic-gradient(#fff 0% 25%, #000 0% 50%); background-size:3px 3px; }
  .vig { box-shadow: inset 0 0 380px 130px rgba(0,0,0,.85); }
  .floor { position:absolute; left:0; right:0; bottom:0; height:34%;
    background:linear-gradient(180deg, transparent, rgba(255,255,255,.045) 40%, rgba(0,0,0,.6));
    transform:perspective(900px) rotateX(62deg); transform-origin:bottom; }
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

/** Wireframe blueprint as transparent SVG paths. */
const blueprint = (paths, label) => scene(
  `<svg width="${W}" height="${H}" viewBox="0 0 1080 1920">
     <g fill="none" stroke="${TEAL}" stroke-width="4" stroke-linejoin="round"
        style="filter:drop-shadow(0 0 14px rgba(62,142,140,.85))">${paths}</g>
   </svg>`, { alpha: true });

const plates = {
  // ---- Beat 1-2 -----------------------------------------------------------
  'phone-balance': scene(`
    <div class="floor"></div>
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
        width:520px;height:1040px;border-radius:56px;padding:14px;
        background:linear-gradient(160deg,#3a4453,#0d1118 55%,#242c38);
        box-shadow:0 60px 120px rgba(0,0,0,.75), 0 0 90px rgba(120,170,255,.10);">
      <div style="width:100%;height:100%;border-radius:44px;overflow:hidden;
          background:linear-gradient(180deg,#f7fbff,#dbe7f5);
          box-shadow:inset 0 0 60px rgba(90,130,190,.35);">
        <div style="padding:64px 46px;color:#8b9bb2;font-size:26px;letter-spacing:.16em;">BALANCE</div>
        <!-- balance digits are drawn by the HyperFrames counter overlay, not baked in -->
        <div style="height:120px"></div>
        <div style="margin:0 46px;height:2px;background:#c3d2e4"></div>
        ${[['Deposit', '+ 1,200.00'], ['Card', '- 84.10'], ['Transfer', '- 320.00'], ['Deposit', '+ 640.00']]
      .map(([a, b]) => `<div style="display:flex;justify-content:space-between;margin:0 46px;
              padding:30px 0;color:#9aa9bd;font-size:27px;border-bottom:1px solid #e3ebf5;">
              <span>${a}</span><span>${b}</span></div>`).join('')}
      </div>
    </div>
    <div class="stage" style="background:radial-gradient(38% 26% at 50% 44%,rgba(150,190,255,.28),transparent 70%);"></div>`),

  // ---- Beat 3 ------------------------------------------------------------
  'empty-vault': scene(`
    <!-- interior: near-black, one shaft of light, single coin on the floor -->
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
        width:900px;height:900px;border-radius:50%;overflow:hidden;
        background:radial-gradient(circle at 50% 30%, #0a1420 0%, #05080d 55%, #000 100%);
        box-shadow:inset 0 0 160px 60px #000, 0 0 120px rgba(0,0,0,.9);">
      <div style="position:absolute;left:38%;top:-12%;width:150px;height:130%;
          transform:rotate(11deg);
          background:linear-gradient(180deg,rgba(255,232,180,.30),rgba(255,232,180,.02));
          filter:blur(16px);"></div>
      <div style="position:absolute;left:50%;bottom:150px;transform:translateX(-50%);">${coin(74)}</div>
      <div style="position:absolute;left:50%;bottom:130px;transform:translateX(-50%);
          width:220px;height:26px;border-radius:50%;
          background:radial-gradient(ellipse,rgba(212,162,76,.35),transparent 70%);filter:blur(8px);"></div>
    </div>
    <!-- vault ring (door frame stays with the background) -->
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
        width:960px;height:960px;border-radius:50%;
        border:34px solid transparent;
        background:linear-gradient(140deg,#6b7686,#20262f 45%,#8a95a4) border-box;
        -webkit-mask:linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0);
        -webkit-mask-composite:xor; mask-composite:exclude;
        box-shadow:0 0 80px rgba(0,0,0,.8);"></div>`),

  // transparent, hinge on the LEFT edge -> rotateY in Remotion
  'vault-door': scene(`
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
        width:880px;height:880px;border-radius:50%;
        background:radial-gradient(circle at 32% 26%, #8f9aa9, #3c444f 52%, #1a1f26);
        box-shadow:0 40px 90px rgba(0,0,0,.75), inset 0 0 60px rgba(0,0,0,.5);">
      ${[340, 250, 160].map((r) => `<div style="position:absolute;left:50%;top:50%;
          transform:translate(-50%,-50%);width:${r * 2}px;height:${r * 2}px;border-radius:50%;
          border:3px solid rgba(255,255,255,.10);"></div>`).join('')}
      <!-- spokes -->
      ${[0, 60, 120, 180, 240, 300].map((d) => `<div style="position:absolute;left:50%;top:50%;
          width:300px;height:16px;border-radius:8px;transform-origin:0 50%;
          transform:translateY(-50%) rotate(${d}deg);
          background:linear-gradient(90deg,#aab4c2,#4a525d);"></div>`).join('')}
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
          width:150px;height:150px;border-radius:50%;
          background:radial-gradient(circle at 36% 30%,#c9d2de,#59616c 60%,#2b3138);
          box-shadow:0 0 40px rgba(0,0,0,.6);"></div>
    </div>`, { alpha: true }),

  // ---- Beat 4 ------------------------------------------------------------
  // Five glass tiers only. Coins are frame-pure divs in Remotion.
  'lending-cascade': scene(`
    ${[0, 1, 2, 3, 4].map((i) => {
    const w = 760 - i * 120, top = 250 + i * 320;
    return `<div style="position:absolute;left:50%;top:${top}px;transform:translateX(-50%);
        width:${w}px;height:34px;border-radius:8px;
        background:linear-gradient(180deg,rgba(255,255,255,.26),rgba(160,200,255,.07));
        border:1px solid rgba(255,255,255,.28);
        box-shadow:0 20px 60px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.5);"></div>
      <div style="position:absolute;left:50%;top:${top + 34}px;transform:translateX(-50%);
        width:${w}px;height:60px;
        background:linear-gradient(180deg,rgba(212,162,76,.16),transparent);filter:blur(10px);"></div>`;
  }).join('')}`),

  coin: scene(`<div style="position:absolute;left:0;top:0;">${coin(48)}</div>`, { alpha: true }),

  // ---- Beat 5 ------------------------------------------------------------
  // Screens are DARK here; Remotion staggers 30 glow divs on top.
  'thirty-owners': scene(`
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
        display:grid;grid-template-columns:repeat(5,150px);grid-template-rows:repeat(6,250px);
        gap:22px;">
      ${Array.from({ length: 30 }).map(() => `<div style="border-radius:20px;
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
    <!-- stone facade: columns land on an entablature + steps so nothing floats -->
    <div style="position:absolute;left:0;right:0;top:0;height:1240px;
        background:linear-gradient(180deg,#333944,#191e26 70%,#0e1218);">
      <div style="position:absolute;left:50%;top:70px;transform:translateX(-50%);
          width:880px;height:74px;background:linear-gradient(180deg,#586170,#2b313a);
          box-shadow:0 14px 30px rgba(0,0,0,.6);"></div>
      <div style="position:absolute;left:50%;top:144px;transform:translateX(-50%);
          display:flex;gap:62px;">
        ${[0, 1, 2, 3, 4].map(() => `<div style="width:84px;height:700px;
            background:linear-gradient(90deg,#2b313a,#5b6472 38%,#40474f 62%,#20252c);
            box-shadow:0 0 30px rgba(0,0,0,.45);"></div>`).join('')}
      </div>
      <div style="position:absolute;left:50%;top:844px;transform:translateX(-50%);
          width:920px;height:40px;background:linear-gradient(180deg,#4c5462,#272d36);"></div>
      <!-- steps -->
      ${[0, 1, 2].map((i) => `<div style="position:absolute;left:50%;top:${884 + i * 44}px;
          transform:translateX(-50%);width:${900 + i * 70}px;height:44px;
          background:linear-gradient(180deg,#434b57,#22272f);"></div>`).join('')}
    </div>
    <!-- arched doorway light leak (Remotion cuts this to 0 on the slam) -->
    <div style="position:absolute;left:50%;top:430px;transform:translateX(-50%);
        width:440px;height:460px;border-radius:220px 220px 0 0;overflow:hidden;
        background:linear-gradient(180deg,rgba(255,232,182,.95),rgba(255,196,110,.55) 60%,rgba(255,176,88,.22));
        box-shadow:0 0 120px 30px rgba(255,205,130,.35);">
      <div style="position:absolute;inset:0;
          background:radial-gradient(70% 55% at 50% 8%,rgba(255,255,240,.9),transparent 70%);"></div>
    </div>
    <!-- crowd, from behind: silhouettes only, no faces. Sits ABOVE the darkening pass. -->
    <div style="position:absolute;left:-60px;right:-60px;bottom:0;height:820px;">
      ${Array.from({ length: 30 }).map((_, i) => {
    const x = (i * 79) % 1160, s = 0.66 + ((i * 37) % 42) / 100;
    const row = i % 3, y = row * 96;
    // back rows read darker and cooler, front row is near-black
    const tone = ['#141b25', '#0b1017', '#05070a'][2 - row];
    return `<div style="position:absolute;left:${x}px;bottom:${y}px;
          transform:scale(${s});transform-origin:bottom;">
          <div style="width:104px;height:104px;border-radius:50%;background:${tone};
            margin:0 auto 6px;"></div>
          <div style="width:186px;height:330px;border-radius:78px 78px 0 0;background:${tone};"></div>
        </div>`;
  }).join('')}
    </div>
    <!-- rim light on the crowd from the doorway -->
    <div class="stage" style="background:radial-gradient(46% 24% at 50% 62%,rgba(255,206,140,.22),transparent 72%);
        mix-blend-mode:screen;"></div>
    <div class="stage" style="background:linear-gradient(180deg,transparent 62%,rgba(0,0,0,.45));"></div>`),

  shutter: scene(`
    <div style="position:absolute;left:50%;top:0;transform:translateX(-50%);
        width:520px;height:660px;
        background:repeating-linear-gradient(180deg,#4e555f 0 16px,#2b3037 16px 32px);
        box-shadow:0 24px 60px rgba(0,0,0,.8), inset 0 0 40px rgba(0,0,0,.5);
        border-left:4px solid #1a1e24;border-right:4px solid #1a1e24;"></div>`, { alpha: true }),

  // seamless vertical tile -> translateY(frame * 22 % tileHeight)
  'rain-tile': scene(`
    ${(() => {
    const r = rng(19);
    // Each streak is drawn twice, 960px apart, so the tile loops seamlessly.
    return Array.from({ length: 110 }).map(() => {
      const x = r() * 1080, y = r() * 960, len = 38 + r() * 76, a = 0.3 + r() * 0.35;
      const streak = (top) => `<div style="position:absolute;left:${x.toFixed(1)}px;top:${top.toFixed(1)}px;
          width:2px;height:${len.toFixed(0)}px;transform:rotate(9deg);
          background:linear-gradient(180deg,transparent,rgba(200,225,255,${a.toFixed(2)}),transparent);"></div>`;
      return streak(y) + streak(y + 960);
    }).join('');
  })()}`, { alpha: true }),

  // ---- Beat 7 ------------------------------------------------------------
  'real-assets': scene(`
    <!-- full vault: coins stacked to the ceiling -->
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
        width:900px;height:900px;border-radius:50%;overflow:hidden;
        background:radial-gradient(circle at 50% 24%, #2a1e08 0%, #120c03 60%, #000 100%);
        box-shadow:inset 0 0 140px 40px #000;">
      ${(() => {
    // Pile filling the lower two-thirds of the vault: rejection-sample inside the
    // circle, bias downward for density, then paint low-to-high so the front of the
    // pile overlaps the back and reads as depth rather than a flat sheet.
    const r = rng(7);
    const coins = [];
    while (coins.length < 320) {
      const x = r() * 900, y = 250 + Math.sqrt(r()) * 650;
      const dx = x - 450, dy = y - 450;
      if (dx * dx + dy * dy > 415 * 415) continue;          // stay inside the vault
      coins.push({ x, y, s: 26 + r() * 30 });
    }
    return coins.sort((a, b) => a.y - b.y).map(
      ({ x, y, s }) => `<div style="position:absolute;left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;">${coin(s, 0.94)}</div>`,
    ).join('');
  })()}
      <div style="position:absolute;inset:0;
          background:radial-gradient(60% 45% at 50% 70%,rgba(212,162,76,.35),transparent 72%);"></div>
    </div>
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
        width:960px;height:960px;border-radius:50%;border:34px solid transparent;
        background:linear-gradient(140deg,#6b7686,#20262f 45%,#8a95a4) border-box;
        -webkit-mask:linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0);
        -webkit-mask-composite:xor; mask-composite:exclude;"></div>`),

  'blueprint-house': blueprint(`
    <path d="M300 1500 L540 1310 L780 1500 L780 1760 L300 1760 Z"/>
    <path d="M300 1500 L780 1500"/><path d="M470 1760 L470 1610 L610 1610 L610 1760"/>
    <path d="M360 1560 L430 1560 L430 1630 L360 1630 Z"/>
    <path d="M650 1560 L720 1560 L720 1630 L650 1630 Z"/>`),

  'blueprint-panels': blueprint(`
    <path d="M250 1660 L560 1560 L830 1640 L520 1745 Z"/>
    <path d="M350 1627 L640 1700"/><path d="M450 1594 L735 1668"/>
    <path d="M470 1700 L470 1790"/><path d="M610 1660 L610 1755"/>
    <path d="M420 1790 L520 1790"/><path d="M560 1755 L660 1755"/>`),

  'blueprint-truck': blueprint(`
    <path d="M270 1580 L620 1580 L620 1730 L270 1730 Z"/>
    <path d="M620 1630 L720 1630 L790 1700 L790 1730 L620 1730 Z"/>
    <circle cx="380" cy="1760" r="48"/><circle cx="700" cy="1760" r="48"/>
    <path d="M640 1650 L710 1650 L750 1692 L640 1692 Z"/>`),
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
  await page.setContent(
    `<body style="background:${alpha ? 'transparent' : '#000'}">${html}</body>`,
    { waitUntil: 'load' },
  );
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    omitBackground: alpha,
  });
  console.log(`${name}.png${alpha ? '  (transparent)' : ''}`);
}

await browser.close();
