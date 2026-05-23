# CLAUDE.md — eco-store

App-specific guidance for AI agents (Claude Code, Cursor, etc.) working in `apps/eco-store/` and `libs/eco-store/*`.

This file **complements** — it does not duplicate — the root `/CLAUDE.md` (which covers Nx workspace, package manager, generic Angular/TypeScript conventions, scopes & module boundaries, commit conventions, etc.). Read the root file first.

---

## Project at a glance

**Eco Store** is a multi-tenant SaaS e-commerce frontend for ecological consumer cooperatives. Each cooperative ("tenant") gets a branded storefront over a shared PocketBase backend. First production tenant: **Associació El Llevat**.

- **Public storefront only** here. Internal admin (Tenant Admin, Superadmin) is a separate app (`eco-admin`, not yet built).
- **Stack:** Angular 21, NgRx Signal Store, Angular Material 3, Tailwind CSS 4, ngx-translate, PocketBase 0.36.7 (SQLite, self-hosted).
- **User-facing copy is in Catalan by default.** Spanish translations co-exist; English is in schema but no production tenant uses it yet.
- **Accessibility target:** WCAG 2.1 Level AA — fully conformant.

---

## Source-of-truth documents

When working here, these are authoritative — consult them before assuming:

| Document                    | Path                                                                                                                | Purpose                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **PRD v1.8**                | `/Volumes/Feina/Projects-modeling/eco/eco-store/ecostoreprdv1_8ca.pdf` _(external to repo — binary, slow-changing)_ | Functional requirements — the master                      |
| **TASKS**                   | `apps/eco-store/TASKS.md`                                                                                           | Live backlog with verified status per PRD ID              |
| **BACKLOG**                 | `apps/eco-store/BACKLOG.md`                                                                                         | Phased / dependency-aware sprint plan with time estimates |
| **PocketBase workflow**     | `apps/eco-store/POCKETBASE.md`                                                                                      | Schema management, hooks, cron, scripts                   |
| **Loading strategies**      | `apps/eco-store/LOADING_STRATEGIES.md`                                                                              | Activity & loading patterns                               |
| **SSR**                     | `apps/eco-store/SSR.md`                                                                                             | Server-side rendering config                              |
| **Accessibility statement** | Published Feb 22, 2025 — WCAG 2.1 AA fully conformant                                                               |

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

---

## Library structure (`libs/eco-store/*`)

Each domain has its own scope. Imports use the `@plastik/eco-store/*` path alias family.

```
libs/eco-store/
├── auth/                      # Login, forgot-password, reset flows
│   ├── login/
│   ├── forgot-password/
│   ├── forgot-password-sent/
│   └── reset-password/
├── cart/
│   ├── data-access/           # ecoStoreCartStore + carts API service
│   └── feature/               # 3-step checkout UI
├── core/
│   ├── api/                   # PocketBase API base wrappers
│   ├── entities/              # Domain types (EcoStoreProduct, EcoStoreCart, …)
│   ├── layout/                # Main shell, header, footer, menu, mobile-nav
│   ├── router/                # Custom TitleStrategy, route-state helpers
│   └── tenant/                # ecoStoreTenantStore (tenant resolution)
├── orders/
│   ├── data-access/
│   ├── feature/list/
│   ├── feature/detail/
│   └── feature/created/       # Post-checkout confirmation
├── product-categories/
├── products/
│   ├── data-access/
│   ├── feature/list/
│   └── feature/detail/
├── profile/
│   ├── addresses/             # PRV-04 full CRUD
│   ├── avatar/                # PRV-02a avatar upload/crop/delete
│   ├── basic/                 # PRV-02a/02b name, phone, email
│   └── feature/               # Routes + shell
├── shared/                    # Eco-store-only shared UI (product-card, breadcrumbs, hero-header, price-summary, etc.)
└── store-window/              # BOT-09 cycle banner + BOT-14 Qui Som
```

Cross-app reusable code goes in `libs/shared/*` or `libs/core/*` (see root CLAUDE.md for scope rules). Don't put eco-store-specific things there.

### App entry points

- `apps/eco-store/src/app/app.routes.ts` — top-level auth routes + the catch-all that loads the layout
- `apps/eco-store/src/app/app.config.ts` — providers: PocketBase, translate, view transitions, service worker, image loader, tenant init
- `libs/eco-store/core/layout/src/layout.routes.ts` — the in-shell route tree (`/cistella`, `/comandes`, `/botiga`, `/perfil`, etc.)

### Current route map

| Path                                                        | Purpose                                                    |
| ----------------------------------------------------------- | ---------------------------------------------------------- |
| `/accedir`                                                  | Login                                                      |
| `/recuperar-contrasenya` + `-enviada`                       | Forgot password flow                                       |
| `/restablir-contrasenya`                                    | Reset password                                             |
| `/` → `/botiga`                                             | **No home (INI) yet** — `**` fallback redirects to catalog |
| `/botiga` · `/botiga/:category` · `/botiga/:category/:slug` | Catalog + detail                                           |
| `/cistella`                                                 | Checkout (3 steps)                                         |
| `/comandes` · `/comandes/nova` · `/comandes/:id`            | Order history + new + detail                               |
| `/perfil`                                                   | Profile area                                               |

When you add the **INI** (home) module, mount it at `''` in `layout.routes.ts` before the `'botiga'` block, and remove or repurpose the `**` redirect.

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

### Hooks workflow (PocketBase 0.36.7)

This version **supports separate `.pb.js` files** — no need to bundle into a single `main.pb.js`. Current live hooks:

| File                           | Purpose                                                                      |
| ------------------------------ | ---------------------------------------------------------------------------- |
| `on_create_order.pb.js`        | Cycle linking, duplicate prevention, cart cleanup, NOT-01 confirmation email |
| `on_password_reset.pb.js`      | PRV-03 password reset support                                                |
| `single_default_address.pb.js` | Enforces single default on `user_addresses` for PRV-04c                      |
| `normalize_user_name.pb.js`    | Auto-normalizes user names for search                                        |
| `cycle_cron.pb.js`             | Scheduled job: initialize weekly cycles and run status transitions           |

### Schema workflow

```bash
# 1. Edit in Admin UI
open http://localhost:8090/_/   # superuser login required

# 2. Export to repo
yarn eco-store:pb:export

# 3. Review diff
yarn eco-store:pb:diff

# 4. Commit. Pre-commit hook will also auto-export.
```

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

For collections with membership gates (carts, orders):

```
user = @request.auth.id
  && tenant = @request.auth.tenant
  && (@request.auth.membershipStatus = "ACTIVE"
      || (@request.auth.membershipStatus = "TRIAL"
          && @request.auth.trialEndsAt > @now))
```

This is already in place on `carts.createRule` and `orders.createRule` — it implements TRL-05 server-side. Trust this enforcement; the frontend block (TRL-04) is for UX only.

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

The brand identity is the **Eco Vibrant** / **"Organic and Kind"** aesthetic. The root CLAUDE.md captures the design principles; this section adds the eco-store-specific details.

### Theming

- **Material 3** with CSS custom properties
- **OKLCH-derived palettes** (not HSL) for perceptual uniformity across light/dark
- Light + dark modes both fully supported via `MatThemeToggleComponent` in header
- Tenant-customizable palette is on the roadmap (UI-03)

### Typography

**Manrope** for all text (display, headlines, body, labels). Loaded via Google Fonts.

| M3 Token       | Size     | Weight | Use                  |
| -------------- | -------- | ------ | -------------------- |
| Display Large  | 3.562rem | 400    | Hero titles          |
| Headline Large | 2rem     | 400    | Major section titles |
| Title Large    | 1.375rem | 400    | Card / panel titles  |
| Body Large     | 1rem     | 400    | Body text            |
| Body Medium    | 0.875rem | 400    | Secondary text       |
| Label Large    | 0.875rem | 500    | Button labels        |
| Label Small    | 0.688rem | 500    | Badges, tags         |

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
- **Translation key validation:** `yarn i18n:validate` (also runs in pre-commit)
- **All user-facing strings must be externalized** — no hardcoded copy in templates or TS files.

---

## Storage & client-side persistence

| Key                                | Where        | Scope                    | Lifecycle                                               |
| ---------------------------------- | ------------ | ------------------------ | ------------------------------------------------------- |
| `${tenant.normalizedName}-cart-v1` | localStorage | Anonymous cart           | Cleared on login (after successful merge) and on logout |
| `eco-lang`                         | localStorage | User language preference | Persists across sessions                                |
| Material theme key                 | localStorage | Light/dark/system        | Persists across sessions                                |
| PocketBase auth token              | localStorage | JWT token                | Managed by PocketBase SDK; 7-day expiry                 |

**Never** store sensitive data (PII, payment info) in localStorage. The cart is the only feature-level use of it.

---

## Testing

In addition to the root CLAUDE.md testing guidance:

- **Pa11y CI** at `apps/eco-store/.pa11yci.json`. Run via `yarn eco-store:a11y`. Workflow at `.github/workflows/eco-store-pa11y.yml`.
- **Cart store** has a mock at `libs/eco-store/cart/data-access/src/eco-store-cart.store.mock.ts` — use this in feature tests.
- **Tenant store mocking:** provide a fake tenant in `TestBed` rather than waiting on real resolution.
- **Always provide locale data in tests** that involve dates/currency, since `LOCALE_ID` is `ca` globally.

---

## Naming conventions specific to eco-store

- **Libraries:** `libs/eco-store/<domain>/<type>` (e.g. `libs/eco-store/products/feature/list`)
- **Library project names:** `eco-store-<domain>-<type>` (e.g. `eco-store-products-feature-list`)
- **Component selectors:** `eco-<name>` for app-internal, `plastik-<name>` for shared libs
- **Path alias prefix:** `@plastik/eco-store/<domain>` (always; don't import via relative paths across libs)
- **Entity names:** `EcoStore<Thing>` (e.g. `EcoStoreCart`, `EcoStoreProduct`, `EcoStoreTenant`)

---

## Common gotchas

1. **`onSameUrlNavigation: 'reload'` is set in router config.** Re-runs guards/resolvers on identical URLs — convenient but can cause double-fetches if you also subscribe to `queryParams` inside a component. Prefer one pattern per route.
2. **`yarn eco-store:local` starts 3 processes** (PocketBase + Angular dev server + SCSS watcher). Stop them all when tearing down.
3. **PocketBase pre-commit auto-export.** If you forget to commit `pb_schema.json` after editing collections, the hook does it for you. If you're offline or the binary is missing, the hook fails — install via `yarn eco-store:pb:download`.
4. **Trial badge in header uses `lg:flex` (hidden on mobile by default).** If product wants trial visibility on mobile too, change in `header.component.html`.
5. **`membershipStatus` has 4 values**: `TRIAL`, `ACTIVE`, `INACTIVE`, `SUSPENDED`. Trial expiry is checked via `trialEndsAt > @now`; status doesn't change on expiry until manual conversion.
6. **Cart merge uses `SharedConfirmDialogService`**, not `MatSnackBar`. Don't "fix" this back to snackbar unless product asks — the dialog allows a CTA to navigate to `/cistella`.

---

## When you're stuck

1. **Read the PRD** for the feature ID you're working on (v1.8 PDF in the modeling folder)
2. **Check TASKS.md** for the latest status and atomized spec for that ID
3. **Check BACKLOG.md** for context on phase / dependencies / time budget
4. **Look at a sibling feature** in the same domain (e.g. `profile/addresses` for `profile/basic` patterns)
5. **Inspect the cart store** for non-trivial Signal Store patterns
6. **Check `apps/eco-store/POCKETBASE.md`** for any backend-related work
7. **Ask Carlos.** PR descriptions and commit subjects should reference the PRD ID.
