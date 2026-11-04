# /sync-eco-store-tasks — TASKS.md ↔ ClickUp drift check (META-05 Phase 1, META-07)

Read-only diff between each task home's `TASKS.md` and its ClickUp list.

The homes live in `tools/scripts/task-homes.json`. Each one pairs a doc (plus optional companion docs) with a ClickUp list, and the file also holds the ID families. The script reads only that file, so adding a home is a config change, not a code change. Keys today: `eco-store` (the default), `eco-admin`, `eco-shared` and `plastikspace`. A home whose `listId` is `null` is checked for doc consistency only.

## What it does

1. Parses each home's doc into **subjects**: table rows, headings, bullets and ID lists that carry a task ID from the configured families (`B-07`, `PRV-05b-A`, `B-02/03`…) and/or a ClickUp ID (`` `86…` `` with 9 characters or `` `123…` `` with 11, so short git SHAs don't count). Several occurrences of one task merge into one subject. Companion docs (eco-store `BACKLOG.md`) only contribute referrals and ClickUp mentions.
2. Fetches every task in the home's ClickUp list (paginated, closed tasks and subtasks included), unless `--offline` or `--clickup-fixture` is set.
3. Prints, per home, the subject count, the tickets in the list and the **bridge coverage**: the share of tickets whose name starts with a task ID. Phase 2 can only auto-create tickets safely above 50%. Then four sections:
   - **only-in-TASKS**: a subject with no ticket.
   - **only-in-ClickUp**: a ticket in the list that no doc claims, either by its ClickUp ID or by the task ID in its name.
   - **status mismatches**: same task, different open/closed bucket.
   - **link problems**: the row's ticket is in another home's list, or in no configured list.
4. Prints two cross-home sections:
   - **doc consistency** (counts as drift):
     - `conflicting-duplicate`: one task stated open in one place and closed in another.
     - `cross-home-duplicate`: one task or ticket as a subject in two homes.
     - `unrecognized-family`: a key cell whose ID family is neither in `idFamilies` nor in `excludedFamilies`.
     - Referral problems: `referral-unknown-home`, `referral-wrong-doc`, `referral-missing-doc`, `dangling-referral`, `referral-cu-mismatch`.
   - **notices** (never drift):
     - `missing-doc`: a configured doc that does not exist (yet).
     - `cu-only-in-mentions`: a ClickUp ID that appears only in prose. It still claims its ticket, so the ticket is not reported as only-in-ClickUp.
     - `no-list`: a home without a ClickUp list.

## Referrals

When a task moves to another home, the doc it came from keeps one line that points to the new home:

```markdown
→ **B-07** · `123kjkdp4mu` · Eco Shared (libs/eco/TASKS.md)
```

The line carries no status and no line or section numbers, so it cannot go stale. The script checks that the home exists, that the doc is that home's doc, that the doc has a row for each ID on the line (`B-02/03` needs a B-02 row and a B-03 row), and that one of those rows carries the ticket.

## Prerequisites

- Node 18+ (for global `fetch`).
- Live runs only: `CLICKUP_API_TOKEN` set to a ClickUp personal token (starts with `pk_`). Get one at <https://app.clickup.com/settings/apps>. `--offline` and `--clickup-fixture` need no token.

## Run it

```bash
# Every home, against what is merged
CLICKUP_API_TOKEN=pk_... node tools/scripts/sync-eco-store-tasks.cjs --all --ref origin/develop

# One home, from the working tree
CLICKUP_API_TOKEN=pk_... node tools/scripts/sync-eco-store-tasks.cjs --home eco-admin

# Doc consistency only: no token, no network
node tools/scripts/sync-eco-store-tasks.cjs --all --offline

# Saved ClickUp data ({"<listId>": [tickets]}), report as JSON
node tools/scripts/sync-eco-store-tasks.cjs --all --clickup-fixture tickets.json --json
```

Options (`--help` prints the same list):

- `--home <key>`: home to report (default `eco-store`).
- `--all`: report every configured home.
- `--ref <git-ref>`: read the docs at a git ref (e.g. `origin/develop`). Docs missing at that ref are tolerated.
- `--offline`: skip ClickUp and check doc consistency only.
- `--clickup-fixture <json>`: read `{"<listId>": [tickets]}` from a file instead of the API.
- `--json`: print the report as JSON.
- `--root <dir>`: repository root (default: this repo).
- `--config <path>`: task-homes config (default `tools/scripts/task-homes.json`).
- `--tasks-path <path>`: override the selected home's doc (read from disk).
- `--list-id <id>`: override the selected home's ClickUp list.
- `--verbose`, `-v`: progress on stderr.
- `--help`, `-h`: CLI help.

Exit codes:

- `0`: no drift.
- `1`: drift (any per-home section or doc-consistency finding is non-empty).
- `2`: usage, config, token or doc error.
- `3`: ClickUp fetch failed.
- `99`: unexpected error.

Tests: `yarn tasks:test` (`tools/scripts/test-sync-tasks.sh`, also run in CI) exercises the script on throwaway repos with `--offline` and `--clickup-fixture`. It also checks that every configured doc is registered in the three places listed below.

## Adding a home

1. Add the entry to `tools/scripts/task-homes.json` (`key`, `name`, `listId`, `tasks`, `companions`). Add any new ID family to `idFamilies`.
2. Register the doc in `.prettierrc` (the `proseWrap: "never"` override), in the `ignores` of `.markdownlint-cli2.yaml`, and in the `TASK_DOCS` regex of `.husky/pre-commit`. `yarn tasks:test` fails until all three are done. A bare basename in `.prettierrc` matches at any depth, so a repo-root doc needs `./TASKS.md`.

## Ground rules

- **No writes.** This command never PATCHes, POSTs, or DELETEs anything on ClickUp or in the docs. Phases 2–4 of META-05 add writes.
- **Don't act on the diff inside this slash command.** If the report shows drift, surface it to the user and let them decide what to reconcile by hand.
- **No tickets from only-in-TASKS before the baseline.** The first `--all --ref origin/develop` run after META-07 merged records the known drift. Until it exists, an only-in-TASKS row is not a reason to create a ticket (META-05's first pass already found 17 mismatches).

## Status bucketing (coarse)

| In the doc                                                                                       | ClickUp `status.type`            | Bucket   |
| ------------------------------------------------------------------------------------------------ | -------------------------------- | -------- |
| `✅` `❌`, or the words done, closed, complete                                                   | `closed`, `done`                 | `closed` |
| `🔄` `📋` `🧪` `⛔` `⏸️` `❓`, or the words open, pending, in progress, blocked, deferred, ready | anything else (`open`, `custom`) | `open`   |

A status on the row itself wins. A row without one inherits the nearest heading that has one (everything in a `### Done ✅` block is `closed`). With neither, the row is `open`.

## Source of truth

- Script: `tools/scripts/sync-eco-store-tasks.cjs`
- Homes: `tools/scripts/task-homes.json`
- Task specs: META-05 in `apps/eco-store/TASKS.md` (ClickUp `86c9uwmzf`); META-07 in the Plastikspace home
