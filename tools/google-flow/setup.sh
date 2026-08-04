#!/usr/bin/env bash
# One-shot local setup for the Google Flow MCP server.
# Run this on YOUR machine (not in a Claude Code web/remote container — this needs a
# real Chrome logged into your Google account).
#
#   bash tools/google-flow/setup.sh [install-dir] [google-account-email]
#
# Defaults: ~/.mcp/google-flow-mcp, account from $FLOW_ACCOUNT.
set -euo pipefail

REPO_URL="https://github.com/gabrielgargiulodev/google-flow-mcp"
DEST="${1:-$HOME/.mcp/google-flow-mcp}"
ACCOUNT="${2:-${FLOW_ACCOUNT:-}}"

if [ -z "$ACCOUNT" ]; then
  read -r -p "Google account used for Flow (e.g. you@gmail.com): " ACCOUNT
fi
[ -n "$ACCOUNT" ] || { echo "Need a Google account email."; exit 1; }

command -v node >/dev/null || { echo "Node.js >= 18 required."; exit 1; }
command -v git  >/dev/null || { echo "git required."; exit 1; }

echo "==> Fetching server into $DEST"
if [ -d "$DEST/.git" ]; then
  git -C "$DEST" pull --ff-only
else
  mkdir -p "$(dirname "$DEST")"
  git clone --depth 1 "$REPO_URL" "$DEST"
fi

echo "==> Installing dependencies"
( cd "$DEST" && npm install --omit=dev )

# Platform-specific Chrome path + dedicated profile dir, matched to ensure-flow-chrome.sh
case "$(uname -s)" in
  Darwin)
    CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    PROFILE_DIR="$HOME/Library/Application Support/FlowAutomationChrome" ;;
  MINGW*|MSYS*|CYGWIN*)
    CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"
    PROFILE_DIR="${LOCALAPPDATA:-$HOME}/FlowAutomationChrome" ;;
  *)
    CHROME_PATH="$(command -v google-chrome || command -v google-chrome-stable || echo /usr/bin/google-chrome)"
    PROFILE_DIR="$HOME/.config/FlowAutomationChrome" ;;
esac

CONFIG="$DEST/config/flow.config.json"
if [ -f "$CONFIG" ]; then
  echo "==> Keeping existing $CONFIG"
else
  echo "==> Writing $CONFIG"
  node -e '
    const fs = require("fs");
    const [src, out, account, chromePath, profileDir] = process.argv.slice(1);
    const cfg = JSON.parse(fs.readFileSync(src, "utf8"));
    cfg.expectedAccount = account;
    cfg.chromePath = chromePath;
    cfg.chromeUserDataDir = profileDir;
    fs.writeFileSync(out, JSON.stringify(cfg, null, 2) + "\n");
  ' "$DEST/config/flow.config.example.json" "$CONFIG" "$ACCOUNT" "$CHROME_PATH" "$PROFILE_DIR"
fi

echo "==> Registering MCP server with Claude Code"
claude mcp remove google-flow --scope user >/dev/null 2>&1 || true
claude mcp add google-flow --scope user -- node "$DEST/src/index.js"

cat <<EOF

Done. Next:

  1. bash tools/google-flow/ensure-flow-chrome.sh
     In the Chrome window that opens, sign in to Google AND click "Sign in to Flow"
     (Flow has its own separate sign-in). That session is saved to the dedicated
     profile and reused from then on.

  2. Restart Claude Code — MCP servers load at startup.

  3. Ask Claude to generate an image; the google-flow-generate skill drives the rest.

Verify any time with:  claude mcp list
EOF
