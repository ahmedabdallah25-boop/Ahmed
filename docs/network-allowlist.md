# Network allowlist needed for direct frame analysis

The visual analysis of reference Shorts currently depends on nexlev's
`watch_youtube_video_and_ask`, which is capped at **1 call per 24 hours** on the free plan.
Allowing YouTube egress removes that dependency entirely — frames can then be pulled and read
directly, unmetered.

## What is blocked today

This session's outbound HTTPS goes through a policy-enforcing egress proxy. Verified 2026-08-01:

| Host | Result |
|---|---|
| `i.ytimg.com` | `403` — `connect_rejected`, gateway policy denial |
| `youtube.com` (via yt-dlp) | `403 Forbidden` on CONNECT tunnel |

The proxy's own README states these must be reported rather than routed around, so the fix has to
happen in the environment's configuration — it cannot be done from inside the session.

## Hosts to allow

Add all four. The third is the one that is easy to miss:

```
youtube.com
www.youtube.com
i.ytimg.com
*.googlevideo.com
```

`*.googlevideo.com` is where the actual media bytes are served from. Without it, `yt-dlp` will
successfully resolve video metadata and then fail at download — which looks like a different bug
than it is.

## Where to change it

The network policy is chosen per **environment** (this session runs in `env_01XtCzuVxkRvebY4KpjpLfbt`),
not per session. Change it in the Claude Code environment settings, then start a new session so the
policy is picked up. Docs: https://code.claude.com/docs/en/claude-code-on-the-web

## Dependencies (already solved)

Both install from pypi, which is on the proxy's `noProxy` allowlist and needs no policy change:

```bash
pip install yt-dlp imageio-ffmpeg
```

`imageio-ffmpeg` ships a static ffmpeg 7.0.2 binary, which sidesteps `apt` — the Debian repos are
also outside the egress policy, so `apt install ffmpeg` would fail for the same reason YouTube does.

## Verifying the change worked

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://i.ytimg.com/vi/yC7O3mITIs4/maxresdefault.jpg
```

`200` means the policy took effect. `403` means it did not — check the recent failures list:

```bash
curl -sS "$HTTPS_PROXY/__agentproxy/status"
```

## Then

```bash
./automation/extract-frames.sh yC7O3mITIs4
./automation/extract-frames.sh id7bRTS7zeI
./automation/extract-frames.sh hgkYDnW5j_w
```

Each produces ~60–90 stills plus contact sheets in `/tmp/frames/<id>/`, which can be read directly
as images — full visual analysis of all three in one sitting, no rate limit, and at a much finer
granularity than a single tool call returns.
