#!/usr/bin/env bash
# Print only the most recent pass(es) from an append-only pass log.
#
# channel-reset.md and heldbyfaith/channel-diagnosis.md are append-only: each pass
# is a new top-level "# ... pass" section and only the last one is current state.
# Reading the whole file to learn current state wastes most of the tokens it costs.
#
#   automation/latest-pass.sh                      # last pass of channel-reset.md
#   automation/latest-pass.sh 2                    # last two passes
#   automation/latest-pass.sh 1 heldbyfaith/channel-diagnosis.md
set -euo pipefail

n="${1:-1}"
file="${2:-channel-reset.md}"

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
[ -f "$file" ] || file="$root/$file"

if [ ! -f "$file" ]; then
  echo "latest-pass: no such file: $file" >&2
  exit 1
fi

start=$(grep -n '^# ' "$file" | tail -n "$n" | head -1 | cut -d: -f1 || true)
if [ -z "$start" ]; then
  cat "$file"
  exit 0
fi

total=$(wc -l < "$file")
echo "# (showing lines $start-$total of $total — $file, last $n pass(es))"
sed -n "${start},\$p" "$file"
