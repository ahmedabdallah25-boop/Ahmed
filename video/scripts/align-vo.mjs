// Derives real per-scene timings from the voiceover.
//
// The pack's designed timings total 196s against a 135.4s recording, so they
// are unusable. Pure silence detection is also not enough: no threshold splits
// this read into exactly 46 pieces, because the pauses *inside* a line ("Pension.
// Four-oh-one-k. Workplace plan.") are the same length as the pauses between
// lines. So the text supplies the prior and the audio supplies the truth:
// each of the 45 internal boundaries is predicted from character count, then
// snapped to a genuine silence gap by monotonic dynamic programming.
import {readFileSync, writeFileSync} from 'node:fs';

const buf = readFileSync(process.argv[2]);
const scenes = JSON.parse(readFileSync(new URL('./scenes.json', import.meta.url), 'utf8'));

let pos = 12, dataOff = 0, dataLen = 0, rate = 16000;
while (pos + 8 <= buf.length) {
  const id = buf.toString('ascii', pos, pos + 4);
  const size = buf.readUInt32LE(pos + 4);
  if (id === 'fmt ') rate = buf.readUInt32LE(pos + 12);
  if (id === 'data') {dataOff = pos + 8; dataLen = size; break;}
  pos += 8 + size + (size % 2);
}
const n = Math.min(dataLen, buf.length - dataOff) >> 1;
const duration = n / rate;

const WIN = Math.round(rate * 0.01);
const env = [];
for (let i = 0; i + WIN <= n; i += WIN) {
  let sum = 0;
  for (let j = 0; j < WIN; j++) {const s = buf.readInt16LE(dataOff + (i + j) * 2) / 32768; sum += s * s;}
  env.push(Math.sqrt(sum / WIN));
}
const peak = env.slice().sort((a, b) => a - b)[Math.floor(env.length * 0.95)];
const quiet = env.map((v) => v < 0.03 * peak);

// Speech extent, so leading/trailing silence is not distributed into scenes.
const firstVoice = quiet.indexOf(false) * 0.01;
const lastVoice = (quiet.length - 1 - [...quiet].reverse().indexOf(false)) * 0.01;

// Candidate boundaries: the midpoint of every silence gap >= 120ms.
const gaps = [];
let run = 0;
for (let i = 0; i <= quiet.length; i++) {
  if (i < quiet.length && quiet[i]) {run++; continue;}
  if (run >= 12) {
    const s = (i - run) * 0.01, e = i * 0.01;
    if (s > firstVoice && e < lastVoice) gaps.push({mid: (s + e) / 2, len: e - s});
  }
  run = 0;
}

// Prior: spoken length per line, tags stripped, trailing pause for punctuation.
const weight = (t) => {
  const clean = t.replace(/\[[^\]]*\]/g, '').trim();
  return clean.replace(/[^A-Za-z0-9]/g, '').length + (/\.\.\.$/.test(clean) ? 14 : /[.?!]$/.test(clean) ? 7 : 0);
};
const script = readFileSync(new URL('../../pension-scene-pack.txt', import.meta.url), 'utf8')
  .split(/VOICEOVER — full script[^\n]*\n=+\n/)[1].split(/\nTAG NOTES:/)[0].split('\n').filter((l) => l.trim());
if (script.length !== scenes.length) throw new Error(`script ${script.length} vs scenes ${scenes.length}`);
// Scene 46 holds while the final line plays, so its VO field is a stage
// direction. Every scene's spoken text is its positional script line.
scenes.forEach((s, i) => {s.spoken = script[i];});
// The pack author allocated screen time per scene deliberately (emphasis,
// breath, the beat before a reveal). Rescaled to the real recording that is a
// far better prior than raw character count, which cannot know a whispered
// line runs slow.
const PRIOR = process.env.PRIOR || 'pack';
let w = PRIOR === 'chars'
  ? scenes.map((s) => weight(s.spoken))
  : scenes.map((s) => Math.max(s.packEnd - s.packStart, 0.5));
const span = lastVoice - firstVoice;
const predictFrom = (weights) => {
  const total = weights.reduce((a, b) => a + b, 0);
  const out = [];
  let acc = 0;
  for (let i = 0; i < scenes.length - 1; i++) {acc += weights[i]; out.push(firstVoice + span * (acc / total));}
  return out;
};
let predicted = predictFrom(w);

// Monotonic DP: assign each boundary a distinct, increasing gap.
const B = predicted.length, G = gaps.length;
let chosen;
const solve = () => {
const INF = 1e18;
const cost = Array.from({length: B}, (_, b) => gaps.map((g) => (g.mid - predicted[b]) ** 2 - Math.min(g.len, 0.6) * 1.2));
const dp = Array.from({length: B}, () => new Float64Array(G).fill(INF));
const back = Array.from({length: B}, () => new Int32Array(G).fill(-1));
for (let g = 0; g < G; g++) dp[0][g] = cost[0][g];
for (let b = 1; b < B; b++) {
  let bestPrev = INF, bestIdx = -1;
  for (let g = 0; g < G; g++) {
    if (g > 0 && dp[b - 1][g - 1] < bestPrev) {bestPrev = dp[b - 1][g - 1]; bestIdx = g - 1;}
    if (bestIdx >= 0) {dp[b][g] = bestPrev + cost[b][g]; back[b][g] = bestIdx;}
  }
}
let end = -1, bestCost = INF;
for (let g = 0; g < G; g++) if (dp[B - 1][g] < bestCost) {bestCost = dp[B - 1][g]; end = g;}
const picked = new Array(B);
for (let b = B - 1; b >= 0; b--) {picked[b] = gaps[end].mid; end = back[b][end];}
return picked;
};

// Expectation-maximisation: the character-count prior is crude (it cannot know
// that a whispered line runs slow), so re-fit a per-line duration model from
// the assignment and re-snap until the boundaries stop moving.
chosen = solve();
for (let iter = 0; iter < 12; iter++) {
  const cuts = [firstVoice, ...chosen, lastVoice];
  const durs = scenes.map((_, i) => cuts[i + 1] - cuts[i]);
  const chars = scenes.map((s) => weight(s.spoken));
  // Robust global rate from the median, then blend each line toward its own
  // observed duration so genuinely slow reads keep their room.
  const rates = chars.map((c, i) => c / Math.max(durs[i], 0.2)).sort((a, b) => a - b);
  const rate = rates[Math.floor(rates.length / 2)];
  w = chars.map((c, i) => 0.5 * (c / rate) + 0.5 * durs[i]);
  predicted = predictFrom(w);
  const next = solve();
  const moved = Math.max(...next.map((v, i) => Math.abs(v - chosen[i])));
  chosen = next;
  if (moved < 0.01) break;
}

const cuts = [firstVoice, ...chosen, Math.min(lastVoice + 0.25, duration)];
const out = scenes.map((s, i) => ({...s, start: +cuts[i].toFixed(3), end: +cuts[i + 1].toFixed(3)}));

const chars = scenes.map((sc) => weight(sc.spoken));
const lens = out.map((sc) => sc.end - sc.start);
const rateOf = lens.map((l, i) => chars[i] / l);
const sortedRate = rateOf.slice().sort((a, b) => a - b);
const mx = chars.reduce((a, b) => a + b, 0) / chars.length;
const my = lens.reduce((a, b) => a + b, 0) / lens.length;
let cxy = 0, cxx = 0, cyy = 0;
chars.forEach((c, i) => {cxy += (c - mx) * (lens[i] - my); cxx += (c - mx) ** 2; cyy += (lens[i] - my) ** 2;});

console.log(`duration ${duration.toFixed(2)}s  speech ${firstVoice.toFixed(2)}-${lastVoice.toFixed(2)}  gaps ${G}`);
console.log(`corr(text, duration) ${(cxy / Math.sqrt(cxx * cyy)).toFixed(3)}`);
console.log(`chars/sec  p10 ${sortedRate[4].toFixed(1)}  median ${sortedRate[23].toFixed(1)}  p90 ${sortedRate[41].toFixed(1)}`);
console.log(`scene length min ${Math.min(...lens).toFixed(2)}s  max ${Math.max(...lens).toFixed(2)}s`);
const fast = rateOf.map((r, i) => ({n: out[i].n, r})).sort((a, b) => b.r - a.r).slice(0, 3);
console.log('fastest scenes:', fast.map((x) => `S${x.n} ${x.r.toFixed(1)}`).join('  '));
writeFileSync(new URL('./timeline.json', import.meta.url), JSON.stringify({duration, scenes: out}, null, 2));
