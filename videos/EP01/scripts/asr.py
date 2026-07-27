import json, sys, wave, numpy as np, sherpa_onnx

SD = "/tmp/claude-0/-home-user-Ahmed/caa532c5-fc75-577f-91e3-f66052808a97/scratchpad"
MD = f"{SD}/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8"
WAV = "/home/user/Ahmed/videos/EP01/audio16k.wav"
OUT = "/home/user/Ahmed/videos/EP01/transcript.json"

w = wave.open(WAV)
sr = w.getframerate()
audio = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
print(f"audio {len(audio)/sr:.1f}s @ {sr}", flush=True)

vc = sherpa_onnx.VadModelConfig()
vc.silero_vad.model = f"{SD}/silero_vad.onnx"
vc.silero_vad.threshold = 0.5
vc.silero_vad.min_silence_duration = 0.35
vc.silero_vad.min_speech_duration = 0.15
vc.silero_vad.max_speech_duration = 18.0
vc.sample_rate = sr
vad = sherpa_onnx.VoiceActivityDetector(vc, buffer_size_in_seconds=120)

rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f"{MD}/encoder.int8.onnx", decoder=f"{MD}/decoder.int8.onnx",
    joiner=f"{MD}/joiner.int8.onnx", tokens=f"{MD}/tokens.txt",
    num_threads=8, model_type="nemo_transducer", decoding_method="greedy_search",
)

segs = []
win = 512
for i in range(0, len(audio), win):
    vad.accept_waveform(audio[i:i + win])
    while not vad.empty():
        segs.append((vad.front.start / sr, vad.front.samples))
        vad.pop()
vad.flush()
while not vad.empty():
    segs.append((vad.front.start / sr, vad.front.samples))
    vad.pop()
print(f"{len(segs)} speech segments", flush=True)

words = []
for n, (t0, samples) in enumerate(segs):
    s = rec.create_stream()
    s.accept_waveform(sr, samples)
    rec.decode_stream(s)
    r = s.result
    toks, stamps = list(r.tokens), list(r.timestamps)
    if not toks:
        continue
    # sherpa-onnx decodes the NeMo BPE "▁" marker into a LEADING SPACE,
    # so a token starting with " " opens a new word; the rest are subwords.
    cur, cstart, clast = "", None, None
    for tk, ts in zip(toks, stamps):
        if tk.startswith(" ") and cur.strip():
            words.append({"text": cur.strip(), "start": round(t0 + cstart, 3),
                          "end": round(t0 + clast, 3)})
            cur, cstart = tk, ts
        else:
            if cstart is None:
                cstart = ts
            cur += tk
        clast = ts
    if cur.strip():
        words.append({"text": cur.strip(), "start": round(t0 + cstart, 3),
                      "end": round(t0 + clast, 3)})
    if n % 25 == 0:
        print(f"  seg {n}/{len(segs)} t={t0:.0f}s words={len(words)}", flush=True)

# close each word's end at the next word's start (cap 0.5s) so the rail advances cleanly
for i, wd in enumerate(words):
    nxt = words[i + 1]["start"] if i + 1 < len(words) else wd["end"]
    wd["end"] = round(min(max(wd["end"], wd["start"] + 0.08), max(nxt, wd["start"] + 0.08)), 3)

json.dump(words, open(OUT, "w"), indent=0)
print(f"WROTE {len(words)} words -> {OUT}")
print(" ".join(x["text"] for x in words[:60]))
