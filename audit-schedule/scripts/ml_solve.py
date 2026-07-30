"""Schedule the MARBLELIFE Joint and Emaar audits against the Aug SFM duty roster.

AM shift = MS (08:00-17:30) and MS. (06:00-15:30); the roster's own summary rows group
the codes the same way.  A day takes at most as many audits (Joint + Emaar together) as
it has AM staff on duty.  Each zone is audited once per month on each sheet, and a zone's
two audits are kept at least 7 days apart.
"""
import json, openpyxl
from collections import Counter

AM_CODES = {'MS', 'MS.'}
GAP = 7
SLOT = [0, 6, 25, 60, 110, 180]      # steeply convex -> spread before stacking

# ---- AM headcount per day from the roster -----------------------------------
rs = openpyxl.load_workbook('roster.xlsx')['Aug']
AM = {}
for d in range(1, 32):
    AM[d] = sum(1 for r in range(5, 16)
                if str(rs.cell(r, d + 3).value or '').strip() in AM_CODES)

# ---- zone rows --------------------------------------------------------------
wb = openpyxl.load_workbook('marblelife.xlsx')
J = [(r, wb['JOINT'].cell(r, 1).value) for r in range(4, 29)]
E = [(r, wb['EMAAR'].cell(r, 1).value) for r in range(3, 27)]
assert all(z for _, z in J + E)

class MCMF:
    def __init__(s, n): s.n, s.g = n, [[] for _ in range(n)]
    def add(s, u, v, cap, cost):
        s.g[u].append([v, cap, cost, len(s.g[v])]); s.g[v].append([u, 0, -cost, len(s.g[u]) - 1])
    def run(s, src, snk):
        INF = float('inf'); flow = 0
        while True:
            dist = [INF]*s.n; dist[src] = 0; inq = [False]*s.n
            pv = [-1]*s.n; pe = [-1]*s.n; q = [src]; inq[src] = True
            while q:
                u = q.pop(0); inq[u] = False
                for i, e in enumerate(s.g[u]):
                    v, cap, c, _ = e
                    if cap > 0 and dist[u] + c < dist[v]:
                        dist[v] = dist[u] + c; pv[v], pe[v] = u, i
                        if not inq[v]: q.append(v); inq[v] = True
            if dist[snk] == INF: return flow
            d = INF; v = snk
            while v != src: d = min(d, s.g[pv[v]][pe[v]][1]); v = pv[v]
            v = snk
            while v != src:
                e = s.g[pv[v]][pe[v]]; e[1] -= d; s.g[v][e[3]][1] += d; v = pv[v]
            flow += d

def assign(zones, edges, cap):
    """zones: list of labels; edges: label -> {day: cost}; cap: day -> slots"""
    n = len(zones); S = 0; T = n + 31 + 1
    zi = {z: i + 1 for i, z in enumerate(zones)}; di = {d: n + d for d in range(1, 32)}
    mc = MCMF(T + 1)
    for z in zones:
        mc.add(S, zi[z], 1, 0)
        for d, c in edges[z].items(): mc.add(zi[z], di[d], 1, c)
    for d in range(1, 32):
        for k in range(cap[d]): mc.add(di[d], T, 1, SLOT[min(k, len(SLOT) - 1)])
    if mc.run(S, T) != n: return None
    out = {}
    for z in zones:
        for v, c, _, _ in mc.g[zi[z]]:
            if c == 0 and v in di.values():
                out[z] = next(d for d, i in di.items() if i == v); break
    return out

# Stage 1 -- Joint.  Take at most half of each day's AM cover so the Emaar pass
# always has room left, and never more than the day actually has.
cap1 = {d: max(1, AM[d] // 2) for d in range(1, 32)}
jz = [z for _, z in J]
# Spread the zones evenly across the whole month: zone i aims at the i-th of len(jz)
# equal slices of the 31 days, and pays for drifting off it.
jtarget = {z: (i + 0.5) * 31 / len(jz) + 0.5 for i, z in enumerate(jz)}
JA = assign(jz, {z: {d: abs(d - jtarget[z]) for d in range(1, 32)} for z in jz}, cap1)
assert JA, 'Joint pass infeasible'

# Stage 2 -- Emaar, at least a week from that zone's Joint audit, within what is left.
used = Counter(JA.values())
cap2 = {d: AM[d] - used[d] for d in range(1, 32)}
ez = [z for _, z in E]
# Aim each Emaar audit half a month from its Joint audit, folding back inside
# the month at the edges; the >= GAP filter stays hard.
etarget = {z: JA[z] + 15 if JA[z] + 15 <= 31 else JA[z] - 15 for z in ez}
edges = {z: {d: abs(d - etarget[z]) for d in range(1, 32) if abs(d - JA[z]) >= GAP}
         for z in ez}
EA = assign(ez, edges, cap2)
assert EA, 'Emaar pass infeasible'

comb = Counter(JA.values()) + Counter(EA.values())
print('AM cover :', {d: AM[d] for d in range(1, 32)})
print('Joint    :', dict(sorted(Counter(JA.values()).items())))
print('Emaar    :', dict(sorted(Counter(EA.values()).items())))
print('combined :', {d: comb[d] for d in range(1, 32)})
print('over AM cover:', {d: comb[d] for d in range(1, 32) if comb[d] > AM[d]} or 'none')
gaps = {z: abs(EA[z] - JA[z]) for z in ez}
print(f'gaps: min {min(gaps.values())}, max {max(gaps.values())}, all >=7: {all(g >= GAP for g in gaps.values())}')
print(f'Joint audits {len(JA)} (25 zones incl. Z26), Emaar audits {len(EA)} (24 zones)')
json.dump({'JA': JA, 'EA': EA, 'AM': AM,
           'jrows': {z: r for r, z in J}, 'erows': {z: r for r, z in E}},
          open('ml_assign.json', 'w'))
