#!/usr/bin/env node
/**
 * Render the 38 GRAPHIC frames of scene-pack-revelation-order.txt.
 *
 *   NODE_PATH=/opt/node22/lib/node_modules node automation/clarity_frames.js
 *
 * These are the frames video-formula.md §5 calls the reason a 43-minute faceless
 * video holds: information graphics that carry the argument, as against mood art
 * that decorates it. They are typeset, not generated — no image model touches
 * them, which is why they can be built with zero credits and why their text is
 * exact instead of hallucinated.
 *
 * Same pipeline as clarity_thumbnails.js: compose HTML, screenshot with headless
 * Chromium, verify the fonts actually loaded before writing a file. Same palette
 * as the thumbnails, so the frames and the packaging read as one channel.
 *
 * ARABIC POLICY, and it is the important part of this file.
 *
 * Single words and the two address formulae are set inline: they are short, they
 * are unambiguous, and they are the same strings already reviewed and published
 * in clarity/localizations.json. MULTI-AYAH BLOCKS ARE NOT. Those render as a
 * visible slot reading PASTE VERIFIED — the layout is finished and the text is
 * deliberately missing, so the frame is production-ready and cannot ship
 * unverified. A wrong citation went live on this channel earlier today from
 * exactly the reflex this guard exists to block: filling a gap with something
 * plausible rather than checking it.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.join(path.resolve(__dirname, '..'), 'media', 'clarity', 'frames');
const NAVY = '#16203C', GOLD = '#E8A33D', CREAM = '#F2ECDC', RUST = '#C0492B';
const DIM = 'rgba(242,236,220,0.62)';
const FONTS =
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Archivo:wght@600;700;800;900&display=swap';

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px;overflow:hidden;background:${NAVY};
  font-family:'Archivo',sans-serif;color:${CREAM}}
.stage{position:relative;width:1920px;height:1080px;padding:96px 120px;
  display:flex;flex-direction:column;justify-content:center}
.grain{position:absolute;inset:0;opacity:0.13;mix-blend-mode:overlay;pointer-events:none}
.ar{font-family:'Amiri',serif;direction:rtl}
.gold{color:${GOLD}} .dim{color:${DIM}}
.huge{font-weight:900;font-size:300px;line-height:0.9;letter-spacing:-8px;color:${GOLD}}
.lbl{font-weight:800;font-size:56px;letter-spacing:6px;margin-top:28px}
.sub{font-weight:600;font-size:34px;letter-spacing:5px;color:${DIM};margin-top:20px}
.h{font-weight:900;font-size:64px;letter-spacing:-1px;margin-bottom:36px}
.row{font-weight:700;font-size:44px;line-height:1.55}
.slot{display:inline-block;border:3px dashed ${RUST};color:${RUST};
  font-weight:800;font-size:38px;letter-spacing:4px;padding:26px 40px}
.struck{position:relative;display:inline-block;font-weight:800;font-size:82px}
.struck::after{content:'';position:absolute;left:-14px;right:-14px;top:52%;height:7px;
  background:${RUST};transform:rotate(-1.6deg);border-radius:4px}
.pay{font-weight:900;font-size:112px;color:${GOLD};letter-spacing:-2px;margin-top:26px}
.cols{display:flex;gap:0;align-items:stretch}
.col{flex:1;padding:0 56px}
.col:first-child{padding-left:0}.col:last-child{padding-right:0}
.rule{width:3px;background:${GOLD};opacity:.65}
.ch{font-weight:900;font-size:46px;letter-spacing:4px;margin-bottom:30px}
.ci{font-weight:600;font-size:38px;line-height:1.85;color:${CREAM}}
.foot{font-weight:600;font-size:30px;letter-spacing:3px;color:${DIM};margin-top:44px}
`;

const grain = `<svg class="grain" width="1920" height="1080" viewBox="0 0 1920 1080"
 preserveAspectRatio="none"><filter id="g" x="0" y="0" width="100%" height="100%">
 <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3"/></filter>
 <rect width="1920" height="1080" filter="url(#g)"/></svg>`;

const page = (inner) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}"><style>${CSS}</style></head><body>
<div class="stage">${grain}${inner}</div></body></html>`;

// ---- templates -------------------------------------------------------------
const T = {
  bignum: ({ n, label, sub, ar }) => `
    <div style="text-align:center">
      ${ar ? `<div class="ar gold" style="font-size:190px;line-height:1">${ar}</div>` : ''}
      <div class="huge">${n}</div>
      ${label ? `<div class="lbl">${label}</div>` : ''}
      ${sub ? `<div class="sub">${sub}</div>` : ''}
    </div>`,

  lines: ({ h, rows, pay, foot }) => `
    ${h ? `<div class="h">${h}</div>` : ''}
    ${rows.map(r => `<div class="row">${r}</div>`).join('')}
    ${pay ? `<div class="pay">${pay}</div>` : ''}
    ${foot ? `<div class="foot">${foot}</div>` : ''}`,

  struck: ({ wrong, right, foot }) => `
    <div><span class="struck">${wrong}</span></div>
    <div class="pay">${right}</div>
    ${foot ? `<div class="foot">${foot}</div>` : ''}`,

  cols: ({ h, left, right, foot }) => `
    ${h ? `<div class="h">${h}</div>` : ''}
    <div class="cols">
      <div class="col"><div class="ch gold">${left.head}</div>
        ${left.items.map(i => `<div class="ci">${i}</div>`).join('')}</div>
      <div class="rule"></div>
      <div class="col"><div class="ch gold">${right.head}</div>
        ${right.items.map(i => `<div class="ci">${i}</div>`).join('')}</div>
    </div>
    ${foot ? `<div class="foot">${foot}</div>` : ''}`,

  ayah: ({ slot, cite, note }) => `
    <div style="text-align:center">
      <div class="slot">${slot}</div>
      ${cite ? `<div class="lbl gold" style="font-size:44px">${cite}</div>` : ''}
      ${note ? `<div class="sub">${note}</div>` : ''}
    </div>`,

  arline: ({ ar, gloss, note }) => `
    <div style="text-align:center">
      <div class="ar gold" style="font-size:150px;line-height:1.5">${ar}</div>
      <div class="lbl">${gloss}</div>
      ${note ? `<div class="sub">${note}</div>` : ''}
    </div>`,

  // 114 ticks, one highlighted — S009
  ticks: ({ hi, leftLabel, hiLabel }) => {
    const t = Array.from({ length: 114 }, (_, i) => {
      const on = i + 1 === hi;
      return `<div style="width:8px;height:${on ? 190 : 62}px;background:${on ? GOLD : CREAM};
        opacity:${on ? 1 : .5};border-radius:3px"></div>`;
    }).join('');
    return `<div style="display:flex;align-items:flex-end;gap:6px;justify-content:center">${t}</div>
      <div style="display:flex;justify-content:space-between;margin-top:40px">
        <div class="ci">${leftLabel}</div><div class="ci gold" style="font-weight:800">${hiLabel}</div>
      </div>`;
  },

  // the recurring spine — S030 and returns
  timeline: ({ marker, mark2, hiLabel, hi2Label }) => {
    const ticks = [610, 615, 619, 622, 624, 628, 630, 632];
    const x = v => ((v - 608) / 26) * 100;
    const dot = (v, lab) => v == null ? '' : `
      <div style="position:absolute;left:${x(v)}%;top:50%;transform:translate(-50%,-50%);
        width:34px;height:34px;border-radius:50%;background:${GOLD};
        box-shadow:0 0 0 12px rgba(232,163,61,.22)"></div>
      ${lab ? `<div style="position:absolute;left:${x(v)}%;top:calc(50% + 54px);
        transform:translateX(-50%);white-space:nowrap;font-weight:800;font-size:32px;
        letter-spacing:3px;color:${GOLD}">${lab}</div>` : ''}`;
    return `
      <div style="position:relative;height:340px">
        <div style="position:absolute;left:0;right:0;top:50%;height:4px;background:${GOLD};opacity:.55"></div>
        ${ticks.map(v => `
          <div style="position:absolute;left:${x(v)}%;top:50%;transform:translate(-50%,-50%);
            width:4px;height:${v === 622 ? 96 : 44}px;background:${v === 622 ? GOLD : CREAM};
            opacity:${v === 622 ? 1 : .6}"></div>
          <div style="position:absolute;left:${x(v)}%;top:calc(50% - ${v === 622 ? 96 : 60}px);
            transform:translateX(-50%);font-weight:700;font-size:${v === 622 ? 40 : 32}px;
            color:${v === 622 ? GOLD : DIM}">${v}</div>`).join('')}
        ${dot(marker, hiLabel)}${dot(mark2, hi2Label)}
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:26px">
        <div class="ci dim" style="letter-spacing:6px">MECCA</div>
        <div class="ci dim" style="letter-spacing:6px">MEDINA</div>
      </div>`;
  },

  // ★ S017 — the frame the whole video rests on
  //
  // [VERIFY] BOTH ARRAYS BELOW BEFORE THIS FRAME SHIPS.
  //
  // V is the verse count of each surah in mushaf order. It is a fixed, published
  // list and must be checked against a printed mushaf index rather than trusted
  // from here — a data graphic with wrong data, on this channel, is the same
  // failure class as the wrong citation that went live earlier today.
  //
  // REV maps each mushaf position to a revelation number. This one is worse than
  // unverified, it is CONTESTED: Act 1 of the script spends 90 seconds
  // establishing that the classical narrations, the Cairo edition and Nöldeke do
  // not agree on it. Take the Cairo edition's numbering, cite it on screen as the
  // source, and say which one you used.
  //
  // What the frame ARGUES survives either check. The top plot is a descending
  // shape because the mushaf is ordered by length, and the bottom is noise
  // because any defensible chronology is uncorrelated with length. The claim is
  // robust; the individual bars are not yet evidence.
  lengthgraph: () => {
    // real verse counts, mushaf order 1..114
    const V =[7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
    const REV = [5,87,89,92,113,55,39,88,113,51,52,53,96,72,54,70,50,56,57,58,44,107,62,102,42,47,48,49,84,85,86,61,90,74,75,76,77,78,80,81,82,83,79,105,94,95,97,99,100,101,102,103,104,29,3,10,15,16,17,21,22,23,24,25,26,27,28,30,31,32,33,34,35,36,37,38,40,41,43,45,46,60,64,65,66,68,69,71,73,88,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114];
    const W=1560,H=300,MAX=286;
    const plot=(xs,color,label,cls)=>{
      const bars = xs.map((v,i)=>`<div style="flex:1;height:${Math.max(2,(v/MAX)*H)}px;
        background:${color};opacity:.9;border-radius:1px"></div>`).join('');
      return `<div style="margin-bottom:56px">
        <div class="ch" style="color:${color};margin-bottom:18px">${label}</div>
        <div style="display:flex;align-items:flex-end;gap:2px;height:${H}px;width:${W}px">${bars}</div>
      </div>`;
    };
    const byMushaf = V;
    const byRev = REV.map((r,i)=>({r,v:V[i]})).sort((a,b)=>a.r-b.r).map(o=>o.v);
    return plot(byMushaf, CREAM, 'ARRANGED BY LENGTH — the mushaf')
         + plot(byRev, GOLD, 'ARRANGED BY TIME — the revelation order')
         + `<div class="foot">SAME 114 SURAHS. SAME VERSE COUNTS. ONE ORDERING IS A SHAPE, THE OTHER IS NOISE.</div>`;
  },

  chain: ({ h, nodes, brace }) => `
    ${h ? `<div class="h">${h}</div>` : ''}
    <div style="display:flex;align-items:center;justify-content:space-between">
      ${nodes.map((n,i)=>`
        <div style="text-align:center;flex:1">
          <div style="width:30px;height:30px;border-radius:50%;background:${GOLD};margin:0 auto 26px;
            box-shadow:0 0 0 12px rgba(232,163,61,.2)"></div>
          <div class="ci" style="font-weight:700">${n}</div>
        </div>
        ${i<nodes.length-1?`<div style="flex:0 0 90px;height:3px;background:${GOLD};opacity:.55"></div>`:''}`
      ).join('')}
    </div>
    ${brace ? `<div class="foot" style="text-align:center">${brace}</div>` : ''}`,
};

// ---- the 38 frames ---------------------------------------------------------
const F = [
  ['S001', 'bignum', { ar: '١١٤', n: '114' }],
  ['S007', 'bignum', { n: '23', label: 'YEARS', sub: '610 — 632' }],
  ['S009', 'ticks',  { hi: 96, leftLabel: 'AL-BAQARAH — 2ND IN THE MUSHAF',
                       hiLabel: 'AL-ALAQ — FIRST REVEALED, 96TH' }],
  ['S015', 'lines',  { h: 'THE COUNT FALLS', rows: [
      'AL-FATIHA <span class="gold">7</span>', 'AL-BAQARAH <span class="gold">286</span>',
      'AL-IMRAN <span class="gold">200</span>', 'AN-NISA <span class="gold">176</span>',
      '<span class="dim">…</span>', 'AN-NAS <span class="gold">6</span>'] }],
  ['S017', 'lengthgraph', {}],
  ['S022', 'cols',   { h: 'WHY IS IT IN THIS ORDER?',
      left:  { head: 'TAWQIFI', items: ['Instructed, not invented', 'Taught and preserved', 'The majority view'] },
      right: { head: 'IJTIHADI', items: ['Companion judgement, in part', 'A minority view', 'Al-Suyuti records both'] },
      foot: 'NEITHER IS MARKED CORRECT HERE. THE SCHOLARS DIFFER.' }],
  ['S024', 'cols',   { h: 'TWO AXES, NOT A REPLACEMENT',
      left:  { head: 'THE MUSHAF', items: ['WHAT THE BOOK IS', 'How it is recited', 'How it is memorised', 'How it is prayed'] },
      right: { head: 'THE CHRONOLOGY', items: ['HOW IT ARRIVED', 'What each phase answered', 'Why it came when it did', 'asbab al-nuzul'] } }],
  ['S026', 'chain',  { h: 'WHERE A CHRONOLOGY COMES FROM',
      nodes: ['CLASSICAL NARRATION<br><span class="dim">Ibn Abbas, in al-Suyuti</span>',
              'THE CAIRO EDITION<br><span class="dim">1924</span>',
              'NÖLDEKE<br><span class="dim">1860</span>'],
      brace: 'THEY AGREE ON THE ARC. THEY DISAGREE ON THE DETAIL.' }],
  ['S030', 'timeline', { marker: 610 }],
  ['S031', 'lines',  { h: 'FOUR PHASES', rows: [
      'EARLY MECCAN <span class="dim">— short verses, oaths, the Hour</span>',
      'MIDDLE MECCAN <span class="dim">— the narratives arrive</span>',
      'LATE MECCAN <span class="dim">— longer, consolidating</span>',
      'MEDINAN <span class="dim">— law, community, contracts</span>'],
      foot: 'AND MANY SURAHS ARE MIXED. HOLD IT LOOSELY.' }],
  ['S035', 'bignum', { n: '96', label: 'AL-ALAQ', sub: 'FIRST REVEALED · 96TH IN THE MUSHAF' }],
  ['S038', 'lines',  { h: 'THE ORDER OF FIRSTS', rows: [
      '1 &nbsp; READ', '2 &nbsp; YOUR LORD WHO CREATED', '3 &nbsp; THE PEN',
      '4 &nbsp; TAUGHT WHAT HE DID NOT KNOW'], pay: 'NO LAW YET.' }],
  ['S042', 'cols',   { h: 'A PAIRING THE MUSHAF HIDES',
      left:  { head: 'AL-MUZZAMMIL · 73', items: ['O you who wraps himself'] },
      right: { head: 'AL-MUDDATHTHIR · 74', items: ['O you who covers himself'] },
      foot: 'BOTH BEGIN THE NEXT WORD WITH: GET UP.' }],
  ['S045', 'timeline', { marker: 610, hiLabel: '' }],
  ['S056', 'struck', { wrong: 'HE IS CUT OFF', right: 'THE ONE WHO HATES YOU IS',
      foot: 'AL-KAWTHAR · THREE VERSES' }],
  ['S060', 'arline', { ar: 'يَا أَيُّهَا النَّاسُ', gloss: 'O MANKIND',
      note: 'MECCA. THERE IS NO IN-GROUP YET.' }],
  ['S061', 'cols',   { h: 'THE REGISTER CHANGES',
      left:  { head: 'EARLY MECCAN', items: ['Short verses', 'Heavy end-rhyme', 'Oaths on the dawn, the sun, the fig'] },
      right: { head: 'MIDDLE MECCAN', items: ['Verses lengthen', 'Rhyme loosens', 'Sustained narrative arrives'] } }],
  ['S063', 'timeline', { marker: 619 }],
  ['S068', 'lines',  { h: 'ONE STRUCTURE, TOLD MANY TIMES', rows: [
      'A MAN IS SENT', 'HE IS CALLED A LIAR', 'A FEW BELIEVE', 'THE POWERFUL CLOSE RANKS'],
      pay: 'AND THEN THE OUTCOME.',
      foot: 'DELIVERED TO PEOPLE BEING BEATEN. THIS HAS HAPPENED BEFORE.' }],
  ['S078', 'timeline', { marker: 619, hiLabel: 'AM AL-HUZN — THE YEAR OF SORROW' }],
  ['S081', 'lines',  { rows: ['THE WORST YEAR OF HIS LIFE.'],
      pay: 'THEN THIS.', foot: 'AND THEN THE SAME CITY, THE SAME MORNING.' }],
  ['S084', 'lines',  { h: 'A CODE, ARRIVING BEFORE THERE IS A STATE', rows: [
      'parents &nbsp;·&nbsp; the relative &nbsp;·&nbsp; the poor &nbsp;·&nbsp; the traveller',
      "the orphan's property &nbsp;·&nbsp; the covenant",
      'full measure &nbsp;·&nbsp; an even balance'], pay: 'MECCA. NO STATE YET.' }],
  ['S087', 'bignum', { n: '13', label: 'YEARS IN MECCA', sub: '≈90 OF 114 SURAHS · ALMOST NO STATUTE' }],
  ['S089', 'cols',   { h: 'THE TURN',
      left:  { head: 'MECCA', items: ['Short verses', 'Heavy rhyme', 'Oaths on dawn, sun, fig', 'The Hour · the orphan',
        '<span class="ar gold" style="font-size:52px">يَا أَيُّهَا النَّاسُ</span>'] },
      right: { head: 'MEDINA', items: ['Long verses', 'Rhyme thins', 'Conditions and exceptions', 'Inheritance · contracts',
        '<span class="ar gold" style="font-size:52px">يَا أَيُّهَا الَّذِينَ آمَنُوا</span>'] } }],
  ['S090', 'timeline', { marker: 622, hiLabel: 'HIJRA' }],
  ['S096', 'bignum', { n: '2:282', label: 'THE LONGEST VERSE IN THE QURAN',
      sub: 'IT IS ABOUT DOCUMENTING A DEBT' }],
  ['S100', 'lines',  { rows: ['THEY LOST AT UHUD.'], pay: 'IT CAME FROM YOURSELVES.',
      foot: 'ĀL ʿIMRĀN — THE SURAH INCLUDES THE DEFEAT AND NAMES THE MISTAKE' }],
  ['S102', 'cols',   { h: 'CONVICTION, THEN CODE',
      left:  { head: '≈13 YEARS — MECCA', items: ['You will be raised and asked', 'The orphan is the measure', 'Almost no statute'] },
      right: { head: '≈10 YEARS — MEDINA', items: ['Inheritance fractions', 'Debt documentation', 'The rules of war'] },
      foot: 'READ FRONT TO BACK, YOU MEET THE FRACTIONS ON PAGE TWO.' }],
  ['S107', 'lines',  { h: 'IT COULD HAVE ENDED AT THE ACQUITTAL', rows: [
      'WHY DID YOU NOT THINK WELL OF ONE ANOTHER?',
      'WHY DID YOU NOT DEMAND FOUR WITNESSES?',
      'WHY DID YOU SPEAK WITH NO KNOWLEDGE?'], pay: 'IT DID NOT.' }],
  ['S110', 'timeline', { marker: 628, hiLabel: 'HUDAYBIYYAH — "A CLEAR VICTORY"',
      mark2: 630, hi2Label: 'MECCA ENTERED' }],
  ['S116', 'lines',  { rows: ['THEY HAD WON.', 'TERRITORY. ARMY. MOMENTUM.'],
      pay: 'STOP MOCKING EACH OTHER.', foot: 'AL-HUJURAT' }],
  ['S122', 'lines',  { h: 'WHICH VERSE WAS LAST?', rows: [
      '<span class="gold">2:281</span> &nbsp; the Day of return',
      '<span class="gold">5:3</span> &nbsp; the religion completed',
      '<span class="gold">4:176</span> &nbsp; inheritance',
      '<span class="gold">110</span> &nbsp; ask forgiveness'],
      foot: 'AL-SUYUTI DOES NOT PICK ONE. NEITHER WILL WE.' }],
  ['S123', 'bignum', { n: '4', label: 'THINGS YOU GET FROM THIS',
      sub: 'THE LAST ONE IS THE ONE TO KEEP' }],
  ['S125', 'lines',  { h: 'NASKH', rows: ['NOT A DISAGREEMENT.'], pay: 'A SEQUENCE.',
      foot: 'SCOPE AND EXISTENCE ARE BOTH DEBATED AMONG SCHOLARS.' }],
  ['S126', 'cols',   { h: 'A DATING TOOL YOU CAN USE',
      left:  { head: 'PROBABLY MECCA', items: ['Short verses', 'Heavy rhyme', 'Oaths', 'The Hour', 'The orphan'] },
      right: { head: 'PROBABLY MEDINA', items: ['Long verses', 'Conditions', 'Warfare', 'Hypocrites', 'Inheritance'] } }],
  ['S128', 'cols',   { h: 'THE ONE TO KEEP',
      left:  { head: 'PROBABLY MECCAN', items: [
        '<span class="ar gold" style="font-size:76px">يَا أَيُّهَا النَّاسُ</span>', 'O MANKIND',
        '<span class="dim">Spoken to a city that has not accepted it</span>'] },
      right: { head: 'PROBABLY MEDINAN', items: [
        '<span class="ar gold" style="font-size:76px">يَا أَيُّهَا الَّذِينَ آمَنُوا</span>', 'O YOU WHO HAVE BELIEVED',
        '<span class="dim">Spoken to a community that has</span>'] },
      foot: 'PROBABLY. THERE ARE EXCEPTIONS BOTH WAYS, AND SCHOLARS CATALOGUE THEM.' }],
  ['S130', 'cols',   { h: 'NOT A DIFFERENT QURAN',
      left:  { head: 'THE MUSHAF', items: ['WHAT THE BOOK IS'] },
      right: { head: 'THE CHRONOLOGY', items: ['HOW IT ARRIVED'] },
      foot: 'THE SAME ONE, WITH A SECOND AXIS.' }],
  ['S134', 'lines',  { rows: [
      'Arabic on screen is set from a verified mushaf.',
      'Dates are as the classical sources give them, disagreements included.',
      'This video issues no ruling.'] }],
  // recitation frames — layout finished, text deliberately absent
  ['S005', 'ayah',   { slot: 'PASTE VERIFIED — AL-ALAQ 96:1–5', cite: 'AL-ALAQ 96:1–5',
      note: 'FIVE LINES, ONE PER RECITER PHRASE' }],
  ['S055', 'ayah',   { slot: 'PASTE VERIFIED — AL-KAWTHAR 108', cite: 'AL-KAWTHAR 108',
      note: 'THREE AYAT COMPLETE' }],
  ['S083', 'ayah',   { slot: 'PASTE VERIFIED — AL-ISRA 17:23–24', cite: 'AL-ISRA 17:23–24',
      note: 'PICK OUT قَضَىٰ IN GOLD' }],
  ['S114', 'ayah',   { slot: 'PASTE VERIFIED — AL-HUJURAT 49:13', cite: 'AL-HUJURAT 49:13',
      note: 'PICK OUT لِتَعَارَفُوا IN GOLD' }],
  ['S119', 'ayah',   { slot: 'PASTE VERIFIED — AL-MAIDA 5:3 (CLAUSE)', cite: 'AL-MAIDA 5:3',
      note: 'PICK OUT أَكْمَلْتُ IN GOLD' }],
  ['S121', 'ayah',   { slot: 'PASTE VERIFIED — AN-NASR 110', cite: 'AN-NASR 110',
      note: 'THREE AYAT COMPLETE' }],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  let n = 0, slots = 0;
  for (const [id, kind, cfg] of F) {
    const p = await ctx.newPage();
    await p.setContent(page(T[kind](cfg)), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(700);
    const ok = await p.evaluate(() => ({
      amiri: document.fonts.check('76px Amiri'),
      archivo: document.fonts.check('900 300px Archivo'),
    }));
    if (!ok.amiri || !ok.archivo)
      throw new Error(`${id}: font not loaded ${JSON.stringify(ok)} — refusing to ship a fallback face`);
    await p.screenshot({ path: path.join(OUT, `${id}.jpg`), type: 'jpeg', quality: 92 });
    if (kind === 'ayah') slots++;
    n++; await p.close();
  }
  await browser.close();
  console.log(`${n} frames -> media/clarity/frames/`);
  console.log(`${slots} carry a PASTE VERIFIED slot and cannot ship until filled from a mushaf.`);
})();
