"""Write the schedule into the MARBLELIFE workbook by patching the sheet XML in place.

openpyxl cannot round-trip this file: it silently drops the three sheet logos
(xl/media + xl/drawings) and the printer settings.  So every other part of the
package is copied through byte-for-byte and only the two sheet parts are edited.
"""
import json, re, shutil, zipfile

SRC = 'marblelife.xlsx'
OUT = 'Audit_Schedule_JuLY_2026_MARBLELIFE.xlsx'
AU_SI = 65                     # shared-string index of "AU"

A = json.load(open('ml_assign.json'))
JA, EA, JROW, EROW = A['JA'], A['EA'], A['jrows'], A['erows']

def cidx(letters):
    n = 0
    for ch in letters: n = n * 26 + ord(ch) - 64
    return n
def clet(n):
    s = ''
    while n: n, r = divmod(n - 1, 26); s = chr(65 + r) + s
    return s

CELL = re.compile(r'<c\s[^>]*?/>|<c\s[^>]*?>.*?</c>', re.S)

class Sheet:
    def __init__(self, xml): self.xml = xml
    def _row(self, r):
        m = re.search(r'<row r="%d"[^>]*>.*?</row>|<row r="%d"[^>]*/>' % (r, r), self.xml, re.S)
        if not m: raise KeyError(f'row {r} not found')
        return m
    def edit_row(self, r, ops):
        """ops: {col_index: ('clear'|'str'|'f', payload)}"""
        m = self._row(r)
        block = m.group(0)
        open_tag = re.match(r'<row [^>]*?>', block).group(0)
        cells = {}
        for cm in CELL.finditer(block):
            t = cm.group(0)
            col = re.search(r'\br="([A-Z]+)\d+"', t).group(1)
            cells[cidx(col)] = t
        def style_of(t):
            s = re.search(r'\bs="(\d+)"', t or '')
            return f' s="{s.group(1)}"' if s else ''
        for c, (kind, payload) in ops.items():
            cur = cells.get(c)
            if cur is None:                       # borrow a neighbour's style
                near = min((k for k in cells if k != c), key=lambda k: abs(k - c), default=None)
                st = style_of(cells[near]) if near else ''
            else:
                st = style_of(cur)
            ref = f'{clet(c)}{r}'
            if kind == 'clear':   cells[c] = f'<c r="{ref}"{st}/>'
            elif kind == 'str':   cells[c] = f'<c r="{ref}"{st} t="s"><v>{payload}</v></c>'
            elif kind == 'f':     cells[c] = f'<c r="{ref}"{st}><f>{payload}</f></c>'
        ordered = ''.join(cells[k] for k in sorted(cells))
        lo, hi = min(cells), max(cells)
        open_tag = re.sub(r'\sspans="[^"]*"', '', open_tag)
        open_tag = open_tag[:-1] + f' spans="{lo}:{hi}">'
        self.xml = self.xml[:m.start()] + open_tag + ordered + '</row>' + self.xml[m.end():]

def build(sheet_xml, rows, day_of, first, last, total_row, rowtot_end, dayrange_extra):
    sh = Sheet(sheet_xml)
    for zone, r in rows.items():
        ops = {c: ('clear', None) for c in range(2, 35)}          # B..AH: wipe the grid
        ops[cidx('AI')] = ('f', f'COUNTA(B{r}:{rowtot_end}{r})')  # per-zone total
        ops[day_of[zone] + 1] = ('str', AU_SI)                    # day d -> column d+1
        sh.edit_row(r, ops)
    ops = {}
    for d in range(1, 32):
        L = clet(d + 1)
        ops[d + 1] = ('f', f'COUNTA({L}{first}:{L}{last})')
    for extra in dayrange_extra:
        ops[cidx(extra)] = ('f', f'COUNTA({extra}{first}:{extra}{last})')
    ops[cidx('AI')] = ('f', 'SUM(B%d:AF%d)' % (total_row, total_row))
    sh.edit_row(total_row, ops)
    return sh.xml

z = zipfile.ZipFile(SRC)
sheets = {
    'xl/worksheets/sheet2.xml': build(z.read('xl/worksheets/sheet2.xml').decode(),
                                      JROW, JA, 4, 28, 29, 'AG', ['AG']),
    'xl/worksheets/sheet3.xml': build(z.read('xl/worksheets/sheet3.xml').decode(),
                                      EROW, EA, 3, 26, 27, 'AF', []),
}
wbx = z.read('xl/workbook.xml').decode()
if 'fullCalcOnLoad' not in wbx:                 # values are uncached -> force a recalc
    wbx = re.sub(r'<calcPr([^>]*?)/>', r'<calcPr\1 fullCalcOnLoad="1"/>', wbx)
sheets['xl/workbook.xml'] = wbx

with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as out:
    for item in z.infolist():
        data = sheets[item.filename].encode() if item.filename in sheets else z.read(item.filename)
        out.writestr(item, data)
print('written:', OUT)
kept = set(zipfile.ZipFile(OUT).namelist())
orig = set(z.namelist())
print('parts preserved:', kept == orig, '| logos/media intact:',
      all(n in kept for n in orig if 'media' in n or 'drawing' in n))
