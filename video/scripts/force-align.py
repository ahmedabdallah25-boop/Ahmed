"""Forced alignment of the pension voiceover against its known script.

The pack's designed timings total 196s against a 135.4s recording, and silence
detection alone never splits the read into exactly 46 pieces — the pauses inside
a line are as long as the pauses between them. The transcript is known exactly,
so this aligns acoustically instead of guessing.

Aligning all 135s as one grammar overruns pocketsphinx's search ("final result
does not match the grammar"), so it walks a short window: a few lines of text
against the audio that can plausibly hold them, trusting only the FIRST line's
boundary before re-anchoring. Drift therefore cannot accumulate.
"""
import json, os, re, sys, wave
from pocketsphinx import Decoder, Config, get_model_path

WAV, LINES, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
lines = json.load(open(LINES))

def words_of(text):
    t = re.sub(r'\[[^\]]*\]', '', text).replace('-', ' ').replace('…', ' ')
    t = re.sub(r"[^A-Za-z' ]", ' ', t)
    return [w.lower() for w in t.split() if w.strip("'")]

per_line = [words_of(l) for l in lines]

mp = get_model_path()
cfg = Config(hmm=os.path.join(mp, 'en-us', 'en-us'),
             dict=os.path.join(mp, 'en-us', 'cmudict-en-us.dict'))
cfg.set_string('-logfn', os.devnull)
dec = Decoder(cfg)
# Words the packs use that cmudict does not carry. Alignment fails outright on
# an unknown word — "Failed to set up alignment of ..." — rather than skipping
# it, so every one has to be declared before the first window is decoded.
# Additive across packs: declaring a word an audio file never says costs
# nothing.
for _word, _phones in (
    ('lifestyling', 'L AY F S T AY L IH NG'),   # pension
    ('uncapped', 'AH N K AE P T'),              # student loan
    ('qard', 'K AA R D'),                       # student loan — qard hasan
):
    dec.add_word(_word, _phones, True)

with wave.open(WAV, 'rb') as w:
    RATE = w.getframerate()
    pcm = w.readframes(w.getnframes())
total = len(pcm) // 2 / RATE

FR = 100.0
CPS = 12.6          # measured median speaking rate, chars/sec
LOOKAHEAD = 3       # lines of context per window

def align(sample_start, sample_end, words):
    dec.set_align_text(' '.join(words))
    dec.start_utt()
    dec.process_raw(pcm[int(sample_start) * 2:int(sample_end) * 2], full_utt=True)
    dec.end_utt()
    seg = dec.seg()
    if seg is None:
        return None
    out = []
    for s in seg:
        w = re.sub(r'\(\d+\)$', '', s.word)
        if w in ('<sil>', '<s>', '</s>', '[NOISE]', '(null)'):
            continue
        out.append((w, s.start_frame / FR, s.end_frame / FR))
    return out

# Forced alignment must consume the whole window, so the LAST word absorbs any
# trailing audio and its end time is unreliable. Interior word starts are not:
# each line's boundary is therefore read off the start of the NEXT line's first
# word, taken from a window that comfortably contains both.
result, t, failures = [], 0.0, []
for i, ws in enumerate(per_line):
    if not ws:
        result.append({'n': i + 1, 'start': None, 'end': None})
        continue
    if i == len(per_line) - 1:
        result.append({'n': i + 1, 'start': round(t, 3), 'end': round(total, 3),
                       'words': len(ws), 'estimated': False})
        break
    group_lines = per_line[i:i + LOOKAHEAD]
    group = [w for ln in group_lines for w in ln]
    est = sum(len(''.join(ln)) for ln in group_lines) / CPS
    win_end = min(total, t + est * 1.7 + 1.5)
    est_line = len(''.join(ws)) / CPS
    segs = align(t * RATE, win_end * RATE, group) if win_end - t > 0.3 else None
    ok = segs is not None and len(segs) > len(ws)
    if ok:
        boundary = t + segs[len(ws)][1]      # start of next line's first word
        start = t + segs[0][1]
        if not (0.25 <= boundary - t <= est_line * 2.5 + 1.5):
            ok = False
    if ok:
        result.append({'n': i + 1, 'start': round(start, 3), 'end': round(boundary, 3),
                       'words': len(ws), 'estimated': False})
        t = boundary
    else:
        failures.append(i + 1)
        result.append({'n': i + 1, 'start': round(t, 3),
                       'end': round(min(t + est_line, total), 3), 'estimated': True})
        t = min(t + est_line, total)

# A line that failed to align sits between two acoustically anchored
# neighbours, so its span is known even when its internals are not. Share that
# span out by character count instead of by assumed speaking rate — that keeps
# the run continuous and stops it undershooting into the next anchor.
i = 0
while i < len(result):
    if not result[i].get('estimated'):
        i += 1
        continue
    j = i
    while j < len(result) and result[j].get('estimated'):
        j += 1
    lo = result[i - 1]['end'] if i > 0 else 0.0
    hi = result[j]['start'] if j < len(result) else total
    weights = [max(len(''.join(per_line[k])), 1) for k in range(i, j)]
    span, acc = hi - lo, 0
    if span > 0:
        for k, wgt in zip(range(i, j), weights):
            result[k]['start'] = round(lo + span * acc / sum(weights), 3)
            acc += wgt
            result[k]['end'] = round(lo + span * acc / sum(weights), 3)
    i = j

# Scene cuts must be contiguous: a pause belongs to the image already on screen,
# so each line runs until the next line's first word.
for a, b in zip(result, result[1:]):
    a['end'] = b['start']
result[-1]['end'] = round(total, 3)
gaps = [round(b['start'] - a['end'], 3) for a, b in zip(result, result[1:]) if abs(b['start'] - a['end']) > 0.001]
print(f'discontinuities after repair: {len(gaps)}')

print(f'lines aligned acoustically: {sum(1 for r in result if r.get("estimated") is False)}/{len(per_line)}')
if failures:
    print(f'fell back to estimate on lines: {failures}')
print(f'speech {result[0]["start"]}s -> {result[-1]["end"]}s of {total:.2f}s')
chars = [len(''.join(ws)) for ws in per_line]
rates = sorted(c / max(r['end'] - r['start'], 0.05) for c, r in zip(chars, result))
print(f'chars/sec  min {rates[0]:.1f}  median {rates[len(rates)//2]:.1f}  max {rates[-1]:.1f}')
json.dump(result, open(OUT, 'w'), indent=2)
