# Google Flow image/video generation

Generate images and video on [Google Flow](https://labs.google/fx/tools/flow) from
Claude, using the Google AI Pro subscription instead of a per-credit service.

Images are effectively free against the monthly Flow pool; **video spends credits**.

## Setup (run on your own machine)

```bash
bash tools/google-flow/setup.sh
```

Clones [gabrielgargiulodev/google-flow-mcp](https://github.com/gabrielgargiulodev/google-flow-mcp)
to `~/.mcp/google-flow-mcp`, installs it, writes `config/flow.config.json` with the
right Chrome path for your OS, and registers the MCP server with Claude Code.

Then:

```bash
bash tools/google-flow/ensure-flow-chrome.sh   # opens the dedicated Chrome
```

Sign in to Google **and** click "Sign in to Flow" once in that window — Flow has its
own separate sign-in. The session persists in a dedicated Chrome profile
(`FlowAutomationChrome`), so this is a one-time step.

Restart Claude Code afterwards; MCP servers load at startup. Verify with
`claude mcp list`.

The [`google-flow-generate`](../../.claude/skills/google-flow-generate/SKILL.md) skill
then drives generation — prompt construction, model choice, verification, fallbacks.

## Why the setup script exists

The upstream repo has no `bin` entry in `package.json`, so `npx github:...` fails with
"could not determine executable to run" — the server must be launched as
`node <path>/src/index.js`. Its Chrome launcher is also PowerShell-only;
`ensure-flow-chrome.sh` is the macOS/Linux/Git-Bash equivalent.

## Constraints worth knowing

- **Will not work in a Claude Code web/remote container.** It drives a real Chrome
  logged into a Google account, and `labs.google` is blocked by the remote sandbox's
  network policy. Local machine only.
- **Unofficial browser automation.** There is no public API for Flow, and the launcher
  deliberately suppresses the automation flag. Automating Google properties can
  violate Google's ToS and carries some account risk — your account, your call.
- Selector-based, so a Flow UI change can break it; `flow_discover_ui` re-inspects.
