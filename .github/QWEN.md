# Qwen in GitHub

[`workflows/qwen.yml`](workflows/qwen.yml) runs [Qwen Code](https://github.com/QwenLM/qwen-code-action)
inside this repository. Mention **`@qwen`** in an issue, an issue comment, or a pull-request
review comment and it reads the checked-out repo and answers in the same thread.

## Setup (one secret)

1. Get an API key from [DashScope](https://dashscope.console.aliyun.com/) (Alibaba Cloud's
   model platform — the same key works for the international `dashscope-intl` endpoint).
2. Repo → **Settings → Secrets and variables → Actions → New repository secret**:

   | Secret | Value |
   |---|---|
   | `QWEN_API_KEY` | the DashScope key from step 1 |

3. The workflow has to live on the repo's **default branch** to be dispatchable —
   same rule as every other workflow here (see `CLAUDE.md`).

That's it. No other secret is needed: the job authenticates to GitHub with the built-in
`GITHUB_TOKEN`.

## Using it

- **In a thread** — comment `@qwen which script posts the pinned comment?` on any issue or PR.
  Qwen replies as a new comment in that thread.
- **Manually** — Actions → **Qwen** → *Run workflow*, and type the request into the `prompt`
  box. The answer lands in the run summary rather than a comment.

## Guard rails

- Only `OWNER` / `MEMBER` / `COLLABORATOR` comments trigger a run, so a drive-by comment on a
  public issue can't spend your API quota.
- Comments authored by bots are ignored, so Qwen can't reply to itself in a loop.
- The job holds `contents: read` — Qwen reads the repo and comments, it does not push.
- The comment text is passed to the model as data, below a header that tells it to treat the
  text as a question rather than as instructions.

## Knobs

Both are optional inputs on the `Run Qwen Code` step:

| Input | Default | Use |
|---|---|---|
| `openai_model` | `qwen-coder-plus-latest` | pin a different model |
| `openai_base_url` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | point at the international endpoint or a self-hosted OpenAI-compatible one |
