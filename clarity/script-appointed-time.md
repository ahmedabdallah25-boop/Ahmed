# SCRIPT — Is Allah Late? What "Ajal" and "Waqt" Actually Mean in Arabic

**Channel:** Clarity in the Quran · `UC0eBu0ZXcF20pTAG3lUnPXA`
**Teardown:** [`teardown-kairos-chronos.md`](teardown-kairos-chronos.md) — the source video, `WM4ZLHet9bk`
**Spec:** [`video-formula.md`](video-formula.md)
**Scene pack:** [`scene-pack-appointed-time.txt`](scene-pack-appointed-time.txt)

**Measured, not estimated** — every number below is produced by walking this file:

```
python3 automation/clarity_measure.py clarity/script-appointed-time.md
```

| | |
|---|---|
| Spoken words | **3,579** |
| Speech at 140 wpm | **25:33** |
| Recitation inserts (6, real reciter) | **+98s** |
| Mid-roll CTA | **+25s** |
| TTS batches | **17**, longest **1,412 chars** (batch 16) |
| `[VERIFY]` tags | **11** |
| **Finished runtime** | **27:36** |

The source video is **26:14**. This runs 82 seconds longer, which is close enough that any
difference in how the two perform is not a difference in runtime — the point of matching it.

**The honest caveat on the read speed.** 140 wpm is brisk for this register. At a more measured
130 wpm the speech is 27:31 and the finished runtime is **29:34** — one and a half minutes past the
19–28 band in `video-formula.md`'s build spec, though still comfortably inside the reference
channel's *actual* measured range of 19:09–60:37, where the median is 27:40. Time a test read of
batch 01 before committing: if it lands near 130, either accept 29:34 or cut, and if you cut, cut
whole beats rather than trimming sentences everywhere. Batch 14's Al-Mu'minun 23:99 paragraph and
batch 15's solar/lunar paragraph are the two that survive removal cleanly.

**Do not pad to reach a number.** The spec's rule is that length comes from a bigger argument,
never from more words around the same one.

---

## HOW TO GENERATE THE AUDIO

Seventeen batches, every one **under 1,500 characters**, so it fits the smallest common TTS cap
without re-splitting. The five uniformity rules from
[`script-revelation-order.md`](script-revelation-order.md) apply here unchanged and are not
repeated: same voice and identical settings on every batch; never regenerate one batch alone after
approving its neighbours; splits at paragraph ends only; no batch opens on a bare pronoun; ~350 ms
of silence at each join.

**Arabic in the VO is transliterated.** TTS engines mispronounce Arabic script unpredictably. The
*on-screen* Arabic is proper script and is the scene pack's job. Where a full ayah is heard, the
script marks `[RECITATION INSERT]` and **that audio is a real reciter, never TTS.**

**`[VERIFY]`** marks a claim to check against a printed source before recording. Every sentence
carrying one is built to survive the tag's own clause being deleted, so nothing here depends on a
claim that fails checking.

---

# ACT 0 — THE HOOK · 0:00–2:42

### BATCH 01 · 0:00–1:14 · 865 chars

> Four.
>
> Four times in the Quran, somebody is asked how long they were there. And four times, the answer
> is wrong.
>
> A group of young men wake in a cave and are asked how long they slept. A day, they say. Or part
> of a day. It was three hundred years, and nine more.
>
> A man rides past a town that has fallen in on itself and wonders aloud how Allah could ever bring
> this back to life. Allah causes him to die for a hundred years, raises him, and asks him how long
> he stayed. A day, he says. Or part of a day.
>
> On the Day of Resurrection, people whisper to each other, trying to work out how long it has been.
> Ten, one of them says. The most accurate among them says: no, one day.
>
> And then a fourth time, the question is put to everyone at once. How many years were you on the
> earth? And this time the answer comes back with something attached to it that changes everything.

### BATCH 02 · 1:14–2:42 · 821 chars

> `[RECITATION INSERT · Al-Mu'minun 23:112–114 · 20s]`
>
> He will say: how many years did you remain on the earth? They will say: we remained a day, or part
> of a day — **ask those who keep count.**
>
> Ask those who keep count. Fa-s'ali al-aaddeen. The answer does not just come back wrong. It comes
> back handing the counting to somebody else.
>
> Four times asked. Four times wrong. And at least twice more the Quran reports the estimate without
> even bothering to ask, because by then you already know it is going to be wrong.
> `[VERIFY: the four question-and-answer exchanges — Al-Kahf 18:19, Al-Baqarah 2:259, Ta-Ha
> 20:103–104, Al-Mu'minun 23:112–113 — and the two reported estimates at Ar-Rum 30:55 and
> An-Nazi'at 79:46.]`
>
> That is not a story about bad memory. Four times is a pattern, and a pattern in this book is an
> argument. The Quran is telling you something about the instrument. You cannot measure a stretch of
> time from inside it. Not roughly. Not within a century.
>
> So if that is true — and the book says it four times — then what is Allah measuring with? Because
> He clearly is.

---

# ACT 1 — SIX WORDS FOR TIME · 2:42–5:44

### BATCH 03 · 2:42–4:03 · 1,082 chars

> Open an English translation and you will find the word "time" scattered across every page. Open
> the Arabic underneath it and you find at least six different words, and they are not
> interchangeable.
>
> Dahr. Unbounded time, the age itself, time as the thing that wears everything down. The deniers in
> Surah Al-Jathiyah say: nothing destroys us but ad-dahr.
>
> Hin. An indefinite while. Not measured, just — a while. Held until further notice.
>
> Asr. The pressed, squeezed portion. Surah Al-Asr is named for it.
>
> Saa'ah. An hour, a moment, and with the definite article, the Hour itself.
>
> Waqt. An appointed point. Fixed, named in advance.
>
> And ajal. A term. A span with a stated end.
> `[VERIFY: the six words and one representative ayah each, checked against a concordance.]`
>
> Six words, one English word covering all of them. And here is the strange part. The word a modern
> Arabic speaker reaches for first — zaman, the ordinary everyday word for time, the one in every
> dictionary and every newspaper headline — does not appear in the Quran at all.
> `[VERIFY: that the root za-mim-nun does not occur in the Quranic text.]`
>
> The most obvious word is missing, and six less obvious ones are doing the work in its place. That
> is not carelessness. That is precision.

### BATCH 04 · 4:03–5:44 · 1,188 chars

> Two of those six carry the weight, and the rest of this study is about them.
>
> Ajal asks: how long. Waqt asks: which moment.
>
> Ajal is a span. It has a beginning, a length, and an end that was set before it started. Waqt is a
> point. It does not have a length. It arrives, and either you are standing there or you are not.
>
> Now, if you speak any Arabic at all, you already own the proof of what ajal means, and you have
> owned it your whole life. When a match is postponed, you say ta'jeel. When something is put off,
> it is mu'ajjal. And when you want to say "this world is immediate and the next one is deferred,"
> you say ad-dunya aajilah, wal-aakhirah aajilah — from the same three letters, alif, jim, lam.
>
> Not one of those words means to die. Every one of them means: to defer something to a stated end.
>
> So here is the claim this whole video rests on. Allah measures out a span, and He appoints a
> moment at the end of it. And most of what you are calling a delay is the span, doing its work.
>
> That is the claim. Now it has to be tested — because it is exactly the kind of claim that gets
> oversold on a graphic with a clock behind it. I would rather hand you something true than
> something tidy.

---

# ACT 2 — AJAL IS A LEASE, NOT A DEATH · 5:44–9:06

### BATCH 05 · 5:44–7:20 · 1,258 chars

> Start with what almost everybody assumes ajal means, because almost everybody assumes the same
> thing. Ajal is death. His ajal came. Her ajal was written. In ordinary Muslim speech the word has
> become a synonym for the moment your life stops.
>
> Now watch where the Quran actually puts it.
>
> Surah Al-Baqarah, verse two hundred and eighty-two. The longest verse in the book.
> `[VERIFY: that 2:282 is the longest verse.]` It is not about death, or judgement, or the soul. It
> is about **lending money.** When you contract a debt, it says, for a stated term — ilaa ajalin
> musammaa — write it down. Get two witnesses. Do not be too proud to record it, whether the sum is
> small or large.
>
> A loan agreement. A repayment deadline. Same word.
>
> Nine verses earlier, the same word again, and this time it is a marriage. When divorced women
> reach their ajal — the end of their waiting period — either keep them honourably or release them
> honourably.
>
> A waiting period. Same word.
>
> And in Surah Al-Qasas, Musa agrees to work for a man for eight years, with a tenth optional, in
> exchange for marriage. When he has finished, he says: ayyamaa al-ajalayni qadaytu — whichever of
> the **two terms** I have completed, let there be no injustice against me.
>
> An employment contract, with two possible lengths. Same word. Twice, in one sentence.

### BATCH 06 · 7:20–9:06 · 1,288 chars

> A debt. A waiting period. A labour contract. And then, in Surah Al-Ahqaf, the heavens and the
> earth themselves — created in truth, and for a stated term.
>
> Ajal is not a word about dying. It is a word about **leases.** A span, with a length, and an end
> that was agreed before the span began.
>
> That changes what the word is telling you. You do not have an ajal the way you have an
> appointment on a Tuesday. You have one the way a lease has a length. Death is not what the word
> means. Death is just where one particular lease happens to run out.
>
> And that matters, because it moves your attention. If ajal means the moment you die, then the
> only interesting fact about it is the date, and the date is hidden, so there is nothing to think
> about. But if ajal means a term — a measured span, granted to you, with terms attached — then the
> interesting fact is not the end at all.
>
> It is the length. And you are standing inside it right now.
>
> Al-A'raf, verse thirty-four: li-kulli ummatin ajal. For every nation, a term. Not for every
> person — for every **nation.** Communities have leases too. Civilisations have leases. The word
> scales all the way up.
>
> And what the Quran does with that word next is the thing this entire study was built to show you.
> Because in the same breath, it reaches for the other one.

---

# ACT 3 — THE SPAN IS WHERE THE WORK HAPPENS · 9:06–12:29

### BATCH 07 · 9:06–10:36 · 1,095 chars

> Before that, though — one long stretch, in detail. Because if the span is the part that matters,
> somebody should show you what a span actually does to a person.
>
> Yusuf. Thrown into a well by his brothers as a boy. Pulled out by a caravan and sold. Bought into
> an Egyptian household. Accused of something he did not do, and put in prison for it, with the
> evidence pointing the other way.
>
> And then the Quran says something you could read past a hundred times. Fa-labitha fis-sijni bid'a
> sineen. He remained in prison for **several years.**
>
> Bid'. It is one of the vaguest words in Arabic. It means somewhere between three and ten, and
> classical grammarians argue about exactly where it stops.
> `[VERIFY: the conventional range given for bid', and who narrows it.]` The Quran gave you three
> hundred and nine for the sleepers in the cave, to the year. Here, it will not give you a number.
>
> That is a choice. And it is the right one, because the number is not the point. Ask a man in year
> four of a prison sentence how long he has been there and he can tell you to the day. It does not
> help him. What is happening to him is not being measured by the count.
>
> So what was happening?

### BATCH 08 · 10:36–12:29 · 1,192 chars

> Look at what Yusuf says the moment the door finally opens. The king needs someone to manage the
> food supply of an entire country through seven years of famine. And Yusuf says: ij'alnee alaa
> khazaa'in al-ard, innee hafeethun aleem. Set me over the storehouses of the land. I am a guardian,
> and I know.
>
> A boy at the bottom of a well could not have said that sentence. Not one word of it.
>
> Between the well and the throne room, he had run a wealthy man's household. Then he had lived in a
> state prison, where he read two men's dreams and told them the truth about both, including the one
> who did not want to hear it. Administration, at one scale. Then administration at another. Then
> the food of a kingdom, across seven years.
>
> Nobody thanked him for any of it. Nobody was watching. The cupbearer who promised to mention him
> forgot for years.
>
> The span was not the wait before the work. The span **was** the work.
>
> And now hold that against a verse in Surah Fatir that reads, at first, like a threat, and turns
> out to be the opposite.
>
> `[RECITATION INSERT · Fatir 35:45 · 16s]`
>
> If Allah were to take people to account for what they have earned, He would not leave a single
> creature on the face of the earth. But He defers them — to a stated term.

---

# ACT 4 — THE TIDY VERSION, AND WHY IT FAILS · 12:29–15:05

### BATCH 09 · 12:29–13:59 · 1,084 chars

> Read that again with the word you now know. He defers them — yu'akhkhiruhum — to an ajal musammaa.
> A named term.
>
> The delay is not Allah being slow. The delay is the reason anything is still standing. Every year
> the term has not run out is another year the door has not closed. And the same sentence appears
> again in Surah An-Nahl, almost word for word, in case you missed it the first time.
>
> Now I owe you some honesty, because this word has picked up a tidy story that does not survive
> contact with the text.
>
> The popular version goes: ajal is death, waqt is prayer times. Two neat boxes. One about the end
> of your life, one about your day.
>
> It does not hold. You have just watched ajal do a bank loan, a divorce, and a work contract. And
> waqt does not stay in its box either — because the Quran uses it for the single largest event in
> creation. When Iblees asks for a reprieve, he is granted it until **yawm al-waqt al-ma'loom**, the
> Day of the appointed time. Not until a number of years. Until a moment that has a name.
>
> Two sealed compartments, and neither word will stay inside its own.

### BATCH 10 · 13:59–15:05 · 849 chars

> The lexicographers who did this properly are more careful than the graphic is. Ar-Raghib al-Isfahani,
> in his dictionary of Quranic vocabulary, draws the distinction by span and by point, not by human
> and divine. `[VERIFY: ar-Raghib's Mufradat entries for a-j-l and w-q-t.]` And the classical
> rhetoricians add a caution worth keeping: sometimes a word is chosen because of how the verse ends
> — the rhyme, the faasilah — and no doctrine at all is riding on the choice.
> `[VERIFY: the classical discussion of faasilah governing lexical selection.]`
>
> So what survives is smaller than the graphic, and it is genuinely there. One word leans toward the
> span. The other leans toward the point. And at the Quran's biggest hinges, both of them turn up
> together.

**MID-ROLL CTA · 15:05–15:30 · 25s** — placed exactly where the source places it: immediately
after the payoff, at 55%, returning to content with **no re-introduction.**

> If this is the kind of study you want more of, subscribe — it is the only thing that decides
> whether the next one reaches anybody. And if one word of this landed, leave one word in the
> comments. It genuinely does more than you would think.

---

# ACT 5 — THE VERSE THAT HOLDS BOTH · 15:30–17:20

### BATCH 11 · 15:30–17:20 · 1,197 chars

> `[RECITATION INSERT · Al-A'raf 7:34 · 14s]`
>
> For every nation there is a term. And when their term comes, they cannot delay it by a single
> hour, nor bring it forward.
>
> There it is. Ajal and saa'ah, standing side by side in one sentence. The span, and the moment.
>
> And look at the two directions it closes off. Laa yasta'khiroon — they cannot push it back. Wa laa
> yastaqdimoon — and they cannot pull it forward. Both of the things a human being actually does with
> time. We stall, and we rush. Neither one moves it.
>
> The same sentence appears again, near enough word for word, in Surah Yunus. The Quran says it
> twice, which is what it does when it does not want you treating something as a passing remark.
>
> And that closes a particular door, so let me close it plainly. There is no calculation here. No
> code, no numerology, no chart that locates your moment. When the Prophet, peace be upon him, was
> asked outright about the Hour — when will it arrive — the answer given in Al-A'raf is that its
> knowledge is with my Lord alone.
>
> He was asked for the date, directly, and he did not have it. So anyone offering you one is
> offering something the Prophet himself was asked for and did not give.
>
> What is given instead is not information. It is a posture.

---

# ACT 6 — THE WORD FOR RIPE · 17:20–19:16

### BATCH 12 · 17:20–19:16 · 1,283 chars

> Which brings us to a verse most people read straight past, because the usual English translation
> flattens the one word in it that matters.
>
> `[RECITATION INSERT · Al-Hadid 57:16 · 13s]`
>
> It is normally rendered: has the time not come for the believers, that their hearts should be
> humbled at the remembrance of Allah.
>
> "Has the time not come." That is a polite phrase in English. It sounds like a gentle nudge.
>
> The Arabic is a-lam ya'ni. From the root alif, nun, yaa. And that root does not mean the clock has
> reached a certain number. It means **to arrive at readiness.** To reach the point.
>
> You can see it in the other places the root shows up. In Surah Ar-Rahman there is water described
> as aanin — water that has reached its full heat, boiling at its peak, not water that has been on
> the fire a certain number of minutes. And the same three letters give inaa' — a vessel, the thing
> that holds something until it is full. `[VERIFY: the derivation of inaa' from alif-nun-yaa, and
> the sense of aanin in 55:44.]`
>
> So the verse is not asking whether enough time has passed. It is asking whether the thing has
> **ripened yet.** Has it not come due?
>
> And the reports around when this verse arrived make the question sharper than it looks. Ibn
> Mas'ud is reported to have said there were only four years between our accepting Islam and Allah
> rebuking us with this verse. `[VERIFY: the report and its grading.]`
>
> Four years. And already the question was: has it not ripened yet.

---

# ACT 7 — THE PASSAGE THAT COSTS THE MOST · 19:16–22:33

### BATCH 13 · 19:16–21:05 · 1,038 chars

> A thing that can ripen is a thing that can also pass. That is built into the word, and it is why
> the passage I have been putting off is the one that costs the most in this entire study.
>
> `[RECITATION INSERT · Al-Munafiqun 63:10–11 · 18s]`
>
> Here is what is being said. A man, at the end, asks for one thing.
>
> Rabbi lawlaa akhkhartanee ilaa ajalin qareeb — my Lord, if only You would defer me for a **short
> term** — fa-assaddaqa wa akun min as-saaliheen — so that I could give in charity, and be among
> the righteous.
>
> He is not asking to be forgiven. He is not asking for the Fire to be lifted. He is asking for
> **more span.** A short one. Ajalin qareeb. He uses the exact word this whole video has been about,
> and he uses it correctly — he knows it is a length, and he is asking for a little more of it.
>
> And the very next line answers him.
>
> Wa lan yu'akhkhira Allahu nafsan idhaa jaa'a ajaluhaa. And Allah will never defer a soul once its
> term has come.
>
> The same word, in the request and in the refusal, one verse apart. The thing he asks for is
> named with the exact word used to tell him it is finished.

### BATCH 14 · 21:05–22:33 · 1,067 chars

> Now — I want to handle this without any smugness, because the easy thing here is to make this a
> story about somebody else, and the surah's title makes that especially easy.
>
> Read what he actually asks for. To give charity. To be among the righteous. He is not confused
> about what he should have been doing. He names it, precisely, on the last day he has. Whatever
> else was missing, the **knowledge** was not missing.
>
> That is the sharp part. Knowing what to do, and having the span left in which to do it, are two
> different possessions. And only one of the two is ever taken from you.
>
> Surah Al-Mu'minun stages the same scene with even less room in it. When death comes to one of
> them, he says: my Lord, send me back. And the answer is a single word. Kallaa. No.
>
> So the risk in this subject runs in both directions, and most people only expect one of them. Yes,
> a span can feel unbearably long. But something can also be standing open beside you, right now, on
> terms it will not offer in a year — while you are still checking the calendar for when it was
> supposed to happen.

---

# ACT 8 — TWO INSTRUMENTS, ONE EVENT · 22:33–24:19

### BATCH 15 · 22:33–24:19 · 1,189 chars

> Go back to the cave, because there is one more thing in it.
>
> `[RECITATION INSERT · Al-Kahf 18:25–26 · 17s]`
>
> And they remained in their cave three hundred years, and they added nine. Say: Allah knows best
> how long they remained.
>
> Read that as a pair of sentences, in order. The verse gives you a number, to the year. And then,
> immediately, in the very next breath, it says: Allah knows best.
>
> The Quran hands you the count and then declines to let the count be the authority. Commentators
> have divided over exactly why — whether verse twenty-five reports the sleepers' own reckoning and
> verse twenty-six corrects it, or whether the number is given and the correction is aimed at the
> people arguing about it outside the cave. At-Tabari records the disagreement and Ibn Kathir
> summarises it, and it has never been settled.
> `[VERIFY: at-Tabari and Ibn Kathir on 18:25–26, and the range of positions.]`
>
> And there is a detail inside the number that many commentators point at. Three hundred years, and
> they added nine. Three hundred solar years is very close to three hundred and nine lunar ones. The
> verse may be giving you the same span, read off two different calendars, in a single sentence.
> `[VERIFY: the solar/lunar reading, and which commentators hold it.]`
>
> Two instruments. One event. Both correct. And neither of them told those young men what had
> actually happened while they slept.

---

# ACT 9 — YOUR OWN WEEK · 24:19–26:14

### BATCH 16 · 24:19–26:14 · 1,412 chars

> So what do you do with a week of your own?
>
> If you are the one waiting, and you have caught yourself counting — I want to say this carefully.
> Counting is what human beings do with time, and the Quran does not scold you for it. It quotes
> you.
>
> Al-Baqarah, verse two hundred and fourteen, describing the people who came before: they were
> shaken until the Messenger and those who believed with him said — **mataa nasru Allah.** When is
> the help of Allah?
>
> A prophet said that. It is in the book, in direct speech, not paraphrased and not softened. And
> the answer comes in the same verse: alaa inna nasra Allahi qareeb. The help of Allah is near.
>
> The question is not rebuked. It is quoted, and then answered.
>
> But the number you are adding up is not a verdict on anything. You already know why. You are the
> one in the cave, saying a day, or part of a day. You cannot see the level rising from inside the
> vessel. Nobody can hand you a date, and anyone who tries is inventing it.
>
> And the other direction. There is a conversation you keep meaning to have. A wrong you keep
> meaning to put right. Something currently repairable, on terms that will not be on offer
> indefinitely, because people move and health turns and windows close without sending anybody a
> notice.
>
> You do not have to manufacture panic about that. Yusuf did not panic in that prison. He also did
> not waste it. He was doing the work of the term, inside the term.

---

# ACT 10 — CLOSE · 26:14–27:36

### BATCH 17 · 26:14–27:36 · 969 chars

> Come back to where we started. Four times the Quran asks a person how long they were there, and
> four times the answer is wrong — and the last of them tells you why. Ask those who keep count.
> The counting was never yours.
>
> What is yours is the term you are standing inside. For every nation, a term — and when it comes,
> not delayed by an hour, and not brought forward by one either.
>
> He is not late. He is not early. And some of what He is doing is happening inside you, while you
> wait for it to happen around you.
>
> The Arabic on screen in this video is set from a verified mushaf. Where the classical scholars
> disagree, this video says so and stops. It issues no ruling on anything — it is an explanation.
>
> If you want the next one: there is a second ajal in Surah Al-An'am, sitting in the same verse as
> the first, and nobody has ever agreed on what it is.
>
> Ask those who keep count. That is the instruction. And the One who keeps count is not the one
> who is running behind.

---

## PRODUCTION NOTES

**Recitation inserts — six places, 98 seconds, never synthesised.**

| # | Batch | Reference | Length |
|---|---|---|---|
| 1 | 02 | Al-Mu'minun 23:112–114 | 20s |
| 2 | 08 | Fatir 35:45 | 16s |
| 3 | 11 | Al-A'raf 7:34 | 14s |
| 4 | 12 | Al-Hadid 57:16 | 13s |
| 5 | 13 | Al-Munafiqun 63:10–11 | 18s |
| 6 | 15 | Al-Kahf 18:25–26 | 17s |

A synthetic voice reciting Quran is the fastest available way to earn the **"AI BE AWARE"** comment
a second time. This is not a budget decision.

**Numbers are spoken as words** — "three hundred and nine", not "309" — because TTS reads bare
digits inconsistently across batches, and inconsistency is the one thing a batched VO cannot
afford. On screen they appear as digits, in both Arabic-Indic and Latin numerals.

**Eleven `[VERIFY]` tags.** Four are load-bearing and the sentence around them should be cut
outright if they do not check out:

1. **The count of four.** The hook is the count. If it is three, or six, the first word of the
   video changes and so does the first frame. Check 18:19, 2:259, 20:103–104, 23:112–113 against a
   concordance before anything else in this script is recorded.
2. **That *zamān* is absent from the Quran.** Act 1 spends thirty seconds on it. If the root occurs
   anywhere, cut the paragraph — the six-word list stands without it.
3. **The Ibn Mas'ud report on Al-Hadid 57:16.** Check the grading, not just the wording. If it does
   not stand, the verse's own verb carries Act 6 by itself.
4. **The solar/lunar reading of 18:25.** Attractive enough to be worth doubting. If no major
   commentator holds it, say "some later writers have suggested" or cut it — the "Allah knows best"
   point is the load-bearing half and does not need it.

**Two authorities and one conceded disagreement**, per the spec: ar-Raghib al-Isfahani on the
lexical distinction (Batch 10), at-Tabari and Ibn Kathir on Al-Kahf 18:25–26 — where the
disagreement is stated and **left unresolved** (Batch 15). A second concession sits in Batch 10:
that the choice of word is sometimes governed by the verse-ending rhyme and carries no doctrine.

**What this script deliberately does not do.** It issues no ruling. It does not claim ajal and waqt
are sealed categories — it says the opposite, and says it at the point where the audience most
expects the tidy version. It does not date the Hour, does not offer any method for discerning
"your moment", does not resolve the two-*ajal* dispute of Al-An'am 6:2 (it tees it up as the next
video instead), and never suggests that counting is faithless — Al-Baqarah 2:214 is in the script
specifically to prevent that reading.

**The mid-roll ask is 25 seconds and mentions no membership.** Clarity has none. The source's ask
runs 30 seconds and spends more of it thanking existing members than asking; the transposition
keeps the softness and drops the product.

**Chapters.** Write 12 chapters into the description from the ACT boundaries above. The channel
has chapters on **3 of 15** long-form uploads and the source video has 23; this is free structure
and YouTube reads it. **Do not announce them in the VO** — the source never does.

**Export.** `automation/clarity_export.py` is currently hardcoded to `script-revelation-order.md`
(`SCRIPT = ROOT / "clarity" / "script-revelation-order.md"`, line 48) and to that video's
`vo-emotion-tags.json` and plate manifest. This script uses an identical batch format, so it
exports correctly the moment that path is parameterised. Doing so was left out of this change on
purpose — it touches a working pipeline for the other video and should be its own commit.
