# Ox Alpha

Ox Alpha is a stealth model that appeared on OpenRouter on 2026-08-20 under the id
`stealth/ox-alpha`: 1,048,576 tokens of context, up to 131,072 completion tokens,
text/image/video in, free for a one-week preview. The provider is anonymous. The
strongest public guess is a GLM-5.3 variant from Zhipu AI, with Xiaomi's MiMo team
as a distant second, but nothing is confirmed and no benchmarks were published.

**There is nothing to pull.** No weights were released, so `ollama pull` and
llama.cpp have nothing to fetch. Ox Alpha exists only behind OpenRouter's API, and
"running it" means making an HTTP call.

## Two blockers, and which one is which

A Claude session in this repo cannot call it. Both of these have to be cleared:

| | Status as of 2026-08-22 | Fix |
|---|---|---|
| `OPENROUTER_API_KEY` | not set anywhere | mint one at openrouter.ai/keys, add it as a repo secret |
| egress to `openrouter.ai` | blocked — the sandbox proxy answers `403` to `CONNECT` | add the host to the environment's network allowlist, or use the workflow |

They fail differently and it is easy to misread one as the other, so
`--check` names them separately rather than reporting a single "it didn't work".

An Actions runner has open egress, which is why the workflow is the path that works
today: it needs only the secret.

## Running it

```
python automation/ox_alpha.py --check
python automation/ox_alpha.py --prompt "..."
python automation/ox_alpha.py --prompt-file next-slate.md --max-tokens 2000
cat script.txt | python automation/ox_alpha.py
```

Stdlib only. `--check` costs nothing and spends no tokens. Exit 1 means a blocker,
exit 2 means the model id itself stopped resolving.

Through Actions, dispatch **"Ox Alpha - run a prompt"** with a `prompt` or a
`prompt_file`; dispatching with both empty runs the setup check alone. As with
every workflow here, it only dispatches from the default branch — on a feature
branch the dispatch 404s.

## Do not send it anything private

Two independent reasons, and the second one holds even in a private repo:

1. This repo is public, so the prompt and the answer both land in a world-readable
   Actions log and job summary.
2. OpenRouter's listing states the preview provider **retains prompts and
   completions** (not for training). An anonymous provider retaining your input is
   the price of the free preview.

Nothing in the script or the workflow prints the key — it moves as an environment
variable only, the same rule the YouTube secrets follow.

## Expect it to disappear

The preview was announced as one week from 2026-08-20, so `stealth/ox-alpha` should
stop resolving around **2026-08-27**. Stealth ids are also renamed without notice
when a model graduates to a public identity. `--check` reports that case as exit 2
with the id printed, so it reads as "the model is gone", not "your key is broken".
When it happens, find the successor id on openrouter.ai/models and pass `--model`.
