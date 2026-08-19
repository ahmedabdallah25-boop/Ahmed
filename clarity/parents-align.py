"""Align the verbatim script to the master audio without ASR.

Viterbi over sentence boundaries: every sentence end should land in one of the
audio's silences, and a sentence's spoken duration should track its word count.
The DP picks the monotone assignment of sentences to inter-silence spans that
minimises total |actual speech time - expected time|, allowing a span to carry
several sentences where the reader ran them together.

Exports align(word_index) -> seconds, anchored every span (~5s) instead of
interpolating one global rate across 31 minutes.
"""
import re, os, bisect

HERE = os.path.dirname(os.path.abspath(__file__))
DUR = 1887.96
MAXS, WIN = 4, 14           # sentences per span, gap-search window

sil = [tuple(map(float, l.split())) for l in open(os.path.join(HERE, "parents-silence.txt"))]
gaps = [(0.0, 0.0)] + sil + [(DUR, DUR)]          # (start, end) of each usable boundary

txt = open(os.path.join(HERE, "parents-script.txt")).read()
body = txt[txt.index("=\n", txt.index("=====", txt.index("THE COMMAND THAT NEVER TRAVELS ALONE"))): txt.index("[END]")]
body = "\n".join(l for l in body.split("\n")
                 if not (l.startswith("====") or l.strip().startswith(("BLOCK ", "NOTE")) or l.startswith("  ")))
body = re.sub(r"\[[a-z]+\]", " ", body)
words = [w for w in re.split(r"\s+", body) if w]
N = len(words)

# sentence ends = word indices after terminal punctuation
ends = [i + 1 for i, w in enumerate(words) if re.search(r"[.?!]['\"]?$", w)]
if not ends or ends[-1] != N: ends.append(N)
sent = []            # (start_word, end_word)
prev = 0
for e in ends:
    sent.append((prev, e)); prev = e
K = len(sent)

_sst = [a for a, _ in sil]
_cum = [0.0]                      # speech seconds elapsed before each silence starts
for i, (a, b) in enumerate(sil):
    prev_end = sil[i - 1][1] if i else 0.0
    _cum.append(_cum[-1] + (a - prev_end))

def _cum_speech(t):
    """Speech seconds from 0 to t."""
    i = bisect.bisect_right(_sst, t)
    if i == 0: return t
    a, b = sil[i - 1]
    return _cum[i] + max(0.0, t - b)

def speech_between(t0, t1):
    return max(_cum_speech(t1) - _cum_speech(t0), 0.0)

RATE = N / speech_between(0.0, DUR)          # words per second of speech

M = len(gaps)
INF = float("inf")
dp = [[INF] * M for _ in range(K + 1)]
bt = [[None] * M for _ in range(K + 1)]
dp[0][0] = 0.0
for k in range(K):
    for j in range(M):
        if dp[k][j] == INF: continue
        base = dp[k][j]
        for s in range(1, MAXS + 1):
            if k + s > K: break
            nw = sent[k + s - 1][1] - sent[k][0]
            exp = nw / RATE
            for j2 in range(j + 1, min(j + 1 + WIN, M)):
                act = speech_between(gaps[j][1], gaps[j2][0])
                if act > exp * 2.5 + 4: break
                c = base + abs(act - exp) + 1.2 * (s - 1)
                if c < dp[k + s][j2]:
                    dp[k + s][j2] = c; bt[k + s][j2] = (k, j, s)
best_j = min(range(M), key=lambda j: dp[K][j])
spans, k, j = [], K, best_j
while bt[k][j]:
    pk, pj, s = bt[k][j]
    spans.append((sent[pk][0], sent[k - 1][1], gaps[pj][1], gaps[j][0]))
    k, j = pk, pj
spans.reverse()

_w0 = [s[0] for s in spans]
def align(widx):
    """word index -> seconds, interpolating on speech time inside its span."""
    i = max(0, bisect.bisect_right(_w0, widx) - 1)
    w0, w1, t0, t1 = spans[i]
    if widx <= w0: return t0
    frac = (widx - w0) / max(w1 - w0, 1)
    need, t = frac * speech_between(t0, t1), t0
    for a, b in sil:                       # walk forward skipping silences
        if b <= t0 or a >= t1: continue
        if a - t >= need: return t + need
        need -= max(0.0, a - t); t = b
    return min(t + need, t1)

if __name__ == "__main__":
    resid = sorted(abs(speech_between(t0, t1) - (w1 - w0) / RATE) for w0, w1, t0, t1 in spans)
    covered = sum(w1 - w0 for w0, w1, _, _ in spans)
    print(f"{K} sentences -> {len(spans)} spans, {covered}/{N} words")
    print(f"span length: median {sorted(s[3]-s[2] for s in spans)[len(spans)//2]:.1f}s  "
          f"max {max(s[3]-s[2] for s in spans):.1f}s")
    print(f"fit residual per span: median {resid[len(resid)//2]:.2f}s  "
          f"p90 {resid[int(len(resid)*.9)]:.2f}s  max {resid[-1]:.2f}s")
    print(f"end of last span {spans[-1][3]:.1f}s of {DUR}s")
