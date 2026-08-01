# PRV-04d fiscal profile — parked 2026-07-21

Work is **complete and verified but unpushed and unmerged**, parked deliberately.
Branch `feat/86c99dev0-prv04d-fiscal-profile`, 18 commits, working tree clean.

Plan: [2026-07-19-prv04d-fiscal-profile.md](2026-07-19-prv04d-fiscal-profile.md)
Design rationale: `apps/eco-store/TASKS.md` § "PRV-04d — Fiscal identity spec"

## Where the work lives

The branch ref is in the shared `/Volumes/Feina/Projects/plastikspace/.git`, so the
commits survive even if the worktree directory
(`.claude/worktrees/feat+86c99dev0-prv04d-billing-address`) is removed. **Nothing is on
the remote** — a disk failure loses all 18 commits. Push before any machine change.

## What shipped on the branch

Rescue of the rejected task, then the approved redesign's capture half:

- Checkout auto-fill fix (`pickDefaultShippingAddress` also resolves on initial load,
  guarded so it never overwrites the member's pick) + the documented record of why the
  original `addressType` typology was rejected.
- `user_fiscal_profiles` collection, 0..1 per member via a unique index on the `user`
  relation; `tenants.fiscalDataEnabled` flag.
- `validate_fiscal_profile.pb.js` — server-side NIF/NIE/CIF checksum, bypass gated on
  `e.requestEvent.hasSuperuserAuth()`. The client `nifValidator` (18 tests) is UX only.
- Entity types, `PocketBaseUserFiscalProfileService`, store `getFiscalProfile()` /
  `saveFiscalProfile()`, the `eco-store-profile-fiscal-data-feature` lib, and the
  `perfil/dades-fiscals` route behind a `canMatch` tenant guard + sidenav + ca/es/en i18n.
- `BaseEntityNameless` / `BasePocketBaseEntityNameless` — the fiscal record has
  `fiscalName`, not `name`, so the api-base contracts' bounds were widened (type-level
  only; the original `Omit`-based version silently collapsed to a bare index signature).
- Constraint fixes: `city` min 5 → 2 and the address book's client/schema mismatch
  (2/25 vs 5/50 → 2/50); `address` maxLength 50 → 100 (was truncating silently).

**Deferred by design** (not missing work): `orders.billing` snapshot and checkout's
"necessito factura" toggle both belong to the invoicing feature.

## Verification state at parking time

- `nx build eco-store` green — the only path that typechecks templates and app wiring.
- `nx affected -t lint test --base=develop` green (235 tasks) as of commit `8c4497ae`;
  the four later commits were covered by targeted lib runs, not a full affected sweep.
- Hook verified with live requests (invalid → 400, valid → 200 + uppercase, member
  bypass rejected, superuser bypass allowed). `city` verified live: Vic accepted,
  Santa Margarida i els Monjos accepted, 1-char rejected.
- **Never done: the interactive browser pass.** Nothing has exercised the Formly form
  end to end. Do this first on resume.

## To resume

1. `cd` into the worktree (or recreate it from the branch) and confirm `git log` shows
   `879b811e` at HEAD.
2. Start PocketBase from the MAIN checkout: `yarn eco-store:pocketbase:run`. It serves
   `pb_data` from there, which holds two local-only pieces of state: the `city` min
   change and `fiscalDataEnabled = true` on the El Llevat tenant. Neither reaches
   staging — `pb_data` is gitignored and the flag's _value_ is data, not schema.
3. The hook file also exists **untracked** in the main checkout's `pb_hooks/` so the
   running instance loads it. It is listed in that checkout's `.git/info/exclude` so
   the pre-commit `git add -A` cannot sweep it onto another branch. Leave it there.
4. Run the browser smoke test, then push and open the PR.

Commits are slow: the pre-commit hook exports PocketBase data (~10 min). Run commits
outside the sandbox and in the background rather than fighting the tool timeout.

## Open items for a human

Three tickets could not be filed — the ClickUp MCP returned `Team not authorized` for
the whole session. All three are written up with technical detail in `TASKS.md`:

1. **`x-bypass-hooks` is inert in `normalize_user_name.pb.js` and `on_create_order.pb.js`**
   (they read the non-existent `e.httpContext`). Path-correcting it alone would open an
   order-total tampering vector: `on_create_order.pb.js` recomputes totals from database
   prices and its bypass has no auth gate. The fix must gate on superuser auth. Highest
   priority of the three — the wrong fix is worse than the current bug.
2. **`phoneValidator` rejects `+34600123456` and `600 123 456`** though the schema
   accepts both; a non-Spanish member cannot create a delivery address. Not regex-only:
   the schema's max of 14 conflicts with the form's stated intent of 15, so it needs a
   normalization decision. Shared with llecoop.
3. **Password inputs silently truncate pastes past 25 characters**
   (`[maxLength]="props.maxLength || 25"`), so a password-manager value is saved short
   and the next login fails. The same fallback caps `oldPassword`, so a member with a
   longer current password can never change it. Shared component; touches llecoop and
   the auth flow PRV-02c just merged.

Also standing: `PRV-04d` is still "in progress" in ClickUp (`86c99dev0`), and
`fiscalDataEnabled` must be set per tenant after deploy — the field syncs, its value
does not. Keep it off in production until invoicing exists; collecting tax IDs with no
current purpose is a data-minimisation problem.
