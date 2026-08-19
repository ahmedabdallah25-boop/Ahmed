"""Pins each recorded clip to the script block it actually reads.

The clips arrive named only by export timestamp. Timestamp order turned out to
be script order here, but that is a fact to check rather than assume: this read
was exported over two sessions, one block was regenerated 22 minutes after the
rest, and aligning a block against the wrong clip fails silently by producing
plausible-looking timings for the wrong words.

Same method as map-vo-chunks.py: a free-grammar decode, matched on shared word
bigrams. Far too rough to caption from, far more than good enough to say which
of thirteen known blocks a clip is reading.

    python3 scripts/map-clips-to-blocks.py <clips-dir> <units.json> <out.json>
"""
import json, os, re, subprocess, sys, unicodedata, wave
from pocketsphinx import Decoder, Config, get_model_path

CLIPS, UNITS, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
FFMPEG = os.path.join(os.path.dirname(__file__),
                      '../node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg')
FFPROBE = FFMPEG.replace('ffmpeg', 'ffprobe')


def words(text):
    t = unicodedata.normalize('NFKD', text)
    t = ''.join(c for c in t if not unicodedata.combining(c))
    return [w for w in re.sub(r"[^A-Za-z' ]", ' ', t).lower().split() if len(w) > 2]


def bigrams(ws):
    return set(zip(ws, ws[1:]))


units = json.load(open(UNITS, encoding='utf-8'))
blocks = {}
for u in units:
    blocks.setdefault(u['block'], []).append(u['text'])
block_bg = {b: bigrams(words(' '.join(t))) for b, t in blocks.items()}

mp = get_model_path()
cfg = Config(hmm=os.path.join(mp, 'en-us', 'en-us'),
             lm=os.path.join(mp, 'en-us', 'en-us.lm.bin'),
             dict=os.path.join(mp, 'en-us', 'cmudict-en-us.dict'))
cfg.set_string('-logfn', os.devnull)
dec = Decoder(cfg)

out = []
for name in sorted(os.listdir(CLIPS)):
    if not name.lower().endswith(('.mp3', '.wav', '.m4a')):
        continue
    wav = '/tmp/%s.16k.wav' % re.sub(r'\W', '_', name)
    subprocess.run([FFMPEG, '-y', '-v', 'error', '-i', os.path.join(CLIPS, name),
                    '-ar', '16000', '-ac', '1', wav], check=True)
    with wave.open(wav, 'rb') as w:
        pcm, dur = w.readframes(w.getnframes()), w.getnframes() / w.getframerate()
    dec.start_utt(); dec.process_raw(pcm, full_utt=True); dec.end_utt()
    heard = bigrams(words(dec.hyp().hypstr))
    # Score by what share of the DECODE each block explains, not what share of
    # the block the decode covers: a block split across two clips would score
    # low the other way round and lose to a block that happens to be short.
    scores = {b: (len(bg & heard) / max(len(heard), 1)) for b, bg in block_bg.items()}
    best = max(scores, key=scores.get)
    ranked = sorted(scores.items(), key=lambda kv: -kv[1])[:2]
    out.append({'file': name, 'seconds': round(dur, 2), 'block': best,
                'score': round(ranked[0][1], 3), 'runner_up': ranked[1][0],
                'runner_up_score': round(ranked[1][1], 3),
                'heard': dec.hyp().hypstr})
    print(f'  {dur:7.2f}s  {name[:44]:44} -> BLOCK {best} '
          f'({ranked[0][1]:.2f}, next {ranked[1][0]} {ranked[1][1]:.2f})', flush=True)

json.dump({'clips': out}, open(OUT, 'w'), indent=1, ensure_ascii=False)

order = [c['block'] for c in out]
print(f'\n{len(out)} clips -> {OUT}')
print('block order as exported: ' + ' '.join(order))
missing = [b for b in blocks if b not in order]
if missing:
    print(f'NO CLIP READS: {sorted(missing)}')
dupes = sorted({b for b in order if order.count(b) > 1})
if dupes:
    print(f'read by more than one clip: {dupes}')
weak = [c['file'] for c in out if c['score'] - c['runner_up_score'] < 0.05]
if weak:
    print(f'AMBIGUOUS, check by hand: {weak}')
