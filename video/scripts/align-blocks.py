"""Aligns the recorded read against the script, one block at a time.

Aligning the whole assembled read in one pass is what force-align.py does for
the Shorts, and it is wrong for this one: this read has a hole in it. Block 10
arrived as a single 42s clip against 148s of written text, so a continuous pass
walks the unread lines forward into the NEXT block's audio and every timing
after the hole is quietly wrong — which is exactly what the first pass did.

So each BLOCK is aligned inside its own bounds. A block cannot borrow audio from
the next one, the damage from a missing recording stops at that block, and every
other block keeps timings good to the frame.

The block rather than the clip is the unit because four blocks arrived as two
clips — a long take and a short one carrying the last few sentences. Aligning
those clips separately splits the block at a boundary the decode cannot see
accurately, and the last sentence of the long take then swallows a minute of
audio that belongs to the sentences after it.

Which units a clip reads is decided the same way the clip was pinned to its
block: a free decode, matched on word bigrams, then the contiguous run from the
first matched unit to the last. Contiguous because a clip is a continuous read —
a unit inside the run that the decoder mangled past recognition is still spoken.

    python3 scripts/align-by-clip.py <clips-dir> <units.json> <clip-map.json> \
        <lexicon.dict> <out.json>
"""
import json, os, re, subprocess, sys, unicodedata, wave
from pocketsphinx import Decoder, Config, get_model_path

CLIPS, UNITS, CLIPMAP, LEXICON, OUT = sys.argv[1:6]
FFMPEG = os.path.join(os.path.dirname(__file__),
                      '../node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg')
FR, CPS, LOOKAHEAD = 100.0, 13.0, 3
COVERAGE = 0.15   # share of a unit's bigrams that must survive the decode


def norm(text):
    t = unicodedata.normalize('NFKD', text)
    return ''.join(c for c in t if not unicodedata.combining(c))


def words_of(text):
    t = norm(re.sub(r'\[[^\]]*\]', ' ', text)).replace('—', ' ').replace('-', ' ').replace('…', ' ')
    return [w.lower().strip("'") for w in re.sub(r"[^A-Za-z' ]", ' ', t).split() if w.strip("'")]


def bigrams(ws):
    return set(zip(ws, ws[1:]))


units = json.load(open(UNITS, encoding='utf-8'))
clips = json.load(open(CLIPMAP, encoding='utf-8'))['clips']
by_block = {}
for i, u in enumerate(units):
    by_block.setdefault(u['block'], []).append(i)

mp = get_model_path()
free = Config(hmm=os.path.join(mp, 'en-us', 'en-us'),
              lm=os.path.join(mp, 'en-us', 'en-us.lm.bin'),
              dict=os.path.join(mp, 'en-us', 'cmudict-en-us.dict'))
free.set_string('-logfn', os.devnull)
loose = Decoder(free)

fit = Config(hmm=os.path.join(mp, 'en-us', 'en-us'),
             dict=os.path.join(mp, 'en-us', 'cmudict-en-us.dict'))
fit.set_string('-logfn', os.devnull)
dec = Decoder(fit)
for line in open(LEXICON, encoding='utf-8'):
    line = line.strip()
    if line and not line.startswith('#'):
        w, ph = line.split(None, 1)
        dec.add_word(w, ph, True)

# Clips play in export order; that was checked against the block map, and the
# assembled read is concatenated in exactly this order.
clips.sort(key=lambda c: c['file'].split('Benjamin')[1])

def decode_free(pcm):
    loose.start_utt(); loose.process_raw(pcm, full_utt=True); loose.end_utt()
    return bigrams(words_of(loose.hyp().hypstr))


def decode_wav(clip):
    wav = '/tmp/%s.16k.wav' % re.sub(r'\W', '_', clip['file'])
    if not os.path.exists(wav):
        subprocess.run([FFMPEG, '-y', '-v', 'error', '-i', os.path.join(CLIPS, clip['file']),
                        '-ar', '16000', '-ac', '1', wav], check=True)
    with wave.open(wav, 'rb') as w:
        return w.readframes(w.getnframes()), w.getframerate()


# Clips play in export order; that was checked against the block map, and the
# assembled read is concatenated in exactly this order.
clips.sort(key=lambda c: c['file'].split('Benjamin')[1])

# One audio stream per block, plus the offset at which that stream begins in the
# assembled read.
streams, offset = [], 0.0
for clip in clips:
    pcm, rate = decode_wav(clip)
    dur = len(pcm) // 2 / rate
    if streams and streams[-1]['block'] == clip['block']:
        streams[-1]['pcm'] += pcm
        streams[-1]['files'].append(clip['file'])
    else:
        streams.append({'block': clip['block'], 'pcm': pcm, 'rate': rate,
                        'offset': offset, 'files': [clip['file']]})
    offset += dur
READ = offset

timings = {}
for st in streams:
    pcm, RATE = st['pcm'], st['rate']
    total = len(pcm) // 2 / RATE
    heard = decode_free(pcm)
    candidates = by_block[st['block']]
    matched = [i for i in candidates
               if (lambda bg: bg and len(bg & heard) / len(bg) >= COVERAGE)(bigrams(words_of(units[i]['text'])))]
    if not matched:
        print(f'  {st["block"]:4} NOTHING MATCHED across {len(st["files"])} clip(s)', flush=True)
        continue
    # The contiguous run from the first matched unit to the last: a block is a
    # continuous read, so a sentence inside the run that the free decode mangled
    # past recognition was still spoken. Anything outside the run was not — that
    # is how a block whose recording is missing its first two thirds is caught
    # instead of being crushed into the audio that does exist.
    idx = list(range(min(matched), max(matched) + 1))
    per_line = [words_of(units[i]['text']) for i in idx]

    def align(a, b, ws):
        dec.set_align_text(' '.join(ws))
        dec.start_utt()
        dec.process_raw(pcm[int(a) * 2:int(b) * 2], full_utt=True)
        dec.end_utt()
        seg = dec.seg()
        if seg is None:
            return None
        return [(re.sub(r'\(\d+\)$', '', x.word), x.start_frame / FR, x.end_frame / FR)
                for x in seg
                if re.sub(r'\(\d+\)$', '', x.word) not in ('<sil>', '<s>', '</s>', '[NOISE]', '(null)')]

    local, t, failed = [], 0.0, 0
    for k, ws in enumerate(per_line):
        if k == len(per_line) - 1 or not ws:
            local.append({'start': round(t, 3), 'end': round(total, 3), 'estimated': not ws})
            break
        group = [w for ln in per_line[k:k + LOOKAHEAD] for w in ln]
        est_group = sum(len(''.join(ln)) for ln in per_line[k:k + LOOKAHEAD]) / CPS
        est_line = len(''.join(ws)) / CPS
        win_end = min(total, t + est_group * 1.7 + 2.5)
        segs = align(t * RATE, win_end * RATE, group) if win_end - t > 0.3 else None
        ok = segs is not None and len(segs) > len(ws)
        if ok:
            boundary = t + segs[len(ws)][1]
            start = t + segs[0][1]
            ok = 0.25 <= boundary - t <= est_line * 2.5 + 3.0
        if ok:
            local.append({'start': round(start, 3), 'end': round(boundary, 3), 'estimated': False})
            t = boundary
        else:
            failed += 1
            local.append({'start': round(t, 3), 'end': round(min(t + est_line, total), 3),
                          'estimated': True})
            t = min(t + est_line, total)
    while len(local) < len(idx):
        local.append({'start': round(total, 3), 'end': round(total, 3), 'estimated': True})

    # Estimated runs sit between acoustic anchors: share their span out by
    # character count so the run stays continuous.
    i = 0
    while i < len(local):
        if not local[i]['estimated']:
            i += 1
            continue
        j = i
        while j < len(local) and local[j]['estimated']:
            j += 1
        lo = local[i - 1]['end'] if i > 0 else 0.0
        hi = local[j]['start'] if j < len(local) else total
        weights = [max(len(''.join(per_line[k])), 1) for k in range(i, min(j, len(per_line)))] or [1]
        span, acc = hi - lo, 0
        for k, wgt in zip(range(i, j), weights + [1] * (j - i - len(weights))):
            local[k]['start'] = round(lo + span * acc / sum(weights), 3)
            acc += wgt
            local[k]['end'] = round(lo + span * acc / sum(weights), 3)
        i = j
    for a, b in zip(local, local[1:]):
        a['end'] = b['start']
    local[-1]['end'] = round(total, 3)

    for i, loc in zip(idx, local):
        timings[i] = {'n': i + 1, 'block': units[i]['block'],
                      'clips': st['files'],
                      'start': round(st['offset'] + loc['start'], 3),
                      'end': round(st['offset'] + loc['end'], 3),
                      'estimated': loc['estimated']}
    print(f'  {st["block"]:4} {len(st["files"])} clip(s) {total:7.2f}s  units {idx[0] + 1}-{idx[-1] + 1}  '
          f'{len(idx) - failed}/{len(idx)} acoustic', flush=True)

aligned = [timings.get(i) or {'n': i + 1, 'block': units[i]['block'], 'clip': None,
                              'start': None, 'end': None, 'estimated': True}
           for i in range(len(units))]
json.dump(aligned, open(OUT, 'w'), indent=1)

unread = [a['n'] for a in aligned if a['start'] is None]
acoustic = sum(1 for a in aligned if a['start'] is not None and not a['estimated'])
print(f'\n{len(units) - len(unread)}/{len(units)} units have audio; '
      f'{acoustic} of those aligned acoustically -> {OUT}')
if unread:
    runs, start = [], unread[0]
    for a, b in zip(unread, unread[1:] + [None]):
        if b != (a + 1 if a is not None else None):
            runs.append((start, a))
            start = b
    print('NOT RECORDED — no audio reads these units:')
    for lo, hi in runs:
        print(f'  units {lo}-{hi} (block {units[lo - 1]["block"]}): '
              f'"{units[lo - 1]["text"][:60]}…" through "{units[hi - 1]["text"][-50:]}"')
print(f'assembled read: {READ:.2f}s')
