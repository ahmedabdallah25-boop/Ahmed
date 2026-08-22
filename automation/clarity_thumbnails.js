#!/usr/bin/env node
/**
 * Render Clarity in the Quran thumbnails to clarity/thumbnail-system.md.
 *
 *   NODE_PATH=/opt/node22/lib/node_modules node automation/clarity_thumbnails.js
 *
 * Runs LOCALLY, not in CI. The output JPEGs are committed and the workflow only
 * uploads them — installing Chromium on a runner to redraw a file that has not
 * changed is a bad trade, and it would also mean a thumbnail could silently
 * change without anyone seeing the diff.
 *
 * Every thumbnail is the same four elements in the same places:
 *
 *   ARABIC WORD (gold, small)      |
 *   WRONG READING (struck)         |   the object, bleeding off the right edge
 *   RIGHT READING (gold, biggest)  |
 *   SURAH 00 (small)               |
 *
 * The object for 5Fb1iERyIhs is the channel's OWN watercolour of a settling
 * glass, reused rather than regenerated: it is the best asset on the channel,
 * and a glass of water with the silt dropping out of suspension is literally
 * what tuma'nina means. It is placed with background-position:right so the crop
 * window excludes the old baked-in text entirely — nothing is painted over.
 *
 * No photoreal humans anywhere, by rule. See thumbnail-system.md section 3: on a
 * channel carrying a public "AI BE AWARE" comment that is a credibility rule.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'media', 'clarity');
const PLATES = path.join(OUT, 'plates');

const NAVY = '#16203C';
const GOLD = '#E8A33D';
const CREAM = '#F2ECDC';
const RUST = '#C0492B';

const dataUri = (p) =>
  'data:image/png;base64,' + fs.readFileSync(p).toString('base64');

const FONTS =
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Archivo:wght@700;800;900&display=swap';

/** Shared chrome: palette, the four-element column, paper grain. */
const baseCss = `
  @font-face{font-family:x;src:local(sans-serif)}
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1920px;height:1080px;overflow:hidden;background:${NAVY}}
  .stage{position:relative;width:1920px;height:1080px;background:${NAVY}}

  /* the object sits in the right 55% and bleeds off the right edge */
  .object{position:absolute;top:0;right:0;width:1056px;height:1080px}

  /* blends the object's own ground into ours so there is no vertical seam */
  .seam{position:absolute;top:0;left:864px;width:420px;height:1080px;
        background:linear-gradient(to right,${NAVY} 0%,rgba(22,32,60,0.86) 38%,rgba(22,32,60,0) 100%)}

  .col{position:absolute;left:104px;top:0;height:1080px;width:900px;
       display:flex;flex-direction:column;justify-content:center;gap:26px;z-index:5}

  .ar{font-family:'Amiri',serif;font-size:104px;line-height:1.25;color:${GOLD};
      direction:rtl;text-align:left;margin-bottom:4px}

  .wrong{position:relative;display:inline-block;align-self:flex-start;
         font-family:'Archivo',sans-serif;font-weight:800;font-size:76px;
         letter-spacing:-0.5px;color:${CREAM};line-height:1}
  .wrong s{text-decoration:none}
  .wrong::after{content:'';position:absolute;left:-14px;right:-14px;top:52%;
                height:7px;background:${RUST};transform:rotate(-2.2deg);
                border-radius:4px}

  .right{font-family:'Archivo',sans-serif;font-weight:900;font-size:168px;
         letter-spacing:-3px;color:${GOLD};line-height:0.92}

  .cite{font-family:'Archivo',sans-serif;font-weight:700;font-size:40px;
        letter-spacing:7px;color:rgba(242,236,220,0.72);margin-top:14px}

  /* real grain, not a gradient pretending to be one */
  .grain{position:absolute;inset:0;opacity:0.16;mix-blend-mode:overlay;
         pointer-events:none}
`;

function page(objectHtml, { ar, wrong, right, cite }) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>${baseCss}</style></head><body>
<div class="stage">
  ${objectHtml}
  <div class="seam"></div>
  <svg class="grain" width="1920" height="1080" viewBox="0 0 1920 1080" preserveAspectRatio="none"><filter id="g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3"/></filter><rect width="1920" height="1080" filter="url(#g)"/></svg>
  <div class="col">
    <div class="ar">${ar}</div>
    <div class="wrong"><s>${wrong}</s></div>
    <div class="right">${right}</div>
    <div class="cite">${cite}</div>
  </div>
</div></body></html>`;
}

const THUMBS = [
  {
    id: '5Fb1iERyIhs',
    file: 'thumb-5Fb1iERyIhs.jpg',
    _title: '"Hearts Find Rest": The Half of Surah Ar-Ra\'d 28 Nobody Quotes',
    // background-position:right means the crop window starts at source x=864.
    // The old baked-in text ends around x=760, so it is outside the window —
    // excluded by geometry rather than covered over.
    object: `<div class="object" style="background:url('${dataUri(
      path.join(PLATES, 'glass-tumaninah.png')
    )}') right center / cover no-repeat"></div>`,
    text: {
      ar: 'طُمَأْنِينَة',
      wrong: 'NOT PEACE',
      right: 'TO SETTLE',
      cite: "AR-RA'D 28",
    },
  },
  {
    id: 'PUPdFpvEA04',
    file: 'thumb-PUPdFpvEA04.jpg',
    _title: 'What "Honor Your Parents" Actually Means in Arabic',
    // No photograph. The object is the Quranic phrase itself, set as ink on a
    // wash — which is also the honest object: it is what the video is about.
    // The wash is the channel's OWN paint — the glass plate, blurred past
    // recognition and dropped to a texture. Same pigment, same paper, so the
    // two thumbnails read as one hand rather than two stock templates. A CSS
    // gradient alone renders flat and digital, which is the failure this whole
    // system exists to stop.
    object: `
      <div class="object" style="
          background:
            radial-gradient(120% 90% at 70% 40%, rgba(232,163,61,0.15) 0%, rgba(22,32,60,0) 62%),
            radial-gradient(90% 70% at 30% 78%, rgba(192,73,43,0.18) 0%, rgba(22,32,60,0) 60%);
          overflow:hidden">
        <div style="position:absolute;inset:-80px;
                    background:url('${dataUri(
                      path.join(PLATES, 'glass-tumaninah.png')
                    )}') center / cover no-repeat;
                    filter:blur(46px) saturate(1.5);opacity:0.5"></div>
        <div style="position:absolute;inset:0;display:flex;align-items:center;
                    justify-content:center;padding:0 40px 0 90px">
          <div style="font-family:'Amiri',serif;font-size:150px;line-height:1.6;
                      color:${CREAM};direction:rtl;text-align:center;
                      text-shadow:0 6px 34px rgba(0,0,0,0.55)">
            وَبِالْوَالِدَيْنِ<br>إِحْسَانًا
          </div>
        </div>
      </div>`,
    text: {
      ar: 'قَضَىٰ',
      wrong: 'NOT OBEDIENCE',
      right: 'DECREED',
      cite: 'AL-ISRA 23',
    },
  },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  for (const t of THUMBS) {
    const ctx = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    const p = await ctx.newPage();
    await p.setContent(page(t.object, t.text), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(1200);

    const ok = await p.evaluate(() => ({
      amiri: document.fonts.check("104px Amiri"),
      archivo: document.fonts.check("900 168px Archivo"),
    }));
    if (!ok.amiri || !ok.archivo) {
      throw new Error(
        `font did not load for ${t.id}: ${JSON.stringify(ok)} — refusing to ship a fallback face`
      );
    }

    const dest = path.join(OUT, t.file);
    await p.screenshot({ path: dest, type: 'jpeg', quality: 90 });

    // The 320px legibility proof, DOWNSCALED — not a 320px crop of a 1920px
    // page, which is what a viewport resize gives you and which proves nothing.
    // This is the size the home feed actually serves; whatever cannot be read
    // here does not exist.
    const prev = await ctx.newPage();
    await prev.setViewportSize({ width: 320, height: 180 });
    await prev.setContent(
      `<style>html,body{margin:0;width:320px;height:180px;overflow:hidden}
       img{width:320px;height:180px;display:block}</style>
       <img src="data:image/jpeg;base64,${fs
         .readFileSync(dest)
         .toString('base64')}">`
    );
    await prev.waitForTimeout(300);
    await prev.screenshot({
      path: path.join(OUT, t.file.replace('.jpg', '-320.jpg')),
      type: 'jpeg',
      quality: 92,
    });
    await prev.close();

    const kb = (fs.statSync(dest).size / 1024).toFixed(0);
    console.log(`${t.id}  ${t.file}  ${kb} KB   fonts ok`);
    await ctx.close();
  }
  await browser.close();
  console.log('\ndone — review the -320 files before applying');
})();
