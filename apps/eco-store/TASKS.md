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

**Document version:** 0.10 · **Last updated:** 2026-06-06

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

| ID          | Title                                              | Priority   | Status | ClickUp     | Notes                                                                                        |
| ----------- | -------------------------------------------------- | ---------- | ------ | ----------- | -------------------------------------------------------------------------------------------- |
| **BUG-001** | Cart merge on login (BOT-05) — verification        | MUST       | ❓     | —           | Code complete; run 5 manual tests                                                            |
| **BUG-002** | Deep-link `/cistella/resum` redirects to `/botiga` | MUST       | ✅     | `86c9uq8kb` | Fixed — empty-cart guard no-ops during SSR; deep-links keep cart items                       |
| **BUG-003** | PWA manifest doesn't use tenant name as default    | MUST       | ✅     | `86c9uq8kj` | Fixed — name patch decoupled from logo presence in `PwaManifestService.applyBranding()`      |
| **BUG-004** | Rationalize cart toasts on add/change/remove qty   | SHOULD     | 📋     | `86c9uq92h` | UX polish — debouncing + dedup                                                               |
| **BUG-005** | Profile routes accessible without login            | **Urgent** | ✅     | `86c9uq8jq` | Shared `ecoStoreAuthGuard` on `/perfil` (also reused for `/comandes`); preserves `returnUrl` |

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
- **A11Y-003** _(new)_ — Password visibility toggle: tooltip + `aria-pressed` fix + label i18n [SHOULD · 📋 · ClickUp `86ca59u4d`]
- **A11Y-004** _(new)_ — Tooltips on eco-store quantity/cart icon buttons [SHOULD · 📋 · ClickUp `86ca59u4x`]
- **A11Y-005** _(new)_ — Header sidenav + tenant-link tooltips/aria-label [SHOULD · 📋 · ClickUp `86ca59u73`]
- Pa11y CI: `yarn eco-store:a11y`

### i18n

- `LOCALE_ID` hardcoded to `'ca'` — register `localeEs` / `localeEn` if formatting in those needed
- **I18N-001** [📋]: hardcoded string audit; `yarn i18n:validate`

### Tech debt

| ID                  | Description                                                                                                         | Priority | ClickUp     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| **TECH-01** _(new)_ | Shared util to get string from `string \| LocalizedField`                                                           | SHOULD   | `86c9uq9rf` |
| **TECH-02** ✅      | Modernize `libs/shared/*` to Angular 21 (already on develop; residual cleanup landed)                               | SHOULD   | `86c9y6upw` |
| **TECH-03** ✅      | Optimize `libs/shared/util/objects` (O(N²)→O(N) `reduce`, drop O(N) alloc in `isEmpty`, native `Object.values()`)   | SHOULD   | `86ca226tz` |
| **TECH-04** ✅      | Optimize `libs/shared/util/latinize`: ASCII-only regex (`/[^\x00-\x7F]/g`) + fix Cyrillic `А` casing bug + add spec | SHOULD   | `86ca59u10` |
| **TECH-05** _(new)_ | TECH-03 follow-up: convert remaining `libs/shared/util/objects` `reduce` fns to `for…in`                            | COULD    | `86ca59u6d` |

### Security

| ID            | Description                                                                                                 | Priority   | ClickUp     |
| ------------- | ----------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| **SEC-01** ✅ | XSS: `escapeHtml` in `SharedUtilFormattersService` (`defaultFormatter` + `booleanWithIconFormatter`) — HIGH | **Urgent** | `86ca59u6g` |
| **SEC-02** ✅ | Reverse-tabnabbing: `rel="noopener noreferrer"` on all `target="_blank"` links (workspace-wide) — MEDIUM    | SHOULD     | `86ca59u43` |

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

| Version | Date       | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.10    | 2026-06-06 | Triaged 18 redundant Jules draft PRs (#1099–#1117) → 7 atomic tasks (each maps to one cluster; valid unmerged work, verified against develop). Added **TECH-04** (latinize), **TECH-05** (object-utils follow-up), **SEC-01/02** (new Security family: XSS + tabnabbing), **A11Y-003/04/05** (password toggle, action tooltips, header). Best source PR per cluster kept open; the rest closed with a pointer comment. CU `86ca59u10/6d/6g/43/4d/4x/73`. |
| 0.9     | 2026-05-31 | **TECH-03 done** — optimized `libs/shared/util/objects` (`isEmpty`, `formatURLQueryParams`, `collectionToArray`) for O(N) perf. Cherry-picked from Jules PR #1095 (superset of #1091, closed as subset). On develop. CU `86ca226tz`.                                                                                                                                                                                                                     |
| 0.8     | 2026-05-30 | **META-02 done** — removed `NOT_REGISTERED` from `users.membershipStatus` (now 4 values). Verified 0 staging records held it; applied on local PB, `pb_schema.json` syncs to staging via `pocketbase-schema.yml` on merge. CU `86c9uq8k3`.                                                                                                                                                                                                               |
| 0.7     | 2026-05-23 | Added **OPS-02** (Urgent, CU `86c9y6xyb`): grant `pull-requests: write` to `.github/workflows/claude-code-review.yml`. Backlog-grooming pass alongside: flipped **TRL-06** and **META-05** to ✅ (ClickUp was source of truth — `/sync-eco-store-tasks` flagged them as status mismatches).                                                                                                                                                              |
| 0.6     | 2026-05-23 | Added TECH-02 (modernize `libs/shared/*` to Angular 21 standards, derived from Jules PRs #1078 + #1073). Fixed stale TECH-01 ClickUp ID (`86c8cjghn` → `86c9uq9rf`).                                                                                                                                                                                                                                                                                     |
| 0.5     | 2026-05-17 | Added META-05 (Phase 1 of ClickUp ↔ TASKS.md automation: read-only `/sync-eco-store-tasks` diff command). CU `86c9uwmzf`.                                                                                                                                                                                                                                                                                                                                |
| 0.4     | 2026-05-16 | ClickUp audit integrated. Re-added PRV-08/09/04d as in-scope (Carlos confirmed). Added PRV-02c, BUG-002..005, BOT-16, UI-04, SEO-01, PST-04, EST-06, TECH-01, OPS-01, META-03/04, A11Y-002, MKT-research-01. 10 ClickUp subtasks of #21 epic mapped: 6 closed (history) + 4 in-progress + billing. Q-15 added (tags store clarification).                                                                                                                |
| 0.3     | 2026-05-16 | Carlos's corrections: EST-02/03 → Done; BOT-07/08 → Pending; PRV-08/09 marked out of scope (later reversed); META-02 added.                                                                                                                                                                                                                                                                                                                              |
| 0.2     | 2026-05-16 | Status reconciled against actual codebase.                                                                                                                                                                                                                                                                                                                                                                                                               |
| 0.1     | 2026-05-16 | Initial draft from PRD v1.8 + memory.                                                                                                                                                                                                                                                                                                                                                                                                                    |

---

## 🔎 Outstanding `// TODO:` items

1. Resolve **Q-13** (reviews data model) before VAL-01
2. Resolve **Q-14** (wishlist data model) before BOT-07
3. Resolve **Q-15** (what is "add tags store" CU `86c8cjgj6`?)
4. Resolve Q-08 (PDF export approach) before EST-04
5. Resolve Q-10 (cookie consent) before LGL-02
6. Decide post-META-01 location for v1.8 PRD (in-repo vs external)
7. Verify BUG-001 cart merge with the 5 manual test cases
