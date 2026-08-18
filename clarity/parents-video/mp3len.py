#!/usr/bin/env python3
"""Duration of MPEG audio files, by walking frame headers.

No ffprobe or ffmpeg in this environment, so durations are read straight from
the bitstream: skip any ID3v2 tag, then sum samples_per_frame / sample_rate
across every frame. Handles MPEG1/2/2.5 Layer I-III, CBR and VBR alike.
"""
import sys, os

BITRATES = {
    (1, 3): [0,32,40,48,56,64,80,96,112,128,160,192,224,256,320,0],
    (1, 2): [0,32,48,56,64,80,96,112,128,160,192,224,256,320,384,0],
    (1, 1): [0,32,64,96,128,160,192,224,256,288,320,352,384,416,448,0],
    (2, 3): [0,8,16,24,32,40,48,56,64,80,96,112,128,144,160,0],
    (2, 2): [0,8,16,24,32,40,48,56,64,80,96,112,128,144,160,0],
    (2, 1): [0,32,48,56,64,80,96,112,128,144,160,176,192,224,256,0],
}
RATES = {3: [44100,48000,32000], 2: [22050,24000,16000], 0: [11025,12000,8000]}

def duration(path):
    d = open(path, "rb").read()
    i = 0
    if d[:3] == b"ID3":
        i = 10 + int.from_bytes(bytes(b & 0x7F for b in d[6:10]), "big", signed=False)
        i = ((d[5] & 0x10) and i + 10) or i          # footer present
    total = 0.0
    n = len(d)
    while i + 4 <= n:
        if d[i] != 0xFF or (d[i+1] & 0xE0) != 0xE0:
            i += 1
            continue
        ver_bits, layer_bits = (d[i+1] >> 3) & 3, (d[i+1] >> 1) & 3
        if ver_bits == 1 or layer_bits == 0:
            i += 1
            continue
        mpeg1 = ver_bits == 3
        layer = {1: 3, 2: 2, 3: 1}[layer_bits]
        br = BITRATES[(1 if mpeg1 else 2, layer)][(d[i+2] >> 4) & 0xF] * 1000
        sr = RATES[ver_bits][(d[i+2] >> 2) & 3]
        if not br or not sr:
            i += 1
            continue
        pad = (d[i+2] >> 1) & 1
        spf = 384 if layer == 1 else (1152 if (layer == 2 or mpeg1) else 576)
        length = (12 * br // sr + pad) * 4 if layer == 1 else (spf // 8 * br // sr + pad)
        if length <= 4:
            i += 1
            continue
        total += spf / sr
        i += length
    return total

if __name__ == "__main__":
    grand = 0.0
    for p in sys.argv[1:]:
        s = duration(p)
        grand += s
        print(f"{os.path.basename(p)[:60]:<62}{int(s//60)}:{s % 60:04.1f}")
    print(f"{'TOTAL':<62}{int(grand//60)}:{grand % 60:04.1f}  ({grand:.1f}s)")
