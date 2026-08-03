import re, html, pathlib, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else 'sound-money-scene-pack.txt'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'scene-pack.html'
src = pathlib.Path(SRC).read_text()
lines = src.split('\n')
out = []
i = 0
RULE = re.compile(r'^[=-]{20,}$')
SCENE = re.compile(r'^SCENE (\d\d) \| (\d:\d\d)-(\d:\d\d) \| (.+)$')
FIELD = re.compile(r'^(VO|CAPTION 1|CAPTION 2|ACTION|IMAGE PROMPT|NEGATIVE|\[POST\]):?\s*(.*)$')

def esc(t):
    return html.escape(t)

# split file into blocks separated by rule lines
blocks, cur = [], []
for ln in lines:
    if RULE.match(ln):
        blocks.append(cur); cur = []
    else:
        cur.append(ln)
blocks.append(cur)

def flush_para(buf):
    if not buf: return ''
    txt = '\n'.join(buf).strip('\n')
    if not txt.strip(): return ''
    return '<pre class="body">%s</pre>' % esc(txt)

n = len(blocks)
k = 0
while k < n:
    b = blocks[k]
    head = next((x for x in b if x.strip()), '')
    m = SCENE.match(head.strip())
    if m:
        num, t0, t1, name = m.groups()
        star = 'star' if '***' in name or 'PEAK' in name else ''
        name = name.replace('***', '').strip()
        fields = []
        buf = []
        for ln in b[b.index(head)+1:]:
            fm = FIELD.match(ln)
            if fm:
                if buf: fields.append(('cont', '\n'.join(buf))); buf = []
                fields.append((fm.group(1), fm.group(2)))
            elif ln.strip():
                buf.append(ln.strip())
        if buf: fields.append(('cont', ' '.join(buf)))
        # merge continuation into previous field
        merged = []
        for key, val in fields:
            if key == 'cont' and merged:
                merged[-1] = (merged[-1][0], merged[-1][1] + ' ' + val.replace('\n', ' '))
            else:
                merged.append((key, val))
        rows = []
        for key, val in merged:
            if key == 'VO':
                v = esc(val)
                v = re.sub(r'\[(\w+)\]', r'<em class="tag">[\1]</em>', v)
                v = v.replace(' / ', '<span class="slash"> / </span>')
                rows.append('<div class="vo">%s</div>' % v)
            elif key.startswith('CAPTION'):
                cls = 'cap1' if key.endswith('1') else 'cap2'
                rows.append('<div class="%s"><span>%s</span></div>' % (cls, esc(val)))
            elif key == 'NEGATIVE':
                rows.append('<div class="neg"><span class="lbl">NEGATIVE</span>%s</div>' % esc(val))
            elif key in ('ACTION', 'IMAGE PROMPT'):
                rows.append('<div class="action"><span class="lbl">PROMPT</span>%s</div>' % esc(val))
            else:
                rows.append('<div class="post"><span class="lbl">POST</span>%s</div>' % esc(val))
        out.append(
            '<section class="scene %s"><header><span class="num">%s</span>'
            '<span class="time">%s – %s</span><span class="name">%s</span></header>%s</section>'
            % (star, num, t0, t1, esc(name), ''.join(rows)))
    else:
        txt = [x for x in b]
        while txt and not txt[0].strip(): txt.pop(0)
        while txt and not txt[-1].strip(): txt.pop()
        if not txt:
            k += 1; continue
        if 'FINANCE % DECODED' in txt[0]:   # file header — the cover says it
            k += 1; continue
        first = txt[0].strip()
        stem = first.split('—')[0].split('(')[0].strip()
        letters = [c for c in stem if c.isalpha()]
        is_head = (len(first) < 72 and len(letters) > 2
                   and sum(c.isupper() for c in letters) / len(letters) > 0.85)
        if is_head:
            out.append('<h2>%s</h2>' % esc(first))
            out.append(flush_para(txt[1:]))
        else:
            out.append(flush_para(txt))
    k += 1

body = '\n'.join(x for x in out if x)

css = """
@page { size: A4; margin: 16mm 14mm 18mm; }
* { box-sizing: border-box; }
body { font-family: "DejaVu Sans", Helvetica, Arial, sans-serif; color: #1b1b1f;
       font-size: 10.2pt; line-height: 1.5; margin: 0; }
.cover { page-break-after: always; padding-top: 55mm; }
.cover .kicker { letter-spacing: .28em; font-size: 8.5pt; text-transform: uppercase;
       color: #8a6a1f; font-weight: 700; }
.cover h1 { font-size: 27pt; line-height: 1.1; margin: 6mm 0 3mm; letter-spacing: -.5pt; }
.cover .sub { font-size: 12pt; color: #55555f; margin-bottom: 14mm; }
.cover dl { display: grid; grid-template-columns: 34mm 1fr; gap: 2mm 4mm;
       border-top: 1.5pt solid #1b1b1f; padding-top: 4mm; font-size: 9.5pt; }
.cover dt { color: #7a7a85; text-transform: uppercase; letter-spacing: .1em; font-size: 8pt;
       padding-top: 1pt; }
.cover dd { margin: 0; font-weight: 600; }
h2 { font-size: 12.5pt; letter-spacing: .04em; text-transform: uppercase;
     border-bottom: 1.5pt solid #1b1b1f; padding-bottom: 2mm; margin: 10mm 0 4mm;
     page-break-after: avoid; }
pre.body { font-family: "DejaVu Sans Mono", monospace; font-size: 8.6pt; line-height: 1.55;
     white-space: pre-wrap; margin: 0 0 4mm; color: #33333a; }
.scene { border: .6pt solid #d8d8de; border-left: 2.4pt solid #c8a44a; border-radius: 2mm;
     padding: 3.5mm 4mm; margin: 0 0 3.5mm; page-break-inside: avoid; }
.scene.star { border-left-color: #1b1b1f; background: #fbf7ee; }
.scene header { display: flex; align-items: baseline; gap: 4mm; margin-bottom: 2.5mm; }
.num { font-size: 15pt; font-weight: 800; letter-spacing: -.5pt; }
.time { font-family: "DejaVu Sans Mono", monospace; font-size: 8.5pt; color: #7a7a85; }
.name { font-size: 8pt; text-transform: uppercase; letter-spacing: .12em; font-weight: 700;
     color: #8a6a1f; margin-left: auto; text-align: right; }
.scene.star .name { color: #1b1b1f; }
.vo { font-size: 10.8pt; line-height: 1.45; margin-bottom: 2.5mm; }
.tag { color: #8a6a1f; font-style: normal; font-weight: 700; font-size: 8.6pt; }
.slash { color: #c0c0c8; }
.cap1 span, .cap2 span { display: inline-block; padding: .7mm 2mm; background: #1b1b1f;
     color: #fff; font-size: 8.4pt; line-height: 1.35; }
.cap2 { margin-left: -3mm; margin-top: .8mm; }
.cap2 span { color: #f5d76e; font-style: italic; }
.action { margin-top: 2.5mm; font-size: 9pt; color: #44444c; }
.neg { margin-top: 2mm; font-size: 7.6pt; color: #8a8a94; line-height: 1.4;
     border-top: .5pt dotted #d8d8de; padding-top: 1.6mm; }
.post { margin-top: 2mm; font-size: 8.6pt; color: #44444c; }
.lbl { display: inline-block; font-size: 7pt; letter-spacing: .14em; font-weight: 700;
     color: #9a9aa4; margin-right: 2mm; vertical-align: 1pt; }
"""

cover = """
<div class="cover">
  <div class="kicker">Finance % Decoded &middot; The Money Machine, Decoded</div>
  <h1>How to Own Gold<br>Without Owning a Promise</h1>
  <div class="sub">Part 15 &mdash; The Fix &middot; Scene Pack</div>
  <dl>
    <dt>Format</dt><dd>9:16 vertical, 1080&times;1920</dd>
    <dt>Runtime</dt><dd>~89 seconds</dd>
    <dt>Scenes</dt><dd>26</dd>
    <dt>Style</dt><dd>3D faceless low-poly &mdash; same character and seed as Part 14</dd>
    <dt>Sequel to</dt><dd>Part 14, &ldquo;The Tax Nobody Voted For&rdquo;</dd>
    <dt>Payoff frames</dt><dd>Scene 17 (mechanism) &middot; Scene 21 (peak / thumbnail)</dd>
  </dl>
</div>
"""

pathlib.Path(OUT).write_text(
    '<!doctype html><html><head><meta charset="utf-8"><title>Part 15 Scene Pack</title>'
    '<style>%s</style></head><body>%s%s</body></html>' % (css, cover, body))
print('wrote', OUT)
