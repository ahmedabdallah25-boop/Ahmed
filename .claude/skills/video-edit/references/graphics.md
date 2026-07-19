# gfx spec vocabulary

Every entry: `{"line": <id>}` or `{"t": <source-seconds>}` + `"type"` + fields below.
Optional everywhere: `"d"` duration seconds (default 2.2), `"pos"`: `top|center|lower`.
The renderer enforces safe margins, brand font/accent from config.json, 0.25s fade
in/out, and keeps `lower` graphics clear of the caption band. If the anchored moment
was cut out or a file is missing, the item is skipped with a printed note — never an error.

| type | fields | use for |
|---|---|---|
| `impact` | `text` | The one big claim; hook, punchline. Huge white uppercase, centered. Max ~4 words. |
| `keyword` | `text` | Names, tools, terms as they're spoken. Accent color. |
| `stat` | `text`, `label` | Numbers: `text` = "$2,000", `label` = "per month". |
| `lower_third` | `text` | Speaker/context tag; small, left, subtle. |
| `image` | `file` | Logo or picture floating over the talking head (assets/img/…). ~60% width. |
| `broll` | `file`, `d` | Full-frame cutaway (image or video), 0.25s crossfade both ends. |

## Taste defaults (override only if taste.md says so)

- 3–8 graphics per minute of final video. One idea on screen at a time — never overlap two gfx.
- `impact` on the hook line; `stat` for every number the speaker says; `keyword` when a tool/name first appears.
- Anchor with `"line"` whenever possible; use `"t"` only for a moment mid-line.
- b-roll cutaways ≥ 2.5s, never during the hook or CTA.
