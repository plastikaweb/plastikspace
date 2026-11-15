#!/usr/bin/env bash
# Claude Code PreToolUse guard (META-09).
#
# Turns rules that used to live only in prose or in Claude's memory into hard checks:
#   - Edit/Write on generated or tool-owned files is blocked.
#   - git commands that skip the Husky hooks are blocked.
#   - Killing, restarting or cloning the local PocketBase on :8090 needs the user's OK.
#
# Contract (Claude Code hooks):
#   block -> reason on stderr, exit 2
#   ask   -> one JSON object on stdout with permissionDecision "ask", exit 0
#   allow -> no output, exit 0
#
# Test by hand: echo '{"tool_name":"Bash","tool_input":{"command":"git commit --no-verify"}}' | .claude/hooks/guard.sh; echo $?

set -u

if ! command -v jq >/dev/null 2>&1; then
  echo "guard.sh: jq not found, Claude Code guards are inactive" >&2
  exit 1
fi

input=$(cat)
tool=$(jq -r '.tool_name // empty' <<<"$input")

block() {
  echo "[guard] blocked: $1" >&2
  exit 2
}

ask() {
  jq -n --arg r "[guard] $1" \
    '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"ask",permissionDecisionReason:$r}}'
  exit 0
}

case "$tool" in
Edit | Write | MultiEdit)
  file=$(jq -r '.tool_input.file_path // empty' <<<"$input")
  case "$file" in
  */apps/eco-store/pocketbase/pb_schema.json)
    block "pb_schema.json is exported from the live PocketBase by the pre-commit hook. Change the collection on the running instance (admin UI or PocketBase MCP), never the JSON."
    ;;
  */yarn.lock)
    block "yarn.lock changes only through yarn (add, remove, upgrade, install), never by hand."
    ;;
  esac
  ;;

Bash)
  cmd=$(jq -r '.tool_input.command // empty' <<<"$input")

  # Bypass checks look at the command line itself: only the first line (a heredoc body is
  # message text), with quoted strings removed so a commit message that mentions a flag
  # does not trip the guard.
  line=$(printf '%s\n' "$cmd" | head -n 1 | sed -E "s/'[^']*'//g; s/\"[^\"]*\"//g")

  # Split on command separators and check each git invocation on its own.
  while IFS= read -r seg; do
    [[ "$seg" =~ (^|[[:space:]/])git[[:space:]] ]] || continue
    if [[ "$seg" =~ [[:space:]](commit|push|merge)([[:space:]]|$) ]]; then
      sub="${BASH_REMATCH[1]}"
      [[ "$seg" == *--no-verify* ]] &&
        block "git $sub --no-verify skips the Husky hooks. Every commit and push must pass them; fix what the hook reports instead."
      [[ "$seg" =~ (^|[[:space:]])HUSKY=0([[:space:]]|$) ]] &&
        block "HUSKY=0 disables the Husky hooks. Every commit and push must pass them."
      [[ "$seg" == *core.hooksPath* ]] &&
        block "overriding core.hooksPath skips the Husky hooks. Every commit and push must pass them."
      if [[ "$sub" == commit ]]; then
        after="${seg#*commit}"
        for tok in $after; do
          [[ "$tok" =~ ^-[A-Za-z]*n[A-Za-z]*$ ]] &&
            block "git commit $tok includes -n (--no-verify), which skips the Husky hooks."
        done
      fi
    fi
  done < <(printf '%s\n' "$line" | awk '{ gsub(/&&|\|\||;|\|/, "\n"); print }')

  # PocketBase on :8090 belongs to the user's running session: ask before stopping,
  # restarting or copying it. Reading it (lsof, curl, the MCP) stays free.
  if [[ "$cmd" =~ (^|[^[:alnum:]_-])(kill|pkill|killall)([[:space:]]|$) ]] &&
    [[ "$cmd" =~ (pocketbase|8090) ]]; then
    ask "this stops the local PocketBase on :8090, which the user may be using. Confirm before running it."
  fi
  if [[ "$cmd" =~ pocketbase[[:space:]]+serve|eco-store:pocketbase:run|eco-store:local ]]; then
    ask "this starts or restarts the local PocketBase on :8090. Confirm that no other instance should keep running."
  fi
  if [[ "$cmd" =~ (^|[^[:alnum:]_-])(cp|rsync|mv|rm|ditto)[[:space:]].*pb_data ]]; then
    ask "this copies, moves or deletes the local pb_data. Confirm before touching the user's PocketBase data."
  fi
  ;;
esac

exit 0
