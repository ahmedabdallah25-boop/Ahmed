// Retimes the parents film against the recorded read, and writes the caption
// track and the audio edit list that go with it.
//
// The pack's designed timecodes put the film at 29:45. The read came in at
// 28:35 with the picture unchanged, so nothing about the pack's numbers can be
// used directly: a shot has to be on screen for the words it illustrates.
//
// How the two are reconciled:
//   · The read is aligned per script unit (scripts/align-by-clip.py), so every
//     sentence has a real start and end.
//   · Script blocks and pack chapters are the same divisions of the film, so a
//     chapter's real span is the span of its block's units. Those boundaries
//     are acoustic — they are the only anchors in here that are measured.
//   · Inside a chapter, shots keep their designed proportions and are scaled to
//     fill the chapter's real span. That is a claim about pacing, not about
//     content: it holds the pack's rhythm without pretending a shot boundary
//     was ever measured against a word.
//   · The nine Quranic cards are silence in the pack ("room tone, and silence
//     under the Arabic cards"), and the read has no gaps in it, so a gap is cut
//     into the audio for each one at the nearest sentence boundary. That gap is
//     1.5s + 4s hold + 1.5s, which is what the script's ASSEMBLY note asks for.
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';

const FPS = 30;
const CARD_HOLD = 4, CARD_LEAD = 1.5, CARD_TAIL = 1.5;
const here = (p) => new URL(p, import.meta.url).pathname;

const shots = JSON.parse(readFileSync(here('./parents-shots.json'), 'utf8'));
const units = JSON.parse(readFileSync(here('./parents-units.json'), 'utf8'));
const aligned = JSON.parse(readFileSync(here('./parents-aligned.json'), 'utf8'));

// Script block -> pack chapter. 04A/04B and 09A/09B are one chapter each; the
// script splits them only because v3 tag adherence collapses on long inputs.
const CHAPTER = {
  '01': 'CH.01', '02': 'CH.02', '03': 'CH.03', '04A': 'CH.04', '04B': 'CH.04',
  '05': 'CH.05', '06': 'CH.06', '07': 'CH.07', '08': 'CH.08', '09A': 'CH.09',
  '09B': 'CH.09', '10': 'CH.10', '11': 'CH.11',
};

// ---- what the read actually contains ---------------------------------------
const spoken = aligned.filter((a) => a.start !== null);
if (!spoken.length) throw new Error('no aligned units');
const READ = spoken.at(-1).end;

const chapterSpan = new Map();
for (const a of spoken) {
  const ch = CHAPTER[a.block];
  const cur = chapterSpan.get(ch);
  chapterSpan.set(ch, cur ? [Math.min(cur[0], a.start), Math.max(cur[1], a.end)] : [a.start, a.end]);
}
// Chapters must abut: a pause between two blocks belongs to the chapter that
// was on screen, so each chapter runs until the next one's first word.
const chapters = [...chapterSpan.entries()].sort((a, b) => a[1][0] - b[1][0]);
for (let i = 1; i < chapters.length; i++) chapters[i - 1][1][1] = chapters[i][1][0];
chapters[0][1][0] = 0;
chapters.at(-1)[1][1] = READ;

// The pack's own chapter spans, used only to read a card's designed position as
// a proportion of its chapter.
const packChapterSpan = new Map();
for (const s of shots) {
  const cur = packChapterSpan.get(s.chapter);
  packChapterSpan.set(s.chapter, cur ? [Math.min(cur[0], s.start), Math.max(cur[1], s.end)] : [s.start, s.end]);
}

// ---- lay the picture out in narration time ---------------------------------
// Shots keep their designed proportions across their chapter's measured span.
const bounds = new Map();   // shot id -> [start, end] in the recorded read
for (const [chapter, [rStart, rEnd]] of chapters) {
  const picture = shots.filter((s) => s.chapter === chapter && s.kind !== 'card');
  const designed = picture.reduce((a, s) => a + s.dur, 0);
  let t = rStart;
  for (const s of picture) {
    const dur = (s.dur / designed) * (rEnd - rStart);
    bounds.set(s.id, [t, t + dur]);
    t += dur;
  }
}

// ---- where each card cuts into the read ------------------------------------
// A card has to satisfy two things at once. The gap is cut into a continuous
// read, so it can only fall between two spoken sentences — cutting inside one
// would clip a word. And the picture cannot be interrupted mid-shot without
// splitting that shot in two, so it should also fall on a shot boundary.
//
// Both are satisfiable because neither is exact: take the pack's designed
// position, find the shot boundary nearest it, then the sentence end nearest
// THAT, and move the shot boundary onto the sentence end. The shots either side
// absorb the difference, which is a second or two out of fifteen.
const cards = shots.filter((s) => s.kind === 'card').map((card) => {
  const [pStart, pEnd] = packChapterSpan.get(card.chapter);
  const [rStart, rEnd] = chapterSpan.get(card.chapter);
  const want = rStart + ((card.start - pStart) / (pEnd - pStart)) * (rEnd - rStart);

  const inChapter = shots.filter((s) => s.chapter === card.chapter && s.kind !== 'card');
  const edges = inChapter.map((s) => bounds.get(s.id)[1]).slice(0, -1);
  const edge = edges.length
    ? edges.reduce((best, e) => (Math.abs(e - want) < Math.abs(best - want) ? e : best))
    : want;

  const spoken_ch = spoken.filter((a) => CHAPTER[a.block] === card.chapter);
  const at = spoken_ch.reduce((best, a) =>
    (Math.abs(a.end - edge) < Math.abs(best - edge) ? a.end : best), spoken_ch[0].end);

  // Move the shot boundary onto the sentence end the audio is cut at.
  for (const s of inChapter) {
    const b = bounds.get(s.id);
    if (Math.abs(b[1] - edge) < 1e-9) b[1] = at;
    if (Math.abs(b[0] - edge) < 1e-9) b[0] = at;
  }
  return {...card, want, at, edge};
}).sort((a, b) => a.at - b.at);

// A gap of lead + hold + tail is cut into the audio at each card, so everything
// after it is pushed later.
const GAP = CARD_LEAD + CARD_HOLD + CARD_TAIL;
const before = (t) => t + cards.filter((c) => c.at < t).length * GAP;
const after = (t) => t + cards.filter((c) => c.at <= t).length * GAP;

// ---- the finished cut -------------------------------------------------------
// A shot that ends on a card runs up to the card's own hold — the 1.5s of lead
// silence plays under the picture, which is what "silence under the card" means
// on screen — and the next shot picks up after the hold, covering the tail.
const events = [];
for (const s of shots.filter((x) => x.kind !== 'card')) {
  const [a, b] = bounds.get(s.id);
  const endsOnCard = cards.find((c) => Math.abs(c.at - b) < 1e-9);
  const startsOnCard = cards.find((c) => Math.abs(c.at - a) < 1e-9);
  events.push({
    ...s,
    from: startsOnCard ? before(a) + CARD_LEAD + CARD_HOLD : before(a),
    end: endsOnCard ? before(b) + CARD_LEAD : before(b),
  });
}
for (const c of cards)
  events.push({...c, kind: 'card', from: before(c.at) + CARD_LEAD, end: before(c.at) + CARD_LEAD + CARD_HOLD});
events.sort((a, b) => a.from - b.from);

// The picture must be continuous — a still holds until the next thing starts —
// but a card holds exactly its 4 seconds and nothing else.
for (let i = 1; i < events.length; i++)
  if (events[i - 1].kind !== 'card') events[i - 1].end = events[i].from;
const TOTAL = after(READ);
events.at(-1).end = TOTAL;
for (const e of events) e.dur = e.end - e.from;

writeFileSync(here('./parents-timeline-vo.json'), JSON.stringify({
  read: READ, total: TOTAL, fps: FPS,
  cards: cards.map((c) => ({id: c.id, cutAt: round(c.at), designedWanted: round(c.want)})),
  gap: GAP, events: events.map((e) => ({id: e.id, kind: e.kind, chapter: e.chapter,
    from: round(e.from), dur: round(e.dur), asset: e.asset, rfParent: e.rfParent})),
}, null, 1) + '\n');

function round(x) { return Math.round(x * 1000) / 1000; }

const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
console.log(`read ${fmt(READ)} + ${cards.length} card gaps of ${GAP}s = ${fmt(TOTAL)} finished`);
console.log(`  pack designed 29:45 against a ${fmt(READ)} read`);
for (const [ch, [a, b]] of chapters)
  console.log(`  ${ch}  ${fmt(after(a))}–${fmt(after(b))}  (pack ${fmt(packChapterSpan.get(ch)[0])}–${fmt(packChapterSpan.get(ch)[1])})`);
const drifted = cards.filter((c) => Math.abs(c.at - c.want) > 8);
if (drifted.length)
  console.log(`\ncards moved more than 8s from their designed position to reach a sentence end: ` +
    drifted.map((c) => `${c.id} ${fmt(c.want)}->${fmt(c.at)}`).join('  '));
