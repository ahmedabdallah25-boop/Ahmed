import json, base64, html, sys, pathlib
S = pathlib.Path(__file__).parent
Q = json.load(open(S/'dl/quran-json-3.1.2/package/dist/quran_en.json'))
def font(p):
    return base64.b64encode(open(S/'dl'/p,'rb').read()).decode()
AM4 = font('fontsource-amiri-5.3.0/package/files/amiri-arabic-400-normal.woff2')
AM7 = font('fontsource-amiri-5.3.0/package/files/amiri-arabic-700-normal.woff2')

def ayat(s, a, b=None):
    ch = Q[s-1]; b = b or a
    vv = [v for v in ch['verses'] if a <= v['id'] <= b]
    ar = ' '.join(f"{v['text']} ﴿{v['id']}﴾" for v in vv)
    en = ' '.join(f"({v['id']}) {html.escape(v['translation'])}" for v in vv)
    ref = f"{ch['transliteration']} {s}:{a}" + (f"–{b}" if b != a else "")
    return f'<div class="ayah"><div class="ref">{ref} <span class="arname">{ch["name"]}</span></div><p class="ar">{ar}</p><p class="en">{en}</p></div>'

# (title, intro, [(surah, from, to), ...])
STAGES = [
 ("Stage 1 — Preparation", """Ruqyah is healing by the words of Allah. Nothing in it works by itself; it works by Allah's permission. Before a single ayah is recited, settle these matters, because the Prophet ﷺ said: "There is no harm in ruqyah as long as it contains no shirk" (Muslim).
<ul><li><b>Correct the belief.</b> Cure comes from Allah alone. The reciter, the water, the oil — none of them heals; they are means.</li><li><b>Purify.</b> Perform wudu. Pray two rakʿahs if possible. Face the qiblah. Sit in a clean, quiet place.</li><li><b>Remove what blocks it.</b> Images, music, amulets and charms (<i>tamā'im</i>) in the room or on the body. Sincere repentance from sins. If you owe anyone something, intend to return it.</li><li><b>Make intention.</b> Say it in your heart: "I seek cure from Allah through His words." Nothing else — no formulas, no names of jinn, no unknown words.</li><li><b>Prepare water</b> (a bottle for drinking, enough for two days, and a separate container for one bath — both open while you recite) and, if used, <b>olive oil</b> and <b>black seed</b>. They are recited over, then drunk or applied.</li></ul>""", []),
 ("Stage 2 — Opening", """Begin as every act of worship begins. Say <i>Aʿūdhu billāhi minash-shayṭānir-rajīm</i>, then <i>Bismillāhir-raḥmānir-raḥīm</i>, then recite Al-Fatihah — the Prophet ﷺ confirmed it as a ruqyah ("How did you know it is a ruqyah?") when a companion recited it over a tribal chief stung by a scorpion (Bukhari, Muslim). Recite each text clearly, slowly, with presence of heart, and blow gently (<i>nafth</i>) with light spittle on the hands, the affected area, or into the water after each one. This applies to every text in Stages 2–6: recite, then blow once into the open bottle (and onto the oil if used), and once over the patient. Keep the bottle open and within reach throughout. Unless a stage says otherwise, recite each passage once; one full pass of all seven stages is one session. Al-Fatihah is the exception: repeat it seven times if the condition is heavy.""",
  [(1,1,7)]),
 ("Stage 3 — Affirming Allah's Oneness and Majesty", """The core of ruqyah is <i>tawḥīd</i>. Shaytan and his helpers cannot bear the declaration of Allah's oneness and His throne. Āyat al-Kursī is the greatest verse in the Qur'an (Muslim) and a nightly guard against Shaytan (Bukhari). Al-Baqarah's closing verses were given from a treasure beneath the Throne (Ahmad).""",
  [(2,1,5),(2,163,164),(2,255,257),(2,284,286),(3,18,19),(3,26,27),(23,115,118),(59,21,24),(112,1,4)]),
 ("Stage 4 — Breaking Magic (Siḥr)", """These are the verses that mention sorcery directly and declare its nullity. Allah describes the sorcerer who learns what harms him and does not profit him, and tells Musa that what the magicians made is a falsehood He will undo. Recite them slowly, repeating 3, 7 or more times, especially over water and oil. If the patient is present, recite with the hand on the head or the painful place. The patient may yawn, weep, feel heat or nausea, or tremble. None of this is the aim and none of it is dangerous: keep reciting calmly, do not raise your voice or strike, and do not speak to anything that speaks through the patient. If the patient is about to vomit or faint, pause, let them lie on their side, then resume. Seek medical help for anything that would need it without ruqyah (seizure, injury, chest pain).""",
  [(2,102,102),(7,117,122),(10,81,82),(20,69,69)]),
 ("Stage 5 — Driving Out Jinn and Evil Eye", """These verses command the jinn, remind them of their limits, and describe their punishment. They are also the verses that treat the evil eye (<i>ʿayn</i>) and envy (<i>ḥasad</i>). Recite with firmness, not fear. Allah says: "Indeed, the plot of Shaytan has ever been weak" (4:76). Address no one but Allah. If a jinn speaks, do not bargain, question or obey it; recite louder and continue. Al-Ikhlas, Al-Falaq and An-Nas (<i>al-muʿawwidhāt</i>) are the surahs the Prophet ﷺ recited over himself when ill, and ʿĀ'ishah recited over him when it grew severe (Bukhari); recite them three times each.""",
  [(7,54,56),(37,1,10),(46,29,32),(55,33,36),(72,1,9),(68,51,52),(113,1,5),(114,1,6)]),
 ("Stage 6 — Verses of Healing (Shifā')", """The six verses in which Allah names <i>shifā'</i> — cure. Recite them over the water and oil last, so they close the recitation, and recite them over the patient directly. Then say the Prophetic prayers of healing: <i>Bismillāhi arqīka min kulli shay'in yu'dhīka, min sharri kulli nafsin aw ʿayni ḥāsidin, Allāhu yashfīka, bismillāhi arqīka</i> — "In the name of Allah I recite over you against everything that harms you, from the evil of every soul or envious eye; may Allah cure you" (Muslim). And: <i>Allāhumma Rabban-nās, adhhibil-ba's, ishfi anta ash-Shāfī, lā shifā'a illā shifā'uk, shifā'an lā yughādiru saqaman</i> (Bukhari). Then, with the right hand on the pain, say <i>Bismillāh</i> three times and seven times: <i>Aʿūdhu bi-ʿizzatillāhi wa qudratihi min sharri mā ajidu wa uḥādhir</i> — "I seek refuge in Allah's might and power from the evil of what I feel and fear" (Muslim).""",
  [(9,14,14),(10,57,57),(16,69,69),(17,82,82),(26,80,80),(41,44,44)]),
 ("Stage 7 — After the Recitation", """<ul><li><b>Session length:</b> one full pass takes 40–60 minutes. Stop at the end of Stage 6 even if the patient still reacts; do not prolong a session past an hour or recite over someone who is exhausted.</li><li><b>Drink</b> the recited water morning and evening until it is finished, then recite over fresh water at the next session; <b>bathe</b> with recited water (not in the toilet, and not poured into drains that carry impurity — pour it on clean ground or in the garden).</li><li><b>Apply</b> recited olive oil to the body before sleep. Eat black seed with honey.</li><li><b>Keep the daily guards:</b> the morning and evening adhkār; Āyat al-Kursī and the three Quls after every prayer and before sleep; Surah Al-Baqarah recited in the home — "Shaytan flees from the house in which Al-Baqarah is recited" (Muslim); one narration gives three nights of protection (Tirmidhi).</li><li><b>Repeat</b> the whole process daily, or as often as able, for as long as needed. Cure may be sudden or slow; both are from Allah.</li><li><b>Never</b> pay for secrets, accept unknown words, accept talismans, or let anyone claim to know the unseen. Any "healer" who asks for the mother's name or an item of clothing is a sorcerer; one who sacrifices to other than Allah is practising shirk — leave either.</li></ul>
<p><b>Final du'ā':</b> <i>Ḥasbunallāhu wa niʿmal-wakīl</i>; <i>Lā ḥawla wa lā quwwata illā billāh</i>; and salawāt on the Prophet ﷺ.</p>""", []),
]

body = ""
for i,(t,intro,refs) in enumerate(STAGES):
    body += f'<section{" class=pb" if i and i!=2 else ""}><h2>{t}</h2><div class="intro">{intro}</div>' + ''.join(ayat(*r) for r in refs) + '</section>'

HTML = f"""<!doctype html><html><head><meta charset="utf-8"><title>Ruqyah Ayat — Process by Process</title><style>
@font-face{{font-family:Amiri;src:url(data:font/woff2;base64,{AM4}) format('woff2');font-weight:400}}
@font-face{{font-family:Amiri;src:url(data:font/woff2;base64,{AM7}) format('woff2');font-weight:700}}
@page{{size:A4;margin:18mm 16mm 20mm 16mm;}}
body{{font:10.5pt/1.5 Georgia,serif;color:#1d2a3a;margin:0}}
h1{{font:700 26pt Georgia;margin:0 0 4pt;color:#16203C}}
.sub{{color:#8a6a1f;font-size:11pt;margin-bottom:14pt}}
h2{{font:700 15pt Georgia;color:#16203C;border-bottom:2px solid #E8A33D;padding-bottom:3pt;margin:0 0 8pt}}
.pb{{page-break-before:always}}
.intro{{margin-bottom:10pt}} .intro ul{{padding-left:16pt;margin:4pt 0}} .intro li{{margin:3pt 0}}
.ayah{{margin:0 0 11pt;padding:7pt 10pt;border-left:3px solid #E8A33D;background:#f8f6f1;page-break-inside:avoid}}
.ref{{font-size:9pt;color:#8a6a1f;letter-spacing:.3px;text-transform:uppercase}} .arname{{font:12pt Amiri;text-transform:none;float:right}}
.ar{{font:400 17pt/2.05 Amiri;direction:rtl;text-align:right;margin:4pt 0 6pt;color:#000}}
.en{{font-size:9.5pt;color:#3b4654;margin:0}}
.cover p{{max-width:150mm}} .toc{{columns:1}} .toc li{{margin:2pt 0}}
.note{{font-size:9pt;color:#555;border-top:1px solid #ccc;padding-top:6pt;margin-top:14pt}}
</style></head><body>
<section class="cover"><h1>Ruqyah Ayat</h1><div class="sub">The Qur'anic recitation for healing — process by process</div>
<p>This booklet lays out ruqyah shar'iyyah as a sequence: what to do before, what to recite and in which order, and what to do after. Every verse is given in Arabic (Uthmani text) with its English meaning. It is for a Muslim reciting over themself or over a family member; it is not a substitute for medical treatment, which the Prophet ﷺ commanded alongside it ("Seek treatment, O servants of Allah" — Abu Dawud).</p>
<h2>The process</h2><ol class="toc">{''.join(f'<li>{t}</li>' for t,_,_ in STAGES)}</ol>
<p class="note">Arabic text: Uthmani script (quran-json). English meanings: Saheeh International. Hadith references are to Bukhari, Muslim, Abu Dawud, Ahmad and Tirmidhi as noted. Compiled 2026.</p></section>
{body}</body></html>"""
open(S/'ruqyah.html','w').write(HTML)
print("ok", len(HTML)//1000, "KB")
