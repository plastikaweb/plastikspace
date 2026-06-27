# Eco Store — TASKS

> **Live development backlog for the `eco-store` app.**
> Status verified against the codebase + ClickUp board on **May 16, 2026**.
>
> Companion to:
>
> - **PRD v1.8** (the master) — lives at `/Volumes/Feina/Projects-modeling/eco/eco-store/ecostoreprdv1_8ca.pdf`
> - **`BACKLOG.md`** — phased / dependency-aware sprint plan derived from this file
> - **`apps/eco-store/POCKETBASE.md`** — backend workflow & scripts
> - **`apps/eco-store/CLAUDE.md`** — app-specific guidance for AI agents

**Document version:** 0.29 · **Last updated:** 2026-06-27

---

## How to use this document

- **One task per PRD ID** (`INI-01`, `BOT-05`, etc.). When a PRD ID is atomized (e.g. `PRV-02a/b/c`, `PRV-04a/b/c/d`), each sub-ID is its own task.
- Status is **derived from the codebase + ClickUp**, not the PRD's own status column (which lags).
- New non-PRD task families: `BUG-NNN` (bugs), `META-NN` (housekeeping), `OPS-NN` (release ops), `TECH-NN` (tech debt), `SEO-NN`, `MKT-research-NN`.

### Status legend

| Symbol | Meaning                                        |
| ------ | ---------------------------------------------- |
| ✅     | Done — implemented and merged                  |
| 🔄     | In progress — actively being worked            |
| 📋     | Ready — spec'd, unblocked, can be picked up    |
| 🧪     | Discovery — needs spec/UX/decision before code |
| ⛔     | Blocked — waiting on dependency or decision    |
| ⏸️     | Deferred — won't ship in v1                    |
| ❓     | Verify — code exists but needs validation      |

### Priority (MoSCoW)

`MUST` · `SHOULD` · `COULD`

### Module prefixes

`INI` Home · `BOT` Catalog · `SRC` Search · `PRV` Auth/Profile · `TRL` Trial members · `PST` Post-order · `VAL` Reviews · `NOT` Notifications · `MKT` Marketing · `EST` Order history · `UI`/`LGL` UI & Legal · `HLP` AI/Messaging · `RCT` Recipes · `META`/`OPS`/`BUG`/`TECH`/`SEO` Cross-cutting

---

## 🎯 Current focus

| Task        | Module | Priority | Status | One-line summary                                                       |
| ----------- | ------ | -------- | ------ | ---------------------------------------------------------------------- |
| **BUG-001** | BOT-05 | MUST     | ❓     | Verify cart merge regression — code complete, needs manual test pass   |
| **BUG-003** | BOT    | MUST     | ✅     | PWA manifest doesn't use tenant name as default app name               |
| **PRV-02b** | PRV    | MUST     | 🔄     | Email change with async verification (CU `86c92g6ek`)                  |
| **PRV-02c** | PRV    | MUST     | 🔄     | In-session password change (CU `86c92g60y`)                            |
| **PRV-04d** | PRV    | MUST     | 📋     | Billing address typology + NIF on `user_addresses` (CU `86c99dev0`)    |
| **PRV-08**  | PRV    | MUST     | 🔄     | Self-service account deletion (RGPD right to erasure) (CU `86c92g6hd`) |
| **PRV-09**  | PRV    | SHOULD   | 🔄     | Notification preferences panel (CU `86c92g7fb`)                        |
| **TRL-03**  | TRL    | MUST     | 📋     | Trial → member conversion CTA                                          |
| **BOT-02b** | BOT    | MUST     | 📋     | Text search input above product grid                                   |
| **BOT-02c** | BOT    | MUST     | 📋     | Tag filter chips above product grid                                    |
| **BOT-08**  | BOT    | MUST     | 📋     | Stock badge + out-of-stock overlay with "Avisa'm"                      |
| **VAL-01**  | VAL    | SHOULD   | 🔄     | Publish review form on product detail                                  |

See **`BACKLOG.md`** for the phased plan.

---

## 🗄 Schema changes pending (PocketBase)

Workflow: edit in Admin UI → `yarn eco-store:pb:export` → `yarn eco-store:pb:diff` → commit.

### Required for queued work

| Collection       | Field / Change      | Type                      | For task         | Notes                                                                                      |
| ---------------- | ------------------- | ------------------------- | ---------------- | ------------------------------------------------------------------------------------------ |
| `users`          | `notificationPrefs` | JSON                      | PRV-09           | 6 boolean toggles (offers, restock, order status, cycle open/close, announcements, social) |
| `user_addresses` | `addressType`       | Select                    | PRV-04d          | `SHIPPING` \| `BILLING` \| `BOTH` (default `SHIPPING`)                                     |
| `user_addresses` | `nif`               | Text (nullable)           | PRV-04d          | Required server-side when `addressType` ∈ {`BILLING`, `BOTH`}                              |
| `user_addresses` | `defaultShipping`   | Bool                      | PRV-04d          | Rename or alias from existing `default`                                                    |
| `user_addresses` | `defaultBilling`    | Bool                      | PRV-04d          | New; at most one per user                                                                  |
| `tenants`        | `heroTitle`         | String (i18n JSON)        | INI-01           |                                                                                            |
| `tenants`        | `heroSubtitle`      | String (i18n JSON)        | INI-01           |                                                                                            |
| `tenants`        | `heroImagePreset`   | Select                    | INI-01           | `hort` \| `cistella` \| `mercat` \| `default`                                              |
| `tenants`        | `heroImageCustom`   | File (Image)              | INI-01           | Optional, overrides preset                                                                 |
| `tenants`        | `aboutUsText`       | String (HTML, i18n JSON)  | INI-06           |                                                                                            |
| `tenants`        | `howItWorksSteps`   | JSON (nullable)           | INI-03           | If null, derive from `logisticsConfig`                                                     |
| `products`       | `isFeatured`        | Boolean (default `false`) | INI-04 / MKT-03  |                                                                                            |
| _new collection_ | `wishlists`         | —                         | BOT-07 / BOT-13b | Per-user, per-tenant. Schema TBD (Q-14)                                                    |
| _new collection_ | `stock_alerts`      | —                         | BOT-13a / NOT-03 | Email + product subscription                                                               |
| _new collection_ | `reviews`           | —                         | VAL-01           | Q-13 pending (collection vs JSON-on-products)                                              |
| _new collection_ | `promo_codes`       | —                         | MKT-02           | Tenant-scoped                                                                              |

### Already in schema

| Collection                               | Field                                                    | Notes                                                 |
| ---------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| `tenants`                                | `shortName`                                              | ✅ Present (text, max 12; PWA `short_name` — BUG-003) |
| `users`                                  | `membershipStatus`                                       | ✅ Present (4 valid values after META-02)             |
| `users`                                  | `trialEndsAt`                                            | ✅ Present (nullable date)                            |
| `users`                                  | `role`                                                   | ✅ `PARTNER` / `GLOBAL_ADMIN` / `TENANT_ADMIN`        |
| `tenants`                                | `logisticsConfig`, `languages`, `closed`, `closedReason` | ✅                                                    |
| `products`                               | `unitType`, `rating`, `reviewsCount`                     | ✅                                                    |
| `carts.createRule` + `orders.createRule` | API rule                                                 | ✅ TRL-05 enforced                                    |
| `carts`                                  | `isEditingOrder`, `activeOrderId`                        | ✅ PST-02 ready                                       |

### Hooks in `pb_hooks/`

| File                           | Purpose                                          | Status                                                                                      |
| ------------------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `cycle_cron.pb.js`             | Weekly cycle init & status transitions           | ✅                                                                                          |
| `normalize_user_name.pb.js`    | Auto-normalize user names                        | ✅                                                                                          |
| `on_create_order.pb.js`        | Cycle linking, dedup, cart cleanup, NOT-01 email | ✅                                                                                          |
| `on_password_reset.pb.js`      | PRV-03 support                                   | ✅                                                                                          |
| `single_default_address.pb.js` | Enforces single default                          | ✅ — **update needed for PRV-04d** (handle `defaultShipping` + `defaultBilling` separately) |

### Hooks still needed

- **NOT-02** — Order status change email
- **NOT-03** — Stock replenishment notification
- **NOT-04** — Cycle opened email
- **NOT-05** — Cycle closing reminder (scheduled)
- **TRL-08** — Trial expiry reminder (scheduled)
- **VAL-01 hook** — Recompute `products.rating` / `reviewsCount` on review write
- **PRV-08 hook** — Hard delete personal data + anonymize past orders (drop name/email, keep zip for stats)
- **PST-04 hook** — On `order_cycles.status` change, transition pending orders accordingly

---

## 🐛 Bugs & regressions

| ID          | Title                                              | Priority   | Status | ClickUp     | Notes                                                                                                                                                                                         |
| ----------- | -------------------------------------------------- | ---------- | ------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BUG-001** | Cart merge on login (BOT-05) — verification        | MUST       | ❓     | —           | Code complete; run 5 manual tests                                                                                                                                                             |
| **BUG-002** | Deep-link `/cistella/resum` redirects to `/botiga` | MUST       | ✅     | `86c9uq8kb` | Fixed — empty-cart guard no-ops during SSR; deep-links keep cart items                                                                                                                        |
| **BUG-003** | PWA manifest doesn't use tenant name as default    | MUST       | ✅     | `86c9uq8kj` | Fixed — Android via decoupled name patch; iOS via per-tenant manifest + `apple-mobile-web-app-title` served by the SSR worker (`run_worker_first` + `HTMLRewriter`), client blob swap retired |
| **BUG-004** | Rationalize cart toasts on add/change/remove qty   | SHOULD     | ✅     | `86c9uq92h` | Done 2026-06-24 — debounce removed; cart shares `cart:<id>` groupKey via TECH-10 (add/update/remove collapse to one toast). i18n `cart.productUpdated` added                                  |
| **BUG-005** | Profile routes accessible without login            | **Urgent** | ✅     | `86c9uq8jq` | Shared `ecoStoreAuthGuard` on `/perfil` (also reused for `/comandes`); preserves `returnUrl`                                                                                                  |

### BUG-001 — Cart merge on login (BOT-05) [❓ Verify]

Manual test checklist:

- [ ] Anonymous adds 2 products → login → both appear in `/cistella` and PocketBase
- [ ] Anonymous A x2 → login (user has A x1) → final quantity is 3
- [ ] Stale price → login → dialog appears + price updated
- [ ] Add → logout → login → clean state, no doubling
- [ ] Storage key uses `${tenant.normalizedName}-cart-v1` format

---

## 4.1 INI — Home page

Root `/` redirects to `/botiga`. No `home` lib exists yet.

| ID         | Description                                    | Priority | Status |
| ---------- | ---------------------------------------------- | -------- | ------ |
| **INI-01** | Hero section                                   | MUST     | 📋     |
| **INI-02** | "Fes-te soci" CTA for anonymous                | MUST     | 📋     |
| **INI-03** | "Com funciona" auto-gen from `logisticsConfig` | MUST     | 📋     |
| **INI-04** | Featured products showcase                     | SHOULD   | 📋     |
| **INI-05** | Visual category navigation                     | MUST     | 📋     |
| **INI-06** | "Qui som / impacte" section                    | SHOULD   | 📋     |
| **INI-07** | Social proof / testimonials                    | COULD    | ⏸️     |
| **INI-08** | Pre-footer conversion CTA                      | SHOULD   | 📋     |
| **INI-09** | Scroll reveal animations                       | COULD    | 📋     |

ClickUp: `86c8cjgkp` is the parent epic.

---

## 4.2 BOT — Catalog & shop

### Done ✅

BOT-01, BOT-02a, BOT-02d, BOT-03, BOT-04, BOT-05 (pending BUG-001 verify), BOT-06a/b/c, BOT-09, BOT-10, BOT-11, BOT-12, BOT-14, BOT-15.

### Pending 📋

| ID                 | Description                                    | Priority | ClickUp     | Notes                              |
| ------------------ | ---------------------------------------------- | -------- | ----------- | ---------------------------------- |
| **BOT-02b**        | Text search input                              | MUST     | `86c8cjggk` | Query `products.normalizedName`    |
| **BOT-02c**        | Tag filter chips                               | MUST     | `86c8cjgkj` | Multi-select tenant tags           |
| **BOT-07**         | Wishlist heart icon (auth-gated)               | SHOULD   | —           | Needs schema (Q-14)                |
| **BOT-08**         | Stock badge + out-of-stock overlay + "Avisa'm" | MUST     | —           | "Avisa'm" CTA stub until 5.5       |
| **BOT-13a**        | "Avisa'm" anonymous email-only                 | SHOULD   | —           | Needs `stock_alerts`               |
| **BOT-13b**        | "Avisa'm" auto for wishlist                    | SHOULD   | —           | Depends on BOT-07                  |
| **BOT-16** _(new)_ | Sidenav menu for cart                          | SHOULD   | `86c8cjgj2` | Side panel access to cart contents |

---

## 4.3 SRC — Global search

All pending. ClickUp parent: `86c8cjgke`.

| ID             | Description                                                       | Priority    |
| -------------- | ----------------------------------------------------------------- | ----------- |
| **SRC-01..09** | Persistent header search bar + typeahead + grouped results + a11y | MUST/SHOULD |

---

## 4.4 PRV — Auth & profile

### Done ✅

| ID          | Description                             | Where                                                                  |
| ----------- | --------------------------------------- | ---------------------------------------------------------------------- |
| **PRV-01**  | Login/logout (JWT, 7-day)               | `libs/eco-store/auth/login`                                            |
| **PRV-02a** | Personal data (name, phone, **avatar**) | `libs/eco-store/profile/{basic,avatar}` · CU `86c92g5x5` + `86c92g5xk` |
| **PRV-03**  | Forgot-password flow                    | `libs/eco-store/auth/{forgot-password,*-sent,reset-password}`          |
| **PRV-04a** | Address list                            | `libs/eco-store/profile/addresses` · CU `86c92g5yn`                    |
| **PRV-04b** | Address CRUD                            | CU `86c92g5yz`                                                         |
| **PRV-04c** | Default address                         | CU `86c92g5z8`                                                         |

### In progress 🔄

| ID          | Description                          | Priority | ClickUp     | Notes                                                                                                                              |
| ----------- | ------------------------------------ | -------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **PRV-02b** | Email change with async verification | MUST     | `86c92g6ek` | Non-blocking flow                                                                                                                  |
| **PRV-02c** | In-session password change           | MUST     | `86c92g60y` | 3 fields (current/new/confirm); different from PRV-03                                                                              |
| **PRV-08**  | Self-service account deletion (RGPD) | MUST     | `86c92g6hd` | Hard delete personal fields + anonymize past orders (drop name/email, keep zip for stats) + cascade `user_addresses` + auto logout |
| **PRV-09**  | Notification preferences panel       | SHOULD   | `86c92g7fb` | 6 toggles → `users.notificationPrefs` JSON                                                                                         |

### Pending 📋

| ID                  | Description                         | Priority | ClickUp     | Notes                                                                                                |
| ------------------- | ----------------------------------- | -------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| **PRV-04d** _(new)_ | Billing address typology + NIF      | MUST     | `86c99dev0` | Add `addressType`, `nif`, `defaultBilling` to `user_addresses`; update form + hook for dual defaults |
| **PRV-05a**         | Pre-authorization (admin)           | MUST     | —           | Out of scope (eco-admin)                                                                             |
| **PRV-05b**         | Registration with pre-auth email    | MUST     | `86c8cjgha` | Gated by tenant admin allow-list                                                                     |
| **PRV-06**          | Membership request form (anonymous) | SHOULD   | —           | Public form                                                                                          |
| **PRV-07**          | Contact form (anonymous)            | SHOULD   | —           | Public form                                                                                          |

### PRV-08 — Account deletion (RGPD) spec

- Section "Seguretat i Accés" → "Eliminar compte"
- Confirmation `MatDialog` with explicit consequences
- PocketBase hook (`on_user_delete.pb.js` new):
  - Hard delete: `users.name`, `email`, `phone`, `avatar`
  - Cascade delete: `user_addresses` for this user
  - Anonymize past `orders`: drop `address.fullName`, `address.email`, keep `address.zip` + everything else (preserves tenant statistics)
  - Wishlist + stock_alerts: cascade delete
- After success: auto logout + redirect to home
- A11y: clear destructive language, focus management, screen-reader announcement

### PRV-09 — Notification preferences spec

6 toggles persisted to `users.notificationPrefs` (JSON):

1. Ofertes i promocions (email)
2. Reposició d'estoc de productes a la wishlist
3. Notificacions d'estat de comanda
4. Avisos d'obertura/tancament de cicles
5. Comunicats generals (tancaments, vacances)
6. Interaccions socials (respostes a comentaris/valoracions)

Each PocketBase hook (NOT-02..05, NOT-03 restock) consults this JSON before sending.

### PRV-04d — Billing address typology spec

Schema:

- `addressType: Select(SHIPPING | BILLING | BOTH, default=SHIPPING)`
- `nif: Text nullable` — required server-side when `addressType ∈ {BILLING, BOTH}`
- `defaultShipping: Bool` (rename current `default`)
- `defaultBilling: Bool` (new)

UI:

- Form: type chip selector + NIF field shown conditionally when type = BILLING/BOTH
- Address list: visual badge per type (SHIPPING / BILLING / BOTH)
- Checkout (BOT-06b): auto-fill from default of relevant type

Hook update: `single_default_address.pb.js` → enforce single `defaultShipping=true` AND single `defaultBilling=true` per user (separate constraints).

---

## 4.5 TRL — Trial members

### Done ✅

TRL-01 (schema-ready), TRL-02 (header badge), TRL-05 (API rules backend), TRL-06 (data preservation verified).

### Pending 📋

| ID         | Description                             | Priority | Notes                                              |
| ---------- | --------------------------------------- | -------- | -------------------------------------------------- |
| **TRL-03** | Conversion CTA in `/perfil`             | MUST     | Spec in earlier TASKS version; ClickUp `86c90qt5e` |
| **TRL-04** | Frontend checkout block + upsell dialog | MUST     | UX mirror of TRL-05                                |
| **TRL-07** | Admin-approved conversion (eco-admin)   | MUST     | Future                                             |
| **TRL-08** | Trial expiry reminder email             | SHOULD   | New scheduled hook                                 |
| **TRL-09** | Admin filter & transitions              | SHOULD   | Out of scope (eco-admin)                           |

---

## 4.6 PST — Post-order management

Schema ready. ClickUp has both cycle and 24/7 mode tasks.

| ID                 | Description                                             | Priority | Status | ClickUp                                                                             |
| ------------------ | ------------------------------------------------------- | -------- | ------ | ----------------------------------------------------------------------------------- |
| **PST-01a**        | Cancel — cycle mode                                     | SHOULD   | 📋     | —                                                                                   |
| **PST-01b**        | Cancel — 24/7 mode                                      | SHOULD   | 📋     | —                                                                                   |
| **PST-02**         | Modify items in active order                            | SHOULD   | 📋     | `86c9ea1wg` (modify order subtask of EST-03) + `86c9dpjmz` (modify for orderWindow) |
| **PST-03**         | Return / exchange request                               | COULD    | ⏸️     | —                                                                                   |
| **PST-04** _(new)_ | Order status transition on `order_cycles` window change | SHOULD   | 📋     | `86c9e9964` — backend hook                                                          |

---

## 4.7 VAL — Reviews

| ID         | Description              | Priority | Status          |
| ---------- | ------------------------ | -------- | --------------- |
| **VAL-01** | Publish rating + comment | SHOULD   | 🔄 — needs Q-13 |
| **VAL-02** | Read reviews             | SHOULD   | ✅              |
| **VAL-03** | Reactions to reviews     | COULD    | ⏸️ (Q-01)       |

---

## 4.8 NOT — Notifications

| ID         | Description               | Priority | Status                                     |
| ---------- | ------------------------- | -------- | ------------------------------------------ |
| **NOT-01** | Order confirmation email  | MUST     | ✅                                         |
| **NOT-02** | Order status change email | MUST     | 📋                                         |
| **NOT-03** | Restock notification      | SHOULD   | 📋                                         |
| **NOT-04** | Cycle opened email        | SHOULD   | 📋                                         |
| **NOT-05** | Cycle closing reminder    | SHOULD   | 📋                                         |
| **NOT-06** | Channel preferences       | COULD    | ⏸️ (Q-07) — superseded by PRV-09 for email |

---

## 4.9 MKT — Discounts & promotions

| ID         | Description                  | Priority | Status                 |
| ---------- | ---------------------------- | -------- | ---------------------- |
| **MKT-01** | Volume discounts             | SHOULD   | 📋                     |
| **MKT-02** | Promo codes at checkout      | SHOULD   | 📋                     |
| **MKT-03** | Featured / on-sale highlight | SHOULD   | 📋 — depends on INI-04 |

---

## 4.10 EST — Order history

| ID                 | Description                           | Priority | Status | Where                                                   |
| ------------------ | ------------------------------------- | -------- | ------ | ------------------------------------------------------- |
| **EST-01**         | Paginated history                     | MUST     | ✅     | `libs/eco-store/orders/feature/list`                    |
| **EST-02**         | Filter & sort (status + product name) | MUST     | ✅     |                                                         |
| **EST-03**         | Order detail page                     | MUST     | ✅     | `libs/eco-store/orders/feature/detail` · CU `86c8cjgma` |
| **EST-04**         | PDF export                            | SHOULD   | 📋     | Q-08 · CU subtask `86c8tqhq4`                           |
| **EST-05**         | Personal consumption stats            | COULD    | ⏸️     |                                                         |
| **EST-06** _(new)_ | Per-order statistics calculation      | SHOULD   | 📋     | `86c9e8zxj` — likely a hook                             |

---

## 4.11 UI / LGL

| ID                 | Description                 | Priority | Status    | ClickUp                     |
| ------------------ | --------------------------- | -------- | --------- | --------------------------- |
| **UI-01**          | Dark/light/system mode      | SHOULD   | ✅        | —                           |
| **UI-02**          | Language selector           | MUST     | ✅        | —                           |
| **UI-03**          | Per-tenant color theme      | COULD    | 📋        | —                           |
| **UI-04** _(new)_  | Footer view                 | MUST     | 🔄        | `86c8cjgg9`                 |
| **LGL-01**         | Legal pages                 | MUST     | 📋        | `86c8cjgm2`                 |
| **LGL-02**         | Cookie consent banner       | MUST     | 📋 (Q-10) | `86c8cjgm3`                 |
| **SEO-01** _(new)_ | Dynamic SEO titles per page | SHOULD   | 📋        | `86c9autmu` — high priority |

---

## 4.12 HLP — AI assistant & messaging

| ID         | Description      | Priority | Status | ClickUp     |
| ---------- | ---------------- | -------- | ------ | ----------- |
| **HLP-01** | AI chatbot       | COULD    | ⏸️     | `86c8cjgkk` |
| **HLP-02** | Direct messaging | COULD    | ⏸️     | —           |

---

## 4.13 RCT — Recipes

All `COULD`, pending discovery.

---

## 🔀 Cross-cutting

### Accessibility (WCAG 2.1 AA)

- **A11Y-001** — 200% zoom breakage [MUST · 📋]
- **A11Y-002** _(new)_ — Tenant button on mobile a11y issue [MUST · 📋 · ClickUp `86c9uq8kt`]
- **A11Y-003** ✅ — Password visibility toggle: tooltip + `aria-pressed` fix + label i18n [SHOULD · ✅ 2026-06-06 · ClickUp `86ca59u4d`]
- **A11Y-004** ✅ — Tooltips + consistent labels on eco-store quantity/cart icon buttons [SHOULD · ✅ 2026-06-07 · ClickUp `86ca59u4x`]
- **A11Y-005** ✅ — Header sidenav + tenant-link tooltips/aria-label [SHOULD · ✅ 2026-06-07 · ClickUp `86ca59u73`]
- **A11Y-006** ✅ — Password visibility toggle keyboard-focusable: removed `tabindex="-1"` from the show/hide `matIconButton` (A11Y-003 left it unreachable via Tab; WCAG 2.1.1). Native button now Tab-reachable + Enter/Space-activatable; Material focus indicator applies. Spec asserts `tabIndex === 0`. [SHOULD · ✅ 2026-06-21 · ClickUp `86ca5gpxj`]
- **A11Y-007** ✅ — Search input (`libs/shared/form/ui/input-search`): `matTooltip` mirroring `aria-label` on the search/clear icon buttons (sibling to A11Y-004/005), repointed to new `common.form.search`/`clear` keys (ca/es/en), Clear button disabled state decoupled from the search `minLength` gate (1-char terms now clearable), `aria-hidden` on clear icon. Sole consumer is eco-store. [SHOULD · ✅ 2026-06-21 · ClickUp `86cac31mt`]
- **A11Y-008** ✅ — `SharedAlertUiComponent` (`libs/shared/alert/ui`): added `MatTooltipModule` + `[matTooltip]` on the close icon button mirroring its `common.close` `aria-label` (sibling to A11Y-004/005/007; the button had the label but no hover hint). Spec asserts tooltip↔aria-label sync. Supersedes Jules draft #1182. [SHOULD · ✅ 2026-06-24 · ClickUp `86cadtkh7`]
- **A11Y-009** ✅ — `textarea-with-counter` (`libs/shared/form/ui/textarea-with-counter`): added `aria-live="polite"` to the character-count hint (SR announces updates) + a `text-warning` state at ≥90% of `maxLength` before the existing `text-error` at the limit; both class bindings unified on `props.maxLength` (drops the `ta.maxLength === -1`-when-unset wart). Shared Formly type consumed by eco-store + llecoop (additive). Spec asserts aria-live + 90%/100% thresholds (5 tests). Harvest from Jules #1185. [SHOULD · ✅ 2026-06-24 · ClickUp `86cadtkvb`]
- **A11Y-010** ✅ — Search input keyboard support (`libs/shared/form/ui/input-search`): **Enter** triggers a full search via `(keydown.enter)`; **Escape** clears (when `resetSearch` on) + restores focus via a `viewChild` ref. The `keyup` handler moved into `onKeyup()` that **skips Enter**, so a single Enter can't fire two searches — both live consumers run `noButton: true`, where `keyup` already searched, so the naive add would have doubled every fetch. Specs assert Enter→search, Escape→reset+focus, single-fire on Enter (14 tests). Sole consumer is eco-store. Harvest from Jules #1193; supersedes PR #1199. [SHOULD · ✅ 2026-06-27 · ClickUp `86caf5zxh`]
- **A11Y-011** ✅ — Tooltips on icon-only back buttons (`libs/eco-store/shared/breadcrumbs` + `libs/eco-store/auth/feature/container`): the two remaining icon-only back buttons had an `aria-label` but no `matTooltip` (sibling to A11Y-004/005/007/008). Added `MatTooltipModule` + `[matTooltip]` mirroring each button's `aria-label` (`backAriaLabel()`; auth `auth.common.back`). Specs assert tooltip↔aria-label sync (the auth-container test drives the PWA-standalone branch via a signal-backed `isStandalone` mock). Consolidates Jules #1195 (breadcrumbs + spec) + #1196 (auth container). [SHOULD · ✅ 2026-06-27 · ClickUp `86caf5zy4`]
- Pa11y CI: `yarn eco-store:a11y`

### i18n

- `LOCALE_ID` hardcoded to `'ca'` — register `localeEs` / `localeEn` if formatting in those needed
- **I18N-001** [📋]: hardcoded string audit; `yarn i18n:validate`

### Tech debt

| ID                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Priority | ClickUp     |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| **TECH-01** _(new)_ | Shared util to get string from `string \| LocalizedField`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | SHOULD   | `86c9uq9rf` |
| **TECH-02** ✅      | Modernize `libs/shared/*` to Angular 21 (already on develop; residual cleanup landed)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | SHOULD   | `86c9y6upw` |
| **TECH-03** ✅      | Optimize `libs/shared/util/objects` (O(N²)→O(N) `reduce`, drop O(N) alloc in `isEmpty`, native `Object.values()`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | SHOULD   | `86ca226tz` |
| **TECH-04** ✅      | Optimize `libs/shared/util/latinize`: ASCII-only regex (`/[^\x00-\x7F]/g`) + fix Cyrillic `А` casing bug + add spec                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | SHOULD   | `86ca59u10` |
| **TECH-05** ✅      | TECH-03 follow-up: convert remaining `libs/shared/util/objects` `reduce` fns to `for…in`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | COULD    | `86ca59u6d` |
| **TECH-06** ✅      | TECH-03/05 follow-up: optimize `areObjectEntriesEqual` (`libs/shared/util/objects`) — `Object.keys().every()` → two `for…in` loops guarded by `hasOwnProperty`, dropping the key-array allocations + closure per call; behaviour-preserving                                                                                                                                                                                                                                                                                                                                                                                                                                                    | COULD    | `86ca5gpy1` |
| **TECH-07** ✅      | Cache system timezone in `SharedUtilFormattersService`: the 3 date formatters recomputed `Intl…resolvedOptions().timeZone` inline per call; now cached once as a `readonly #timezone` field. Behaviour-identical. PR #1198 supersedes Jules drafts #1192/#1194/#1197. Done 2026-06-27                                                                                                                                                                                                                                                                                                                                                                                                          | COULD    | `86ca8m6aj` |
| **TECH-08** ✅      | Optimize `BytesToSizePipe` (`libs/shared/util/bytes-to-size`) — cached `Math.log(1024)` as `LOG1024`, dropped `parseInt(String(…))` round-trip, precomputed `POWERS` table for Bytes…TB. Behaviour-identical (PR #1155). Done 2026-06-21                                                                                                                                                                                                                                                                                                                                                                                                                                                       | COULD    | `86cac31nm` |
| **TECH-09** ✅      | `latinize()` ASCII fast-path early-return (`libs/shared/util/latinize`) — skips `.replace()` + map lookup for pure-ASCII input; **distinct** from TECH-04's regex narrowing. Behaviour-identical (PR #1163). Done 2026-06-21                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | COULD    | `86cac31p6` |
| **TECH-10** ✅      | Centralize notification dedup + max-concurrent + array-leak fix in the shared layer (`libs/shared/notification/*`); add a `provideNotificationConfig` surface (per-type duration, position, `maxConcurrent`) honoured by both hot-toast and mat-snackbar. `notificationStore.show()` dedups by `groupKey`, caps + moves an updated group to the top (in place only when newest **and** same type). Reordered `create()` to `(message, type, options?, parameters?)`. Migrated generic PocketBase/Firebase CRUD + llecoop `order-list` callers to `groupKey`s. Per-app config: eco-store 3 + `provideHotToastConfig`, llecoop + nasa-images 1. Supersedes the BUG-004 debounce. Done 2026-06-24 | SHOULD   | `86cadqxva` |
| **TECH-11** ✅      | Optimize `deepClone` + `escapeHtml` in `libs/shared/util/objects` — `deepClone` swaps `obj.map()`/`Object.keys().forEach()` for a manual indexed `for` loop + `for…in` guarded by `hasOwnProperty` (and drops the redundant trailing `typeof === 'object'` guard); `escapeHtml` (SEC-01 escaper) hoists its `map`+regex to module scope and adds a non-global `RegExp.test()` fast-path (return input unchanged when no special chars). Behaviour-identical (kept `escapeHtml` strict — no `typeof` guard). Distinct from TECH-03/05/06. PR #1202 supersedes Jules #1183. Done 2026-06-27                                                                                                      | COULD    | `86cadtm4h` |
| **TECH-12** _(new)_ | Trim pre-commit hook latency: lint only the directly-changed project(s) via `nx show projects --files` → `run-many` instead of the full `nx affected` (~40 projects on a `shared/util/formatters` one-liner); gate the PocketBase boot + `pb:export` behind a changed `apps/eco-store/`/`libs/eco-store/` file OR a dirty `pb_schema.json` (schema-only edits then need a manual `pb:export`). Pre-push keeps the full affected lint+test+build gate, so no coverage lost (CI excludes `llecoop-firebase` → don't trim pre-push). Stretch: self-hosted remote cache (powerpack) for cross-branch/CI reuse — Nx Cloud is disabled (401); doesn't fix the cold first-run                         | COULD    | `86caf7c8y` |

### Security

| ID            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Priority   | ClickUp     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| **SEC-01** ✅ | XSS: `escapeHtml` in `SharedUtilFormattersService` (`defaultFormatter` + `booleanWithIconFormatter`) — HIGH                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | **Urgent** | `86ca59u6g` |
| **SEC-02** ✅ | Reverse-tabnabbing: `rel="noopener noreferrer"` on all `target="_blank"` links (workspace-wide) — MEDIUM                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | SHOULD     | `86ca59u43` |
| **SEC-03** ✅ | XSS: `SharedConfirmFeatureComponent` (`shared-confirm-feature.component.ts`) — escape user-controlled `translate` params via `escapeHtml` before `bypassSecurityTrustHtml`; template markup stays trusted — HIGH                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | **Urgent** | `86ca5gpx8` |
| **SEC-04** ✅ | Harden `NotificationUiMatSnackbar` — swap `[innerHTML]="data.message"` for `{{ }}` interpolation, removing the HTML sink. **Defense-in-depth only** (Angular auto-sanitizes plain `[innerHTML]`; render path applies no `translate` pipe, so `message` is _not_ pre-translated; consumers are nasa-images + llecoop, eco-store uses the separate `hot-toast` UI). LOW. Supersedes Jules draft #1161                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | COULD      | `86cac31md` |
| **SEC-05** ✅ | Escape dynamic content before `bypassSecurityTrustHtml` in **llecoop** `order-list` table/dialog configs (`order-list.util.ts` delivery labels, `order-list-feature-list-table` activate/pause/cancel dialogs on `order.name`, the 3 resume/detail `${name}${info}…` configs). Unlike SEC-04, `bypassSecurityTrustHtml` **disables** sanitization → real sink; data is admin-controlled (order/product names) so MEDIUM not HIGH. **Done 2026-06-24** — applied `escapeHtml` (SEC-01) to every dynamic value, null-guarded (`?? ''`, `String()` where `name` is `string \| LocalizedFields`) so escaping can't throw; markup stays trusted. Also hardened **2 sibling order-name `LINK` cells** the enumeration missed (`order-list-user-order-feature-list-table`, `user-order-feature-table`) — same `[innerHTML]` render path. Added an `<img onerror>` escaping spec. Harvest from Jules #1184 (superset; #1181 closed as subset) | SHOULD     | `86cadtkav` |

### Ops / Release

| ID                  | Description                                                                                        | Priority   | ClickUp     |
| ------------------- | -------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| **OPS-01** _(new)_  | Setup production deploy pipeline                                                                   | MUST       | `86c8cjgm0` |
| **OPS-02** ✅       | Grant `pull-requests: write` to `claude-code-review.yml` workflow                                  | **Urgent** | `86c9y6xyb` |
| **META-03** _(new)_ | Fix repo coverage badge update                                                                     | Low        | `86c8tqjma` |
| **META-04** _(new)_ | Add a SKILL to format readme files                                                                 | Low        | `86c8cjgh6` |
| **META-05** ✅      | Phase 1: read-only `/sync-eco-store-tasks` diff command (ClickUp ↔ TASKS.md automation foundation) | Low        | `86c9uwmzf` |

### Research / Marketing (not dev)

| ID                  | Description                                    | Notes                                            |
| ------------------- | ---------------------------------------------- | ------------------------------------------------ |
| **MKT-research-01** | Estudi de cooperatives de consum (competitors) | CU `86c8hb9ef` — discovery, no sprint allocation |

### Multi-tenancy

- Storage keys tenant-scoped: cart uses `${tenant.normalizedName}-cart-v1`
- Tenant resolution at app init via `ecoStoreTenantStore` + `provideAppInitializer`

---

## ❓ Open decisions

| ID               | Question                                                                  | Owner             | Status        |
| ---------------- | ------------------------------------------------------------------------- | ----------------- | ------------- |
| **Q-01**         | Reactions on reviews (VAL-03) in v1?                                      | PO                | Open          |
| **Q-04**         | LLM provider for HLP-01                                                   | PO + Tech Lead    | Open          |
| **Q-05**         | Direct messaging: in-house vs third-party                                 | PO                | Open          |
| **Q-06**         | Tags: fixed list per tenant vs free-form                                  | PO + Superadmin   | In progress   |
| **Q-07**         | SMS provider for NOT-06                                                   | PO                | Open          |
| **Q-08**         | PDF export: client-side or PocketBase hook                                | Tech Lead         | Open          |
| **Q-10**         | Cookie consent: CMP vs in-house                                           | Tech Lead + Legal | Open          |
| **Q-11**         | Featured products: manual / dynamic / both                                | PO                | Open          |
| **Q-13**         | Reviews data model: dedicated collection or JSON on `products`?           | Tech Lead         | Open — VAL-01 |
| **Q-14**         | Wishlist data model: dedicated `wishlists` collection or JSON on `users`? | Tech Lead         | Open — BOT-07 |
| **Q-15** _(new)_ | Clarify scope of CU `86c8cjgj6` "add tags store"                          | PO                | Open          |

---

## 🧭 META — Meta-tasks

### META-01 — Delete obsolete PRD ✅ Done (2026-05-23)

`apps/eco-store/eco-store-req.md` (v1.7 PRD) removed via `git rm`. Authoritative spec is now the external v1.8 PDF only (see CLAUDE.md source-of-truth table). Stale references in `cspell.json`, `.markdownlint-cli2.yaml`, `apps/eco-store/CLAUDE.md`, and `BACKLOG.md` cleaned up.

### META-02 — Remove `NOT_REGISTERED` enum value ✅ Done (2026-05-30)

`users.membershipStatus` now has 4 values (`TRIAL`, `ACTIVE`, `INACTIVE`, `SUSPENDED`), matching `PocketBaseMembershipStatus` and CLAUDE.md. Verified 0 staging users held `NOT_REGISTERED` before removal. Applied on the local PB instance; `pb_schema.json` syncs to staging via `pocketbase-schema.yml` on merge to `develop`. CU `86c9uq8k3`.

### META-03 — Coverage badge fix

ClickUp `86c8tqjma`. Workflow at `.github/workflows/ci.yml` writes to a Gist; badge endpoint not updating. Investigate.

### META-04 — Format readme SKILL

ClickUp `86c8cjgh6`. Internal tooling — add a Claude Code skill at `.claude/skills/format-readme/` for consistent README formatting across libs.

### META-05 — ClickUp ↔ TASKS.md automation (Phase 1 of 4) ✅ Done (2026-05-17)

ClickUp `86c9uwmzf`. Internal tooling — first slice of a multi-phase workflow that keeps `TASKS.md` and ClickUp in sync. Phase 1 is a **read-only** slash command `/sync-eco-store-tasks` that diffs both sides (TASKS.md vs ClickUp list `901521018763`) and outputs a three-section report (only-in-TASKS, only-in-ClickUp, status mismatches). No writes. Validates API token, IDs, and the PRD-ID-as-bridge matching assumption before later phases add hooks/Actions that write.

**Later phases (separate tasks):** Phase 2 = PostToolUse hook on TASKS.md edits creates in ClickUp; Phase 3 = GitHub Action on PR merge sets ClickUp status to done; Phase 4 = local `post-merge` git hook reconciles checkboxes on `git pull`.

---

## 📝 Changelog

| Version | Date       | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.29    | 2026-06-27 | **TECH-11 done** (task 7.32) — `libs/shared/util/objects`: `deepClone` swaps `obj.map()`/`Object.keys().forEach()` for an indexed `for` loop + `for…in` guarded by `hasOwnProperty`, dropping the key-array alloc + per-item closure (and the redundant trailing `typeof === 'object'` guard, unreachable behind the top non-object guard); `escapeHtml` hoists its map+regex to module scope and adds a non-global `RegExp.test()` fast-path returning input unchanged when nothing to escape. Behaviour-identical — deviated from the Jules draft by **not** adding its `typeof text !== 'string'` guard (would swallow non-string as `''`, a behaviour change). Added `deepClone` specs incl. own-vs-inherited keys (41 → 47). PR #1202 supersedes Jules #1183. Closes the round-6 cleanup. CU `86cadtm4h`.                                                                                                                           |
| 0.28    | 2026-06-27 | **TECH-12 filed** (task 7.35) — pre-commit hook latency. New tracked task to (1) lint only directly-changed project(s) at pre-commit instead of the full `nx affected` (~40 projects on a `shared/util/formatters` one-liner) and (2) gate the unconditional PocketBase boot + `pb:export` behind a real eco-store change. Surfaced while shipping TECH-07/A11Y-010/A11Y-011 (a 1-field shared-util change took minutes). Spec adversarially verified: pre-push already runs the full affected lint+test+build gate (so scoping pre-commit loses no coverage), CI excludes `llecoop-firebase` (don't trim pre-push), and the `pb:export` gate needs a `pb_schema.json`-dirty escape hatch since nothing else re-exports. CU `86caf7c8y`.                                                                                                                                                                                                 |
| 0.27    | 2026-06-27 | **Jules draft-PR triage (round 6)** — new batch #1192–#1197 (6 drafts). Verified each against develop, then shipped all 3 genuine clusters: **TECH-07 done** — cached system timezone in `SharedUtilFormattersService` (1-field `#timezone`); the 3 timezone drafts #1192/#1194/#1197 all implemented the already-tracked task, now closed (PR #1198). **A11Y-010 done** (task 7.33) — `input-search` keyboard support (Enter→search, Escape→clear+focus); `keyup` rerouted through `onKeyup()` that skips Enter to avoid a double-fetch the bot draft #1193 missed (both consumers run `noButton`). PR #1199. **A11Y-011 done** (task 7.34) — `matTooltip` on the breadcrumbs + auth-container back buttons; consolidated #1195 (spec) + #1196 (auth container), the superset draft lacking the spec. PR (this branch). CU `86ca8m6aj` / `86caf5zxh` / `86caf5zy4`.                                                                     |
| 0.26    | 2026-06-24 | **A11Y-008 done** (task 7.30) — `SharedAlertUiComponent` (`libs/shared/alert/ui`): imported `MatTooltipModule` + added `[matTooltip]` on the close icon button mirroring its existing `common.close` `aria-label` (sibling to A11Y-004/005/007; the button had the label but no hover hint for sighted mouse/keyboard users). Spec asserts tooltip↔aria-label sync. Bundled a `test` fix: `price-summary` vite coverage `reportsDirectory` pointed at cart's dir, racing eco-store-cart under `--parallel=3 --coverage`. PR #1189; supersedes Jules draft #1182. CU `86cadtkh7`.                                                                                                                                                                                                                                                                                                                                                         |
| 0.25    | 2026-06-24 | **A11Y-009 done** (task 7.31) — `textarea-with-counter` (`libs/shared/form/ui`): `aria-live="polite"` on the character-count hint + a `text-warning` state at ≥90% of `maxLength` before the `text-error` hard limit; both class bindings unified on `props.maxLength` (drops the `ta.maxLength === -1`-when-unset wart). Additive for the shared type's consumers (eco-store + llecoop). Spec asserts aria-live + 90%/100% thresholds (5 tests). Harvest from Jules #1185. CU `86cadtkvb`. _(NB: 0.22 row lives only in BACKLOG.md — TECH-10/BUG-004; TASKS.md table skipped it.)_                                                                                                                                                                                                                                                                                                                                                      |
| 0.24    | 2026-06-24 | **SEC-05 done** — escaped every dynamic value (`escapeHtml`, null-guarded) before `bypassSecurityTrustHtml` across 7 llecoop `order-list` table/dialog configs + `order-list.util.ts`; the bypass disables Angular sanitization and output renders via `[innerHTML]`, so admin-controlled order/product names would otherwise execute (MEDIUM). Extended beyond the enumerated sinks to 2 sibling order-name `LINK` cells (`order-list-user-order-feature-list-table`, `user-order-feature-table`). Added an `<img onerror>` `llecoop-order-list-util` spec. Harvest from Jules #1184 (subset #1181 folded in). CU `86cadtkav`.                                                                                                                                                                                                                                                                                                          |
| 0.23    | 2026-06-24 | Jules draft-PR triage (round 5) — 7 open drafts #1180–#1186. Closed 3: timezone-cache ×2 (#1180/#1186 → already-tracked **TECH-07** `86ca8m6aj`, in progress, verified still inline on develop) + llecoop-XSS subset #1181 (folded into #1184). Filed 4 new tracked tasks, canonical Jules draft kept open as harvest source for each: **SEC-05** llecoop `order-list` `bypassSecurityTrustHtml` escaping (MEDIUM — real sink, admin-controlled data; #1184, `86cadtkav`), **A11Y-008** `SharedAlert` close-button `matTooltip` (#1182, `86cadtkh7`), **A11Y-009** `textarea-with-counter` `aria-live` + 90% warning (#1185, `86cadtkvb`), **TECH-11** `deepClone`/`escapeHtml` perf in `shared/util/objects` — distinct from TECH-03/05/06 (#1183, `86cadtm4h`). All verified against develop before filing.                                                                                                                            |
| 0.21    | 2026-06-21 | **TECH-06 done** — optimized `areObjectEntriesEqual` (`libs/shared/util/objects`): `Object.keys(prev)`+`Object.keys(curr)`+`.every()` → two `for…in` loops guarded by `hasOwnProperty`, dropping the two key-array allocations and the predicate closure per call. Behaviour-preserving (own-enumerable-key semantics, `===` value equality) across all edge cases — reference equality, differing key counts either direction, `undefined` values, inherited enumerable keys. Hot path behind filter/pagination/sort change-detection in the shared PocketBase/Firebase signal stores. TECH-03/05 follow-up. Added specs for the extra-entries and inherited-enumerable cases (39 → 41 tests). Supersedes Jules draft #1129. CU `86ca5gpy1`.                                                                                                                                                                                            |
| 0.20    | 2026-06-21 | **TECH-09 done** (`latinize()` ASCII fast-path early-return; distinct from TECH-04) + **TECH-08 done** (`BytesToSizePipe` perf: cached `LOG1024`, dropped `parseInt(String(…))`, precomputed `POWERS`). Both behaviour-identical. Realigned TASKS.md + BACKLOG.md to a shared version 0.20 (had drifted to 0.19/0.18). CU `86cac31p6` / `86cac31nm`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 0.19    | 2026-06-21 | **SEC-04 done** — swap `NotificationUiMatSnackbar`'s `[innerHTML]="data.message"` → `{{ }}` interpolation, removing the HTML sink (LOW defense-in-depth; Angular auto-sanitizes plain `[innerHTML]`). Corrected the prior rationale: the render path applies **no** `translate` pipe, so `message` is _not_ "pre-translated by `StoreNotificationService`" — its consumers are nasa-images (plain-text errors) + llecoop (translation keys); eco-store uses the separate, already-interpolated `hot-toast` UI and never touched this sink. Spec feeds an `<img onerror>`/`<strong>` payload and asserts inert text. Supersedes Jules draft #1161. CU `86cac31md`.                                                                                                                                                                                                                                                                        |
| 0.18    | 2026-06-21 | **A11Y-007 done** — `input-search` icon-button `matTooltip`s mirroring `aria-label`, repointed `form.search`/`clear` (resolved in no locale) to new `common.form.search`/`clear` keys (ca/es/en), decoupled the Clear button from the search `minLength` gate (1-char terms now clearable), `aria-hidden` on clear icon. Specs assert tooltip↔aria-label sync + Clear enabled at 1 char. Sole consumer is eco-store (main search + orders filter). Built on a verified pre-existing uncommitted draft; supersedes PR #1167. CU `86cac31mt`.                                                                                                                                                                                                                                                                                                                                                                                              |
| 0.17    | 2026-06-21 | Jules draft-PR triage (round 4) — new batch #1155–#1171 (18 drafts). Closed 14 mapped to tracked clusters: timezone ×6 (→ **TECH-07** `86ca8m6aj`), password-toggle ×3 (→ **A11Y-006** `86ca5gpxj`), snackbar dupes ×2 + #1170 rejected (bundled an out-of-scope formatters return-type widening), search dupe ×1, #1165 noise (empty architect-review of #1164). Filed 4 new tracked tasks for genuinely-new untracked work (canonical PR kept open each): **SEC-04** snackbar `[innerHTML]`→`{{ }}` (deferred SEC-03 extra, LOW defense-in-depth — _not_ the "HIGH" Jules claimed; `message` is pre-translated; PR #1161, `86cac31md`), **A11Y-007** search-input tooltips + decoupled clear button (PR #1167, `86cac31mt`), **TECH-08** `BytesToSizePipe` perf (PR #1155, `86cac31nm`), **TECH-09** `latinize()` ASCII fast-path — verified distinct from TECH-04 (PR #1163, `86cac31p6`). Header version synced (was stale at 0.15). |
| 0.16    | 2026-06-14 | Jules draft-PR triage (round 3) — closed the remaining 22 open drafts: 18 in already-tracked clusters (**SEC-03** ×8, **A11Y-006** ×6, **TECH-06** ×4 — incl. their "source" PRs, per updated policy: once a ClickUp task exists, close the whole cluster), #1150 noise (empty review targeting `main`), + 3 timezone dupes. Added **TECH-07** (cache `Intl…timeZone` in `SharedUtilFormattersService`; PR #1147 kept open — genuinely new + untracked). Captured bundled extras into the tasks before closing: SEC-03 ← snackbar `[innerHTML]` (defense-in-depth, Angular auto-sanitizes), TECH-06 ← `deepClone` sparse-array fix + specs. CU `86ca8m6aj`.                                                                                                                                                                                                                                                                              |
| 0.15    | 2026-06-14 | **SEC-03 done** (task 7.20) — escape user-controlled `translate` params via `escapeHtml` (from `@plastik/shared/objects`, SEC-01) before `translate.instant()`/`bypassSecurityTrustHtml` in `SharedConfirmFeatureComponent`; translation template stays trusted so intentional markup still renders. Specs assert an injected `<img onerror>` param is escaped and `<strong>` template markup survives. Supersedes Jules PR #1130. CU `86ca5gpx8`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 0.14    | 2026-06-07 | **A11Y-005 done** — `matTooltip` on the header sidenav toggle + in-sidenav mobile close button (mirroring their `aria-label`), and `aria-label` + tooltip on the tenant logo link (had no accessible name) via existing `common.navigation.backToStore`. Spec asserts tooltip↔aria-label sync. Supersedes Jules PR #1106. CU `86ca59u73`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 0.13    | 2026-06-07 | Triaged remaining open Jules draft PRs → 3 new tasks for work not yet tracked (verified against develop): **SEC-03** (confirm-dialog XSS, PR #1130), **A11Y-006** (password toggle `tabindex="-1"`, PR #1128), **TECH-06** (`areObjectEntriesEqual` perf, PR #1129). #1106 already = A11Y-005; #1100 fully redundant with SEC-01/02 (both shipped on develop). CU `86ca5gpx8/xj/y1`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 0.12    | 2026-06-07 | **A11Y-004 done** — tooltips on eco-store quantity/cart icon buttons + reworded `products.quantity.increment/decrement/remove` (ca/es/en) to a consistent "verb + quantity + product name" form via `{value}` interpolation; specs assert tooltip↔aria-label sync. Supersedes Jules PRs #1113 + #1109. CU `86ca59u4x`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 0.11    | 2026-06-06 | **SEC-01/02 + TECH-04/05 + A11Y-003 done** — XSS escape in formatters (PR #1120), tabnabbing `rel=noopener` workspace-wide (PR #1122), latinize ASCII regex + Cyrillic А/Я casing (PR #1123), util/objects `reduce`→`for…in` follow-up (PR #1125), password-toggle a11y (this branch). CU `86ca59u6g/43/10/6d/4d`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 0.10    | 2026-06-06 | Triaged 18 redundant Jules draft PRs (#1099–#1117) → 7 atomic tasks (each maps to one cluster; valid unmerged work, verified against develop). Added **TECH-04** (latinize), **TECH-05** (object-utils follow-up), **SEC-01/02** (new Security family: XSS + tabnabbing), **A11Y-003/04/05** (password toggle, action tooltips, header). Best source PR per cluster kept open; the rest closed with a pointer comment. CU `86ca59u10/6d/6g/43/4d/4x/73`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 0.9     | 2026-05-31 | **TECH-03 done** — optimized `libs/shared/util/objects` (`isEmpty`, `formatURLQueryParams`, `collectionToArray`) for O(N) perf. Cherry-picked from Jules PR #1095 (superset of #1091, closed as subset). On develop. CU `86ca226tz`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 0.8     | 2026-05-30 | **META-02 done** — removed `NOT_REGISTERED` from `users.membershipStatus` (now 4 values). Verified 0 staging records held it; applied on local PB, `pb_schema.json` syncs to staging via `pocketbase-schema.yml` on merge. CU `86c9uq8k3`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 0.7     | 2026-05-23 | Added **OPS-02** (Urgent, CU `86c9y6xyb`): grant `pull-requests: write` to `.github/workflows/claude-code-review.yml`. Backlog-grooming pass alongside: flipped **TRL-06** and **META-05** to ✅ (ClickUp was source of truth — `/sync-eco-store-tasks` flagged them as status mismatches).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 0.6     | 2026-05-23 | Added TECH-02 (modernize `libs/shared/*` to Angular 21 standards, derived from Jules PRs #1078 + #1073). Fixed stale TECH-01 ClickUp ID (`86c8cjghn` → `86c9uq9rf`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 0.5     | 2026-05-17 | Added META-05 (Phase 1 of ClickUp ↔ TASKS.md automation: read-only `/sync-eco-store-tasks` diff command). CU `86c9uwmzf`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 0.4     | 2026-05-16 | ClickUp audit integrated. Re-added PRV-08/09/04d as in-scope (Carlos confirmed). Added PRV-02c, BUG-002..005, BOT-16, UI-04, SEO-01, PST-04, EST-06, TECH-01, OPS-01, META-03/04, A11Y-002, MKT-research-01. 10 ClickUp subtasks of #21 epic mapped: 6 closed (history) + 4 in-progress + billing. Q-15 added (tags store clarification).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 0.3     | 2026-05-16 | Carlos's corrections: EST-02/03 → Done; BOT-07/08 → Pending; PRV-08/09 marked out of scope (later reversed); META-02 added.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 0.2     | 2026-05-16 | Status reconciled against actual codebase.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 0.1     | 2026-05-16 | Initial draft from PRD v1.8 + memory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

---

## 🔎 Outstanding `// TODO:` items

1. Resolve **Q-13** (reviews data model) before VAL-01
2. Resolve **Q-14** (wishlist data model) before BOT-07
3. Resolve **Q-15** (what is "add tags store" CU `86c8cjgj6`?)
4. Resolve Q-08 (PDF export approach) before EST-04
5. Resolve Q-10 (cookie consent) before LGL-02
6. Decide post-META-01 location for v1.8 PRD (in-repo vs external)
7. Verify BUG-001 cart merge with the 5 manual test cases
