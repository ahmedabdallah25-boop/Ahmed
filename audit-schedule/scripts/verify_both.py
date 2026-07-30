"""End-to-end check of both audit sheets, re-deriving everything from the PPM."""
import openpyxl, re
from collections import defaultdict, Counter
from openpyxl.utils import range_boundaries

SRC, OUT = 'audit_july.xlsx', 'Audit_Schedule_JuLY_2026_TRANSGUARD_DM.xlsx'
GAP, CAP = 7, 4
fails = []
def check(ok, msg):
    print(('  PASS  ' if ok else '  FAIL  ') + msg)
    if not ok: fails.append(msg)

# ---- PPM truth table, rebuilt independently ----------------------------------
p = openpyxl.load_workbook('aug_ppm.xlsx')['List of PMs']
ALIAS = {'Z01': 'Z1', 'Z01A': 'Z01a', 'E33': 'Z33'}
pm = defaultdict(set)
for r in range(2, p.max_row + 1):
    if not p.cell(r, 1).value: continue
    d = (p.cell(r, 2).value or '').replace('\xa0', ' ').strip()
    tok = re.search(r'((?:ZB|FV|CT|Z|E)\s*0*\d+[a-zA-Z]?)\s*$', d).group(1).replace(' ', '').upper()
    m, day, y = (int(x) for x in p.cell(r, 3).value.split('/'))
    if (m, y) == (8, 26): pm[ALIAS.get(tok, tok).upper()].add(day)

src, out = openpyxl.load_workbook(SRC), openpyxl.load_workbook(OUT)
ja, ea = out['JOINT AUDIT '], out['EMAAR AUDT']
zones = [ja.cell(r, 1).value for r in range(5, 89)]
zrow = {z: 5 + i for i, z in enumerate(zones)}

def marks(ws, z):
    return [c - 2 for c in range(3, 34) if ws.cell(zrow[z], c).value == 'AU']

for tag, ws in [('JOINT AUDIT', ja), ('EMAAR AUDT', ea)]:
    print(f'== {tag} ==')
    sched, load, one = {}, Counter(), True
    for z in zones:
        m = marks(ws, z)
        if len(m) != 1: one = False
        if m: sched[z] = m[0]; load[m[0]] += 1
    check(one and len(sched) == 84, 'all 84 zones marked exactly once')
    check(not any(ws.cell(zrow[z], c).value == 'AU' for z in zones for c in range(34, 40)),
          'no mark outside the day columns C..AG')
    check(all(1 <= d <= 31 for d in sched.values()), 'every audit is inside August')
    check(max(load.values()) <= CAP, f'no day exceeds {CAP} audits (busiest = {max(load.values())})')
    globals()['S_' + tag[:2]] = sched

JAs, EAs = S_JO, S_EM

print('\n== EMAAR vs JOINT AUDIT ==')
check(all(EAs[z] != JAs[z] for z in zones), 'no zone has both audits on the same day')

has_alt = {z for z in zones if any(d != JAs[z] for d in pm.get(z.upper(), ()))}
anchored = {z for z in zones if EAs[z] in pm.get(z.upper(), ())}
check(anchored == has_alt,
      f'every zone the PPM could anchor is anchored, and no other ({len(anchored)} zones)')
check(all(EAs[z] in pm[z.upper()] and EAs[z] != JAs[z] for z in anchored),
      'each anchored EMAAR audit sits on a real Aug PM date that is not its Joint Audit date')
best = {z: max(abs(d - JAs[z]) for d in pm[z.upper()] if d != JAs[z]) for z in has_alt}
yielded = [z for z in has_alt if abs(EAs[z] - JAs[z]) != best[z]]
check(all(abs(EAs[z] - JAs[z]) >= GAP for z in yielded),
      'any zone not on its furthest PM date still keeps a full week '
      f'(yielded: {", ".join(f"{z} {best[z]}d->{abs(EAs[z]-JAs[z])}d" for z in yielded) or "none"})')
for z in yielded:                       # a yield must be forced by the daily cap
    want = max(pm[z.upper()] - {JAs[z]}, key=lambda d: abs(d - JAs[z]))
    rivals = [y for y in zones if EAs[y] == want]
    check(len(rivals) >= CAP, f'{z} yielded day {want} only because it was already full '
                              f'({len(rivals)} audits: {", ".join(sorted(rivals))})')

free = [z for z in zones if z not in has_alt]
check(all(abs(EAs[z] - JAs[z]) >= GAP for z in free),
      f'all {len(free)} zones without a PPM alternative are >= {GAP} days from the Joint Audit')
check(len(has_alt) + len(free) == 84, f'accounting: {len(has_alt)} PPM-anchored + {len(free)} free = 84')

gaps = {z: abs(EAs[z] - JAs[z]) for z in zones}
short = sorted((g, z) for z, g in gaps.items() if g < GAP)
print(f'  NOTE  {len(short)} zones fall short of the {GAP}-day gap - unavoidable under the'
      ' "PPM date wins" rule; all are PPM-anchored:')
print('        ' + ', '.join(f'{z} {g}d' for g, z in short))
check(all(z in anchored for _, z in short), 'every sub-week gap is the price of a real PM date, not a free choice')

print('\n== preserved content ==')
for tag, o, s in [('JOINT AUDIT ', ja, src['JOINT AUDIT ']), ('EMAAR AUDT', ea, src['EMAAR AUDT'])]:
    check([o.cell(r,1).value for r in range(5,89)] == [s.cell(r,1).value for r in range(5,89)], f'{tag}: zone column unchanged')
    check([o.cell(r,2).value for r in range(5,89)] == [s.cell(r,2).value for r in range(5,89)], f'{tag}: auditor names unchanged')
    check([o.cell(4,c).value for c in range(1,40)] == [s.cell(4,c).value for c in range(1,40)], f'{tag}: header row unchanged')
    check(str(o.merged_cells.ranges) == str(s.merged_cells.ranges), f'{tag}: merged ranges unchanged')
    check(o.freeze_panes == s.freeze_panes and o.auto_filter.ref == s.auto_filter.ref, f'{tag}: panes/filter unchanged')
for sh in ['INSTRUCTION', 'ZONE']:
    check([[c.value for c in r] for r in src[sh].iter_rows()] == [[c.value for c in r] for r in out[sh].iter_rows()],
          f"sheet '{sh}' untouched")
check(out.sheetnames == src.sheetnames, 'sheet names/order unchanged')

print('\n== formulas ==')
def counta(ws, rng):
    c1, r1, c2, r2 = range_boundaries(rng)
    return sum(1 for rr in range(r1, r2+1) for cc in range(c1, c2+1) if ws.cell(rr, cc).value not in (None, ''))
pat = re.compile(r'^=(COUNTA|SUM)\([A-Z]+\d+:[A-Z]+\d+\)$')
allf = [(w.title, c.coordinate, c.value) for w in out.worksheets for row in w.iter_rows()
        for c in row if isinstance(c.value, str) and c.value.startswith('=')]
check(all(pat.match(f) for _, _, f in allf), f'all {len(allf)} formulas are plain COUNTA/SUM (the broken =AG93 is gone)')
for tag, ws, sched in [('JOINT AUDIT', ja, JAs), ('EMAAR AUDT', ea, EAs)]:
    rt = {r: counta(ws, ws.cell(r,35).value[8:-1]) for r in range(5,89)}
    check(all(v == 1 for v in rt.values()), f'{tag}: every per-zone total (AI) evaluates to 1')
    load = Counter(sched.values())
    got = {d: counta(ws, ws.cell(89, d+2).value[8:-1]) for d in range(1,32)}
    check(got == {d: load.get(d,0) for d in range(1,32)}, f'{tag}: all 31 day totals evaluate to the real count')
    check(sum(rt.values()) == 84, f'{tag}: grand total (AI89) evaluates to 84')

print('\nRESULT:', 'ALL CHECKS PASSED' if not fails else f'{len(fails)} FAILURE(S): {fails}')
