// Parses clarity/parents-timeline.csv into the shot index for the
// "One sound the Quran forbids you to make" long-form build, and checks it
// against clarity/parents-scene-pack.txt so the two cannot drift.
//
// The CSV is the structured source here rather than the prose pack: it already
// carries kind (still / reframe / card), the re-frame parentage and the asset
// filename, all of which the pack states only in prose. The pack is still read,
// because its section 04 timecodes are what the script was written against and
// a mismatch between the two files is exactly the failure this check exists for.
import {readFileSync, writeFileSync} from 'node:fs';

const here = (p) => new URL(p, import.meta.url).pathname;

// Minimal RFC4180 reader — the prompt column is quoted and contains commas.
const parseCsv = (text) => {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const head = rows.shift();
  return rows.filter((r) => r.length > 1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
};

const secs = (t) => {
  const [m, s] = t.split(':').map(Number);
  return m * 60 + s;
};

const rows = parseCsv(readFileSync(here('../../clarity/parents-timeline.csv'), 'utf8'));

const shots = rows.map((r) => ({
  event: Number(r.event),
  id: r.id,
  chapter: r.chapter,
  kind: r.kind,                       // still | reframe | card
  start: secs(r.tin),
  end: secs(r.tout),
  dur: Number(r.dur),
  track: r.track,
  rfParent: r.rf_parent || null,
  status: r.status,
  asset: r.asset || null,
  prompt: r.prompt || '',
}));

// ---- checks the pack's own audit record claims are true of this file too ----
const fail = [];

// Continuity: every event's IN is the previous event's OUT, no gaps, no overlaps.
for (let i = 1; i < shots.length; i++) {
  if (shots[i].start !== shots[i - 1].end)
    fail.push(`gap/overlap at ${shots[i].id}: ${shots[i - 1].end}s -> ${shots[i].start}s`);
}
// Stated duration equals its own span.
for (const s of shots) {
  if (s.end - s.start !== s.dur) fail.push(`${s.id} states ${s.dur}s but spans ${s.end - s.start}s`);
}
// Runtime resolves to the pack's 29:45.
const RUNTIME = 29 * 60 + 45;
if (shots.at(-1).end !== RUNTIME) fail.push(`runtime ${shots.at(-1).end}s, pack claims ${RUNTIME}s`);

// Every re-frame names a parent that exists and is a still.
const byId = new Map(shots.map((s) => [s.id, s]));
for (const s of shots.filter((x) => x.kind === 'reframe')) {
  const p = byId.get(s.rfParent);
  if (!p || p.kind !== 'still') fail.push(`${s.id} re-frames ${s.rfParent}, which is not a generated still`);
}

// Shot IDs sequential S01..S121 with no gaps or duplicates.
const ids = shots.filter((s) => s.kind !== 'card').map((s) => Number(s.id.slice(1)));
for (let i = 0; i < ids.length; i++) if (ids[i] !== i + 1) { fail.push(`shot ids break sequence at position ${i + 1} (${ids[i]})`); break; }

// The pack's timecodes must agree with the CSV's, shot for shot.
const pack = readFileSync(here('../../clarity/parents-scene-pack.txt'), 'utf8');
const packTimes = new Map();
for (const m of pack.matchAll(/^(S\d+) · (\d+:\d+)–(\d+:\d+) · (\d+)s/gm))
  packTimes.set(m[1], [secs(m[2]), secs(m[3])]);
for (const s of shots) {
  const t = packTimes.get(s.id);
  if (!t) continue;
  if (t[0] !== s.start || t[1] !== s.end)
    fail.push(`${s.id} pack says ${t[0]}-${t[1]}s, csv says ${s.start}-${s.end}s`);
}
if (packTimes.size !== ids.length)
  fail.push(`pack lists ${packTimes.size} shots, csv lists ${ids.length}`);

const out = here('./parents-shots.json');
writeFileSync(out, JSON.stringify(shots, null, 2) + '\n');

const stills = shots.filter((s) => s.kind === 'still');
console.log(`${shots.length} events -> ${out}`);
console.log(`  ${stills.length} stills · ${shots.filter((s) => s.kind === 'reframe').length} re-frames · ` +
  `${shots.filter((s) => s.kind === 'card').length} Arabic cards`);
console.log(`  runtime ${Math.floor(shots.at(-1).end / 60)}:${String(shots.at(-1).end % 60).padStart(2, '0')}`);
console.log(`  ${packTimes.size} shot timecodes cross-checked against the pack`);

if (fail.length) {
  console.error('\nFAILED:\n  ' + fail.join('\n  '));
  process.exit(1);
}
console.log('  all continuity, duration, runtime and cross-file checks pass');
