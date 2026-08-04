#!/usr/bin/env bash
# Idempotent: ensures the dedicated Chrome for Google Flow is listening on CDP 9222.
# Already up -> READY. Otherwise launches it detached (survives the caller exiting)
# and verifies. Single-line output for easy parsing.
# macOS / Linux / Git-Bash counterpart to the repo's scripts/ensure-flow-chrome.ps1.
set -uo pipefail

CDP_PORT="${FLOW_CDP_PORT:-9222}"
FLOW_URL="https://labs.google/fx/tools/flow"

case "$(uname -s)" in
  Darwin)
    USER_DATA_DIR="${FLOW_CHROME_PROFILE:-$HOME/Library/Application Support/FlowAutomationChrome}"
    CANDIDATES=(
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      "$HOME/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    ) ;;
  MINGW*|MSYS*|CYGWIN*)
    USER_DATA_DIR="${FLOW_CHROME_PROFILE:-${LOCALAPPDATA:-$HOME}/FlowAutomationChrome}"
    CANDIDATES=(
      "/c/Program Files/Google/Chrome/Application/chrome.exe"
      "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"
      "${LOCALAPPDATA:-$HOME}/Google/Chrome/Application/chrome.exe"
    ) ;;
  *)
    USER_DATA_DIR="${FLOW_CHROME_PROFILE:-$HOME/.config/FlowAutomationChrome}"
    CANDIDATES=(
      "$(command -v google-chrome || true)"
      "$(command -v google-chrome-stable || true)"
      "$(command -v chromium || true)"
      "$(command -v chromium-browser || true)"
    ) ;;
esac

cdp_up() { curl -sf -m 4 "http://127.0.0.1:${CDP_PORT}/json/version" >/dev/null 2>&1; }

if cdp_up; then
  echo "READY: Chrome already up on CDP ${CDP_PORT}"
  exit 0
fi

CHROME="${FLOW_CHROME_PATH:-}"
if [ -z "$CHROME" ]; then
  for c in "${CANDIDATES[@]}"; do
    [ -n "$c" ] && [ -x "$c" ] && { CHROME="$c"; break; }
  done
fi

if [ -z "$CHROME" ] || [ ! -x "$CHROME" ]; then
  echo "FAILED: Google Chrome not found (set FLOW_CHROME_PATH or install Chrome)"
  exit 1
fi

mkdir -p "$USER_DATA_DIR"

nohup "$CHROME" \
  --remote-debugging-port="${CDP_PORT}" \
  --user-data-dir="$USER_DATA_DIR" \
  --no-first-run \
  --no-default-browser-check \
  --disable-blink-features=AutomationControlled \
  --window-size=1920,1080 \
  "$FLOW_URL" >/dev/null 2>&1 &
disown 2>/dev/null || true

for _ in $(seq 1 12); do
  sleep 1
  if cdp_up; then
    echo "LAUNCHED: Chrome up on CDP ${CDP_PORT}. If labs.google shows the landing page, click 'Sign in to Flow' once."
    exit 0
  fi
done

echo "FAILED: Chrome launched but CDP ${CDP_PORT} not responding within 12s"
exit 1
