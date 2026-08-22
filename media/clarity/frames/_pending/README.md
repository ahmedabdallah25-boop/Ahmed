# Recitation plates — awaiting verified mushaf text

Each JPEG here is a PARTIAL FRAME, not a placeholder: everything on it is real
on-screen copy — the citation, in its final position and treatment. The area
above it is empty because the ayah is not verified yet.

**Nothing in this folder may be cut into the video as-is.** Not because it
carries a warning — it deliberately does not — but because the ayah is missing,
which is visible.

Paste the text from a checked digital mushaf, never retyped, and have a reader
confirm it on screen before render.

| Frame | Citation | What goes above the citation |
|---|---|---|
| S005 | AL-ALAQ 96:1–5 | Five ayat, Amiri, cream, one line appearing per reciter phrase. No translation. |
| S055 | AL-KAWTHAR 108 | Three ayat complete, one per phrase. |
| S083 | AL-ISRA 17:23–24 | Both ayat. Set قَضَىٰ in gold, the rest cream. |
| S114 | AL-HUJURAT 49:13 | The ayah. Set لِتَعَارَفُوا in gold. |
| S119 | AL-MAIDA 5:3 | The relevant clause only. Set أَكْمَلْتُ in gold. |
| S121 | AN-NASR 110 | Three ayat complete, one per phrase. |

Regenerate one plate with:

    NODE_PATH=/opt/node22/lib/node_modules node automation/clarity_frames.js S083
