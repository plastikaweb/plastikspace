#!/usr/bin/env bash
# Claude Code PreToolUse guard (META-09, META-32).
#
# Turns rules that used to live only in prose or in Claude's memory into hard checks:
#   - Edit/Write on generated or tool-owned files is blocked.
#   - git commands that skip the Husky hooks are blocked.
#   - git commit and git push piped into another command are blocked: the pipe reports the
#     last command's exit code, so a failed hook looks like success.
#   - git commit with a message commitlint rejects, or read with -F from a relative or $TMPDIR
#     path, is blocked before the pre-commit runs (commit-msg-check.mjs).
#   - Killing, restarting or cloning the local PocketBase on :8090 needs the user's OK.
#
# Commands are checked on their command words: heredoc bodies and quoted strings are text,
# so a grep pattern or a commit message that names a flag or PocketBase trips nothing. Only
# `bash -c`, `sh -c`, `zsh -c` and `eval`, whose quoted text runs, are also checked raw.
#
# Contract (Claude Code hooks):
#   block -> reason on stderr, exit 2
#   ask   -> one JSON object on stdout with permissionDecision "ask", exit 0
#   allow -> no output, exit 0
#
# Test: yarn guard:test. By hand:
#   echo '{"tool_name":"Bash","tool_input":{"command":"git commit --no-verify"}}' | .claude/hooks/guard.sh; echo $?

set -u
set -f

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

# Sets WORD to the program a command segment runs: skips variable assignments, wrappers (sudo,
# env, command, exec, time, nohup, caffeinate, xargs), shell keywords (do, then, if…) and the
# options of those wrappers. It sets a variable instead of printing because it runs for every
# stage, and a subshell costs ~5 ms.
cmdword() {
  local tok is_wrapped=0
  WORD=
  for tok in $1; do
    tok=${tok#[\(\{]}
    [[ -z "$tok" ]] && continue
    if [[ $is_wrapped == 1 && "$tok" == -* ]]; then continue; fi
    case "$tok" in
    [A-Za-z_]*=*) continue ;;
    sudo | env | command | exec | time | nohup | caffeinate | xargs | '(' | '{' | '!' | \
      do | then | else | elif | if | while | until)
      is_wrapped=1
      continue
      ;;
    esac
    WORD=${tok##*/}
    return
  done
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

  # Line continuations joined, heredoc bodies dropped (not `<<<` here-strings).
  code=$(printf '%s\n' "$cmd" | awk '
    delim != "" { line = $0; sub(/^[ \t]+/, "", line); if (line == delim) delim = ""; next }
    /\\$/ { sub(/\\$/, ""); buf = buf $0 " "; next }
    {
      $0 = buf $0; buf = ""; print
      rest = $0
      while (match(rest, /<<-?[ \t]*["\047]?[A-Za-z_][A-Za-z0-9_]*["\047]?/)) {
        if (RSTART > 1 && substr(rest, RSTART - 1, 1) == "<") { rest = substr(rest, RSTART + 3); continue }
        d = substr(rest, RSTART, RLENGTH); sub(/^<<-?[ \t]*/, "", d); gsub(/["\047]/, "", d)
        delim = d; break
      }
    }')
  # Quoted strings dropped (they may span lines), then fd redirections such as 2>&1 and &>,
  # whose & is not a separator; then one pipeline per line (split on ;, &&, ||, &).
  words=$(printf '%s' "$code" | perl -0777 -pe 's/\x27[^\x27]*\x27|"(?:[^"\\]|\\.)*"//g; s/\d*>&\d*-?|&>>?//g; s/&&|\|\||;|&/\n/g')

  has_commit=0 has_kill=0 has_copy=0 has_shell=0

  # Each pipeline (between ;, &&, ||, & and newlines), stage by stage.
  while IFS= read -r pipeline; do
    IFS='|' read -r -a stages <<<"$pipeline"
    n=${#stages[@]}
    for ((i = 0; i < n; i++)); do
      seg=${stages[i]}
      cmdword "$seg"
      word=$WORD
      case "$word" in
      kill | pkill | killall) has_kill=1 ;;
      cp | rsync | mv | rm | ditto) has_copy=1 ;;
      bash | sh | zsh | eval) [[ "$word" == eval || "$seg" =~ [[:space:]]-[a-z]*c ]] && has_shell=1 ;;
      esac
      [[ "$word" == git ]] || continue
      [[ "$seg" =~ [[:space:]](commit|push|merge)([[:space:]]|$) ]] || continue
      sub="${BASH_REMATCH[1]}"

      [[ "$seg" == *--no-verify* ]] &&
        block "git $sub --no-verify skips the Husky hooks. Every commit and push must pass them; fix what the hook reports instead."
      [[ "$pipeline" =~ (^|[[:space:]])HUSKY=0([[:space:]]|$) ]] &&
        block "HUSKY=0 disables the Husky hooks. Every commit and push must pass them."
      [[ "$seg" == *core.hooksPath* ]] &&
        block "overriding core.hooksPath skips the Husky hooks. Every commit and push must pass them."
      if [[ "$sub" == commit ]]; then
        has_commit=1
        after="${seg#*commit}"
        for tok in $after; do
          [[ "$tok" =~ ^-[A-Za-z]*n[A-Za-z]*$ ]] &&
            block "git commit $tok includes -n (--no-verify), which skips the Husky hooks."
        done
      fi
      # PIPESTATUS (bash), pipestatus (zsh) and pipefail keep git's exit code: allowed.
      if [[ "$sub" != merge ]] && ((i < n - 1)) && [[ ! "$cmd" =~ PIPESTATUS|pipestatus|pipefail ]]; then
        cmdword "${stages[i + 1]}"
        next=$WORD
        block "git $sub piped into ${next:-another command}: the pipe returns that command's exit code, so a failed hook reads as success. Redirect to a file and print \$? (git $sub … > \"\$log\" 2>&1; echo \"exit \$?\"; tail \"\$log\")."
      fi
    done
  done <<<"$words"

  if [[ $has_commit == 1 ]] && command -v node >/dev/null 2>&1; then
    printf '%s' "$cmd" | node "$(dirname "${BASH_SOURCE[0]}")/commit-msg-check.mjs"
    [[ $? == 2 ]] && exit 2
  fi

  # PocketBase on :8090 belongs to the user's running session: ask before stopping,
  # restarting or copying it. Reading it (lsof, curl, the MCP) stays free, and so does text
  # that only names it, such as a grep pattern.
  if [[ $has_shell == 1 ]]; then
    scan_words=$cmd
  else
    scan_words=$words
  fi
  if [[ $has_kill == 1 || $has_shell == 1 && "$cmd" =~ (^|[^[:alnum:]_-])(kill|pkill|killall)([[:space:]]|$) ]] &&
    [[ "$cmd" =~ (pocketbase|8090) ]]; then
    ask "this stops the local PocketBase on :8090, which the user may be using. Confirm before running it."
  fi
  if [[ "$scan_words" =~ eco-store:pocketbase:stop ]]; then
    ask "eco-store:pocketbase:stop kills every 'pocketbase serve' process, the user's included. Confirm before running it."
  fi
  if [[ "$scan_words" =~ pocketbase[[:space:]]+serve|eco-store:pocketbase:run|eco-store:local ]]; then
    ask "this starts or restarts the local PocketBase on :8090. Confirm that no other instance should keep running."
  fi
  # Like kill, anywhere in the command: a loop can name pb_data in its list and rm it in its body.
  re_copy='(^|[^[:alnum:]_-])(cp|rsync|mv|rm|ditto)[[:space:]]'
  if [[ $has_copy == 1 || $has_shell == 1 && "$cmd" =~ $re_copy ]] && [[ "$cmd" == *pb_data* ]]; then
    ask "this copies, moves or deletes the local pb_data. Confirm before touching the user's PocketBase data."
  fi
  ;;
esac

exit 0
