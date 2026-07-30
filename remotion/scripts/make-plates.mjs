/**
 * Renders the Part 15 plates for BOTH orientations, and generates src/layouts.ts.
 *
 *   npm run plates
 *
 * Output:
 *   public/plates/landscape/*.png   1920x1080
 *   public/plates/vertical/*.png    1080x1920
 *   src/layouts.ts                  GENERATED — the same geometry, typed
 *
 * The vertical set is not the landscape set cropped. Layouts come from
 * scripts/layouts.mjs, where each orientation re-composes the stack: the phone sits left
 * of its balance figure in 16:9 and above it in 9:16, the owner grid is 10x3 vs 5x6, the
 * multiplier chain sits beside the cascade vs over it behind a scrim.
 *
 * Layers are deliberately separate files: the beat components animate the vault door,
 * shutter, blueprints and coins independently of their backgrounds, so a single
 * flattened still would be unusable. Transparent layers are marked alpha:true.
 */
import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { LAYOUTS, derive } from './layouts.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'plates');

// Series palette. Keep in sync with src/theme.ts.
const GOLD = '#D4A24C';
const TEAL = '#3E8E8C';
const NAVY = '#0B1A2E';

/**
 * Deterministic PRNG (mulberry32). Plain `i * k % n` scatters band into visible
 * diagonal stripes, so anything placed "randomly" here goes through this instead.
 */
const rng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const coin = (size, opacity = 1) => `
  <div style="width:${size}px;height:${size}px;border-radius:50%;opacity:${opacity};
    background:radial-gradient(circle at 34% 28%, #ffe9b0, ${GOLD} 46%, #8a5f1d 78%, #4a3210);
    box-shadow:0 0 ${size * 0.5}px rgba(212,162,76,.55), inset 0 -${size * 0.08}px ${size * 0.12}px rgba(0,0,0,.45);"></div>`;

// Long enough for the tall frame, which shows more rows than the wide one.
const STATEMENT = [
  ['Deposit', '+ 1,200.00'], ['Card', '- 84.10'], ['Transfer', '- 320.00'],
  ['Deposit', '+ 640.00'], ['Card', '- 26.40'], ['Standing order', '- 910.00'],
  ['Card', '- 51.80'], ['Transfer', '- 145.00'], ['Deposit', '+ 380.00'],
];

/** Builds every plate for one orientation. */
const platesFor = (L) => {
  const D = derive(L);
  const { w: W, h: H } = L;

  const base = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { width:100vw; height:100vh; overflow:hidden; font-family:ui-sans-serif,system-ui,sans-serif; }
    .stage { position:absolute; inset:0; }
    .void { background: radial-gradient(${W > H ? '90% 110%' : '120% 70%'} at 50% 16%,
      #16304f 0%, ${NAVY} 44%, #04080f 78%, #000 100%); }
    .haze { background: radial-gradient(${W > H ? '44% 60%' : '60% 40%'} at 79% 21%, rgba(212,162,76,.20), transparent 70%); }
    .rim  { background: radial-gradient(${W > H ? '38% 55%' : '50% 40%'} at 11% 76%, rgba(62,142,140,.16), transparent 72%); }
    .grain { opacity:.055; mix-blend-mode:overlay; background-image:
        repeating-conic-gradient(#fff 0% 25%, #000 0% 50%); background-size:3px 3px; }
    .vig { box-shadow: inset 0 0 ${Math.round(Math.max(W, H) * 0.18)}px ${Math.round(Math.max(W, H) * 0.065)}px rgba(0,0,0,.85); }
    .floor { position:absolute; left:0; right:0; bottom:0; height:38%;
      background:linear-gradient(180deg, transparent, rgba(255,255,255,.045) 40%, rgba(0,0,0,.6));
      transform:perspective(900px) rotateX(63deg); transform-origin:bottom; }
  `;

  const scene = (inner, { alpha = false } = {}) => `<style>${base}</style>
    ${alpha ? '' : '<div class="stage void"></div><div class="stage haze"></div><div class="stage rim"></div>'}
    ${inner}
    ${alpha ? '' : '<div class="stage grain"></div><div class="stage vig"></div>'}`;

  const vaultRing = () => `
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
        width:${L.vault.ring}px;height:${L.vault.ring}px;border-radius:50%;
        border:${L.vault.border}px solid transparent;
        background:linear-gradient(140deg,#6b7686,#20262f 45%,#8a95a4) border-box;
        -webkit-mask:linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0);
        -webkit-mask-composite:xor; mask-composite:exclude;
        box-shadow:0 0 80px rgba(0,0,0,.8);"></div>`;

  const blueprint = (paths) => scene(
    `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
       <g fill="none" stroke="${TEAL}" stroke-width="4" stroke-linejoin="round"
          style="filter:drop-shadow(0 0 14px rgba(62,142,140,.85))">${paths}</g>
     </svg>`, { alpha: true });

  // Blueprints are drawn centred in whatever frame this is, so one set of paths works
  // for both orientations — Beat7 transforms them into their slots either way.
  const bp = (cx, cy) => ({ cx, cy });
  const c = { x: W / 2, y: H / 2 };

  return {
    // ---- Beat 1-2 ---------------------------------------------------------
    'phone-balance': scene(`
      <div class="floor"></div>
      <div style="position:absolute;left:${L.phone.left}px;top:${L.phone.top}px;
          width:${L.phone.w}px;height:${L.phone.h}px;border-radius:${L.phone.radius}px;
          padding:${L.phone.pad}px;
          background:linear-gradient(160deg,#3a4453,#0d1118 55%,#242c38);
          box-shadow:0 50px 100px rgba(0,0,0,.75), 0 0 90px rgba(120,170,255,.10);">
        <div style="width:100%;height:100%;border-radius:${L.phone.radius - 10}px;overflow:hidden;
            background:linear-gradient(180deg,#f7fbff,#dbe7f5);
            box-shadow:inset 0 0 60px rgba(90,130,190,.35);">
          <div style="padding:${L.phone.fontSize * 2}px ${L.phone.fontSize * 1.6}px ${L.phone.fontSize}px;
              color:#8b9bb2;font-size:${L.phone.fontSize}px;letter-spacing:.18em;">RECENT</div>
          <div style="margin:0 ${L.phone.fontSize * 1.6}px 6px;height:2px;background:#c3d2e4"></div>
          ${STATEMENT.slice(0, L.phone.rows).map(([a, b]) => `<div style="display:flex;
                justify-content:space-between;margin:0 ${L.phone.fontSize * 1.6}px;
                padding:${L.phone.fontSize * 1.15}px 0;color:#9aa9bd;
                font-size:${L.phone.fontSize}px;border-bottom:1px solid #e3ebf5;">
                <span>${a}</span><span>${b}</span></div>`).join('')}
        </div>
      </div>
      <div class="stage" style="background:radial-gradient(${L.phoneGlow},rgba(150,190,255,.26),transparent 70%);"></div>`),

    // ---- Beat 3 -----------------------------------------------------------
    'empty-vault': scene(`
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
          width:${L.vault.size}px;height:${L.vault.size}px;border-radius:50%;overflow:hidden;
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

    'vault-door': scene(`
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
          width:${L.door.size}px;height:${L.door.size}px;border-radius:50%;
          background:radial-gradient(circle at 32% 26%, #8f9aa9, #3c444f 52%, #1a1f26);
          box-shadow:0 40px 90px rgba(0,0,0,.75), inset 0 0 60px rgba(0,0,0,.5);">
        ${L.door.rings.map((r) => `<div style="position:absolute;left:50%;top:50%;
            transform:translate(-50%,-50%);width:${r * 2}px;height:${r * 2}px;border-radius:50%;
            border:3px solid rgba(255,255,255,.10);"></div>`).join('')}
        ${[0, 60, 120, 180, 240, 300].map((d) => `<div style="position:absolute;left:50%;top:50%;
            width:${L.door.spoke}px;height:16px;border-radius:8px;transform-origin:0 50%;
            transform:translateY(-50%) rotate(${d}deg);
            background:linear-gradient(90deg,#aab4c2,#4a525d);"></div>`).join('')}
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
            width:${L.door.hub}px;height:${L.door.hub}px;border-radius:50%;
            background:radial-gradient(circle at 36% 30%,#c9d2de,#59616c 60%,#2b3138);
            box-shadow:0 0 40px rgba(0,0,0,.6);"></div>
      </div>`, { alpha: true }),

    // ---- Beat 4 -----------------------------------------------------------
    'lending-cascade': scene(`
      ${D.tiers.map((t) => {
      const left = t.centerX - t.width / 2;
      return `<div style="position:absolute;left:${left}px;top:${t.top}px;
          width:${t.width}px;height:${L.tiers.bar}px;border-radius:8px;
          background:linear-gradient(180deg,rgba(255,255,255,.26),rgba(160,200,255,.07));
          border:1px solid rgba(255,255,255,.28);
          box-shadow:0 20px 60px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.5);"></div>
        <div style="position:absolute;left:${left}px;top:${t.top + L.tiers.bar}px;
          width:${t.width}px;height:52px;
          background:linear-gradient(180deg,rgba(212,162,76,.16),transparent);filter:blur(10px);"></div>`;
    }).join('')}`),

    coin: scene(`<div style="position:absolute;left:24px;top:24px;">${coin(48)}</div>`, { alpha: true }),

    // ---- Beat 5 -----------------------------------------------------------
    'thirty-owners': scene(`
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
          display:grid;grid-template-columns:repeat(${L.grid.cols},${L.grid.cellW}px);
          grid-template-rows:repeat(${L.grid.rows},${L.grid.cellH}px);gap:${L.grid.gap}px;">
        ${Array.from({ length: L.grid.cols * L.grid.rows }).map(() => `<div style="border-radius:20px;
            background:linear-gradient(165deg,#2c333f,#0b0e13);
            border:1px solid rgba(255,255,255,.07);
            box-shadow:0 18px 40px rgba(0,0,0,.6);">
            <div style="margin:10px;height:calc(100% - 20px);border-radius:13px;
              background:linear-gradient(180deg,#101823,#080c12);"></div></div>`).join('')}
      </div>`),

    'owners-coin': scene(`
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);">${coin(190)}</div>`,
      { alpha: true }),

    // ---- Beat 6 -----------------------------------------------------------
    'bank-run': scene(`
      <div style="position:absolute;left:0;right:0;top:0;height:${L.facade.height}px;
          background:linear-gradient(180deg,#333944,#191e26 74%,#0e1218);">
        <div style="position:absolute;left:50%;top:${L.facade.entabTop}px;transform:translateX(-50%);
            width:${L.facade.entabW}px;height:${L.facade.entabH}px;
            background:linear-gradient(180deg,#586170,#2b313a);
            box-shadow:0 14px 30px rgba(0,0,0,.6);"></div>
        <div style="position:absolute;left:50%;top:${L.facade.colTop}px;transform:translateX(-50%);
            display:flex;gap:${L.facade.colGap}px;">
          ${Array.from({ length: L.facade.cols }).map(() => `<div style="width:${L.facade.colW}px;
              height:${L.facade.colH}px;
              background:linear-gradient(90deg,#2b313a,#5b6472 38%,#40474f 62%,#20252c);
              box-shadow:0 0 30px rgba(0,0,0,.45);"></div>`).join('')}
        </div>
        <div style="position:absolute;left:50%;top:${L.facade.styloTop}px;transform:translateX(-50%);
            width:${L.facade.styloW}px;height:${L.facade.styloH}px;
            background:linear-gradient(180deg,#4c5462,#272d36);"></div>
        ${[0, 1, 2].map((i) => `<div style="position:absolute;left:50%;
            top:${L.facade.stepsTop + i * L.facade.stepH}px;transform:translateX(-50%);
            width:${L.facade.stepW + i * L.facade.stepGrow}px;height:${L.facade.stepH}px;
            background:linear-gradient(180deg,#434b57,#22272f);"></div>`).join('')}
      </div>
      <div style="position:absolute;left:50%;top:${L.arch.top}px;transform:translateX(-50%);
          width:${L.arch.width}px;height:${L.arch.height}px;
          border-radius:${L.arch.width / 2}px ${L.arch.width / 2}px 0 0;overflow:hidden;
          background:linear-gradient(180deg,rgba(255,232,182,.95),rgba(255,196,110,.55) 60%,rgba(255,176,88,.22));
          box-shadow:0 0 120px 30px rgba(255,205,130,.35);">
        <div style="position:absolute;inset:0;
            background:radial-gradient(70% 55% at 50% 8%,rgba(255,255,240,.9),transparent 70%);"></div>
      </div>
      <div style="position:absolute;left:-${L.crowd.bleed}px;right:-${L.crowd.bleed}px;bottom:0;
          height:${L.crowd.areaH}px;">
        ${(() => {
      const r = rng(67);
      return Array.from({ length: L.crowd.count }).map((_, i) => {
        const x = (i * L.crowd.pitch) % L.crowd.spread, s = 0.6 + r() * 0.42;
        const row = i % 3, y = row * L.crowd.rowGap;
        const tone = ['#141b25', '#0b1017', '#05070a'][2 - row];
        return `<div style="position:absolute;left:${x}px;bottom:${y}px;
            transform:scale(${s.toFixed(3)});transform-origin:bottom;">
            <div style="width:${L.crowd.head}px;height:${L.crowd.head}px;border-radius:50%;
              background:${tone};margin:0 auto 5px;"></div>
            <div style="width:${L.crowd.bodyW}px;height:${L.crowd.bodyH}px;
              border-radius:${L.crowd.bodyW / 2.4}px ${L.crowd.bodyW / 2.4}px 0 0;
              background:${tone};"></div>
          </div>`;
      }).join('');
    })()}
      </div>
      <div class="stage" style="background:radial-gradient(${L.archRim},rgba(255,206,140,.22),transparent 72%);
          mix-blend-mode:screen;"></div>
      <div class="stage" style="background:linear-gradient(180deg,transparent 62%,rgba(0,0,0,.45));"></div>`),

    shutter: scene(`
      <div style="position:absolute;inset:0;
          background:repeating-linear-gradient(180deg,#4e555f 0 16px,#2b3037 16px 32px);
          box-shadow:0 24px 60px rgba(0,0,0,.8), inset 0 0 40px rgba(0,0,0,.5);
          border-left:4px solid #1a1e24;border-right:4px solid #1a1e24;"></div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:14px;background:#12161b;"></div>`,
      { alpha: true }),

    'rain-tile': scene(`
      ${(() => {
      const r = rng(19);
      const n = Math.round((W * L.rainPeriod) / 13000);
      return Array.from({ length: n }).map(() => {
        const x = r() * W, y = r() * L.rainPeriod, len = 34 + r() * 64, a = 0.3 + r() * 0.35;
        const streak = (top) => `<div style="position:absolute;left:${x.toFixed(1)}px;top:${top.toFixed(1)}px;
            width:2px;height:${len.toFixed(0)}px;transform:rotate(9deg);
            background:linear-gradient(180deg,transparent,rgba(200,225,255,${a.toFixed(2)}),transparent);"></div>`;
        return streak(y) + streak(y + L.rainPeriod);
      }).join('');
    })()}`, { alpha: true }),

    // ---- Beat 7 -----------------------------------------------------------
    'real-assets': scene(`
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
          width:${L.vault.size}px;height:${L.vault.size}px;border-radius:50%;overflow:hidden;
          background:radial-gradient(circle at 50% 24%, #2a1e08 0%, #120c03 60%, #000 100%);
          box-shadow:inset 0 0 140px 40px #000;">
        ${(() => {
      const r = rng(7);
      const R = L.vault.size / 2;
      const out = [];
      while (out.length < 300) {
        const x = r() * L.vault.size, y = 200 + Math.sqrt(r()) * 600;
        const dx = x - R, dy = y - R;
        if (dx * dx + dy * dy > (R - 15) * (R - 15)) continue;
        out.push({ x, y, s: 24 + r() * 28 });
      }
      return out.sort((a, b) => a.y - b.y).map(
        ({ x, y, s }) => `<div style="position:absolute;left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;">${coin(s, 0.94)}</div>`,
      ).join('');
    })()}
        <div style="position:absolute;inset:0;
            background:radial-gradient(60% 45% at 50% 70%,rgba(212,162,76,.35),transparent 72%);"></div>
      </div>
      ${vaultRing()}`),

    'blueprint-house': blueprint(`
      <path d="M${c.x - 140} ${c.y + 70} L${c.x} ${c.y - 70} L${c.x + 140} ${c.y + 70} L${c.x + 140} ${c.y + 230} L${c.x - 140} ${c.y + 230} Z"/>
      <path d="M${c.x - 140} ${c.y + 70} L${c.x + 140} ${c.y + 70}"/>
      <path d="M${c.x - 50} ${c.y + 230} L${c.x - 50} ${c.y + 150} L${c.x + 50} ${c.y + 150} L${c.x + 50} ${c.y + 230}"/>
      <path d="M${c.x - 110} ${c.y + 100} L${c.x - 70} ${c.y + 100} L${c.x - 70} ${c.y + 140} L${c.x - 110} ${c.y + 140} Z"/>
      <path d="M${c.x + 70} ${c.y + 100} L${c.x + 110} ${c.y + 100} L${c.x + 110} ${c.y + 140} L${c.x + 70} ${c.y + 140} Z"/>`),

    'blueprint-panels': blueprint(`
      <path d="M${c.x - 150} ${c.y + 100} L${c.x} ${c.y + 40} L${c.x + 150} ${c.y + 80} L${c.x} ${c.y + 142} Z"/>
      <path d="M${c.x - 100} ${c.y + 82} L${c.x + 50} ${c.y + 122}"/>
      <path d="M${c.x - 50} ${c.y + 64} L${c.x + 100} ${c.y + 104}"/>
      <path d="M${c.x} ${c.y + 142} L${c.x} ${c.y + 200}"/>
      <path d="M${c.x - 60} ${c.y + 200} L${c.x + 60} ${c.y + 200}"/>`),

    'blueprint-truck': blueprint(`
      <path d="M${c.x - 150} ${c.y + 20} L${c.x + 40} ${c.y + 20} L${c.x + 40} ${c.y + 120} L${c.x - 150} ${c.y + 120} Z"/>
      <path d="M${c.x + 40} ${c.y + 50} L${c.x + 100} ${c.y + 50} L${c.x + 150} ${c.y + 100} L${c.x + 150} ${c.y + 120} L${c.x + 40} ${c.y + 120} Z"/>
      <circle cx="${c.x - 90}" cy="${c.y + 150}" r="30"/>
      <circle cx="${c.x + 100}" cy="${c.y + 150}" r="30"/>
      <path d="M${c.x + 50} ${c.y + 60} L${c.x + 95} ${c.y + 60} L${c.x + 125} ${c.y + 92} L${c.x + 50} ${c.y + 92} Z"/>`),
  };
};

// ---- render ---------------------------------------------------------------------
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--force-color-profile=srgb'],
});
const page = await browser.newPage({ deviceScaleFactor: 1 });

for (const [orient, L] of Object.entries(LAYOUTS)) {
  const dir = path.join(OUT, orient);
  await mkdir(dir, { recursive: true });
  const plates = platesFor(L);

  // Plates that are not full-frame, keyed by name -> [w, h].
  const sizes = { coin: [96, 96], shutter: [L.arch.width, L.arch.height] };

  for (const [name, html] of Object.entries(plates)) {
    const alpha = !html.includes('class="stage void"');
    const [w, h] = sizes[name] ?? [L.w, L.h];
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(
      `<body style="background:${alpha ? 'transparent' : '#000'}">${html}</body>`,
      { waitUntil: 'load' },
    );
    await page.screenshot({ path: path.join(dir, `${name}.png`), omitBackground: alpha });
  }
  console.log(`${orient}: ${Object.keys(plates).length} plates at ${L.w}x${L.h}`);
}

await browser.close();

// ---- generate src/layouts.ts ----------------------------------------------------
const ts = `/**
 * GENERATED by scripts/make-plates.mjs from scripts/layouts.mjs — do not edit by hand.
 *
 * The plates were drawn with exactly these numbers, so the beat components animate
 * against the real geometry instead of a hand-copied approximation. Change
 * scripts/layouts.mjs and re-run \`npm run plates\`.
 */
export const LAYOUTS = ${JSON.stringify(
  Object.fromEntries(Object.entries(LAYOUTS).map(([k, L]) => [k, { ...L, ...derive(L) }])),
  null,
  2,
)} as const;

export type Orientation = keyof typeof LAYOUTS;
export type Layout = (typeof LAYOUTS)[Orientation];
`;
await writeFile(path.join(ROOT, 'src', 'layouts.ts'), ts);
console.log('src/layouts.ts written');
