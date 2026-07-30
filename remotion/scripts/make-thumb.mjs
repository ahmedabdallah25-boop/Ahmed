/**
 * Renders the Part 14 thumbnail.
 *
 *   node scripts/make-thumb.mjs
 *
 * 1080x1920 to match the Short. Text-dominant on purpose: a Short's thumbnail is only
 * ever seen small (channel grid, search), so the claim has to survive at ~120px wide.
 * The number is the hook — it is the one thing that must still be legible.
 */
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../out');
const GOLD = '#D4A24C';
const NAVY = '#0B1A2E';

const html = `
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1080px; height:1920px; overflow:hidden;
    font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;
    background: radial-gradient(120% 70% at 50% 22%, #16304f 0%, ${NAVY} 42%, #04080f 78%, #000 100%); }
  .stage { position:absolute; inset:0; }
  .haze { background: radial-gradient(60% 40% at 76% 16%, rgba(212,162,76,.22), transparent 70%); }
  .vig { box-shadow: inset 0 0 340px 120px rgba(0,0,0,.88); }
  .wrap { position:absolute; left:0; right:0; top:50%; transform:translateY(-50%); text-align:center; }
  .kicker { font-size:76px; font-weight:800; letter-spacing:.16em; color:rgba(232,238,247,.72); }
  .huge { font-size:400px; font-weight:900; line-height:.92; color:${GOLD};
    letter-spacing:-.03em; text-shadow:0 0 90px rgba(212,162,76,.55); margin:26px 0 10px; }
  .sub { font-size:96px; font-weight:900; line-height:1.06; color:#fff; letter-spacing:-.01em; }
  .rule { width:420px; height:5px; background:${GOLD}; margin:52px auto 0; border-radius:3px; }
  .foot { position:absolute; left:0; right:0; bottom:150px; text-align:center;
    font-size:40px; font-weight:800; letter-spacing:.14em; color:rgba(232,238,247,.65); }
</style>
<div class="stage haze"></div>
<div class="wrap">
  <div class="kicker">YOUR BANK HAS</div>
  <div class="huge">3&cent;</div>
  <div class="sub">OF EVERY DOLLAR<br/>YOU OWN</div>
  <div class="rule"></div>
</div>
<div class="foot">PART 14 &middot; FINANCE % DECODED</div>
<div class="stage vig"></div>`;

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--force-color-profile=srgb'],
});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.setContent(`<body>${html}</body>`, { waitUntil: 'load' });
await mkdir(OUT, { recursive: true });
// JPEG: YouTube caps thumbnails at 2MB and the gradient is smooth, so quality 92 is ample.
await page.screenshot({ path: path.join(OUT, 'part14-thumb.jpg'), type: 'jpeg', quality: 92 });
await browser.close();
console.log('out/part14-thumb.jpg');
