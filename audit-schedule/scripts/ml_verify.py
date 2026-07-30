"""Independent check of the MARBLELIFE workbook."""
import openpyxl, zipfile, re
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from openpyxl.utils import range_boundaries

SRC, OUT = 'marblelife.xlsx', 'Audit_Schedule_JuLY_2026_MARBLELIFE.xlsx'
GAP = 7
fails = []
def check(ok, msg):
    print(('  PASS  ' if ok else '  FAIL  ') + msg)
    if not ok: fails.append(msg)

print('== package integrity ==')
zs, zo = zipfile.ZipFile(SRC), zipfile.ZipFile(OUT)
check(set(zs.namelist()) == set(zo.namelist()), 'every part of the original package is still present')
untouched = [n for n in zs.namelist() if n not in
             ('xl/worksheets/sheet2.xml', 'xl/worksheets/sheet3.xml', 'xl/workbook.xml')]
check(all(zs.read(n) == zo.read(n) for n in untouched),
      f'the {len(untouched)} parts I did not edit are byte-identical (logos, media, styles, printer settings)')
check(zs.read('xl/media/image1.png') == zo.read('xl/media/image1.png'), 'embedded logo image is bit-for-bit intact')
for n in zo.namelist():
    if n.endswith('.xml'):
        try: ET.fromstring(zo.read(n))
        except ET.ParseError as e: check(False, f'{n} is malformed: {e}')
check(True, 'every XML part parses')
for s in ('sheet2.xml', 'sheet3.xml'):
    x = zo.read('xl/worksheets/' + s).decode()
    masters = set(re.findall(r'<f[^>]*t="shared"[^>]*ref="[^"]*"[^>]*si="(\d+)"', x))
    used = set(re.findall(r'<f[^>]*t="shared"[^>]*si="(\d+)"', x))
    check(used <= masters, f'{s}: no shared formula left pointing at a dissolved master '
                           f'(masters={sorted(masters)}, used={sorted(used)})')

print('\n== schedule ==')
src, out = openpyxl.load_workbook(SRC), openpyxl.load_workbook(OUT)
rs = openpyxl.load_workbook('roster.xlsx')['Aug']
AM = {d: sum(1 for r in range(5, 16)
             if str(rs.cell(r, d + 3).value or '').strip() in {'MS', 'MS.'}) for d in range(1, 32)}

sched = {}
for tag, first, last in [('JOINT', 4, 28), ('EMAAR', 3, 26)]:
    ws = out[tag]; one = True; got = {}
    for r in range(first, last + 1):
        z = ws.cell(r, 1).value
        marks = [c - 1 for c in range(2, 33) if ws.cell(r, c).value == 'AU']
        if len(marks) != 1: one = False
        if marks: got[z] = marks[0]
        if any(ws.cell(r, c).value is not None for c in range(33, 35)):
            check(False, f'{tag} row {r}: stray value outside the day grid')
    n = last - first + 1
    check(one and len(got) == n, f'{tag}: all {n} zones marked exactly once')
    check(all(1 <= d <= 31 for d in got.values()), f'{tag}: every audit is inside August')
    sched[tag] = got
J, E = sched['JOINT'], sched['EMAAR']
check(set(J) - set(E) == {'Z26'}, f"JOINT carries Z26 on top of EMAAR's zones (extra: {sorted(set(J)-set(E))})")

comb = Counter(J.values()) + Counter(E.values())
over = {d: (comb[d], AM[d]) for d in range(1, 32) if comb[d] > AM[d]}
check(not over, f'no day exceeds its AM headcount (worst day uses '
                f'{max(comb[d]/AM[d] for d in range(1,32)):.0%} of cover)')
check(all(comb[d] >= 1 for d in range(1, 32)), 'every day of the month carries at least one audit')
gaps = {z: abs(E[z] - J[z]) for z in E}
check(all(g >= GAP for g in gaps.values()),
      f'every zone has >= {GAP} days between its Joint and Emaar audit (min {min(gaps.values())})')
check(all(J[z] != E[z] for z in E), 'no zone is audited twice on the same day')

print('\n== preserved content ==')
for tag, first, last in [('JOINT', 4, 28), ('EMAAR', 3, 26)]:
    check([out[tag].cell(r, 1).value for r in range(first, last+1)] ==
          [src[tag].cell(r, 1).value for r in range(first, last+1)], f'{tag}: zone column unchanged')
    hdr = 3 if tag == 'JOINT' else 2
    check([out[tag].cell(hdr, c).value for c in range(1, 38)] ==
          [src[tag].cell(hdr, c).value for c in range(1, 38)], f'{tag}: header row unchanged')
    check(str(out[tag].merged_cells.ranges) == str(src[tag].merged_cells.ranges), f'{tag}: merged ranges unchanged')
for sh in ['INSTRUCTION', 'ZONE']:
    check([[c.value for c in r] for r in src[sh].iter_rows()] ==
          [[c.value for c in r] for r in out[sh].iter_rows()], f"sheet '{sh}' untouched")
check(out.sheetnames == src.sheetnames, 'sheet names/order unchanged')

print('\n== formulas ==')
def counta(ws, rng):
    c1, r1, c2, r2 = range_boundaries(rng)
    return sum(1 for rr in range(r1, r2+1) for cc in range(c1, c2+1)
               if ws.cell(rr, cc).value not in (None, ''))
pat = re.compile(r'^=(COUNTA|SUM)\([A-Z]+\d+:[A-Z]+\d+\)$')
allf = [(w.title, c.coordinate, c.value) for w in out.worksheets for row in w.iter_rows()
        for c in row if isinstance(c.value, str) and c.value.startswith('=')]
check(all(pat.match(f) for _, _, f in allf), f'all {len(allf)} formulas are plain COUNTA/SUM')
for tag, first, last, trow in [('JOINT', 4, 28, 29), ('EMAAR', 3, 26, 27)]:
    ws = out[tag]
    rt = {r: counta(ws, ws.cell(r, 35).value[8:-1]) for r in range(first, last+1)}
    check(all(v == 1 for v in rt.values()), f'{tag}: every per-zone total (AI) evaluates to 1')
    want = Counter(sched[tag].values())
    got = {d: counta(ws, ws.cell(trow, d+1).value[8:-1]) for d in range(1, 32)}
    check(got == {d: want.get(d, 0) for d in range(1, 32)},
          f'{tag}: all 31 day totals evaluate to the real count (incl. the ones that were missing)')
    n = last - first + 1
    check(sum(got.values()) == n, f'{tag}: day totals sum to {n}')
print('\nRESULT:', 'ALL CHECKS PASSED' if not fails else f'{len(fails)} FAILURE(S): {fails}')
