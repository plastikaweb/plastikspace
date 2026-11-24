# CLAUDE.md — eco-store

App-specific guidance for AI agents (Claude Code, Cursor, etc.) working in `apps/eco-store/` and `libs/eco-store/*`.

It complements the root `CLAUDE.md` (workspace, conventions, boundaries, commits) and does not repeat it: read that one first.

---

## Project at a glance

**Eco Store** is a multi-tenant SaaS e-commerce frontend for ecological consumer cooperatives. Each cooperative ("tenant") gets a branded storefront over a shared PocketBase backend. First production tenant: **Associació El Llevat**.

- **Public storefront only** here. Internal admin (Tenant Admin, Superadmin) is a separate app, `eco-admin` (`apps/eco-admin/`, described in the root `CLAUDE.md`).
- **Stack:** Angular 21, NgRx Signal Store, Angular Material 3, Tailwind CSS 4, ngx-translate, PocketBase 0.36.7 (SQLite, self-hosted).
- **User-facing copy is in Catalan by default.** Spanish translations co-exist; English is in schema but no production tenant uses it yet.
- **Accessibility target:** WCAG 2.2 Level AA (owner, 2026-11-24; it was 2.1 AA). META-39 audited what 2.2 adds; its failures are fixed and its open points are in root `TASKS.md`. Pa11y covers only 2.5.8 of them (`documentation/accessibility.md`).

---

## Source-of-truth documents

When working here, these are authoritative — consult them before assuming:

- **PRD v1.8**, the master for functional requirements: `/Volumes/Feina/Projects-modeling/eco/eco-store/ecostoreprdv1_8ca.pdf` (outside the repo, binary, slow-changing)
- **TASKS** (`apps/eco-store/TASKS.md`): live backlog with verified status per PRD ID
- **BACKLOG** (`apps/eco-store/BACKLOG.md`): phased, dependency-aware sprint plan with time estimates
- **PocketBase** (`apps/eco-store/POCKETBASE.md`): schema, hooks, cron, scripts
- **Email and SMTP** (`apps/eco-store/MAILTRAP.md`): transactional email and the Mailtrap SMTP setup (dev, staging)
- **Loading strategies** (`apps/eco-store/LOADING_STRATEGIES.md`) and **SSR** (`apps/eco-store/SSR.md`)
- **Accessibility statement**: the published one (Feb 22, 2025) claims full WCAG 2.1 AA conformance, which the META-39 audit disproves. A draft of 2026-11-24, partially conformant with WCAG 2.2 AA, waits for the owner to publish it (kept outside the repo); its known limitations follow the open A11Y tasks

Read one task with `yarn task <ID>` (`tools/scripts/task.cjs`: task ID, ClickUp ID, or a row label with `--home`), never the whole TASKS.md or BACKLOG.md. It prints the definition plus every other line that names the ID, so a status that differs between places shows up. Exit 2 means no definition was found.

After editing a task doc, run `yarn tasks:check`; the pre-commit runs it when a TASKS, BACKLOG or REQUIREMENTS doc changes, and CI on every push. Escape `|` in a cell as `\|`, even inside backticks, and keep TASKS.md and BACKLOG.md on the same `Document version`.

### Referencing task identifiers (MANDATORY)

Every change in `apps/eco-store/` or `libs/eco-store/*` must reference its **PRD/TASKS ID** (`INI-01`, `BOT-05`, `TRL-03`, `BUG-NNN`, `META-NN`, `OPS-NN`, `TECH-NN`, `SEO-NN`, `MKT-research-NN`, etc.) — they map 1:1 to PRD sections and to entries in `apps/eco-store/TASKS.md` (see source-of-truth table above).

This is **in addition to** the ClickUp `#<task>` ID the `commitizen-git-flow` skill extracts from the branch name. Both must appear where applicable:

- **Commit subject** — append the PRD ID to the description:
  `feat(eco-store): #86c9uq646 BOT-04 add dynamic add-to-cart button`
  (If a commit covers multiple TASKS IDs, comma-separate: `BOT-04, BOT-11`.)
- **Commit body** — when context helps, expand the PRD ID with one-line intent (e.g. `BOT-04: initial pill → [− N +] selector on first tap`).
- **CHANGELOG.md** — include the PRD ID in the bullet, before or alongside the ClickUp link, e.g. `Added dynamic add-to-cart button (BOT-04, [#86c9uq646](…))`.
- **PR titles & descriptions** — same rule.

If you can't find a matching ID in TASKS.md, **stop and ask** rather than inventing one. New cross-cutting work without a PRD section should be filed under the appropriate non-PRD family (`BUG-`, `META-`, `OPS-`, `TECH-`, `SEO-`, `MKT-research-`) — propose the ID before committing.

### Adding new tasks to `TASKS.md` / `BACKLOG.md` (MANDATORY)

When you add a brand-new task entry to `apps/eco-store/TASKS.md` or `apps/eco-store/BACKLOG.md`, you **must also create the corresponding ClickUp ticket** via the ClickUp MCP in the same change. The TASKS.md row should then carry the new ClickUp ID. Don't leave entries with `—` or `_pending_` in the ClickUp column: that is how drift starts.

Before creating the ClickUp task: inspect a same-family analog already in the board (e.g. another `BOT-` or `OPS-` task) to pick the right list, tags, and assignee defaults. The ClickUp ID is the bridge for status sync.

### Committing changes to `TASKS.md` / `BACKLOG.md` only

They are planning docs, not release artifacts:

- They go in their own commit, never with code (the pre-commit rejects the mix). The code commit carries the CHANGELOG bullet, which describes the work with its PRD and ClickUp IDs; the task-doc commit gets none.
- A grooming pass with no code (audits, ID corrections, version bumps, queued tasks) is a `docs(eco-store):` commit in the next feature branch, or in a META-08 docs PR.
- Deleting an obsolete document (META-01) or a similar one-off cleanup is a deliverable: it gets a CHANGELOG bullet and a PR.

---

## Libraries and routes

Libraries live in `libs/eco-store/<domain>/<type>` behind `@plastik/eco-store/*` aliases (`yarn nx show projects` lists them); a new one comes from `yarn eco-lib`. Cross-app code goes in `libs/shared/*` or `libs/core/*` and code shared with eco-admin in `libs/eco/*` (scope rules in the root `CLAUDE.md`); nothing eco-store-specific goes there.

### App entry points

- `apps/eco-store/src/app/app.routes.ts` — top-level auth routes + the catch-all that loads the layout
- `apps/eco-store/src/app/app.config.ts` — providers: PocketBase, translate, view transitions, service worker, image loader, tenant init
- `libs/eco-store/core/layout/src/layout.routes.ts` — the in-shell route tree (`/cistella`, `/comandes`, `/botiga`, `/perfil`, etc.)

### Routes

`tools/feature-map.json` maps every page to its library, access, guards and specs (`yarn feature-map:find <words>`). There is no home (INI) yet: the `**` fallback redirects to `/botiga`. When you add INI, mount it at `''` in `layout.routes.ts` before the `'botiga'` block, and remove or repurpose the `**` redirect.

---

## PocketBase backend (specific to eco-store)

> Before editing anything under `apps/eco-store/pocketbase/` (schema, hooks, migrations, API rules), invoke the `pocketbase-best-practices` skill. For collection-level work, consult the matching `rules-*` sub-rule (e.g. `rules-locked-vs-open` for new collections, `rules-cross-collection` for multi-tenant access).

The PocketBase instance lives **inside the app**: `apps/eco-store/pocketbase/`. Schema and hooks are versioned with the code.

### Layout

```
apps/eco-store/pocketbase/
├── pocketbase                 # Binary (gitignored)
├── pb_schema.json             # Schema export (committed)
├── pb_migrations/             # Auto-generated migrations
├── pb_hooks/                  # JavaScript hooks (one file per hook)
├── pb_data/                   # Local dev data (gitignored)
└── backup-host/, data/        # Staging clone targets
```

### Hooks (PocketBase 0.36.7)

Each `pb_hooks/*.pb.js` file loads on its own (no single `main.pb.js`). `POCKETBASE.md` "PocketBase Hooks & Cron Jobs" lists them with what each does.

### Schema workflow

```bash
# 1. Edit in Admin UI
open http://localhost:8090/_/   # superuser login required

# 2. Export to repo
yarn eco-store:pb:export

# 3. Review diff
yarn eco-store:pb:diff

# 4. Stage pb_schema.json with the eco code that needs it, and commit. A staged
#    pb_schema.json is kept as it is and the pre-commit does not export again, so
#    export after your last Admin UI edit. Left unstaged, it is exported and staged
#    only when the commit stages eco code (Markdown does not count). A schema-only
#    commit needs ALLOW_SCHEMA_ONLY=1 git commit ...
```

A PR into develop that changes `pb_schema.json` without eco code (Markdown does not count), or that removes a collection or field, fails `.github/workflows/pb-schema-guard.yml` unless it has the `pb-schema` label. How the label and its record work: AGENTS.md "PocketBase Schema Workflow".

Pushing to `develop` triggers `.github/workflows/pocketbase-schema.yml`, which syncs the schema to staging (PocketHost).

### Conventions

- **Collection names:** `snake_case` (e.g. `user_addresses`, `order_cycles`, `product_categories_stats`)
- **Field names:** `camelCase` (e.g. `membershipStatus`, `trialEndsAt`, `priceWithIva`, `normalizedName`)
- **`tenant` field on every multi-tenant collection** (relation to `tenants`); enforce in API rules
- **i18n fields are `JSON` type** with shape `{ ca: "...", es: "...", en: "..." }` — names, descriptions, closedReason, etc.
- **Items in carts/orders are stored as `JSON`**, not a separate collection (denormalized snapshot at order time)
- **`products.rating` and `reviewsCount` are denormalized** — updated by VAL-01 hook (to be built)

### Multi-tenant API rule pattern

For collections where data is tenant-scoped, the read/list rule is typically:

```
@request.auth.id != "" && tenant = @request.auth.tenant
```

For collections with membership gates (carts, orders), the target rule is:

```
user = @request.auth.id
  && tenant = @request.auth.tenant
  && (@request.auth.membershipStatus = "ACTIVE"
      || (@request.auth.membershipStatus = "TRIAL"
          && @request.auth.trialEndsAt > @now))
```

`carts.createRule` has all of it. `orders.createRule` has the user and membership checks but **not** `tenant = @request.auth.tenant`: a member can create an order for another tenant until SEC-09 lands (`TASKS.md`). The membership part implements TRL-05 server-side on both; the frontend block (TRL-04) is for UX only. Read the live rules in `pocketbase/pb_schema.json`, not here.

The `membershipStatus` enum has exactly **4 values**: `TRIAL`, `ACTIVE`, `INACTIVE`, `SUSPENDED`. Trial expiry is gated by `trialEndsAt > @now`; status stays as `TRIAL` until manually converted.

### Local dev

```bash
yarn eco-store:local              # PocketBase + app + SCSS watcher
yarn eco-store:pocketbase:run     # PocketBase only
yarn eco-store:pb:seed             # Clone real data from staging
yarn eco-store:pb:seed-gen         # Generate fake data for local testing
```

---

## Tenant resolution

Tenant identification happens **at app init**, before any route activates:

- `provideEcoStoreTenant` is registered in `app.config.ts`
- `ecoStoreTenantStore.getTenant()` is awaited inside `provideAppInitializer`
- Tenant is identified by the request host (subdomain / domain) — check `libs/eco-store/core/tenant` for the resolver
- All downstream services read `ecoStoreTenantStore.tenant()` and never re-fetch

**Implications when building features:**

- Don't gate on tenant inside components — by the time a component renders, the tenant is loaded
- For tenant-derived computed values (e.g. `storageKey: '${tenant.normalizedName}-cart-v1'`), use `computed()` on `tenantStore.tenant()`
- Tenant logo/branding is applied to the PWA manifest at init via `PwaManifestService.applyBranding()`

---

## Design system — "Organic and Kind"

The brand identity is the **Eco Vibrant** / **"Organic and Kind"** aesthetic, for the users and partners of local food cooperatives who browse proximity and ecological products, place orders and consult their history.

- **Personality**: nature, lightness, proximity: organic connection, kindness, approachability. Soft, natural and welcoming; no harsh "tech" look, no clinical minimalism.
- **Earthy elegance**: colours and spacing that feel natural, light and unforced.
- **Gentle interactions**: smooth, subtle animations and micro-interactions, never jarring.
- **Clear typographic hierarchy**: legible for a diverse user base; accessibility first, without losing the kind tone.
- **Proximity**: less friction, so ordering local food feels intuitive and neighbourly.

### Theming

- **Material 3** with CSS custom properties
- **OKLCH-derived palettes** (not HSL) for perceptual uniformity across light/dark
- Light + dark modes both fully supported via `MatThemeToggleComponent` in header
- **Manrope** for all text (display, headlines, body, labels), loaded from Google Fonts; the M3 type scale is in `libs/eco/styles/src/_eco_tokens.css`
- Tenant-customizable palette is on the roadmap (UI-03)

### Shape

- Cards: `border-radius: 1rem` (16px)
- Buttons & badges: `border-radius: 9999px` (pill)
- No sharp corners on primary UI

### Header pattern

Floating "pill" header (`mat-toolbar`) with backdrop blur (glassmorphism). The trial badge and store-window banner live inside it (see `libs/eco-store/core/layout/src/header/`).

### Reusable patterns

- **Dynamic add-to-cart button** (BOT-04): initial pill → `[− N +]` selector on first tap; reverts when qty = 0
- **Image placeholder** (BOT-11): always use the placeholder helper from `@plastik/eco-store/shared/utils` — never let `<img>` show the browser broken icon
- **Humanize unit** (BOT-12): `HumanizeUnitPipe` for "PESA 100G", "OCUPA 1,50L", "PREU PER UNITAT", etc.

### Tailwind layer pattern

SCSS uses `@layer base / @layer components / @layer utilities`. M3 colors come through as CSS custom properties (e.g. `bg-tertiary-container`, `text-on-tertiary-container`) — Tailwind 4's `@theme` directive bridges them. **Don't hardcode hex values** in component styles.

---

## State management patterns

### Cart store (`ecoStoreCartStore`)

Reference implementation for non-trivial NgRx Signal Store features in this app. Read it before building similar stores.

Key patterns:

- `withImmutableState` + `withEntities` + custom `withResetEntities` feature
- `withProps` for service injection
- Effects in `withHooks.onInit` orchestrate cart lifecycle: anonymous restore from localStorage, login → merge to PocketBase, logout → clear
- **localStorage key is tenant-scoped**: `${tenant.normalizedName}-cart-v1` (not a global key)
- Notifications use `StoreNotificationService` + `SharedConfirmDialogService` (custom dialog), **not raw `MatSnackBar`**
- SSR-safe (`isPlatformBrowser(_platformId)` checks before any localStorage access)

### Tenant store (`ecoStoreTenantStore`)

Resolved at app init via `provideAppInitializer`. Use it for:

- `tenant()` — full tenant record
- `loaded()` — boolean
- `storeStatus()` — `OPEN` / `CLOSED` / `CLOSED_MANUALLY`
- `getTenantDeliveryOptionCost(method, total)` — shipping calculation
- `getTenantDeliveryOptionSlotsDays(method, addressId)` — pickup slot resolution

### User profile store (`pocketBaseUserProfileStore`)

From `@plastik/auth/pocketbase/data-access`. Holds auth state + user record.

- `isAuthenticated()` signal
- `user()` — full record (when authenticated)
- `authRefresh()` — refresh JWT token; **call this after PATCH'ing the user record** so the in-memory state reflects changes (e.g. TRL-03 trial conversion)

---

## i18n specifics

- **Library:** `ngx-translate` with `ngx-translate-formatjs-compiler` for ICU MessageFormat
- **Translation files:** loaded via `/i18n/{lang}.json` HTTP loader
- **Available languages:** `ca`, `es`, `en` (only `ca` + `es` in production tenants today)
- **localStorage key:** `eco-lang`
- **Language switcher:** only renders if tenant has more than one active language (UI-02 — already implemented)
- **`LOCALE_ID` is hardcoded to `'ca'`** in `app.config.ts`. Only Catalan locale data is registered for Angular pipes. If you need ES/EN-formatted dates or currencies, register `localeEs` / `localeEn`.
- **All user-facing strings must be externalized** — no hardcoded copy in templates or TS files.

---

## Storage & client-side persistence

All in `localStorage`:

- `${tenant.normalizedName}-cart-v1`: the anonymous cart; cleared on login (after a successful merge) and on logout
- `eco-lang`: the language preference, kept across sessions
- the Material theme key: light, dark or system, kept across sessions
- the PocketBase auth token (JWT): managed by the SDK, 7-day expiry

**Never** store sensitive data (PII, payment info) in localStorage. The cart is the only feature-level use of it.

---

## Testing

- **Pa11y CI** at `apps/eco-store/.pa11yci.json`. Run via `yarn eco-store:a11y`. Workflow at `.github/workflows/eco-store-pa11y.yml`.
- **Playwright + axe** in `apps/eco-a11y-e2e` (META-40): the screens Pa11y cannot reach (a loaded product, a cart with products, signed in), with PocketBase answered from fixtures. Run via `yarn eco-a11y:e2e`; root `CLAUDE.md`, "Playwright accessibility suite".
- **Cart store** has a mock at `libs/eco-store/cart/data-access/src/eco-store-cart.store.mock.ts` — use this in feature tests.
- **Tenant store mocking:** provide a fake tenant in `TestBed` rather than waiting on real resolution.
- **Always provide locale data in tests** that involve dates/currency, since `LOCALE_ID` is `ca` globally.

---

## Naming conventions specific to eco-store

- **Libraries:** names, paths and project names come from `yarn eco-lib` (`tools/generators/eco-lib/generator.cjs`); existing ones read `libs/eco-store/<domain>/<type>` and `eco-store-<domain>-<type>`
- **Component selectors:** `eco-<name>` for app-internal, `plastik-<name>` for shared libs
- **Path alias prefix:** `@plastik/eco-store/<domain>` (always; don't import via relative paths across libs)
- **Entity names:** `EcoStore<Thing>` (e.g. `EcoStoreCart`, `EcoStoreProduct`, `EcoStoreTenant`)

---

## Common gotchas

1. **`onSameUrlNavigation: 'reload'` is set in router config.** Re-runs guards/resolvers on identical URLs — convenient but can cause double-fetches if you also subscribe to `queryParams` inside a component. Prefer one pattern per route.
2. **`yarn eco-store:local` first stops every PocketBase** (`pkill -f 'pocketbase serve'`, another worktree's or session's included) and whatever holds port 4200, then starts 3 processes (PocketBase + Angular dev server + SCSS watcher). With a PocketBase already up, use `yarn eco-store:serve`. Stop all three when tearing down.
3. **PocketBase pre-commit export.** Every worktree shares the PocketBase on :8090, so its schema can carry edits made for another branch. The hook exports on every commit that is not Markdown-only and stages `pb_schema.json` only when the commit stages eco code; the full rules are in AGENTS.md "PocketBase Schema Workflow". If no PocketBase answers and the binary is missing, the hook fails: `yarn eco-store:pb:download`.
4. **Trial badge in header uses `lg:flex` (hidden on mobile by default).** If product wants trial visibility on mobile too, change in `header.component.html`.
5. **Cart merge uses `SharedConfirmDialogService`**, not `MatSnackBar`. Don't "fix" this back to snackbar unless product asks — the dialog allows a CTA to navigate to `/cistella`.

---

## When you're stuck

Read the PRD section and the task (`yarn task <ID>`), then BACKLOG for its phase and dependencies; look at a sibling feature in the same domain (`profile/addresses` for `profile/basic`), the cart store for Signal Store patterns, and `POCKETBASE.md` for backend work. Then ask Carlos.
