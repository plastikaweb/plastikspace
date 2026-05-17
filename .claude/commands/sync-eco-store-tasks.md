# /sync-eco-store-tasks — META-05 Phase 1

Read-only diff between the eco-store `TASKS.md` and ClickUp list `901521018763`.

This command validates the **PRD-ID-as-bridge** matching assumption before
Phases 2–4 of META-05 (which add writes via hooks/GitHub Actions/git hooks).

## What it does

1. Parses `apps/eco-store/TASKS.md` and extracts every PRD ID + its status
   bucket + linked ClickUp ID.
2. Fetches every task in ClickUp list `901521018763` (paginated, includes
   closed tasks and subtasks).
3. Prints a three-section report:
   - **only-in-TASKS** — PRD IDs in TASKS.md with no resolvable ClickUp link
   - **only-in-ClickUp** — ClickUp tasks whose name carries a PRD ID not in TASKS.md
   - **status mismatches** — both sides agree on identity but disagree on
     Done ↔ closed bucketing
4. Reports a **bridge-coverage** metric: the percentage of ClickUp tasks
   whose name carries a recognizable PRD-ID prefix. Phase 2's PostToolUse
   hook can only auto-create CU tasks safely if this is high (the README
   threshold is 50%).

## Prerequisites

- `CLICKUP_API_TOKEN` env var set to a ClickUp personal token (starts with
  `pk_`). Get one at <https://app.clickup.com/settings/apps>.
- Node 18+ (for global `fetch`).

## Run it

```bash
CLICKUP_API_TOKEN=pk_... node tools/scripts/sync-eco-store-tasks.cjs
```

Options:

- `--tasks-path <path>` — override TASKS.md location
- `--list-id <id>` — override ClickUp list ID (default `901521018763`)
- `--verbose` — print per-row parse details to stderr
- `--help` — show CLI help

Exit codes:

- `0` — no drift detected (TASKS.md and ClickUp agree)
- `1` — drift detected (any of the three sections is non-empty)
- `2` — bad input (missing env var, missing TASKS.md, bad args)
- `3` — ClickUp API error
- `99` — unexpected error

## Phase 1 ground rules

- **No writes.** This command never PATCHes, POSTs, or DELETEs anything on
  ClickUp or in `TASKS.md`. Phases 2–4 add writes once the bridge assumption
  is validated.
- **Don't act on the diff inside this slash command.** If the report shows
  drift, surface it to the user — let them decide what to reconcile by hand
  (or wait for Phase 2's automation).

## Status bucketing (coarse)

| TASKS.md symbol               | ClickUp `status.type` | Bucket   |
| ----------------------------- | --------------------- | -------- |
| `✅`                          | `closed`, `done`      | `closed` |
| `🔄` `📋` `🧪` `⛔` `⏸️` `❓` | `open`, `custom`      | `open`   |

A row whose status doesn't appear inline inherits the most recent section
heading's status (e.g. everything in a `### Done ✅` block is `closed`).

## Source of truth

- Script: `tools/scripts/sync-eco-store-tasks.cjs`
- Task spec: `apps/eco-store/TASKS.md` → search "META-05"
- ClickUp ticket: `86c9uwmzf`
