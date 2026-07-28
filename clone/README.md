# The presenter clone

How the host you see in `remotion/public/host/` gets made, and the specific
things that make an AI presenter read as a person rather than as an avatar.

The source is `media/clone-source.mp4` — a 10-second, 720×1280, 24 fps
Gemini-generated take of you at the desk, and it is the identity reference for
everything downstream.

---

## 0. One-time: extract the references

```bash
./clone/extract_reference.sh media/clone-source.mp4
```

Writes `clone/reference/`:

| File | What it is | Where it goes |
|---|---|---|
| `face.png` | de-watermarked full-res still | avatar identity reference |
| `face-crop.png` | 1024-wide head-and-shoulders | most tools want this framing |
| `voice.wav` | 48 kHz mono, de-noised, −16 LUFS | voice-clone reference |
| `grade.txt` | measured source format + loudness | matching new takes |

The watermark removal is a `delogo` box measured at `x=590 y=1148 w=76 h=76` on
a 720×1280 plate. If you regenerate the source at a different resolution,
re-measure it or the box will sit in the wrong place.

---

## 1. Voice first. Always voice first.

Picture is cut to a locked voice track, and the avatar takes are generated
**from** that track. Doing it the other way — generating video, then trying to
lay narration over it — is what produces the floaty, half-a-frame-late lip sync
that people read as fake without being able to say why.

1. Clone the voice from `clone/reference/voice.wav` (ElevenLabs instant clone,
   HeyGen voice clone, or equivalent).
2. Render the episode VO as **one continuous track** from the `vo:` fields in
   `remotion/src/scripts/epNN.ts`. Read them in beat order, no edits.
3. Save it as `remotion/public/vo/ep01.mp3` and register it:

   ```ts
   // remotion/src/lib/assets.ts
   export const NARRATION = { ep01: 'ep01.mp3' };
   ```

**The honest limit:** 10 seconds of reference gets you an instant clone that
sounds close in isolation and flattens out over a seven-minute script —
monotone at the ends of long sentences, wrong stress on the punchlines. That is
exactly where this format lives. Record **3–5 minutes** of clean read-aloud
into the same mic before cloning for real. It is the single highest-leverage
hour in this whole pipeline.

Delivery direction for the render: ~165 wpm, conversational, no dramatic
pauses. Every pause in these videos is a cut, not a breath — if the VO breathes,
the jump cuts land on silence and the edit goes limp.

---

## 2. Then the takes

Generate the avatar against `clone/reference/face.png` (or a video avatar
trained on 2+ minutes of footage, which is meaningfully better), driven by the
VO track from step 1.

Four rules, and all four are the difference between "presenter" and "avatar":

**One take per beat group, never one take for the episode.** The scripts name
takes `ep01-hook`, `ep01-a` … `ep01-g` for exactly this. Long unbroken avatar
renders accumulate drift — the head slowly centres, the blink rate goes
metronomic, the micro-movement decays. Keep each take under ~90 seconds.

**Vary the framing between takes, not just the zoom.** The `zoom` values in the
scripts punch in on the *same* plate, which is a real editing move. But if
every take is generated at identical framing, the punch-ins are the only
variation in seven minutes and it starts to feel like a slideshow. Ask for a
slightly different head position per take.

**Never generate the reaction frames.** `freeze` beats hold a frame out of a
take you already have. A separately generated "reaction shot" will not match.

**Let the grade do the unifying.** `remotion/src/components/Grade.tsx` puts
moving grain, a vignette and a warm wash over everything, including the
cutaways and the title cards. This is not decoration — a shared grain plate over
a mixed-source edit is most of what makes it feel like one camera.

Then conform and register them:

```bash
./clone/build_takes.sh clone/raw remotion/public/host
# prints the TAKES array to paste into remotion/src/lib/assets.ts
```

`build_takes.sh` forces every take to 720×1280 / 30 fps, strips the watermark,
strips audio, and applies a small contrast/saturation match. Skipping this is
how one shot ends up half a stop brighter than its neighbours.

---

## 3. Disclosure

The presenter is synthetic. YouTube requires the "altered or synthetic content"
disclosure in Studio for realistic AI-generated people, and it applies here even
though the likeness is your own. Tick it. It shows as a small label in the
description panel, it has no measurable effect on reach, and it costs nothing
compared to having a channel-level strike land on a finance channel.

---

## 4. Where the placeholder fits

`remotion/public/host/placeholder.mp4` is the raw source clip. Every take name
in every script falls back to it (`resolveTake` in
`remotion/src/lib/assets.ts`), so all five episodes preview end-to-end at full
length before a single real take exists. As you add takes to `TAKES`, they take
over one at a time — you never have a broken timeline mid-build.
