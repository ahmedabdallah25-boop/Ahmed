# Review room + taste memory

## Round protocol

1. `ve review` (run in background Bash — it serves until stopped) and give the user
   the printed URL. They pause the video, type timestamped notes, hit **Done**.
2. User says "feedback done" → run `ve taste`. It prints the notes and moves them
   into `taste.md` under `## Inbox`.
3. For each note, make the SMALLEST change that satisfies it:
   - graphic/caption/music/sfx note → edit `edit.json`, re-run `ve render` only
     (cut.mp4 is cached — this is the fast path).
   - pacing/"cut this part" note → adjust `keep_lines`, `ve cut && ve render`.
4. Distill each note into one permanent rule under `## Rules` in `taste.md`
   (e.g. "t=12s: logo overlaps text" → "- Never place `image` gfx at `center` while
   captions are on"). Delete the Inbox entry once distilled.
5. Reply with only: new version number + one line per note on how it was addressed.

## Taste memory

`taste.md` is the client's permanent style sheet. Read it before EVERY plan and every
feedback round; its rules override the defaults in graphics.md/audio.md. Rules must be
written as testable imperatives ("never…", "always…", "prefer X over Y"), one line each.
This is what makes version 10 better than version 1 — never let a noted mistake recur.
