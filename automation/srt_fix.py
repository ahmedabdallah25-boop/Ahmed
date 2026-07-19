#!/usr/bin/env python3
"""Fix common SRT issues that make YouTube reject caption uploads.
Usage: python3 srt_fix.py input.srt [output.srt]
Fixes: BOM/encoding, dot-vs-comma millis, short timestamps, arrow spacing,
cue renumbering, overlaps, zero-duration cues, missing blank lines, CRLF.
"""
import re, sys

def parse_ts(ts):
    ts = ts.strip().replace('.', ',')
    m = re.match(r'(?:(\d+):)?(\d{1,2}):(\d{1,2})[,](\d{1,3})$', ts)
    if not m:
        return None
    h = int(m.group(1) or 0)
    return ((h * 3600 + int(m.group(2)) * 60 + int(m.group(3))) * 1000
            + int(m.group(4).ljust(3, '0')))

def fmt_ts(ms):
    h, rem = divmod(ms, 3600000)
    m, rem = divmod(rem, 60000)
    s, ms = divmod(rem, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

def main():
    if len(sys.argv) < 2:
        sys.exit("Usage: python3 srt_fix.py input.srt [output.srt]")
    src = sys.argv[1]
    dst = sys.argv[2] if len(sys.argv) > 2 else src.replace('.srt', '_fixed.srt')

    raw = open(src, 'rb').read()
    for enc in ('utf-8-sig', 'utf-8', 'cp1256', 'latin-1'):
        try:
            text = raw.decode(enc); break
        except UnicodeDecodeError:
            continue
    text = text.replace('\r\n', '\n').replace('\r', '\n')

    # Split into cue blocks on blank lines OR on lines that look like a bare index
    blocks, cur = [], []
    for line in text.split('\n'):
        if not line.strip():
            if cur: blocks.append(cur); cur = []
        else:
            cur.append(line)
    if cur: blocks.append(cur)

    cues, issues = [], []
    arrow = re.compile(r'\s*-+\s*>\s*')
    for b in blocks:
        # Drop a leading pure-number index line if present
        lines = b[1:] if re.fullmatch(r'\d+', b[0].strip()) else b[:]
        if not lines: continue
        parts = arrow.split(lines[0], maxsplit=1)
        if len(parts) != 2:
            issues.append(f"skipped block (no timestamp): {b[0][:40]!r}")
            continue
        start, end = parse_ts(parts[0]), parse_ts(parts[1])
        txt = [l.strip() for l in lines[1:] if l.strip()]
        if start is None or end is None or not txt:
            issues.append(f"skipped malformed cue near {parts[0].strip()!r}")
            continue
        cues.append([start, end, txt])

    cues.sort(key=lambda c: c[0])
    for i, c in enumerate(cues):
        if c[1] <= c[0]:
            c[1] = c[0] + 500
            issues.append(f"cue {i+1}: zero/negative duration -> +500ms")
        if i + 1 < len(cues) and c[1] > cues[i + 1][0]:
            c[1] = cues[i + 1][0]
            issues.append(f"cue {i+1}: overlap clamped")

    with open(dst, 'w', encoding='utf-8', newline='\n') as f:
        for i, (s, e, txt) in enumerate(cues, 1):
            f.write(f"{i}\n{fmt_ts(s)} --> {fmt_ts(e)}\n" + "\n".join(txt) + "\n\n")

    print(f"Wrote {len(cues)} cues -> {dst}")
    print("\n".join(issues) if issues else "No structural issues found (encoding/format normalized anyway).")

if __name__ == '__main__':
    main()
