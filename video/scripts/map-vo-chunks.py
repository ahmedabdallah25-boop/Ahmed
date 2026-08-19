"""Works out which scenes each supplied voiceover file actually contains.

The reads arrive as a pile of separately-exported clips named only by export
timestamp. Nothing in the filename says which part of the script is in it, the
exports are not necessarily in script order, and at least one line was recorded
twice. Guessing from the timestamps is how you ship a film with a scene in the
wrong place, so this decodes each clip and matches what it hears against the
scene pack's own VO lines.

The decode is free-grammar pocketsphinx: bad enough that no caption could ever
be written from it, and far more than good enough to say which of thirty known
lines a clip is reading. Matching is on shared word bigrams, which survives the
decoder mangling roughly a third of the words.

    python3 scripts/map-vo-chunks.py <clips-dir> <scene-pack.txt> <out.json>
"""
import json, os, re, subprocess, sys, wave
from pocketsphinx import Decoder, Config, get_model_path

CLIPS, PACK, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
FFMPEG = os.path.join(os.path.dirname(__file__),
                      '../node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg')

def words(text):
    text = re.sub(r'\[[^\]]*\]', ' ', text)
    return [w for w in re.sub(r"[^A-Za-z' ]", ' ', text).lower().split() if len(w) > 2]

def bigrams(ws):
    return set(zip(ws, ws[1:]))

# ---- the script's own lines -------------------------------------------------
src = open(PACK, encoding='utf-8').read()
scenes = []
for block in re.split(r'\n(?=SCENE \d\d)', src[src.index('SCENE 01'):]):
    m = re.match(r'SCENE (\d+) · (\d+:\d+)–(\d+:\d+)', block)
    if not m:
        continue
    vo = re.search(r'\nVO:([\s\S]*?)(?=\n(?:ON SCREEN|IMAGE|🎵|ARABIC|TRANSLATION)|\Z)', block)
    scenes.append({'n': int(m.group(1)),
                   'vo': re.sub(r'\s+', ' ', vo.group(1)).strip() if vo else ''})

# ---- what each clip says ----------------------------------------------------
mp = get_model_path()
cfg = Config(hmm=os.path.join(mp, 'en-us', 'en-us'),
             lm=os.path.join(mp, 'en-us', 'en-us.lm.bin'),
             dict=os.path.join(mp, 'en-us', 'cmudict-en-us.dict'))
cfg.set_string('-logfn', os.devnull)
dec = Decoder(cfg)

clips = []
for name in sorted(f for f in os.listdir(CLIPS) if f.lower().endswith(('.mp3', '.wav', '.m4a'))):
    path = os.path.join(CLIPS, name)
    wav = '/tmp/%s.16k.wav' % re.sub(r'\W', '_', name)
    subprocess.run([FFMPEG, '-y', '-v', 'error', '-i', path, '-ar', '16000', '-ac', '1', wav], check=True)
    with wave.open(wav, 'rb') as w:
        pcm, dur = w.readframes(w.getnframes()), w.getnframes() / w.getframerate()
    dec.start_utt(); dec.process_raw(pcm, full_utt=True); dec.end_utt()
    heard = words(dec.hyp().hypstr)
    hb = bigrams(heard)
    # Every scene this clip carries, in the order the clip says them: a scene
    # matches when a real share of its bigrams turn up in the decode.
    hits = []
    for s in scenes:
        sb = bigrams(words(s['vo']))
        if not sb:
            continue
        share = len(sb & hb) / len(sb)
        if share >= 0.25:
            hits.append({'scene': s['n'], 'share': round(share, 2)})
    clips.append({'file': name, 'seconds': round(dur, 2),
                  'scenes': [h['scene'] for h in hits],
                  'confidence': {h['scene']: h['share'] for h in hits},
                  'heard': dec.hyp().hypstr})

json.dump({'clips': clips}, open(OUT, 'w'), indent=1)

covered = {}
for c in clips:
    for n in c['scenes']:
        covered.setdefault(n, []).append(c['file'])
missing = [s['n'] for s in scenes if s['n'] not in covered and s['vo']]
dupes = {n: f for n, f in covered.items() if len(f) > 1}

print(f'{len(clips)} clips, {sum(c["seconds"] for c in clips):.1f}s total -> {OUT}')
for c in clips:
    print(f'  {c["seconds"]:6.2f}s  {c["file"][:46]:46}  scenes ' +
          (','.join(str(n) for n in c['scenes']) or '— NOTHING MATCHED'))
print(f'\nscenes covered: {len(covered)}/{len(scenes)}')
if missing:
    print(f'NOT RECORDED: {missing}')
if dupes:
    print('RECORDED TWICE: ' + '; '.join(f'scene {n} in {len(f)} clips' for n, f in dupes.items()))
