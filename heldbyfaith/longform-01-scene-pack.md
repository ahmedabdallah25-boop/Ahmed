# HELD BY FAITH — LONG-FORM 01
## "They Told Me The Cancer Was Gone. Nobody Warned Me What Came After."

**Format:** 16:9 · 1920×1080 · ~13:20 · 66 scenes · illustrated character
**Live channel state, verified 2026-09-09:** 55 subs · 28 videos · **25 Shorts, 3 long-form** ·
~21,000 lifetime Shorts views.

---

# WHY THIS VIDEO, AND NOT THE ORIGIN STORY

The channel's own data decides this. Sorted by views:

| Short | Views | Type |
|---|---|---|
| The wristband in my drawer fixes my worst days | **1.7K** | single idea, object, payoff |
| They said the cancer was gone. Nobody warned me about this | **1.3K** | single idea, open loop |
| Please stop saying this to people who are sick | **1.2K** | single idea, service |
| I survived. He didn't. Nobody prepares you for that | **1.2K** | single idea, guilt |
| At 3am I asked Allah what the pain was for | **1.2K** | single idea, faith |
| I couldn't stand up to pray for 6 weeks | **1.1K** | single idea, body |
| The morning I stood up to pray again | **1.1K** | single idea, payoff |
| I said I'm fine for a year and people believed me | **1.1K** | single idea, mask |
| The things I googled the week I was diagnosed | **1.0K** | single idea, list |
| …14 more in the 340–970 band | | |
| **I asked Allah for a long life and got cancer 4 days later** | **343** | origin story |
| **Part 2: Waiting 7 Days for Cancer Results** | **13** | chronological chapter |
| **Part 5: How I Told My Family I Had Cancer** | **12** | chronological chapter |
| **Part 4: Why I Felt Nothing When The Doctor Said Cancer** | **7** | chronological chapter |

**Three conclusions, all forced by the numbers:**

1. **Chronological chapters are dead.** 7–13 views against a 1K median. Do not build long-form
   as a recap of the story in order — that is the exact format the audience has already refused.
2. **The origin hook is the weakest winner.** "I asked Allah for a long life" is a real Short
   and it sits at **343** — a third of the channel's median. It is the most *dramatic* beat and
   the *least* watched. It is not the spine of the breakthrough video.
3. **What works is one idea, in the present tense, about the aftermath.** The top four are all
   *after* — remission, the wristband, survivor guilt, what to say to a sick person. The
   audience arrived for the diagnosis and stayed for what came next.

**So the long-form is the aftermath, assembled from the beats that already earned their views.**
Every act below is a proven Short, expanded, with its view count noted. This is not a new bet.
It is the channel's own winners, sequenced, with the open loop from the 1.3K Short as the spine.

> ⚠️ **`ch6-scene-pack.txt` in this repo is obsolete.** It specifies "photographic, faceless by
> framing" and a chronological Chapter 6. The channel is illustrated, has a **main character
> with a face**, and has abandoned chapter numbering. Delete or rewrite that file.

> ⚠️ **Runtime > 180s → a custom 16:9 thumbnail is MANDATORY.** See THUMBNAIL below.

---

# THE FUNNEL — this is the point of the video

25 Shorts pulling ~21K views into a channel with 55 subscribers is a **conversion** problem, not
a reach problem. Roughly 0.26% of Shorts viewers subscribe. The long-form is the fix, and only
if it is wired in deliberately:

1. **Pin a comment on the six 1K+ Shorts** the day this publishes: *"The full story of what
   happened after they said it was gone is on the channel now."* Do not link — YouTube
   suppresses external-looking pins on Shorts; name it and let them tap the avatar.
2. **End-screen the top three Shorts** from this video's final 20 seconds.
3. **Playlist:** create **"After the All-Clear"** and put this at the top with the aftermath
   Shorts beneath it. The existing `PLczfvNC3NVjo` playlist is the dead chapter spine — leave
   it, don't feed it.
4. **The cold open must work for someone who has never seen a Short.** No callbacks in the
   first 45 seconds.
5. **Re-cut three segments from this video as new Shorts** afterwards (S26–S31, S38–S43,
   S56–S60 are built to stand alone). Long-form feeding Shorts feeding long-form is the loop.

---

# CHARACTER LOCK

Every prompt contains the token `[HIM]`. Before pasting into Flowlabs, find-and-replace once:

**A — with the sheet (best).** Attach the character sheet as image reference at **45–55%**, and
replace `[HIM]` with:
> `the man from the reference image`

**B — without the sheet.** Replace `[HIM]` with:
> `an adult man with a soft rounded build, short cropped dark-brown hair, clean-shaven, rounded face with a soft jaw, small simple dot eyes, warm light skin, wearing a muted slate-blue short-sleeve t-shirt, tan khaki trousers and dark brown slip-on shoes`

One replace in a text editor. Never retype per scene — that is where drift starts.

**Post-surgery note:** he is thinner than the sheet after S20. Add `slightly thinner in the face
and looser in the shirt than the reference` to prompts marked `[THIN]`. Everything else holds.

# STYLE SUFFIX — append to EVERY prompt, unchanged

```
Flat 2D vector cartoon illustration, clean uniform dark-brown outline of even weight,
flat colour fills with soft minimal shading, no gradients, no texture, soft elliptical
ground shadow, calm restrained storybook-explainer aesthetic, generous negative space,
16:9 horizontal composition 1920x1080, subject on the left or right third with clear
empty space opposite for text.
```

# NEGATIVE PROMPT — paste once, all 66 scenes

```
photorealistic, photograph, 3D render, cel shading, anime, thick uneven outlines, sketchy
lines, cross-hatching, painterly, watercolour, gradients, glow, bloom, HDR, oversaturated,
neon, blood, wounds, surgical incision, graphic medical imagery, gore, needles in skin,
IV lines in arms, distressing imagery, text, letters, numbers, watermark, logo, signature,
hospital branding, distorted hands, extra fingers, extra limbs, multiple heads, crowd,
beard, glasses, hat, different clothing, different hair colour
```

# BACKGROUND GRADE — the only variable that moves

The character never changes. The wall behind him does. Flat illustration cannot hold a
photographic grade, so the background carries the arc. It reads at thumbnail size and it is
infinitely reusable across future videos.

| State | Hex | Scenes | Meaning |
|---|---|---|---|
| `PALE` | `#EFEAE2` | S01–S12, S64–S66 | the flat, hollow *after*. Not warm — empty. |
| `COOL` | `#C9D2D4` | S13–S37 | the body, and the ward |
| `DEEP` | `#8E9BA3` | S38–S49 | survivor guilt and 3am. Lowest point. |
| `WARM` | `#E8C79A` | S50–S63 | the turn. **Never before S50.** |
| Accent | `#C4553F` | — | the wristband, and nothing else. Exactly 5 uses. |

**The accent red is reserved for the wristband.** It is the only saturated colour in 13 minutes,
it appears in S02, S11, S49, S61 and S66, and that scarcity is what makes the final frame land.

---

# VOICEOVER + SCENES

Bracketed `[...]` = a fact only you know. Replace or cut. Everything else is craft — if a line
isn't true, the line is wrong, change it. Every beat below is drawn from a Short you have
already published, so almost nothing here needs inventing.

---
## COLD OPEN · 0:00–1:05 — *extends "The wristband in my drawer" (1.7K)*
---

**S01** · 0:00 · **VO:** "There's a drawer in my kitchen I open most mornings."
**CAP:** there's a drawer
**IMG:** `PALE #EFEAE2.` [HIM] standing side-on at a plain kitchen counter, one hand resting on a closed drawer handle, not pulling it, looking down at it. Him right of centre, wide empty pale space left.

**S02** · 0:06 · **VO:** "There's a hospital wristband in it. Cut off, kept."
**IMG:** `PALE.` Close-up of an open shallow drawer from directly above, empty except for a single thin accent-red `#C4553F` hospital wristband lying flat, cut through at one end. Drawer occupies the right two-thirds. **First of only 5 uses of the accent colour.**

**S03** · 0:13 · **VO:** "I don't look at it for comfort. I look at it to check something."
**IMG:** `PALE.` [HIM] looking down into the open drawer, face calm and neutral, one hand still on the handle. Him left third, empty pale wall right.

**S04** · 0:21 · **VO:** "Eleven months ago a doctor said the words I had spent a year praying for. He said: we think it's gone."
**CAP:** "we think it's gone"
**IMG:** `PALE.` [HIM] `[THIN]` seated in a consultation chair facing a doctor's flat standing figure, both drawn small, an enormous empty pale wall above and around them. The room is far too big for the two of them.

**S05** · 0:32 · **VO:** "And I want to tell you honestly what that felt like. Because it is not what I expected, and nobody warned me."
**IMG:** `PALE.` Close-up of [HIM]'s `[THIN]` face, front on, completely neutral — dot eyes open, mouth a flat straight line. No smile, no tears. Face right half, empty pale space left.

**S06** · 0:42 · **VO:** "I walked out to the car park and I felt nothing at all."
**CAP:** I felt nothing at all
**IMG:** `PALE.` `[THIN]` [HIM] standing alone in a wide empty car park, arms at his sides, one car shape far behind him, looking at nothing. He is small, lower right. Vast empty pale sky and tarmac.

**S07** · 0:50 · **VO:** "I had built a whole year around one sentence, and when it came I couldn't feel it."
**IMG:** `PALE.` `[THIN]` [HIM] sitting in a stationary car, seen from the side through the window frame, both hands on the wheel, engine not started, staring straight ahead. Car right of centre, empty pale space left.

**S08** · 0:59 · **VO:** "This video is about the part after. The part I couldn't find anywhere when I went looking."
**IMG:** `PALE.` `[THIN]` [HIM] seen from behind, standing at the edge of a long flat empty road that stretches to a vanishing point. Him small, lower left. Huge empty pale sky.

---
## ACT 1 — THE ANTICLIMAX · 1:05–2:40 — *extends "They said the cancer was gone" (1.3K)*
---

**S09** · 1:05 · **VO:** "Everybody around me was celebrating. That was the strangest week of the whole thing."
**IMG:** `PALE.` `[THIN]` [HIM] standing still in the centre of a small room while three flat silhouette figures around him are mid-celebration, arms raised. He is the only one not moving. Him centred, silhouettes around, empty space above.

**S10** · 1:15 · **VO:** "They had waited a year to be happy for me and I could not join in. I performed it. I was good at it by then."
**CAP:** I performed it
**IMG:** `PALE.` Close-up of `[THIN]` [HIM]'s face wearing a small polite closed-mouth smile, but the dot eyes flat and unmoving. The mismatch between mouth and eyes is the entire image. Face left third, empty pale right.

**S11** · 1:27 · **VO:** "That night I cut the wristband off and I didn't throw it away."
**IMG:** `PALE.` Close-up of `[THIN]` [HIM]'s two hands, one holding small scissors, cutting through the thin accent-red `#C4553F` wristband on his own wrist. Hands fill the lower right, empty pale space upper left. **Accent use 2 of 5.**

**S12** · 1:36 · **VO:** "I have thought about why for eleven months. I'll tell you at the end, because it took me the whole story to work it out."
**IMG:** `PALE.` The drawer from S02, now closed, [HIM] `[THIN]`'s hand just leaving the handle. Drawer and hand right third, empty pale space left.

**S13** · 1:47 · **VO:** "Here's the thing nobody says. Being told you're clear doesn't end it. It just takes away the thing you were allowed to be scared of."
**CAP:** it doesn't end it
**IMG:** `COOL #C9D2D4.` `[THIN]` [HIM] standing in an empty room, arms at his sides, while a large plain flat shape that had been beside him is drawn as a faint outline only — present, then gone. Him right, outline shape left, empty cool wall between.

**S14** · 2:00 · **VO:** "For a year I had a job. Get through it. Then the job ended and I still couldn't eat a plate of rice in under an hour."
**IMG:** `COOL.` `[THIN]` [HIM] seated alone at a table looking down at a single plain plate of rice, fork in hand, not eating. Him and table right of centre, wide empty cool space left.

**S15** · 2:12 · **VO:** "The cancer was gone. The body it happened to was still mine."
**CAP:** the body was still mine
**IMG:** `COOL.` `[THIN]` [HIM] standing side-on in front of a plain mirror, looking at his own reflection, one hand flat against his own stomach. No scar shown, no skin detail. Him and mirror left third, empty cool wall right.

**S16** · 2:24 · **VO:** "And nobody claps for that part. There's no appointment where they tell you the rest of it is over."
**IMG:** `COOL.` `[THIN]` [HIM] sitting alone in a row of empty waiting-room chairs, no reception desk, no staff, nobody else. He is small, lower right, long empty row stretching left.

---
## ACT 2 — THE BODY · 2:40–5:00 — *extends "an hour to eat rice" · "couldn't stand to pray for 6 weeks" (1.1K) · "the first drive" · "I didn't fast Ramadan"*
---

**S17** · 2:40 · **VO:** "Let me be specific, because specific is the only thing that helped me when I was reading other people's."
**IMG:** `COOL.` A plain flat notebook open on a table, filled with short simple horizontal line-marks standing in for handwriting, no readable letters. Notebook right third, empty cool table left.

**S18** · 2:50 · **VO:** "After a Whipple, your body no longer does something it has always done for you without asking."
**IMG:** `COOL.` `[THIN]` [HIM] standing side-on, one hand resting flat on his own upper abdomen, looking down calmly. No anatomy, no medical detail. Him right of centre, empty cool space left.

**S19** · 3:01 · **VO:** "So eating stopped being a thing I did and became a thing I managed. An hour, for a plate of rice."
**CAP:** an hour. for rice.
**IMG:** `COOL.` Four small identical panels in a row, each showing `[THIN]` [HIM] at the same table with the same plate, barely changed between them. Repetitive and flat. Wide empty cool space above the row.

**S20** · 3:14 · **VO:** "[BRIEF LINE — one concrete daily thing your body still won't do. Only what you're comfortable saying.]"
**IMG:** `COOL.` `[THIN]` [HIM] standing in a kitchen holding a plain glass, paused mid-motion, looking at it. Him left third, empty cool space right.

**S21** · 3:25 · **VO:** "But the one that broke me wasn't food. For six weeks I could not stand up to pray."
**CAP:** 6 weeks
**IMG:** `COOL.` `[THIN]` [HIM] sitting on the edge of a bed beside a prayer mat laid out on the floor, looking at the mat, not moving toward it. Him and bed right, mat lower centre, empty cool space left.

**S22** · 3:37 · **VO:** "I prayed sitting down. Which is allowed. Everyone told me it was allowed."
**IMG:** `COOL.` `[THIN]` [HIM] sitting upright on a plain chair on the prayer mat, hands open in prayer, facing forward. Him right of centre, wide empty cool space left.

**S23** · 3:47 · **VO:** "Knowing it's allowed and feeling it are different rooms. I knew I wasn't sinning. I still felt like I was watching my own religion from a chair."
**CAP:** allowed. and still.
**IMG:** `COOL.` Wide flat view of `[THIN]` [HIM] seated on a chair on the left, and on the right an empty prayer mat on the floor with a faint pale outline of a standing figure on it. Large empty cool space between them.

**S24** · 4:03 · **VO:** "[YOUR LINE — the lowest thought you had about that. One sentence. If it was anger, say anger.]"
**IMG:** `COOL.` Close-up of `[THIN]` [HIM]'s face in three-quarter view, jaw set, eyes down, no tears — a closed, hard expression. Face right half, empty cool space left.

**S25** · 4:14 · **VO:** "Then Ramadan came and I did not fast a single day of it."
**CAP:** not one day
**IMG:** `COOL.` `[THIN]` [HIM] sitting alone at a table with a plain plate of food in front of him in daylight, while through a window behind him the sky is drawn in evening tones. Him right, window left, empty cool wall between.

**S26** · 4:25 · **VO:** "Thirty years of my life had a shape and that year it didn't. I ate at noon and felt like a stranger in my own house."
**IMG:** `COOL.` `[THIN]` [HIM] standing alone in the middle of his own living room, arms at his sides, everything around him ordinary and unchanged, looking around as if it were somebody else's. Him centred, generous empty cool space either side.

**S27** · 4:38 · **VO:** "Here's what I'd say to you if you're there now. Your deen did not get smaller. Your body did."
**CAP:** your deen didn't get smaller
**IMG:** `COOL.` Two plain shapes side by side on a flat wall: one large and unchanged, one visibly smaller. Simple, geometric, no faces, no text. Shapes right two-thirds, empty cool space left.

**S28** · 4:50 · **VO:** "The chair is not a demotion. It took me six weeks and a lot of arguing with myself to believe that."
**IMG:** `COOL.` `[THIN]` [HIM] seated on the chair on the prayer mat, hands open, and this time drawn calm and settled, shoulders down. Him right of centre, empty cool space left. Same composition as S22, different posture.

---
## ACT 3 — THE WARD · 5:00–6:40 — *extends "22 chairs" (973) · "things I googled" (1K) · "the paperwork" (904)*
---

**S29** · 5:00 · **VO:** "I want to take you into the room, because I think people picture it wrong."
**IMG:** `COOL.` Wide flat view of a treatment room: a neat semicircle of plain identical chairs, all empty, no equipment, no people. Chairs lower two-thirds, wide empty cool wall above.

**S30** · 5:10 · **VO:** "Twenty-two chairs. All full. And nobody asks anybody what they've got."
**CAP:** 22 chairs
**IMG:** `COOL.` The same room, now every chair occupied by flat silhouette figures with no facial detail, all facing forward, none turned toward each other. `[THIN]` [HIM] is the one figure drawn in full colour, right of centre.

**S31** · 5:21 · **VO:** "You'd think it would be the one place you could. It's the one place you don't. It's the only unspoken rule and everybody keeps it."
**IMG:** `COOL.` Close-up of two plain chair armrests side by side with a small gap between them, one hand resting on each, not touching. Armrests fill the lower frame, empty cool space above.

**S32** · 5:34 · **VO:** "You talk about parking. About the weather. About the coffee machine on the second floor."
**IMG:** `COOL.` `[THIN]` [HIM] seated beside one silhouette figure, both facing forward, small polite expressions, clearly mid-small-talk. Both right of centre, empty cool space left.

**S33** · 5:44 · **VO:** "And then one week a chair is empty and nobody says anything about that either."
**CAP:** and then a chair is empty
**IMG:** `COOL.` The same semicircle of chairs, all occupied by silhouettes except one clearly empty chair. Nobody is looking at it. `[THIN]` [HIM] in colour, right of centre, facing forward.

**S34** · 5:57 · **VO:** "The week I was diagnosed I googled things I will not repeat here. You know the ones. Survival, and then a number, and then a year."
**IMG:** `COOL.` `[THIN]` [HIM] lying in bed at night, face lit from below by a phone held above him, expression flat. Bed lower right, huge empty dark-cool space upper left. No readable screen content.

**S35** · 6:09 · **VO:** "Don't. Or do, because you're going to anyway. But know that the number you find is old, and it isn't you."
**CAP:** the number isn't you
**IMG:** `COOL.` A single plain flat shape on a wall, drawn faint and half-erased at its edges. Simple, geometric, no text or digits. Shape right third, empty cool wall left.

**S36** · 6:22 · **VO:** "And nobody warns you about the paperwork. I spent more hours on forms than in surgery."
**IMG:** `COOL.` `[THIN]` [HIM] seated at a table almost hidden behind a tall untidy stack of plain papers, only his head and shoulders visible above it. Him and stack right of centre, empty cool space left.

**S37** · 6:32 · **VO:** "There is something almost funny about that. I laughed at it once and it turned into something else halfway through."
**IMG:** `COOL.` Close-up of `[THIN]` [HIM]'s face mid-laugh, mouth open, but the eyes wet and unsmiling — the expression caught in the exact moment it changes. Face right half, empty cool space left.

---
## ACT 4 — THE ONE I STILL CAN'T HOLD · 6:40–8:30 — *extends "I survived. He didn't." (1.2K)*
---

**S38** · 6:40 · **VO:** "There was a man in the chair next to mine. [FIRST NAME OR 'I'll call him H'.]"
**CAP:** the chair next to mine
**IMG:** `DEEP #8E9BA3.` Two plain chairs side by side, `[THIN]` [HIM] in one drawn in full colour, a single silhouette figure in the other. Everything else empty. Both right of centre, deep grey-blue space left.

**S39** · 6:50 · **VO:** "We talked about parking, obviously. For four months."
**IMG:** `DEEP.` The same two chairs, four small identical panels in a row showing the pair sitting together unchanged. Repetitive and flat. Empty deep space above.

**S40** · 6:59 · **VO:** "[BRIEF LINE — one small, specific, ordinary thing about him. A habit, a phrase, what he brought with him. One detail is worth a paragraph.]"
**IMG:** `DEEP.` Close-up of a single small ordinary personal object resting on a chair armrest — a plain flask, or a folded newspaper. Object right third, empty deep space left. No people.

**S41** · 7:11 · **VO:** "He was doing better than me. Everyone said so. He was doing better than me right up until he wasn't."
**CAP:** he was doing better than me
**IMG:** `DEEP.` The two chairs again, but now the second chair is empty and `[THIN]` [HIM] is sitting alone, looking straight ahead, not at the empty chair. Him right of centre, empty deep space left.

**S42** · 7:24 · **VO:** "I found out the way you find out. Somebody didn't say his name."
**IMG:** `DEEP.` `[THIN]` [HIM] standing facing a nurse's flat silhouette, whose posture is slightly turned away. Neither is looking directly at the other. Both right, empty deep space left.

**S43** · 7:34 · **VO:** "And then eleven months later a doctor told me mine was gone."
**IMG:** `DEEP.` Split composition: on the left the empty chair, on the right `[THIN]` [HIM] seated in the consultation room. A thin dark vertical line between. Empty deep space above both.

**S44** · 7:44 · **VO:** "Nobody prepares you for what that does. You are not allowed to be unhappy about good news."
**CAP:** you're not allowed to be unhappy
**IMG:** `DEEP.` `[THIN]` [HIM] standing alone, arms at his sides, head slightly lowered, in a very large completely empty deep grey-blue room. He is small, lower centre. Maximum emptiness.

**S45** · 7:56 · **VO:** "So you say Alhamdulillah, and you mean it, and underneath it you are asking a question you know you shouldn't ask."
**IMG:** `DEEP.` Close-up of `[THIN]` [HIM]'s open hands raised in dua, but the fingers slightly tense and curled rather than relaxed — the right gesture, held wrong. Hands lower right, empty deep space upper left.

**S46** · 8:08 · **VO:** "Why him and not me. There is no good answer to that and I have stopped looking for one."
**CAP:** why him and not me
**IMG:** `DEEP.` Two identical plain chairs facing the viewer, both completely empty, drawn symmetrically. Nothing else. Chairs centred low, huge empty deep space above.

**S47** · 8:20 · **VO:** "What I do instead is say his name out loud sometimes. That's all I've got. It turns out that's allowed to be all you've got."
**IMG:** `DEEP.` `[THIN]` [HIM] standing alone, mouth slightly open mid-word, eyes open and calm, facing an empty room. Him right of centre, empty deep space left.

---
## ACT 5 — 3AM · 8:30–10:20 — *extends "At 3am I asked Allah what the pain was for" (1.2K) · "Sabr doesn't mean what I thought" (914)*
---

**S48** · 8:30 · **VO:** "Which brings me to a night about four months in. Three in the morning, second night after surgery."
**CAP:** 3am
**IMG:** `DEEP.` Wide flat view of `[THIN]` [HIM] lying awake in a hospital bed at night, eyes open, arms at his sides on top of the covers, one small window shape on the wall. Bed lower right, huge empty dark space upper left. No tubes, no equipment.

**S49** · 8:41 · **VO:** "I still had the wristband on then."
**IMG:** `DEEP.` Close-up of `[THIN]` [HIM]'s wrist resting on a pale sheet, the thin accent-red `#C4553F` wristband around it, intact. Wrist and band lower right, empty deep space upper left. **Accent use 3 of 5.**

**S50** · 8:49 · **VO:** "And I asked Allah, out loud, in an empty room, what the pain was for."
**IMG:** `DEEP.` `[THIN]` [HIM] lying in the bed, head turned toward the window, mouth slightly open mid-sentence, speaking to nobody. Bed right of centre, empty deep space left.

**S51** · 8:59 · **VO:** "Not why. What for. There's a difference and I only found it that night."
**CAP:** not why. what for.
**IMG:** `DEEP.` Two plain shapes side by side on a flat wall, similar but clearly not identical. Simple, geometric, no text. Shapes right two-thirds, empty deep space left.

**S52** · 9:10 · **VO:** "Why is a complaint dressed as a question. It wants somebody to be at fault."
**IMG:** `DEEP.` `[THIN]` [HIM] seated on the edge of the bed, arms crossed, chin slightly raised, a guarded closed posture. Him right of centre, empty deep space left.

**S53** · 9:20 · **VO:** "What for is a different thing entirely. It assumes there's a use. It's the harder question because it puts some of it back on you."
**IMG:** `WARM #E8C79A — the grade turns here and does not go back.` `[THIN]` [HIM] seated on the edge of the bed, arms uncrossed, hands open on his knees, shoulders down. Warm sand wall behind him for the first time. Him right of centre, wide warm empty space left.

**S54** · 9:34 · **VO:** "I didn't get an answer that night. I want to be very clear about that. Nothing happened. No light, no dream, nothing."
**CAP:** nothing happened
**IMG:** `WARM.` The same hospital room, same framing, completely unchanged except the warm background. `[THIN]` [HIM] still sitting there. Deliberately uneventful.

**S55** · 9:45 · **VO:** "But I stopped asking the first question. And about a month later I noticed I had been getting an answer the whole time, just not in words."
**IMG:** `WARM.` `[THIN]` [HIM] standing at a window in warm daylight, side-on, one hand flat on the sill, looking out with a calm expression. Him and window left third, wide warm empty wall right.

**S56** · 9:58 · **VO:** "Everyone had told me to have sabr. I had always heard that as: endure this quietly and don't complain."
**IMG:** `WARM.` `[THIN]` [HIM] standing very still and upright with his mouth closed in a tight flat line, shoulders rigid, arms pinned at his sides. Stiff and held. Him right of centre, warm empty space left.

**S57** · 10:09 · **VO:** "That isn't what it is. Sabr isn't going quiet. It's staying — staying in the room, staying in the relationship with Allah — while it hurts."
**CAP:** sabr isn't going quiet
**IMG:** `WARM.` `[THIN]` [HIM] seated on the prayer mat, shoulders relaxed, hands open, clearly present and settled rather than braced. Him right of centre, wide warm empty space left.

**S58** · 10:23 · **VO:** "You are allowed to say it hurts. Yaqub said it hurts. He said it out loud and it's in the Quran."
**IMG:** `WARM.` A plain open book resting on a low table, pages blank, no readable text. Book right third, warm empty space left. No people.

**S59** · 10:35 · **VO:** "What you're not asked to do is leave. That's the whole thing. Sabr is a location, not a volume."
**CAP:** sabr is a location, not a volume
**IMG:** `WARM.` `[THIN]` [HIM] seated on the prayer mat in the exact centre of a warm room, staying, everything around him open and calm. Centred, generous warm space on all sides.

---
## ACT 6 — THE WRISTBAND · 10:20–12:20 — *extends "Please stop saying this" (1.2K) · "what cancer took and gave back" (1.2K) · "the wristband" (1.7K)*
---

**S60** · 10:50 · **VO:** "Two quick things, and then the drawer."
**IMG:** `WARM.` `[THIN]` [HIM] standing facing the viewer directly, hands loose, calm open posture, mid-speech. Him right of centre, wide warm empty space left.

**S61** · 10:57 · **VO:** "One. If someone you love is sick, please stop saying 'everything happens for a reason.' Say 'I'm here Thursday.' Give them a day, not a philosophy."
**CAP:** give them a day, not a philosophy
**IMG:** `WARM.` Two flat shapes side by side: on the left a large vague cloud-like form, on the right a small solid clearly-defined square. Simple, geometric, no text. Shapes right two-thirds, warm empty space left.

**S62** · 11:14 · **VO:** "Somebody paid my rent one month and never told me who. That person understood something the rest of us are still working out."
**IMG:** `WARM.` A plain unmarked envelope resting on a doormat inside a front door, nobody in frame. Envelope and door lower right, warm empty hallway space upper left.

**S63** · 11:27 · **VO:** "Two. People ask what cancer took. It took a year, an organ, and a version of me who thought he had time to waste."
**CAP:** what it took
**IMG:** `WARM.` Three small plain shapes in a row on a flat wall, each drawn as a faint outline only, clearly absent. Simple, geometric. Shapes right two-thirds, warm empty space left.

**S64** · 11:42 · **VO:** "What it gave back is harder to say out loud without sounding like a poster. So I'll say it as plainly as I can: I am here now. Actually here. I wasn't before."
**CAP:** I am actually here now
**IMG:** `PALE #EFEAE2.` `[THIN]` [HIM] standing in an ordinary kitchen looking directly and attentively at a very ordinary thing — a mug on the counter — really seeing it. Him left third, mug right, empty pale space between.

**S65** · 12:00 · **VO:** "So. The drawer. I open it most mornings and I look at a cut wristband, and I'm not being sentimental. I'm checking a date."
**IMG:** `PALE.` The open drawer from directly above, the accent-red `#C4553F` wristband lying flat inside, `[THIN]` [HIM]'s hand at the drawer's edge. Drawer right two-thirds, empty pale space left. **Accent use 4 of 5.**

**S66** · 12:14 · **VO:** "Because a year ago I would have told you I wanted more time. I had it. I just wasn't in it. The wristband is how I remember to actually turn up to my own life. Then I close the drawer and go and have breakfast."
**CAP:** turn up to your own life
**IMG:** `PALE.` Wide flat view: `[THIN]` [HIM] seated at his kitchen table having an ordinary breakfast in ordinary morning light, the drawer closed behind him, one small accent-red `#C4553F` detail somewhere in the room. Calm, unremarkable, warm-neutral. Him right of centre, generous empty pale space left. **Accent use 5 of 5. Final frame.**

**S67** · 12:35 · **VO:** "If you're the one who just got the phone call, there are shorter pieces of this on the channel. Start wherever it hurts. I'll see you there."
**IMG:** `PALE.` `[THIN]` [HIM] standing facing the viewer, calm and still, hands relaxed. Centred, generous empty pale space either side — deliberately clear for end-screen cards.

---

# THUMBNAIL — 16:9, MANDATORY (runtime > 180s)

Generate **1920×1080**, downscale to **1280×720**, under 2MB. Set the `thumbnail` key in the
upload config only once the file exists — preflight fails on a key pointing at a missing file.

**Do not use the finance channel's vidIQ card layout.** That sells a number. This sells a
sentence. Rules for this channel:

1. **The character carries it**, at a close-up scale the video never uses.
2. **Two elements only:** his face left, text right.
3. **Text must not repeat the title.** The title says the cancer was gone. The thumbnail says
   the half the title leaves out.
4. **Legibility at 320px.** If it isn't readable, cut a word.

**Prompt:**
> `PALE #EFEAE2 background.` Close-up portrait of [HIM] `[THIN]` from the chest up, hard-cropped on the **left third**, facing into frame toward the right. Expression: a small polite closed-mouth smile with completely flat, unsmiling dot eyes — the mismatch is the whole point. Larger scale than any image in the film. Right two-thirds completely empty flat pale ground for text. `STYLE SUFFIX` applies.

**Text (heavy sans, deep charcoal `#2B2B2B`, right two-thirds):**

| | Text | Why |
|---|---|---|
| **A** *(lead)* | `THEY SAID` / `IT WAS GONE.` / `I FELT NOTHING.` | The 1.3K Short's exact promise. Proven hook, three-beat rhythm, contradicts the smile in the picture. |
| B | `NOBODY WARNS` / `YOU ABOUT` / `THE AFTER` | Broader, less specific, weaker at 320px. |
| C | `I SURVIVED.` / `HE DIDN'T.` | Strongest emotionally, but it promises Act 4 and the video is wider than that. |

Add a small accent-red `#C4553F` pill badge clipped to the lower text edge: `11 MONTHS AFTER`.
The wristband is red, the badge is red — that's the channel's one colour and it should show up
in the thumbnail so the grid reads as one body of work.

---

# TITLE

**Lead:** `They Told Me The Cancer Was Gone. Nobody Warned Me What Came After.`

Alternates:
- `The Year After They Said I Was Cancer Free`
- `What Nobody Tells You About Surviving Pancreatic Cancer`

**No `Part N`.** The Part-numbered uploads on this channel sit at 7–13 views. The numbering
signals "fragment, you've missed some" to a Shorts viewer who has never seen the others — which
is every viewer this video is for.

---

# DESCRIPTION

```
Eleven months ago a doctor told me they thought the cancer was gone. I walked out to
the car park and felt nothing at all.

Nobody warns you about the part after. This is that part — the body that doesn't come
back the way you left it, the six weeks I couldn't stand up to pray, the chair next to
mine that was empty one week, and what I actually think sabr means now.

If you were just diagnosed, or you're the one holding their hand, this is the video I
went looking for and couldn't find.

00:00  The drawer
01:05  "We think it's gone"
02:40  What the surgery leaves behind
05:00  22 chairs
06:40  The one I still can't hold
08:30  3am
10:50  Please stop saying this
12:00  The wristband

🔔 A new piece of the story every day: https://www.youtube.com/@HeldByFaithJourney

For business or to share your own story: heldbyfaithjourney@gmail.com

DISCLAIMER: This is a personal story, not medical advice. Please consult healthcare
professionals for any medical concerns.

#CancerJourney #MuslimCancerStory #PancreaticCancer #WhippleSurgery #Sabr #Tawakkul
#CancerSurvivor #Remission #HeldByFaith #CancerSupport
```

# TAGS

```
life after cancer, cancer free but not okay, survivor guilt, what nobody tells you about
remission, whipple surgery recovery, pancreatic cancer survivor, muslim cancer story,
praying sitting down illness, sabr meaning, cancer ward, being told cancer is gone,
what to say to someone with cancer, cancer recovery mental health, held by faith,
scanxiety, life after whipple
```

`life after cancer`, `survivor guilt` and `what to say to someone with cancer` are the
searches that keep this video earning long after the feed drops it. That is the long-form
advantage the Shorts do not have.

---

# PRODUCTION NOTES

- **Record the VO first.** The cut follows delivery.
- **~1,500 words over ~12:40.** Deliberately slow. Roughly 40% is silence. Do not fill the
  pauses with music.
- **Captions:** burn in the 22 `CAP` beats only. Long-form captioned line-by-line reads as a
  stretched Short. Upload a full `.srt` separately — `hasCaption: false` across this channel
  is worth ending here.
- **Holds:** 8–14s per image. Slow 3–5% push-in on faces, static on objects.
- **The repeats are load-bearing.** S02→S65 (the drawer), S22→S28 (the chair, braced then
  settled), S38→S41→S46 (two chairs, then one, then none), S45's tense dua hands, S10's
  smile-with-flat-eyes reappearing as the thumbnail. Frame them identically.
- **Never warm before S53.** It is the only arc the visuals have.
- **The accent red appears exactly 5 times**: S02, S11, S49, S65, S66. Every extra use costs
  the final frame something.
