# Form-field eval (META-22)

Measures whether a headless Claude Code session follows the repo's form rules (`.claude/CLAUDE.md` «Forms», `apps/eco-store/CLAUDE.md` «i18n specifics») when it adds a field.
A script grades what the session leaves; no model judges it.

## The task

`run.mjs` asks, in Spanish, for a delivery-method filter next to the product and status filters of the eco-store orders list (`/comandes`).
`deliveryMethod` is already a field of `orders`, so no schema change is needed, and the agent is told not to commit, start PocketBase or ask.

## What `grade.mjs` checks

A run passes when all of these hold:

| Check           | Holds when                                                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `inConfig`      | `eco-store-orders-filter-form.config.ts` declares a `deliveryMethod` field of type `select` or `select-with-icons`                       |
| `noHandControl` | no form control is written in a template, and `check-eco-conventions` passes on the eco files the run changed                            |
| `translated`    | every label, placeholder and option label the run added is a translation key present in `ca`, `es` and `en`; none is written out as text |
| `i18nValid`     | `tools/scripts/validate-i18n-keys.cjs` passes                                                                                            |
| `tests`         | with `--tests`: vitest of `eco-store-orders-list` and `eco-store-orders-data-access` passes                                              |

`tests` is where a field type can go missing: the route registers `select`, but the list spec's TestBed registers only `input-search` and `select-with-icons`.
Also reported: `wired` (the orders store's filter holds `deliveryMethod`, so the value reaches the PocketBase query), commits made, and files changed outside the orders libraries, the eco entities and the i18n files.

## How to run it

Outside the sandbox (worktrees, `yarn install`, the API), with the Mac kept awake:

```bash
caffeinate -i node tools/evals/form-field/run.mjs --label before --ref origin/develop --tests
node tools/evals/form-field/run.mjs --clean   # removes the worktrees (about 1.7 GB each)
```

Each of the five runs (`--runs`) gets a detached worktree at `--ref`, with its own `yarn install`, in `plastikspace-form-eval` next to the main checkout:
under the checkout, the main checkout's `CLAUDE.md` files would load too.
The sessions load the project settings only (`--setting-sources project,local`, so the guard and Stop hooks run), no MCP server and no saved session.
Bash is limited to read-only git and the yarn checks, and git commit and push are refused.
Model `sonnet` and 3 USD per run by default. Results go to `tmp/form-eval/<label>-<n>.json` (cost, turns, grade) and `.diff`.

## Results

| Date       | Ref                    | Model  | Pass | Cost (5 runs) | Time per run |
| ---------- | ---------------------- | ------ | ---- | ------------- | ------------ |
| 2026-11-24 | `67767793` (`develop`) | sonnet | 5/5  | 2.59 USD      | 6–11 min     |

All five runs used `select-with-icons`, the type of the `status` field next to it, with the label and icon maps the eco entities already export.
All five wired the store's filter and added the label key in the three languages; three also added `deliveryMethod` to the spec's mock filter.

**What this does not show.** The task has a field of the same kind next to the new one, and copying it satisfies every rule, so it cannot tell whether the rules or the neighbour led the runs.
With nothing failing, the planned second batch after one round of edits to the Forms rules was not run: it could only repeat 5/5.
The case that can fail is a form with no select to copy, where the type must be registered in the route's Formly providers and in the spec.
No eco form offers one today without a schema change; the first forms of eco-admin will. Run this harness with that task when it comes.

## Found on the way

`validate-i18n-keys.cjs` checks the keys used with the `translate` pipe or `instant()` only.
It does not read the labels of Formly configs (`translate: true`) and does not compare the language files,
so a Formly label missing in one language passes `yarn i18n:validate`.
`translated` covers that here.

## Not measured, and why

- **The commit rules of `commitizen-git-flow`** need no model to check:
  `tools/scripts/check-commit-refs.cjs` refuses a commit without the ClickUp ID, the task ID or the CHANGELOG bullet, and commitlint covers the rest.
- **The task docs** are already checked on every commit and push by `yarn tasks:check`.
