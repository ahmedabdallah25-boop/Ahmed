"""Turns a tagged ElevenLabs narration script into the caption units to align.

One unit per sentence, because that is the grain a subtitle cue wants and the
grain forced alignment is reliable at. The v3 performance tags are direction for
the read, not words anyone said, so they are stripped for alignment and kept
alongside for the record.

    python3 scripts/parse-script.py <script.txt> <out.json>
"""
import json, re, sys, unicodedata

SRC, OUT = sys.argv[1], sys.argv[2]
text = open(SRC, encoding='utf-8').read()

# The blocks only. Everything above BLOCK 01 is production notes and everything
# from TAG COUNT down is the audit, and both contain prose that would otherwise
# be read as script.
body = text[text.index('\nBLOCK 01'):text.index('\nTAG COUNT')]

units = []
for chunk in re.split(r'\n=+\n(?=BLOCK )', '\n' + body):
    head = re.match(r'BLOCK (\S+) · (\d+:\d+)–(\d+:\d+) · (.+)', chunk.strip())
    if not head:
        continue
    block = head.group(1)
    # Drop the whole header box in one cut: from the BLOCK line to the rule
    # that closes it. Two of the blocks carry a multi-line NOTE inside that box,
    # and trimming it line by line is how you accidentally delete a wrapped line
    # of script — a pattern for the note's indented continuation lines also
    # matches the second line of any indented paragraph.
    after_head = chunk[chunk.index('BLOCK '):]
    rule = re.search(r'^=+$', after_head, flags=re.M)
    rest = after_head[rule.end():] if rule else after_head
    rest = rest.replace('[END]', '')

    for para in [p for p in re.split(r'\n\s*\n', rest) if p.strip()]:
        para = re.sub(r'\s+', ' ', para).strip()
        # Sentence split that does not break on "Mu'awiya ibn Jahima — and he",
        # on an ellipsis, or on the initial in "Ibn Hajar". Split after . ! or ?
        # only when the next thing is a capital or an opening tag.
        for sent in re.split(r'(?<=[.!?])\s+(?=\[|[A-Z"“])', para):
            sent = sent.strip()
            if not sent:
                continue
            tags = re.findall(r'\[(\w+)\]', sent)
            spoken = re.sub(r'\[[^\]]*\]', ' ', sent)
            spoken = re.sub(r'\s+', ' ', spoken).strip()
            if not re.search(r'[A-Za-z]', spoken):
                continue
            units.append({'n': len(units) + 1, 'block': block,
                          'text': spoken, 'tags': tags})

json.dump(units, open(OUT, 'w'), indent=1, ensure_ascii=False)

blocks = {}
for u in units:
    blocks[u['block']] = blocks.get(u['block'], 0) + 1
chars = sum(len(u['text']) for u in units)
print(f'{len(units)} caption units across {len(blocks)} blocks -> {OUT}')
print('  ' + '  '.join(f'{b}:{n}' for b, n in blocks.items()))
print(f'  {chars} spoken characters; at 12.6 chars/sec that is {chars / 12.6 / 60:.1f} minutes of read')
