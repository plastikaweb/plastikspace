# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2026-07-21] - Eco Store: PRV-04b/04d — address form constraints vs. schema

### Fixed

- **`apps/eco-store/pocketbase` (`user_addresses` + `user_fiscal_profiles`), `libs/eco-store/profile/{addresses,fiscal-data}`**: the `city` field rejected real Catalan municipalities. Both collections required a minimum of 5 characters, which excludes Vic, Olot, Reus, Salt, Sort, Alp and Bot — and Ea (Bizkaia, 2 characters) is Spain's shortest. The minimum is now 2 on both the schema and both forms, verified against the running API (Vic accepted, a single character still rejected). The address book's form was additionally **out of sync with its own schema in both directions**: it declared `minLength: 2, maxLength: 25` against a schema of `min: 5, max: 50`, so a member in Vic passed client validation and then hit a raw API error, while a real municipality name longer than 25 characters (Santa Margarida i els Monjos, 28) could not be typed at all. Client and schema now agree at 2/50. Separately, `user_addresses.address` capped input at 50 characters against an unbounded schema; because Formly binds `maxLength` to the native attribute, a full address with floor, door and stairwell ("Carrer de la Mare de Déu del Coll, 74, 3r 2a, escala B", 54 characters) was **silently truncated as the member typed**, with no error shown, and the courier received the shortened value. Raised to 100. Surfaced by a form-vs-schema constraint audit across all nine PocketBase-backed eco-store forms; two further confirmed findings (the `phone` validator rejecting `+34600123456` and spaced formats, and password inputs silently truncating pastes past 25 characters) are recorded in `apps/eco-store/TASKS.md` and still need their own tickets (PRV-04b/PRV-04d, [#86c99dev0](https://app.clickup.com/t/86c99dev0)).

## [2026-07-20] - Eco Store: PRV-04d — fiscal profile (Dades fiscals)

### Added

- **`apps/eco-store/pocketbase` (`user_fiscal_profiles` + `tenants.fiscalDataEnabled`), `libs/core/entities`, `libs/shared/pocketbase-user-fiscal-profiles`, `libs/shared/auth/pocketbase/data-access`, `libs/eco-store/profile/{fiscal-data,feature}`, `libs/shared/form/util`**: members can capture a fiscal identity for future invoicing, following the target design from the 2026-07-18 redesign (PRV-04d, see the `[2026-07-18]` entry below). New `user_fiscal_profiles` collection (`user` relation with a **unique** index, `fiscalName`, `nif`, `address`, `city`, `zip`) holds the identity as one unit and enforces cardinality **0..1** per member — a deliberate departure from the earlier per-address typology. A new PocketBase hook, `validate_fiscal_profile.pb.js`, is the actual control: it normalizes and re-validates the NIF/NIE/CIF checksum server-side on every create/update and rejects a bad value with a 400, so the client-side `nifValidator` (retained from the redesign, now `DNI/NIE/CIF` with checksum across 18 tests) is UX only, never the source of truth. The feature is opt-in and gated behind a new `tenants.fiscalDataEnabled` flag: profile gets a separate "Dades fiscals" section (`libs/eco-store/profile/fiscal-data`, sidenav entry + `receipt_long` icon) mounted at `/perfil/dades-fiscals` behind a `canMatch` tenant guard (`ecoStoreFiscalDataCanMatchGuard`) that redirects to `dades-personals` when the flag is off — a member whose tenant doesn't request fiscal data sees zero added fields. `pocketBaseUserProfileStore` gains `getFiscalProfile()`/`saveFiscalProfile()`, create-or-update by presence of an existing record, with success/error toasts. ca/es/en i18n throughout. **Deferred to the invoicing work**: `orders.billing` (fiscal-tuple snapshot written at invoice issuance) and checkout's "necessito factura" toggle — a member cannot yet attach fiscal data to an order. Known follow-up recorded in `apps/eco-store/TASKS.md` (no BUG ticket filed — ClickUp unauthorized this session): the `x-bypass-hooks` test-harness header is inert in the pre-existing `normalize_user_name.pb.js` and `on_create_order.pb.js` hooks — both read the non-existent `e.httpContext`. Simply correcting the path to `e.requestEvent.request` (the field the new hook reads) is **not** the fix: `on_create_order.pb.js` recomputes `subtotal`/`tax`/`shipping`/`total` from database prices as checkout's anti-price-tampering control, and its bypass check has no auth gate, so a header-only correction would let any authenticated customer send `x-bypass-hooks: true` to skip total recomputation and set their own order total. The fix must additionally gate the bypass on superuser authentication — `e.requestEvent.hasSuperuserAuth()`, confirmed working on PocketBase 0.36.7 and adopted by `validate_fiscal_profile.pb.js` itself — which the seed/staging scripts (`seed-local.js`, `seed.ts`, `push-to-staging.ts`) already satisfy since they authenticate as superuser before sending the header (PRV-04d, [#86c99dev0](https://app.clickup.com/t/86c99dev0)).

## [2026-07-18] - Eco Store: PRV-04d — fiscal identity model redesigned

### Changed

- **`libs/core/entities`, `libs/eco-store/profile/addresses`, `libs/shared/address-card/ui`, `libs/shared/auth/pocketbase/data-access`, `apps/eco-store/pocketbase`**: the billing-address typology shipped on this branch (`addressType: SHIPPING | BILLING | BOTH` on `user_addresses`, plus a per-address `nif` and an independent `defaultBilling` flag with its own hook constraint) was rejected on review and reverted. It conflated a role an address plays **in a transaction** with an intrinsic property of the address — `orders.address` already proves the role is decided per order at checkout — and it bound the tax ID to the address rather than the person, duplicating it across every billing-flagged row with no source of truth (a BCNF/3NF violation whose update, insertion and deletion anomalies were all reachable). It also could not produce a valid invoice: the field copy offered "DNI, NIE o CIF" while the schema had nowhere to store a razón social, and a full Spanish invoice needs the recipient's name, NIF **and** domicilio as one unit. `BOTH` was an unsound discriminator — one enum value denoting the union of the other two, so no consumer could switch on it, and the repo already carried three different encodings of that union across four call sites. The address book is restored to plain delivery locations with a single `default`, which additionally fixed a user-visible regression in the purchase flow: tenant pickup points share the `UserContact` type but were never migrated, so the address card rendered the literal untranslated string `address.card.type.undefined` at checkout, and their default-ordering sort had silently become a no-op after the `default` → `defaultShipping` rename was applied to only one of the two collections. `pickDefaultShippingAddress` no longer filters by type (which could leave the checkout selector silently empty for a member whose addresses were all billing-typed) and now also resolves on initial form load, guarded so it never overwrites an address the member already chose. The `chip-selector` lib was removed as dead code; `nifValidator` (DNI/NIE/CIF with checksum, 13 tests) is retained for the fiscal profile form. The target design — a `user_fiscal_profiles` collection (0..1 via a unique FK, opened to 0..N by dropping the index if a tenant ever serves legal entities) plus an `orders.billing` snapshot written at invoice issuance — is specified in `apps/eco-store/TASKS.md` and deferred until invoicing actually exists (PRV-04d, [#86c99dev0](https://app.clickup.com/t/86c99dev0)).

## [2026-07-05] - Eco Store: PRV-02c — in-session password change

### Added

- **`libs/eco-store/profile/access-security` + `libs/shared/auth/pocketbase/data-access`**: members can change their password from the "Accés i seguretat" profile section without leaving the session. A new "Contrasenya" subsection hosts a 3-field form (current / new / confirm) using the shared `password-with-visibility` Formly type; the new-password field enforces the shared strength validator (min 8, lower/upper/digit) and the group reuses the shared `passwordMatch` validator — the form keys are deliberately `newPassword`/`confirmPassword` because that validator destructures exactly those keys. Submitting PATCHes the user with `oldPassword`/`password`/`passwordConfirm` (PocketBase validates the current password server-side) and then **re-authenticates silently with the new password**, since the password change rotates the user's `tokenKey` and would otherwise kill the session; per spec the session stays alive and a success toast confirms. A wrong current password (PocketBase 400 with a `data.oldPassword` entry) surfaces its own error toast. Adds `changePassword` to `PocketBaseAuthService` and `pocketBaseUserProfileStore` plus the `ChangePasswordData` type, and ca/es/en i18n. UX per review feedback: both access-security forms are constrained to `max-w-[650px]`; on success each form resets to its pristine initial state (values cleared, no validation errors — `SharedFormFeatureComponent`'s `resetForm` input now takes a counter and forces a full reset through `FormGroupDirective.resetForm()`, which also clears the Material error-state `submitted` flag), and a failed password change re-focuses the current-password field (stable `#password-change-current` id). Found and filed separately: the shared `passwordMatch` validator is inert on the PRV-03 reset-password form (key mismatch `password` vs `newPassword`) — tracked as BUG-007 ([#86cajvh93](https://app.clickup.com/t/86cajvh93)) (PRV-02c, [#86c9uq8n9](https://app.clickup.com/t/86c9uq8n9)).

## [2026-07-04] - Llecoop: SEC-06 — Escape dynamic values in list-facade `.confirm()` messages

### Fixed

- **`libs/llecoop` list facades (category / product / user / order-list ×3 + `user-feature-table.config`)**: the delete/SET*ADMIN confirmation dialogs interpolated record data straight into the **message** string passed to `SharedConfirmDialogService.confirm(...)`; `SharedConfirmFeatureComponent` runs that message through `translate.instant()` and then `bypassSecurityTrustHtml(...)` into `[innerHTML]`, so any markup in the data would execute. SEC-03 escaped only the translate \_params*, never the message itself. Severity **HIGH**: the user-delete dialog interpolates `item.email` and the SET_ADMIN dialog `user.name || user.email` — a registered user controls their own email/name, so a crafted value would execute in the **admin's session**. Each interpolated value is now HTML-escaped with `escapeHtml` (from `@plastik/shared/objects`, SEC-01) at all 7 call sites — category/product/order-list `item.name`, user `item.email`, SET_ADMIN `user.name || user.email` — with `String(...)` coercion where `name` is typed `string | LocalizedFields` (matching the prior template-literal coercion). Escaping is at the call sites, not centrally in the dialog component, because the message parameter intentionally accepts trusted HTML (e.g. the "Iniciar nova comanda" dialog). Added 7 facade/config specs asserting an injected `<img onerror>` payload arrives escaped (`&lt;img`), that a declined dialog triggers no store call, and that the store `delete`/`setAdmin` fires only after confirmation. An adversarial review sweep confirmed no other unescaped `.confirm()` message remains; residual `unit.base` pipe sinks are tracked as SEC-08 and a pre-existing `translate.instant()` TypeError on `SafeHtml` messages is folded into SEC-07. Harvest from Jules draft [#1207](https://github.com/plastikaweb/plastikspace/pull/1207) (dupes #1204/#1209 closed) (SEC-06, [#86cajqprd](https://app.clickup.com/t/86cajqprd)).

## [2026-06-28] - Eco Store: PRV-02b — email change with async verification

### Fixed

- **`apps/eco-store` notifications**: every hot-toast in eco-store had been invisible since the hot-toast migration — the v6 container mounts as a native `popover="manual"` element (hidden by the browser until `showPopover()` runs) and its single `afterNextRender` show call never landed under zoneless change detection. Disabled the popover mode (`usePopover: false`) so the container uses the classic fixed overlay (BUG-006, PRV-02b, [#86c9uq8mt](https://app.clickup.com/t/86c9uq8mt)).

### Added

- **`libs/eco-store/profile/access-security` + `libs/eco-store/auth/feature/confirm-email-change` + `libs/shared/auth/pocketbase/data-access`**: members can change their account email via PocketBase's native, verified flow. A new "Accés i seguretat" profile section (`/perfil/access-i-seguretat`) hosts an inline request form (new email, submit blocked when it equals the current address); submitting triggers PocketBase's `requestEmailChange` and a success toast — the account is unchanged until confirmed. PocketBase emails the **new** address a link to a new public page `/confirmar-correu?token=…` (reachable logged in or out — the link is usually opened from a still-authenticated browser) which asks for the **current password**, calls `confirmEmailChange(token, password)`, and on success logs out and forces re-login at `/accedir`. Adds `requestEmailChange`/`confirmEmailChange` to `PocketBaseAuthService` and `pocketBaseUserProfileStore` (plus the `ConfirmEmailChangeData` type), rewires the sidenav link `seguretat → access-i-seguretat`, and adds ca/es/en i18n. The confirmation email is built by a new PocketBase hook `on_email_change.pb.js` (branded, per-tenant link to `/confirmar-correu`, localized through a new optional `users.language` field the app syncs with the `eco-lang` preference on login and on language switch — which also localizes the password-reset email); both auth mail hooks now sign with the tenant name, form validation messages go through the registered Formly translate extensions, and a duplicate/invalid new email (PocketBase 400) surfaces its own error toast (PRV-02b, [#86c9uq8mt](https://app.clickup.com/t/86c9uq8mt)).

## [2026-06-27] - Shared: TECH-11 — optimize `deepClone` + `escapeHtml` in `util-objects`

### Changed

- **`libs/shared/util/objects` (`deepClone`, `escapeHtml`)**: two behaviour-preserving micro-optimizations (distinct from TECH-03/05/06). `deepClone` now clones arrays with a manual indexed `for` loop (`new Array(len)`) and objects with a `for…in` loop guarded by `hasOwnProperty`, instead of `obj.map()` / `Object.keys().forEach()` — dropping the intermediate key-array allocation and the per-item closure on a hot path; the redundant trailing `typeof === 'object'` guard was removed since the top `obj === null || typeof obj !== 'object'` guard already returns every non-object. `escapeHtml` hoists its character map and regex to module scope and adds a `RegExp.test()` fast-path that returns the input unchanged when there is nothing to escape (the common case), using a **non-global** regex for `.test()` (avoids the stateful-`lastIndex` pitfall) and the global one only for `.replace()`. Own-enumerable-key semantics and the escaped output are unchanged. _(Deviations from the Jules draft: kept `escapeHtml` strictly behaviour-identical by **not** adding a `typeof text !== 'string'` guard that would have swallowed non-string input as `''`; the array `for` loop densifies sparse-array holes, harmless for this app's JSON-shaped data.)_ Added `deepClone` specs incl. an own-vs-inherited-keys guard (41 → 47 tests). Supersedes Jules draft [#1183](https://github.com/plastikaweb/plastikspace/pull/1183) (TECH-11, [#86cadtm4h](https://app.clickup.com/t/86cadtm4h)).

## [2026-06-27] - Eco Store: A11Y-011 — tooltips on icon-only back buttons

### Added

- **`libs/eco-store/shared/breadcrumbs` + `libs/eco-store/auth/feature/container`**: the two remaining icon-only "back" buttons carried an `aria-label` but no `matTooltip`, so sighted mouse/keyboard users got no hover/focus hint — inconsistent with the icon-only buttons hardened in A11Y-004/005/007/008. Imported `MatTooltipModule` in both components and added a `[matTooltip]` mirroring each button's existing `aria-label` (`backAriaLabel()` for breadcrumbs, `auth.common.back` for the auth container's PWA-standalone back button). Specs assert the tooltip stays in sync with the `aria-label` (the auth-container test drives the PWA-standalone branch via a signal-backed `isStandalone` mock). Consolidates Jules drafts [#1195](https://github.com/plastikaweb/plastikspace/pull/1195) (breadcrumbs + spec) and [#1196](https://github.com/plastikaweb/plastikspace/pull/1196) (breadcrumbs + auth container) (A11Y-011, [#86caf5zy4](https://app.clickup.com/t/86caf5zy4)).

## [2026-06-27] - Shared: A11Y-010 — search input keyboard support

### Added

- **`libs/shared/form/ui/input-search` (`InputSearchTypeComponent`)**: keyboard operability for the shared Formly search type (WCAG 2.1.1). **Enter** now triggers a full search via `(keydown.enter)`, and **Escape** clears the field (when `resetSearch` is enabled) and restores focus to the input via a `viewChild` ref so the user can re-type immediately. The existing `keyup` handler was moved into an `onKeyup()` method that **skips Enter** — Enter is owned solely by `(keydown.enter)` — so a single Enter keypress can no longer fire two searches (the live consumers, eco-store's main + orders-filter search, both run `noButton: true`, where `keyup` already triggered a search; the naive addition would have doubled every fetch). Typing behaviour for all other keys is unchanged. Specs assert Enter→search, Escape→reset+focus, and single-fire on Enter in `noButton` mode (14 tests). Harvest from Jules draft [#1193](https://github.com/plastikaweb/plastikspace/pull/1193) (A11Y-010, [#86caf5zxh](https://app.clickup.com/t/86caf5zxh)).

## [2026-06-27] - Shared: TECH-07 — cache system timezone in `SharedUtilFormattersService`

### Changed

- **`libs/shared/util/formatters` (`SharedUtilFormattersService`)**: the three date formatters (`dateFormatter`, `dateTimeFormatter`, `firebaseTimestampFormatter`) each recomputed `Intl.DateTimeFormat().resolvedOptions().timeZone` inline on every call — an allocation-heavy `Intl.DateTimeFormat` construction repeated under table rendering and change detection. The resolved system timezone is now computed once into a `readonly #timezone` field and reused as the default in all three formatters. Behaviour-identical: per-call `extras()` overrides still take precedence over the cached default, and the resolved zone is stable for a session. Supersedes Jules drafts [#1192](https://github.com/plastikaweb/plastikspace/pull/1192) / [#1194](https://github.com/plastikaweb/plastikspace/pull/1194) / [#1197](https://github.com/plastikaweb/plastikspace/pull/1197) (TECH-07, [#86ca8m6aj](https://app.clickup.com/t/86ca8m6aj)).

## [2026-06-24] - Shared: A11Y-008 — `SharedAlert` close button tooltip

### Fixed

- **`libs/shared/alert/ui` (`SharedAlertUiComponent`)**: The alert close icon button carried an `[attr.aria-label]="'common.close' | translate"` but no `matTooltip`, so sighted mouse/keyboard users got no hover/focus affordance — inconsistent with the icon-only buttons hardened in A11Y-004/005/007. Imported `MatTooltipModule` and added a `[matTooltip]` mirroring the existing `common.close` `aria-label`. Added a spec asserting the tooltip stays in sync with the `aria-label`. Harvest from Jules draft [#1182](https://github.com/plastikaweb/plastikspace/pull/1182) (A11Y-008, [#86cadtkh7](https://app.clickup.com/t/86cadtkh7)).

## [2026-06-24] - Shared: A11Y-009 — `textarea-with-counter` aria-live counter + pre-limit warning

### Changed

- **`libs/shared/form/ui/textarea-with-counter`**: the character-count `mat-hint` now carries `aria-live="polite"` so screen-reader users hear the count update as they type, and a `text-warning` state kicks in at ≥90% of `maxLength` to give early feedback before the existing `text-error` hard limit. Both class bindings were unified on `props.maxLength` (replacing the mixed `ta.maxLength`/`props.maxLength` sources, which also drops the `ta.maxLength === -1`-when-unset edge case where the error class stuck on). Behaviour is additive for the shared type's consumers (eco-store + llecoop). Spec asserts the aria-live attribute plus the 90% / 100% thresholds (5 tests). Harvested from Jules draft #1185. (A11Y-009, [#86cadtkvb](https://app.clickup.com/t/86cadtkvb))

## [2026-06-24] - Llecoop: SEC-05 — Escape dynamic content before `bypassSecurityTrustHtml` in order-list tables

### Fixed

- **`libs/llecoop/order-list` (table/dialog configs + `UserOrderUtilsService`)**: Several order-list table and confirmation-dialog configs interpolated dynamic record data (order/product `name`, product `info`/`provider`/`origin`, delivery labels) straight into HTML strings passed to `DomSanitizer.bypassSecurityTrustHtml(...)` — which **disables** Angular sanitization — then rendered them via `[innerHTML]` (directly, or through the table's `safeFormatted` pipe for `LINK` cells), so any markup in that data would execute. Each dynamic value is now HTML-escaped with `escapeHtml` (from `@plastik/shared/objects`, SEC-01) before concatenation, while the intended `<p>`/`<li>`/class markup stays trusted. Severity **MEDIUM**, not HIGH: the data is cooperative-admin-controlled (order/product names), not anonymous user input. Hardened sinks: `order-list.util.ts` delivery labels; the activate/pause/cancel `order.name` dialogs and the order-name `LINK` cell in `order-list-feature-list-table.config.ts`; the `${name}${info}…` cells in the user-order resume/detail/feature-resume configs; and — beyond the originally-enumerated set — the two sibling order-name `LINK` cells in `order-list-user-order-feature-list-table.config.ts` and `user-order-feature-table.config.ts` (same `[innerHTML]` render path). Every call is null-guarded (`?? ''`, plus `String(…)` where `name` is typed `string | LocalizedFields`) so escaping an absent/object value cannot throw — matching the prior crash-free template-literal coercion. Added a `llecoop-order-list-util` spec asserting an injected `<img onerror>` label is escaped (the leading `<` is encoded, so it cannot execute). Supersedes Jules draft PR [#1184](https://github.com/plastikaweb/plastikspace/pull/1184) (subset dupe #1181 folded in) (SEC-05, [#86cadtkav](https://app.clickup.com/t/86cadtkav)).

## [2026-06-24] - Eco Store: BUG-004 — Rationalize cart add/change/remove toasts

### Fixed

- **`libs/eco-store/cart/data-access` (`ecoStoreCartStore`)**: cart quantity changes stacked duplicate toasts for the same product (e.g. two "… - actualitzat"). Replaced the per-store 600ms debounce with the centralized notification `groupKey` mechanism from TECH-10: add/update/remove for a product all share `cart:<id>`, so rapid +/- collapse to a single toast reflecting the latest state, a removal replaces a pending add/update, and a first add reads "added" while a later quantity change reads "updated". Added the `cart.productUpdated` i18n key (ca/es/en). Ships coupled with TECH-10 (the `create()` signature reorder the cart consumes). (BUG-004, [#86c9uq92h](https://app.clickup.com/t/86c9uq92h))

## [2026-06-24] - Shared: TECH-10 — Centralize notification dedup, max-concurrent & per-app config

### Added

- **`libs/shared/notification/entities` (`provideNotificationConfig`, `NOTIFICATION_MAX_CONCURRENT`)**: A single, UI-agnostic place to configure notification behaviour — per-type duration (existing `NOTIFICATION_TYPES_CONFIG`), screen position, and the new max-concurrent cap — honoured by both the hot-toast and mat-snackbar UIs. Apps call `provideNotificationConfig({ maxConcurrent })` once; `eco-store` pairs it with `provideHotToastConfig({ visibleToasts: 3, stacking: 'vertical' })` (multi-toast), while `llecoop` + `nasa-images` use `{ maxConcurrent: 1 }` so their single mat-snackbar UI always shows the latest notification instead of being stuck on the oldest `[0]`.

### Changed

- **`libs/shared/notification` (store + service + hot-toast UI)**: `notificationStore.show()` now de-duplicates by a caller-supplied `groupKey`, caps the retained array at `maxConcurrent` (dropping the oldest), and moves an updated group's toast to the top of the stack — refreshing it in place only when it is already the newest **and** keeps the same type (so a SUCCESS → ERROR change for one `groupKey` restacks with correct styling rather than silently swapping text under stale colours). `StoreNotificationService.create()` gains an `options` argument (`{ groupKey, preserve, duration }`) placed **before** the rarely-used `parameters`, so the common call sites no longer pass `undefined`. The hot-toast component now owns its `HotToastRef`, refreshes it in place, and keys the library off the stable store `id` (the previous `name` keying was always empty, so the library's same-id replacement never fired). Generic PocketBase/Firebase CRUD (`${featureName}:<op>`) and the llecoop `order-list-store` (`order-status:<id>`) adopt `groupKey`s so repeated/optimistic notifications collapse to one. Removed the dead `Notification.name`/`code` fields. (TECH-10, [#86cadqxva](https://app.clickup.com/t/86cadqxva))

### Fixed

- **`libs/shared/notification` (array leak)**: the eco-store hot-toast host never removed notifications from the store on auto-dismiss, so the `configuration` array grew unbounded. The toast component now wires the library's close callback back through its `sendDismiss` output to `notificationStore.dismiss(id)`, keeping the array bounded. (TECH-10, [#86cadqxva](https://app.clickup.com/t/86cadqxva))

## [2026-06-21] - Shared: TECH-06 — Optimize `areObjectEntriesEqual` (`libs/shared/util/objects`)

### Changed

- **`libs/shared/util/objects` (`areObjectEntriesEqual`)**: Replaced the `Object.keys(prev)` + `Object.keys(curr)` + `.every()` comparison with two `for...in` loops guarded by `hasOwnProperty`, eliminating the two intermediate key-array allocations (and the predicate closure) per call while preserving exact own-enumerable-key semantics and `===` value equality. This is a hot path — it backs filter/pagination/sort change-detection in the shared PocketBase and Firebase signal stores. Behaviour is unchanged across all edge cases (reference equality, differing key counts in either direction, `undefined` values, inherited enumerable keys). Follow-up to TECH-03/05. Added specs for the first-object-has-extra-entries and inherited-enumerable-property cases; the existing tests stay green (39 → 41). Supersedes Jules draft #1129 (TECH-06, [#86ca5gpy1](https://app.clickup.com/t/86ca5gpy1)).

## [2026-06-21] - Shared: TECH-09 — `latinize()` ASCII fast-path

### Changed

- **`libs/shared/util/latinize` (`latinize()`)**: Added an early return for pure-ASCII input — `if (!/[^\x00-\x7F]/.test(str)) return str;` — so strings with nothing to transliterate skip the `String.prototype.replace()` call and its per-character map lookups entirely. Behaviour-identical: a pure-ASCII string already passed through `replace()` unchanged, and any string containing a non-ASCII char still falls through to the original transliteration path. This is a **distinct** optimization from TECH-04 (which narrowed the replace regex to ASCII-only); it targets the common case in this codebase where most slugs/keys are already ASCII. Added a spec asserting the fast-path covers the full `\x00-\x7F` range (control + punctuation). Supersedes Jules draft PR [#1163](https://github.com/plastikaweb/plastikspace/pull/1163) (TECH-09, [#86cac31p6](https://app.clickup.com/t/86cac31p6)).

## [2026-06-21] - Shared: TECH-08 — `BytesToSizePipe` micro-optimization

### Changed

- **`libs/shared/util/bytes-to-size` (`BytesToSizePipe`)**: Removed two per-call inefficiencies on a pipe that re-evaluates during change detection. The size exponent was computed as `parseInt(String(Math.floor(Math.log(value) / Math.log(1024))), 10)` — a redundant number→string→number round-trip — now just `Math.floor(Math.log(value) / LOG1024)`; `Math.log(1024)` is hoisted to a module constant `LOG1024` instead of being recomputed every call; and the divisor uses a precomputed `POWERS` table for the Bytes…TB tiers (`POWERS[size] ?? 1024 ** size`, the fallback preserving the original `1024 ** size` for larger inputs). Behaviour-identical — output strings are byte-for-byte unchanged (specs cover 0/Bytes/KB/MB/GB/TB + fixed precision). Sibling to TECH-03→07; supersedes Jules draft PR [#1155](https://github.com/plastikaweb/plastikspace/pull/1155) (TECH-08, [#86cac31nm](https://app.clickup.com/t/86cac31nm)).

## [2026-06-21] - Shared: SEC-04 — Snackbar message: remove `[innerHTML]` sink in favour of interpolation

### Fixed

- **`libs/shared/notification/ui/mat-snackbar` (`NotificationUiMatSnackbarComponent`)**: The notification message was rendered with `[innerHTML]="data.message"`, parsing the string as live HTML. Swapped to `{{ data.message }}` interpolation, removing the HTML sink entirely. This is **defense-in-depth** (LOW, not the "HIGH" the originating Jules draft claimed): Angular already auto-sanitizes plain `[innerHTML]`, and no message source reaching this component carries markup, so the change is behaviour-neutral — the mat-snackbar render path applies **no** `translate` pipe (correcting the backlog note that `message` is "pre-translated by `StoreNotificationService`": it is not). Its consumers are `nasa-images` (plain-text errors) and `llecoop` (translation keys); `eco-store` uses the separate, already-interpolated `hot-toast` UI, so it never touched this sink. Added a spec feeding an `<img onerror>`/`<strong>` payload and asserting it renders as inert text with no `img`/`strong` nodes materialised. Completes the deferred "optional extra" of SEC-03; supersedes Jules draft PR [#1161](https://github.com/plastikaweb/plastikspace/pull/1161) (SEC-04, [#86cac31md](https://app.clickup.com/t/86cac31md)).

## [2026-06-21] - Shared: A11Y-007 — Search input: action-button tooltips + decoupled clear button

### Fixed

- **`libs/shared/form/ui/input-search` (`InputSearchTypeComponent`)**: The search and clear icon-only buttons had no `matTooltip` (sighted users got no hover/focus affordance) and referenced `form.search`/`form.clear` translation keys that exist in no locale, so their `aria-label`s rendered the raw key. Worse, the clear button shared the search button's `isDisabled()` gate, so a below-`minLength` term (e.g. a single character) left the clear button **disabled — the user could not clear what they had typed**. Fixed: added a `matTooltip` mirroring each button's `aria-label`, repointed both to the existing `common.form.search`/`common.form.clear` keys (added to ca/es/en, matching the A11Y-003 `common.form.*` convention), decoupled the clear button's disabled state from the search `minLength` gate (now disabled only when the field is genuinely `INVALID` and not `buttonEnabledIfValue`), and added `aria-hidden` to the clear icon. Added specs asserting tooltip↔`aria-label` sync on every icon button and that the clear button stays enabled for a 1-char term while the search button stays disabled. The sole consumer is eco-store (main site search + orders filter, both `noButton`+`resetSearch`); nasa-images/llecoop use the separate `type: 'input'` addon variant, so the visible tooltip never leaks the key elsewhere. Builds on a pre-existing uncommitted draft (verified + spec hardened). (A11Y-007, [#86cac31mt](https://app.clickup.com/t/86cac31mt)).

## [2026-06-21] - Shared: A11Y-006 — Password visibility toggle now keyboard-focusable

### Fixed

- **`libs/shared/form/ui/input-password-with-visibility` (`InputPasswordWithVisibilityTypeComponent`)**: The show/hide password toggle carried `tabindex="-1"`, removing the native `matIconButton` from the keyboard tab order — keyboard-only users could not reach it (WCAG 2.1.1 Keyboard, Level A). A11Y-003 had already given it an `aria-label`, `aria-pressed` state and `matTooltip`, but those are moot if the control is unfocusable. Removed the `tabindex="-1"`; the native button is now reachable by Tab and activatable with Enter/Space, and Material's default focus indicator applies (no custom CSS suppresses it; the component `.scss` only overrides icon-button sizing). The attribute was a deliberate-but-wrong choice here, not inherent Material suffix-button behavior — a password reveal toggle should be operable, unlike purely decorative suffix affordances. Added a spec asserting the toggle exposes no `tabindex` and resolves to `tabIndex === 0`. Supersedes Jules PR [#1128](https://github.com/plastikaweb/plastikspace/pull/1128) and its dupes (A11Y-006, [#86ca5gpxj](https://app.clickup.com/t/86ca5gpxj)).

## [2026-06-14] - Shared: SEC-03 — XSS in confirm dialog: escape user-controlled params before trusting as HTML

### Fixed

- **`libs/shared/confirm/data-access` (`SharedConfirmFeatureComponent`)**: The dialog `message` computed interpolated caller-supplied `data.params` into the translated string and passed the raw result straight to `DomSanitizer.bypassSecurityTrustHtml()`, rendered via `[innerHTML]`. Params carry runtime, user-influenced values — e.g. an address name (`{ address: addressName.toUpperCase() }` in the profile-addresses delete flow) or an order number — so any HTML/JS in that data executed in the dialog (HIGH). Now each string param value is HTML-escaped (reusing `escapeHtml` from `@plastik/shared/objects`, introduced in SEC-01) **before** `translate.instant()`, while the translation template itself stays trusted — preserving any intentional markup in message strings (the reason the component uses `bypassSecurityTrustHtml` + `[innerHTML]` rather than plain interpolation). Non-string params pass through untouched. Added specs asserting an injected `<img onerror>` param is escaped and that intentional `<strong>` template markup survives while the param is still escaped (SEC-03, [#86ca5gpx8](https://app.clickup.com/t/86ca5gpx8)).

## [2026-06-07] - Workspace: SEC-02 follow-up — Reverse-tabnabbing on `nasa-images` FAQ links

### Fixed

- **`apps/nasa-images` (`faqs.json`)**: The 7 `target="_blank"` anchors embedded in the FAQ answers — rendered as live DOM via `[innerHTML]` in `nasa-images-faqs-feature.component.html` — were missing `rel="noopener noreferrer"`, leaving them open to reverse-tabnabbing. SEC-02 fixed all template-level `target="_blank"` links workspace-wide but did not scan anchors embedded inside JSON data files, so these slipped through. Added `rel="noopener noreferrer"` to all 7. Completes SEC-02 ([#86ca59u43](https://app.clickup.com/t/86ca59u43)); supersedes the remaining unmerged portion of Jules PR [#1100](https://github.com/plastikaweb/plastikspace/pull/1100) (the rest was already on develop via SEC-01/SEC-02).

## [2026-06-07] - Eco-store: A11Y-005 — Header sidenav + tenant-link tooltips/aria-label

### Fixed

- **`libs/eco-store/core/layout` (header, layout shell & tenant-link)**: Three header/sidenav controls lacked the hover/focus and/or screen-reader affordance. Added a `matTooltip` mirroring the existing dynamic `aria-label` on the header sidenav toggle button (_Obrir/Tancar menú lateral_) and on the in-sidenav mobile close button (which is the control actually visible once the sidenav is open on mobile — the header, and its toggle, is hidden then). The tenant logo link (returns to the store home at `/`) had **no accessible name at all** — on mobile its name `<span>` is hidden, leaving a logo-only button — so screen-reader and mouse users got nothing; added both `aria-label` and `matTooltip` using the existing `common.navigation.backToStore` key (_Tornar a la botiga_). Added a spec asserting the tenant link exposes an accessible name with a tooltip in sync. Supersedes Jules PR [#1106](https://github.com/plastikaweb/plastikspace/pull/1106) (A11Y-005, [#86ca59u73](https://app.clickup.com/t/86ca59u73)).

## [2026-06-07] - Eco-store: A11Y-004 — Tooltips + consistent labels on quantity/cart action buttons

### Fixed

- **`libs/eco-store/shared/product-quantity` & `libs/eco-store/cart/feature`**: Icon-only action buttons had no `matTooltip`, so sighted users got no hover/focus affordance, and their accessible names were inconsistent — only the increment button included the product name (built by string concatenation, yielding awkward labels like "Augmentar pastanagues"), while decrement/remove omitted it. Added a `matTooltip` mirroring each button's `aria-label` on the quantity increment / decrement-or-remove buttons and the cart item delete button, and reworded the three quantity labels (`products.quantity.increment`/`decrement`/`remove`) across ca/es/en to a consistent "verb + quantity + product name" form using `{value}` interpolation (e.g. "Incrementar quantitat de {value}", "Disminuir quantitat de {value}", "Eliminar {value}"). Added specs asserting each tooltip stays in sync with its `aria-label` and that the remove state shows at minimum quantity. Supersedes Jules PRs [#1113](https://github.com/plastikaweb/plastikspace/pull/1113) and [#1109](https://github.com/plastikaweb/plastikspace/pull/1109) (A11Y-004, [#86ca59u4x](https://app.clickup.com/t/86ca59u4x)).

## [2026-06-06] - Shared: A11Y-003 — Password visibility toggle: correct `aria-label`/`aria-pressed` + tooltip + label i18n

### Fixed

- **`libs/shared/form/ui/input-password-with-visibility`**: The visibility-toggle button was mislabeled for assistive tech twice over — its `aria-label` ternary referenced non-existent kebab-case keys (`form.hide-password`/`form.show-password`) with the first branch not even piped through `translate`, and `aria-pressed` reported `true` while the password was _hidden_ (the inverse of the "show password" toggle semantics). Both fixed: `aria-label` now uses new `common.form.showPassword`/`hidePassword` keys (added to ca/es/en), `aria-pressed` is `true` only when the password is visible, and a `matTooltip` with the same translated text gives sighted users the affordance on hover/focus. The sr-only input label key was also corrected (`form.password` → `common.form.password`). Added a spec asserting label/pressed state sync across toggles. Supersedes Jules PR [#1102](https://github.com/plastikaweb/plastikspace/pull/1102) (A11Y-003, [#86ca59u4d](https://app.clickup.com/t/86ca59u4d)).

## [2026-06-06] - Eco-store: BUG-003 — iOS "Add to Home Screen" now shows the tenant name (server-rendered PWA identity)

### Fixed

- **`apps/eco-store` (SSR worker) & `libs/shared/pwa`**: On iOS Safari, "Add to Home Screen" prefilled the generic name "Eco" instead of the tenant's name (e.g. "El Llevat"), even though Android/Chrome were correct. Tenant PWA identity was applied only client-side — `PwaManifestService` fetched the static `/manifest.webmanifest`, patched `name`/`short_name`, and swapped `<link rel="manifest">` to a `blob:` URL — but iOS reads the server-rendered document and ignores JS-injected/`blob:` manifests and JS-set titles, so it fell back to the static manifest's `short_name` ("Eco"). The Cloudflare SSR worker (`apps/eco-store/src/server.ts`) — the single entry point for every request and the only place that sees the request `Host` — now (1) serves a per-tenant `/manifest.webmanifest` (tenant `name`/`short_name`/logo icons) by resolving the tenant from the subdomain via an edge-cached, time-bounded, unauthenticated PocketBase lookup (`run_worker_first` on that path routes it past the static asset), and (2) injects `<meta name="apple-mobile-web-app-title">` (the load-bearing iOS tag) plus `apple-mobile-web-app-capable`/`mobile-web-app-capable` into the served HTML `<head>` for both SSR and prerendered routes. The now-redundant client-side manifest blob swap was removed from `PwaManifestService`, which retains only the `apple-touch-icon` update; the static `public/manifest.webmanifest` remains as the generic fallback (mirrored as the worker's base manifest). Pure worker logic (slug resolution, record→branding mapping, manifest building, attribute escaping) is unit-tested (BUG-003, [#86c9uq8kj](https://app.clickup.com/t/86c9uq8kj)).

## [2026-06-06] - Workspace: SEC-02 — Reverse-tabnabbing: add `rel="noopener noreferrer"` to all `target="_blank"` links

### Fixed

- **Workspace-wide**: All 7 `target="_blank"` anchor elements across 5 files were missing `rel="noopener noreferrer"`, leaving them open to reverse-tabnabbing (opened page can navigate `window.opener` back to the originating tab). Fixed in `libs/core/cms-layout/feature` (2), `libs/llecoop/cms-layout` (2), `libs/shared/button/ui` (1), `libs/eco-store/core/layout` (1), and `apps/llecoop-firebase/public` (1). Closes [#86ca59u43](https://app.clickup.com/t/86ca59u43).

## [2026-06-06] - Shared: SEC-01 — Fix XSS in `SharedUtilFormattersService` table-cell formatters

### Fixed

- **`libs/shared/util/formatters`**: `defaultFormatter` (the `TEXT`/`INPUT`/default table-cell path) and `booleanWithIconFormatter` passed unescaped, potentially user-controlled strings straight to `DomSanitizer.bypassSecurityTrustHtml`, so a payload like `<img src=x onerror=alert(1)>` in a cell value (or a malicious icon name) rendered as live markup — a reflected XSS vector in every table built on the shared formatters. Both formatters now escape the dynamic value with the `escapeHtml` utility from `@plastik/shared/objects` (introduced for the `HighlightPipe` fix) before trusting the HTML; intentional HTML keeps flowing through the separate `CUSTOM`/`LINK`/`COMPONENT` paths, which never touch the sanitizer. Escaped characters render identically as text, so legit cell values are visually unchanged. Added XSS-prevention specs for both formatters plus visual-parity control tests. Supersedes Jules PR [#1116](https://github.com/plastikaweb/plastikspace/pull/1116) (SEC-01, [#86ca59u6g](https://app.clickup.com/t/86ca59u6g)).

## [2026-06-06] - Shared: BUG-003 — PWA manifest uses the tenant name even when the tenant has no logo

### Fixed

- **`libs/shared/pwa`**: `PwaManifestService.applyBranding()` gated the entire manifest patch — including the app `name`/`short_name` — on a logo being present, so tenants without a logo kept the generic static manifest name ("Botiga Eco") as the installed PWA app name. The name and icon patches are now independent: the tenant name is applied whenever provided, icons and the `apple-touch-icon` are only patched when a logo is provided (logo-less tenants keep the static fallback icons), and the method no-ops only when neither is available. SSR guard unchanged. Updated the lib README usage example, which reproduced the buggy logo-gated call pattern, and added unit tests for the name-only branding path (BUG-003, [#86c9uq8kj](https://app.clickup.com/t/86c9uq8kj)).

### Added

- **`apps/eco-store/pocketbase` & `libs/shared/pwa`**: New optional `tenants.shortName` field (text, max 12 chars) for explicit control over the PWA manifest `short_name` — `name.substring(0, 12)` produced mid-word cuts like "Associació E" for "Associació El Llevat" instead of "El Llevat". `PwaAppData` gains a `shortName` property used by `PwaManifestService` when present, falling back to the 12-character truncation of `name`; the eco-store `PWA_APP_DATA_FN` factory passes `tenant.shortName` through. The header tenant logo and the auth container now also prefer `shortName` (falling back to `name`) for the displayed tenant label. Set the value per tenant in the PocketBase Admin UI (staging needs it after the schema sync) (BUG-003, [#86c9uq8kj](https://app.clickup.com/t/86c9uq8kj)).

## [2026-05-31] - Shared: TECH-03 — Optimize `libs/shared/util/objects` utility functions

### Changed

- **`libs/shared/util/objects`**: Optimized three hot utility functions without changing observable behaviour. `isEmpty` now uses an early-exit `for...in` loop instead of `Object.entries(obj).length`, avoiding an O(N) array allocation per call. `formatURLQueryParams` builds its result by mutating the `reduce` accumulator instead of spreading it on every iteration (O(N) instead of O(N²)), and now returns `{}` for a URL with no query string rather than throwing. `collectionToArray` uses native `Object.values()` in place of `Object.keys().map()`. Verified by the existing 39 unit tests (TECH-03, [#86ca226tz](https://app.clickup.com/t/86ca226tz), [#1095](https://github.com/plastikaweb/plastikspace/pull/1095)).

## [2026-05-31] - Shared: Fix XSS vulnerability in `HighlightPipe`

### Fixed

- **`libs/shared/util/highlight`** & **`libs/shared/util/objects`**: `HighlightPipe` passed unescaped, user-controlled text straight to `DomSanitizer.bypassSecurityTrustHtml`, so a payload such as `<script>alert('xss')</script>` arriving via a search result rendered as live markup — a reflected XSS vector. Added an `escapeHtml` utility to `@plastik/shared/objects` (`libs/shared/util/objects`) that escapes HTML special characters, and updated the pipe to escape every dynamic segment — the no-match/no-search passthrough value, and the parts before, within, and after a match — before wrapping the matched text in trusted `<mark>` tags, so only the intended highlight markup reaches `innerHTML`. Added unit tests covering `escapeHtml` and the pipe's escaping behaviour ([#1097](https://github.com/plastikaweb/plastikspace/pull/1097)).

## [2026-05-30] - Eco-store: META-02 — Remove `NOT_REGISTERED` from `users.membershipStatus` enum

### Changed

- **`apps/eco-store/pocketbase/pb_schema.json`**: Removed the deprecated `NOT_REGISTERED` value from the `users.membershipStatus` select field, leaving the four canonical values (`TRIAL`, `ACTIVE`, `INACTIVE`, `SUSPENDED`) already declared by `PocketBaseMembershipStatus` (`libs/core/entities`) and documented in `apps/eco-store/CLAUDE.md`. Verified 0 staging users held the value before removal — PocketBase does not auto-clean orphaned select values, so a populated value would have failed validation on the next write. Applied on the local PocketBase instance and re-exported; staging picks up the schema on merge to `develop` via `.github/workflows/pocketbase-schema.yml` (META-02, [#86c9uq8k3](https://app.clickup.com/t/86c9uq8k3)).

## [2026-05-29] - Shared: TECH-02 — libs/shared Angular-21 modernization residue

### Changed

- **`libs/shared/table/ui`**: Converted `TableCellTitleDirective`'s `private` methods to ES6 `#` private methods (and dropped a redundant `getTextContent` call); removed the dead `@ViewChildren('matFormField')` query from `SharedTableUiComponent` (never read) along with its now-unused `ElementRef` / `ViewChildren` imports. Residual cleanup of the `libs/shared/*` Angular-21 modernization — the bulk of which already landed on `develop`. The recurring Jules modernization PRs (#1073/#1078/#1087, all closed) targeted `main` (llecoop's prod branch, ~595 commits behind `develop`), which is why they kept re-proposing already-merged work (TECH-02, [#86c9y6upw](https://app.clickup.com/t/86c9y6upw)).

## [2026-05-29] - Eco-store: BUG-002 — Deep-link to /cistella/resum no longer redirects to /botiga during SSR

### Fixed

- **`libs/eco-store/cart/feature/src/lib/guards/empty-cart.guard.ts`**: The empty-cart guard now no-ops during server-side rendering (`isPlatformBrowser` check → allows activation on the server). `/cistella` renders with `RenderMode.Server`, but the cart lives only in the browser (localStorage for anonymous visitors, auth token for members), so server-side the store always read empty and the guard bounced valid deep-links — e.g. `/cistella/resum` with items — to `/botiga`. The decision is deferred to the client, which re-runs the guard once the cart has hydrated; genuinely-empty carts still redirect in the browser. Added `empty-cart.guard.spec.ts` covering the server (no redirect) and browser (redirect-when-empty / allow-when-filled) paths (BUG-002, [#86c9uq8kb](https://app.clickup.com/t/86c9uq8kb)).

## [2026-05-23] - Workspace: OPS-02 — Grant `pull-requests: write` to claude-code-review workflow

### Fixed

- **`.github/workflows/claude-code-review.yml`**: Raised `permissions.pull-requests` from `read` to `write` (and `issues` from `read` to `write` for summary-comment fallback). The Claude code-review plugin was running successfully end-to-end but its final step — calling `github.rest.pulls.createReview` / `createReviewComment` to attach the report to the PR — got denied by the GitHub permission gate, so every review run completed silently. PR #1080's run logged 2 `permission_denials_count` and `"No buffered inline comments"` after 9 min / $3.47 / 17 turns of analysis. From now on, every PR matching the existing `paths-ignore` filter will get Claude's review report posted as comments (OPS-02, [#86c9y6xyb](https://app.clickup.com/t/86c9y6xyb)).

## [2026-05-23] - Eco-store: META-01 — Remove obsolete v1.7 PRD + TECH-01/02 ClickUp ID corrections

### Removed

- **`apps/eco-store/eco-store-req.md`**: Deleted the v1.7 PRD (86 KB). Superseded by the external v1.8 PDF (`/Volumes/Feina/Projects-modeling/eco/eco-store/ecostoreprdv1_8ca.pdf`), which has been the canonical spec since `apps/eco-store/CLAUDE.md` was introduced (2026-05-16). Keeping a stale spec in the repo invited drift — every doc still referencing it had to carry a "don't read this" disclaimer (META-01).

### Changed

- **`cspell.json`**: Removed the now-dead `apps/eco-store/eco-store-req.md` entry from `ignorePaths` (META-01).
- **`.markdownlint-cli2.yaml`**: Removed the now-dead `apps/eco-store/eco-store-req.md` entry from `ignores` (META-01).
- **`apps/eco-store/CLAUDE.md`**: Removed the obsolete-file warning callout under the source-of-truth table — no longer needed once the file is gone (META-01).
- **`apps/eco-store/TASKS.md` + `apps/eco-store/BACKLOG.md`**: Marked META-01 as ✅ Done (removed from current focus; detail block + Phase 0.2 row updated with completion note). Bumped TASKS to v0.6 / BACKLOG to v0.4 with a 2026-05-23 changelog row. Corrected TECH-01 ClickUp ID (stale `86c8cjghn` → `86c9uq9rf`) and added the previously `_pending_` TECH-02 ClickUp ID (`86c9y6upw`) — both surfaced during the audit pass.

## [2026-05-23] - Eco-store: BUG-005 — Auth guard on /perfil + shared returnUrl flow

### Added

- **`libs/eco-store/core/router/src/lib/eco-store-auth.guard.ts`**: New shared `ecoStoreAuthGuard` (`CanActivateFn`). Redirects unauthenticated visitors to `/accedir` with the attempted URL preserved in a `returnUrl` query param. SSR-safe (bypassed on server). Wired as `canActivateChild` on `/perfil` (closes the BUG-005 leak) and as the replacement for the per-domain orders guard on `/comandes` (BUG-005, [#86c99rjxt](https://app.clickup.com/t/86c99rjxt)).

### Changed

- **`libs/eco-store/auth/feature/login/.../eco-store-auth-login-facade.service.ts`**: On successful login, navigate to a sanitized `returnUrl` query param (same-origin paths only — open-redirect guard rejects schemes and `//host` forms) instead of always landing on `/`. Lets deep-link → guard → login → original-target flow work end-to-end (BUG-005, [#86c99rjxt](https://app.clickup.com/t/86c99rjxt)).
- **`libs/eco-store/cart/feature/.../guards/not-logged-shipping.guard.ts`**: The "Login" branch of the not-logged-shipping confirm dialog now passes `returnUrl: state.url` to `/accedir`, so a user who deep-links to `/cistella/enviament` or `/cistella/confirmacio` and chooses "Log in" returns to the same checkout step after authenticating. Same UX guarantee as the new shared guard (BUG-005, [#86c99rjxt](https://app.clickup.com/t/86c99rjxt)).
- **`apps/eco-store/TASKS.md`**: Marked BUG-005 as ✅ Done (removed from current focus; status updated in bugs table with implementation note).

### Removed

- **`libs/eco-store/orders/data-access/src/not-logged-orders.guard.ts`** + barrel export: Superseded by `ecoStoreAuthGuard`. The orders-list redundant `canActivate` is also dropped (parent `/comandes` already covers it via `canActivateChild`). DRY: one auth guard for the app instead of one per domain (BUG-005, [#86c99rjxt](https://app.clickup.com/t/86c99rjxt)).

## [2026-05-17] - Eco-store: META-05 Phase 1 — TASKS.md ↔ ClickUp sync command + in-repo backlog

### Added

- **`tools/scripts/sync-eco-store-tasks.cjs` + `.claude/commands/sync-eco-store-tasks.md`**: New read-only `/sync-eco-store-tasks` Claude Code slash command. Diffs `apps/eco-store/TASKS.md` against ClickUp list `901521018763`, prints three sections (only-in-TASKS, only-in-ClickUp, status mismatches) plus a bridge-coverage metric. Phase 1 of 4 in the ClickUp ↔ TASKS.md automation — read-only by design, validates the PRD-ID-as-bridge assumption before Phases 2–4 add writes (META-05, [#86c9uwmzf](https://app.clickup.com/t/86c9uwmzf)).

### Changed

- **`apps/eco-store/TASKS.md` + `apps/eco-store/BACKLOG.md`**: Moved into the repo from the external `/Volumes/Feina/Projects-modeling/eco/eco-store/` directory so devs cloning the repo see the backlog, lifecycle-align with code commits, and unlock straightforward CI/git-hook automation. PRD v1.8 PDF stays external (binary, slow-changing) (META-05, [#86c9uwmzf](https://app.clickup.com/t/86c9uwmzf)).
- **`apps/eco-store/CLAUDE.md`**: Updated the source-of-truth table and the "Referencing task identifiers (MANDATORY)" section to point at the new in-repo TASKS.md location (META-05, [#86c9uwmzf](https://app.clickup.com/t/86c9uwmzf)).

## [2026-05-17] - Workspace: Reactivate Claude Code GitHub workflows

### Changed

- **`.github/workflows/claude.yml` & `.github/workflows/claude-code-review.yml`**: Reactivated previously disabled (`.temp`) workflows and switched authentication from `ANTHROPIC_API_KEY` (pay-per-token API billing) to `CLAUDE_CODE_OAUTH_TOKEN` (counts against the Claude Code Max subscription quota, no extra billing). Added `paths-ignore` filter on the review workflow so PRs touching only Markdown, workflow YAML, or `documentation/` skip the automated review and preserve Max quota for substantive code changes.

## [2026-05-16] - Workspace: CLAUDE.md hierarchy refinement

### Changed

- **Root `CLAUDE.md`**: Removed duplicate Angular/TypeScript guidance (canonical source remains `.claude/CLAUDE.md`), added a "Per-app guidance" pointer, added a "Where things actually live" reference table consolidating Nx cache, path-alias, ESLint boundary, scripts, and documentation paths, and collapsed the eco-store-specific PocketBase backend subsection ([#86c9uq646](https://app.clickup.com/t/86c9uq646)).

### Added

- **`apps/eco-store/CLAUDE.md`**: New app-level Claude Code guide covering eco-store architecture, PocketBase schema/hooks workflow, multi-tenant routing, design system, state management patterns, and the `pocketbase-best-practices` skill invocation mandate ([#86c9uq646](https://app.clickup.com/t/86c9uq646)).
- **`apps/eco-store/CLAUDE.md` → "Referencing task identifiers (MANDATORY)"**: Codified that all eco-store commits, CHANGELOG entries, and PRs must include the PRD/TASKS ID (e.g. `BOT-04`, `INI-01`) alongside the ClickUp ID, sourced from the external TASKS.md ([#86c9uq646](https://app.clickup.com/t/86c9uq646)).

## [2026-05-02] - Workspace: Angular 21.2.9, NgRx 21.1.0 & Toolchain Upgrade

### Changed

- **Angular Ecosystem to 21.2.9**: Bumped all `@angular/*`, `@angular-devkit/*`, `@angular/cli`, `@angular/build`, `@angular/ssr`, `@angular/language-service`, and `@schematics/angular` from 21.2.2 → 21.2.9. Pinned `@angular/platform-server` and `@angular/ssr` to match the rest of the Angular package versioning style ([#86c9kxn69](https://app.clickup.com/t/86c9kxn69)).
- **NgRx to 21.1.0**: Bumped all `@ngrx/*` packages (`store`, `effects`, `entity`, `signals`, `operators`, `router-store`, `component`, `schematics`, `store-devtools`) from 21.0.1 → 21.1.0 ([#86c9kxn69](https://app.clickup.com/t/86c9kxn69)).
- **Angular ESLint to 21.3.1**: Bumped `@angular-eslint/*` from ^21.2.0 → ^21.3.1 ([#86c9kxn69](https://app.clickup.com/t/86c9kxn69)).
- **ng-packagr to 21.2.3**: Tracks the Angular minor for library packaging ([#86c9kxn69](https://app.clickup.com/t/86c9kxn69)).
- **Nx to 22.7.1**: Picked up via `nx migrate latest`; aligned all `@nx/*` packages and added `@nx/devkit` as an explicit devDependency to satisfy `@simondotm/nx-firebase`'s peer requirement ([#86c9kxn69](https://app.clickup.com/t/86c9kxn69)).
- **Vitest to 4.1.5 & Analog to 2.5.0**: Bumped `vitest`, `@vitest/ui`, `@vitest/coverage-v8`, `@analogjs/vite-plugin-angular`, and `@analogjs/vitest-angular`. Relaxed the analog `~2.1.2` tilde to `^2.5.0` so both Analog packages stay aligned ([#86c9kxn69](https://app.clickup.com/t/86c9kxn69)).
- **Firebase Tools to ^14.27.0**: Required by `@angular/fire@20`'s peer range ([#86c9kxn69](https://app.clickup.com/t/86c9kxn69)).
- **Explicit Missing Peers**: Added `@angular-devkit/architect@0.2102.9` (peer of `@analogjs/vitest-angular`) and `@typescript-eslint/types@^8.59.1` (peer of `@angular-eslint/eslint-plugin-template`) ([#86c9kxn69](https://app.clickup.com/t/86c9kxn69)).
- **esbuild Pinned to 0.27.3**: Match `@angular/build@21.2.9`'s exact pin so the JS package and platform binary stay in lockstep ([#86c9kxn69](https://app.clickup.com/t/86c9kxn69)).
- **Minor / Patch Bumps**: `@typescript-eslint/*` ^8.59.1, `cypress` 15.14.2, `prettier` ^3.8.3, plus `@swc-node/register`, `@babel/*`, `tailwindcss`, `@tailwindcss/postcss`, `graphql`, `intl-messageformat`, `pocketbase`, `postcss`, `tslib`, `@ngxpert/hot-toast`, `@cloudflare/workers-types`, `commitizen`, `cz-customizable`, `dotenv`, `firebase-functions-test`, `husky`, `ng-mocks`, `pa11y-ci`, `postcss-preset-env`, `rimraf`, `ts-node`, `verdaccio`, `wrangler`, and `baseline-browser-mapping` ([#86c9kxn69](https://app.clickup.com/t/86c9kxn69)).

### Fixed

- **Vitest 4 `matchMedia` Conflict**: Removed the duplicate `Object.defineProperty(window, 'matchMedia', …)` block from `libs/shared/mat-theme-toggle`, `libs/eco-store/core/layout`, and `libs/eco-store/orders/feature/created` test setups; the global `vitest-setup.ts` now handles it via `vi.stubGlobal`, avoiding the "Cannot redefine property: matchMedia" error introduced by Vitest 4 ([#86c9kxn69](https://app.clickup.com/t/86c9kxn69)).
- **Vitest 4 `IntersectionObserver` Constructor**: Switched the global mock from an arrow function to a regular function so `new IntersectionObserver()` (used by Angular's `@defer` viewport trigger) no longer throws "is not a constructor" ([#86c9kxn69](https://app.clickup.com/t/86c9kxn69)).
- **Shared Button UI Test SVG Fetch**: Added `provideHttpClientTesting()` to `SharedButtonUiComponent`'s spec so the icon registry's SVG request is intercepted instead of bubbling up as the unhandled XHR error that Vitest 4 now promotes to a test failure ([#86c9kxn69](https://app.clickup.com/t/86c9kxn69)).
- **nasa-images Initial Bundle Budget**: Bumped the `production` and `staging` initial-bundle warnings from 500kb → 800kb and the `production` error from 900kb → 1mb to absorb the ~6 kB of Angular 21.2.9 / NgRx 21.1.0 / rxjs 7.8.2 patch growth ([#86c9kxn69](https://app.clickup.com/t/86c9kxn69)).

## [2026-05-02] - Shared: Jules Modernization Fixes (PR #1062)

### Changed

- **Firebase Storage Reset on Upload Failure**: Replaced the partial `this.progress.set(0)` in `FirebaseStorageService.upload`'s `catch` block with `this.reset()` so the `fileUrl` signal is also cleared when an upload throws, keeping signal state consistent on error ([#1062](https://github.com/plastikaweb/plastikspace/pull/1062)).
- **Shared Table Lean Architecture**: Removed the unused `DataFormatFactoryService` import and its dead `protected dataFormatFactoryService` injection from `SharedTableUiComponent` ([#1062](https://github.com/plastikaweb/plastikspace/pull/1062)).

## [2026-05-02] - Eco-Store: Cart Shipping Progress & Status Strip

### Changed

- **Shipping Status Box Flattened**: Removed the gradient background, `1px` border, `box-shadow`, and `translateY(-1px)` hover lift on `.cart-order-price-slots__shipping`; replaced with a flat `color-mix(... 12%, transparent)` tinted strip so it no longer reads as a card-in-card inside the price-summary `mat-card` ([#86c9kxfya](https://app.clickup.com/t/86c9kxfya)).
- **Shipping Status Icon Animations Removed**: Dropped the Tailwind `animate-bounce` from the "info" icon and `animate-pulse` from the "check_circle" icon, eliminating the bounce/elastic-easing AI-tell on the cart shipping summary ([#86c9kxfya](https://app.clickup.com/t/86c9kxfya)).
- **Shipping Status Body Text**: Bumped the wrapper from `text-xs` (12px) to `text-sm` (14px) so the remaining-for-free / free-achieved message clears the body-text minimum-size floor ([#86c9kxfya](https://app.clickup.com/t/86c9kxfya)).

## [2026-05-02] - Eco-Store: Orders Detail Typography & Missing Icon

### Changed

- **Orders Detail Eyebrow Labels**: Replaced the `text-xs font-bold tracking-wider uppercase` treatment on the four delivery-summary labels (Method, Time slot, Address, Notes) with `text-sm font-semibold`, fixing the all-caps body-text and tiny-body-text findings (12px → 14px) ([#86c9kwzf1](https://app.clickup.com/t/86c9kwzf1)).
- **Orders Detail Section Headings**: Switched the Delivery Summary and Products section `<h3>` headings from `text-base font-bold tracking-wider uppercase` to `text-lg font-bold tracking-tight`, removing the all-caps body-text tell while keeping a clear typographic hierarchy ([#86c9kwzf1](https://app.clickup.com/t/86c9kwzf1)).
- **Eco-Store Material Symbols Preload**: Added the `chat_bubble_outline` glyph to the Material Symbols Outlined preload/`<noscript>` URL in `apps/eco-store/src/index.html` so the icon used by the order-notes block renders without a fallback flash ([#86c9kwzf1](https://app.clickup.com/t/86c9kwzf1)).

## [2026-05-02] - Eco-Store: Profile Views Alert & Chip Audit Fixes

### Changed

- **Shared Alert Border**: Replaced the asymmetric `border-left: 4px` (the "side-tab accent" AI tell) on `plastik-shared-alert` with a soft full-perimeter `1px` border using `color-mix(... 35%, transparent)`. The variant signal still flows through the tinted background and coloured icon ([#86c9kwxm4](https://app.clickup.com/t/86c9kwxm4)).
- **Profile Avatar Hint Text**: Replaced the `text-[11px] font-bold tracking-widest uppercase` "recommended" hint with `text-sm font-medium tracking-normal italic`, fixing both the all-caps body-text and tiny-text findings ([#86c9kwxm4](https://app.clickup.com/t/86c9kwxm4)).
- **Shared Chip Optional Uppercase**: Added an `uppercase` input on `SharedChipComponent` (default `true` to preserve existing visuals across all consumers); set `[uppercase]="false"` on the profile-feature role chip whose label is long enough to read as body text ([#86c9kwxm4](https://app.clickup.com/t/86c9kwxm4)).

## [2026-05-02] - Eco-Store: Confirm Dialog & Header Trial Badge

### Changed

- **Shared Confirm Dialog Sectioning**: Removed the distinct `bg-surface-container-low` / `bg-surface-container-lowest` backgrounds from the dialog's `<header>` and `<mat-dialog-actions>`; kept the `border-b` / `border-t` separators so the dialog stops reading as a card-in-card while preserving visual hierarchy ([#86c9kwwjg](https://app.clickup.com/t/86c9kwwjg)).
- **Header Trial Badge Typography**: Bumped the trial-status pill from `text-xs / py-1` to `text-sm / py-1.5` so the warning text clears the 12px body-text floor and the pill stays comfortably tappable ([#86c9kwwjg](https://app.clickup.com/t/86c9kwwjg)).

## [2026-05-02] - Eco-Store: Auth Container Footer Typography

### Changed

- **Auth Container Terms/Privacy Footnote**: Replaced the `text-[10px] font-bold tracking-widest uppercase opacity-50` treatment on the shared `eco-store-auth-container` footer fallback with `text-sm font-medium tracking-normal opacity-70`, fixing the all-caps body-text and tiny-body-text findings flagged on every auth screen (login, register, forgot/reset password) ([#86c9kwtb3](https://app.clickup.com/t/86c9kwtb3)).

## [2026-05-02] - Eco-Store: Impeccable UI Audit Fixes on Products Page

### Changed

- **Sidenav Category Icons Toned Down**: Replaced raw `[style.color]` with a `color-mix(... in oklch ...)` blend on `.category-icon` so vivid hues (e.g. purple) render as soft, organic accents instead of the "AI palette" pattern flagged by the audit ([#86c9kwk3x](https://app.clickup.com/t/86c9kwk3x)).
- **Header Toolbar Visual Weight**: Removed the redundant `box-shadow` and `border-bottom` from `mat-toolbar`; the visual weight already lives on the `<eco-header>` wrapper, eliminating the "card-in-card" tell ([#86c9kwk3x](https://app.clickup.com/t/86c9kwk3x)).
- **Product Quantity Stepper Styling**: Removed the heavy `border-2 / bg-surface-variant / rounded-2xl` wrapper around the +/- controls and switched the add-button icon to the `--mat-sys-on-primary` token; the round icon buttons themselves provide the visual grouping in both light and dark mode ([#86c9kwk3x](https://app.clickup.com/t/86c9kwk3x)).
- **Favorite Button Animation & Color**: Replaced the elastic `cubic-bezier(0.175, 0.885, 0.32, 1.275)` heart-pop easing with the M3 standard `cubic-bezier(0.22, 1, 0.36, 1)`, softened the keyframes (1.4 → 1.25, 1.1 → 1.05) and wrapped `icon-color` with `light-dark()` so the icon stays legible on dark surfaces ([#86c9kwk3x](https://app.clickup.com/t/86c9kwk3x)).
- **Cart Button Disabled Icon Contrast**: Scoped the bright `--primary-50` icon color to `:not(:disabled)` and added a fallback to the M3 disabled on-surface token, fixing the 1.1:1 contrast when the cart is empty ([#86c9kwk3x](https://app.clickup.com/t/86c9kwk3x)).
- **Shared Chip Vertical Padding**: Bumped chip padding from `py-1` to `py-2.5` so it clears the 8px floor in the project's Tailwind spacing scale ([#86c9kwk3x](https://app.clickup.com/t/86c9kwk3x)).
- **Sidenav Nav-Line Letter Spacing**: Reset Material's wide list-line tracking (`--mat-list-list-item-label-text-tracking: normal`) so category names no longer trip the "wide letter spacing on body text" heuristic ([#86c9kwk3x](https://app.clickup.com/t/86c9kwk3x)).
- **Activity Overlay Loading Text**: Removed `uppercase` and oversized tracking, switched to `text-sm font-semibold tracking-wide` with `py-2.5`, fixing both the "all-caps body text" and "cramped padding" findings ([#86c9kwk3x](https://app.clickup.com/t/86c9kwk3x)).
- **Sidenav Layout Animation Hint**: Added `ng-animate-disabled` on `<mat-sidenav-container>` and a desktop `mat-drawer-content { transition: none }` reset so Material's layout-property transition (`margin-left, margin-right`) does not animate in our `over`/`side` configuration ([#86c9kwk3x](https://app.clickup.com/t/86c9kwk3x)).

## [2026-05-01] - Code Quality Refinements: Jules Review & Convention Alignment

### Added

- **Concurrent PocketBase Schema Sync**: Added a `processInChunks` utility and `pb.autoCancellation(false)` to `apps/eco-store/scripts/sync-pocketbase-schema.js`, parallelising the three sync passes (create, update, views) in chunks of 10 to reduce wall-clock time on large schemas ([#86c9kq61r](https://app.clickup.com/t/86c9kq61r)).

### Changed

- **SharedTableUiComponent Reactive Sync**: Replaced the `ngOnInit` signal-truthiness checks with proper `effect()`-based synchronisation for `data`, `filterCriteria`/`filterPredicate`, `sort`/`matSort` and `matPaginator`, so lazy `@defer` table controls hydrate correctly ([#86c9kq61r](https://app.clickup.com/t/86c9kq61r)).
- **Private Fields Migration**: Converted the `private` modifier to ES6 `#` private fields in `ViewportTransitionNameDirective`, `CountdownService`, `ErrorHandlerService`, `WithCartQuantityPipe`, `BytesToSizePipe`, `DataFormatFactoryService` and `SharedTableUiComponent` to comply with the project's ESLint `no-restricted-syntax` rule ([#86c9kq61r](https://app.clickup.com/t/86c9kq61r)).
- **Public API JSDoc Coverage**: Added or normalised JSDoc on `SkipLinkComponent`, `BytesToSizePipe`, `SharedUtilDynamicBgColorDirective`, `SafeFormattedPipe`, `FirebaseStorageService`, `DataFormatFactoryService` and `SharedUtilFormattersService`, removing legacy `@description` tags and standardising parameter formatting ([#86c9kq61r](https://app.clickup.com/t/86c9kq61r)).
- **Console Statement Cleanup**: Removed prohibited `console.*` calls and orphan commented-out console lines from `FirebaseAuthService`, `store-firebase-crud-feature`, `EcoStoreTenantBaseService`, `transformToString`, `eco-store/app.config` and the user-order facade stub, replacing each with a no-op or descriptive comment ([#86c9kq61r](https://app.clickup.com/t/86c9kq61r)).
- **FirebaseStorageService Error Handling**: Moved the missing-file guard outside the upload `try` block; the catch now re-throws the original error after resetting progress, instead of silently swallowing failures ([#86c9kq61r](https://app.clickup.com/t/86c9kq61r)).
- **SharedUtilFormattersService Whitespace**: Rewrote `quantityFormatter` to interpolate the prefix, formatted number and suffix without leaking whitespace/newlines from the original template literal ([#86c9kq61r](https://app.clickup.com/t/86c9kq61r)).

### Fixed

- **BytesToSizePipe Zero-Byte Output**: The pipe now returns `"0 Bytes"` for a `0` input (previously returned `"n/a"`) and only returns `"n/a"` for `null`/`undefined`/`NaN` values; the spec was updated accordingly ([#86c9kq61r](https://app.clickup.com/t/86c9kq61r)).
- **DynamicBgColor Default Input**: Default value of the `color` input was the literal string `"color"` (which set `background-color: color` on hover); changed to `""` so the directive becomes a no-op until consumers pass a real colour ([#86c9kq61r](https://app.clickup.com/t/86c9kq61r)).
- **Shared Table Cell Class Binding**: Replaced the broken `[class]="\`py-sub ${setCellNgClass(column)}\`"`(template-literal-stringifying an object to`"[object Object]"`) with a concatenated `[class]`plus per-flag`[class.mat-cell-input]`/`[class.mat-cell-link]`bindings, and removed the now-unused`setCellNgClass` method ([#86c9kq61r](https://app.clickup.com/t/86c9kq61r)).

## [2026-05-01] - Eco-Store: Shared Hero Header Library & Responsive Polish

### Added

- **Hero Header Library**: Created `@plastik/eco-store/hero-header` (`libs/eco-store/shared/hero-header`) — a new shared UI library owning the recurring hero-header pattern (organic background, responsive typography, subtitle/title/extras layout) with inputs (`title`, `icon`, `subtitle`, `compact`, `revealDelay`, `headerRole`, `titleClass`, `subtitleClass`) and a `[heroAction]` projection slot for trailing actions ([#86c9hdf9z](https://app.clickup.com/t/86c9hdf9z)).
- **Hero Header Integration**: Refactored eight consumer views (products list/detail, orders list/detail, cart shipping/summary/confirmation, profile) to use the new shared component, removing inline `.hero-header` markup duplication ([#86c9hdf9z](https://app.clickup.com/t/86c9hdf9z)).

### Changed

- **Hero Header Styles Migration**: Moved the `.hero-header`, `.hero-content`, `.category-title` and `.category-subtitle` rules out of the global `apps/eco-store/src/styles/_components.scss` into the new component (using `ViewEncapsulation.None` so projected content remains styled) ([#86c9hdf9z](https://app.clickup.com/t/86c9hdf9z)).
- **Responsive Spacing Polish**: Replaced magic spacing values with `--space-*` design tokens, normalized the mobile breakpoint to Tailwind's `sm` (640px), made vertical padding symmetric and breathable, and unified `margin-bottom` across viewports ([#86c9hdf9z](https://app.clickup.com/t/86c9hdf9z)).
- **Title Row Alignment**: Switched the structured title row to `items-end` baseline alignment with a `gap-4` separator so trailing actions (sort selectors, buttons, chips) line up cleanly with the title baseline ([#86c9hdf9z](https://app.clickup.com/t/86c9hdf9z)).
- **Orders Detail Header**: Stacked the subtitle block and "View PDF" button on mobile (`flex-col` → `sm:flex-row`), fixed an incorrect `flex-1` on the receipt icon, bumped the order title from `text-base` to `text-lg`, and added an `aria-label` and explicit `type="button"` on the action ([#86c9hdf9z](https://app.clickup.com/t/86c9hdf9z)).
- **Cart Steps Spacing**: Replaced `py-8` with `pb-8` on the section directly below the hero in shipping, summary, and confirmation steps to remove ~32px of duplicated breathing room created by the hero's own bottom padding ([#86c9hdf9z](https://app.clickup.com/t/86c9hdf9z)).

## [2026-04-28] - Eco-Store: Breadcrumb Navigation Library & UI Accessibility

### Added

- **Breadcrumbs Library**: Created `@plastik/eco-store/breadcrumbs` (`libs/eco-store/shared/breadcrumbs`) — a new shared UI library providing a responsive, accessible breadcrumb navigation bar with integrated back button, skeleton loading states, optional Material icons, and full i18n support via `ngx-translate` ([#86c9hdff3](https://app.clickup.com/t/86c9hdff3)).
- **Order Detail Breadcrumbs**: Integrated `EcoStoreBreadcrumbsComponent` into `EcoStoreOrdersDetailComponent` with a two-level trail (orders list → order detail) and a reactive `breadcrumbItems` computed signal ([#86c9hdff3](https://app.clickup.com/t/86c9hdff3)).
- **Product Detail Breadcrumbs**: Integrated `EcoStoreBreadcrumbsComponent` into `EcoStoreProductFeatureComponent` with a three-level trail (store → category → product) and skeleton placeholders while data loads ([#86c9hdff3](https://app.clickup.com/t/86c9hdff3)).

### Changed

- **Responsive Accessibility Optimization**: Refined `StoreWindowComponent` and `SharedCountdownUiComponent` to hide labels and prefixes on mobile and tablet (`lg` breakpoint) to maximize space for primary countdown content. Implementation uses a separate `sr-only` span for screen readers and `aria-hidden` visual labels, ensuring full accessibility without layout compromises ([#86c9hv1mf](https://app.clickup.com/t/86c9hv1mf)).

### Fixed

- **Store Status Visibility**: Standardized status chip label responsive behavior across all store views, ensuring the primary state is always available to assistive technologies regardless of visual layout ([#86c9hv1mf](https://app.clickup.com/t/86c9hv1mf)).

## [2026-04-27] - Eco-Store: Hero Spacing Standardization & UI Modernization

### Added

- **Responsive Sort Selector**: Enhanced `SortSelectorComponent` with a dual-layout strategy: a compact icon-only view with tooltips for mobile devices and a full label+icon view for desktop, improving usability across viewports ([#86c9hddft](https://app.clickup.com/t/86c9hddft)).

### Changed

- **Hero Spacing Standardization**: Standardized bottom spacing for hero-header sections across all eight major pages (products, orders, profile, cart) using the `var(--space-lg)` (1.5rem) design token, ensuring visual rhythm and consistency ([#86c9hddft](https://app.clickup.com/t/86c9hddft)).
- **Angular Material Modernization**:Workspace-wide refactoring of Angular Material button directives to use modern camelCase selectors (`matButton`, `matIconButton`, `matFabButton`) for improved consistency with Angular standards ([#86c9hddft](https://app.clickup.com/t/86c9hddft)).
- **Product Detail Layout**: Refined the product detail feature by centralizing category metadata, favorite actions, and product tags within the hero header, eliminating redundant overlays and decluttering the media section ([#86c9hddft](https://app.clickup.com/t/86c9hddft)).
- **Profile Page Refinement**: Aligned trial banner and loading skeleton spacing with global design tokens and simplified the template structure by removing unnecessary layout wrappers ([#86c9hddft](https://app.clickup.com/t/86c9hddft)).
- **Breadcrumb Navigation**: Standardized breadcrumb layout in detail views with integrated "back" action and improved responsive behavior for long category names ([#86c9hddft](https://app.clickup.com/t/86c9hddft)).
- **Shared UI Consistency**: Updated shared components including table actions, form selectors, snackbars, and image croppers to follow the new standardized Material button patterns.

### Fixed

- **Order Number Overflow**: Implemented dynamic width constraints and text truncation for order identifiers in `OrderCardComponent`, preventing layout breaks on narrow mobile viewports ([#86c9hddft](https://app.clickup.com/t/86c9hddft)).
- **Hero Typography**: Fixed category title scaling on small screens using fluid typography (`clamp`) to prevent text clipping on mobile devices.

## [2026-04-24] - Eco-Store: Bundle Size Fix & Price Summary Refactor

### Added

- **Price Summary Component**: Extracted `EcoStorePriceSummaryComponent` into a new shared library `@plastik/eco-store/price-summary`, replacing the former `CartOrderSummaryComponent` for reuse across cart steps and orders detail.

### Changed

- **Bundle optimization**: Moved `ecoStoreOrdersStore` and `ecoStoreCartStore` back to the lazy layout chunk by removing their static import from `EcoStorePrefixTitleService` and inlining the order title resolution into `layout.routes.ts`.
- **Order detail title**: The dynamic browser tab title for order detail (e.g. "Order #1234") is now resolved inline in the lazy layout routes, preserving correctness for list-to-detail navigations.
- **Router barrel cleanup**: Removed `EcoStoreOrdersDetailRouteTitleService` from the `@plastik/eco-store/core/router-state` barrel to prevent accidental tree-shaking bypass through the shared barrel import.
- **Cart feature API**: Removed `CartOrderSummaryComponent` from the cart feature public API (`index.ts`) and deleted the component files; use `EcoStorePriceSummaryComponent` from `@plastik/eco-store/price-summary` instead.

### Fixed

- **Initial bundle error**: Resolved the production build failure caused by the initial bundle exceeding the 900 kB error budget (970 kB → 812 kB).

## [2026-04-22] - Eco-Store: Orders Detail Feature & UI Improvements

### Added

- **Orders Detail Feature**: Implemented a new library `@plastik/eco-store/orders/feature/detail` providing a comprehensive view for individual orders with itemized lists, logistics summaries, and total breakdowns ([#86c8cjgma](https://app.clickup.com/t/86c8cjgma)).
- **Orders Detail Resolver**: Added `ecoStoreOrdersDetailResolver` to ensure order data is hydrated and state is synchronized before the detail view renders ([#86c8cjgma](https://app.clickup.com/t/86c8cjgma)).
- **Unauthenticated Orders Guard**: Implemented `ecoStoreNotLoggedOrdersGuard` to protect order-related routes and ensure proper authentication state management ([#86c8cjgma](https://app.clickup.com/t/86c8cjgma)).
- **Dynamic Detail Titles**: Created `EcoStoreOrdersDetailRouteTitleService` to provide reactive, context-aware page titles (e.g., "Order #1234") for the browser tab ([#86c8cjgma](https://app.clickup.com/t/86c8cjgma)).

### Changed

- **i18n (CA/EN/ES)**: Integrated extensive new translation keys for order details, including pluralized item counts, status labels, and delivery forecast across all three languages ([#86c8cjgma](https://app.clickup.com/t/86c8cjgma)).
- **Shared Alert UI Refinement**: Refactored `SharedAlertUiComponent` with a more flexible flexbox-based layout, improved mobile responsiveness, and better icon/title alignment ([#86c8cjgma](https://app.clickup.com/t/86c8cjgma)).
- **PocketBase Signal State Modernization**: Refactored `withPocketBaseGetOneFeature` to use a modern `async/await` pattern with `firstValueFrom`, providing cleaner error handling and more robust state updates ([#86c8cjgma](https://app.clickup.com/t/86c8cjgma)).
- **Orders List Integration**: Updated the orders list to trigger navigation to the detailed view and enforced the new authentication guards ([#86c8cjgma](https://app.clickup.com/t/86c8cjgma)).
- **Cart UI Polish**: Refined templates for cart summary and shipping steps to ensure visual consistency with the new orders detail layout ([#86c8cjgma](https://app.clickup.com/t/86c8cjgma)).

### Fixed

- **Shared Alert Tests**: Updated `shared-alert-ui.component.spec.ts` to align with the refactored HTML structure and generic button selectors ([#86c8cjgma](https://app.clickup.com/t/86c8cjgma)).

## [2026-04-17] - Workspace: CI/CD Strategy and Documentation Refactor

### Added

- New section in README and Git Flow documentation explaining the dual CI/CD and caching strategy.

### Changed

- Refactored CI workflow to use Nx Cloud consistently and differentiated testing logic (affected on PRs, run-many on develop).
- Updated `nx.json` to enable `nx-cloud` task runner for centralized caching and AI-assisted failure analysis.

## [2026-04-16] - Eco-Store: SSR Reliability and Stability Improvements

### Changed

- Optimized SSR reliability by switching category routes to Server mode to avoid build-time tenant fetch failures ([#86c9c38yr](https://app.clickup.com/t/86c9c38yr)).
- Improved loading stability by ensuring guards and resolvers wait for tenant data before proceeding ([#86c9c38yr](https://app.clickup.com/t/86c9c38yr)).
- Refactored local development workflow with conditional security headers to prevent local SSL/HSTS issues ([#86c9c38yr](https://app.clickup.com/t/86c9c38yr)).
- Enhanced activity store integration and layout scroll management ([#86c9c38yr](https://app.clickup.com/t/86c9c38yr)).

## [2026-04-15] - Eco-Store: Angular SSR and Cloudflare Workers Deployment

### Added

- **Angular SSR Implementation**: Enabled Server-Side Rendering using `@angular/ssr` for Angular 21, improving SEO and initial load performance for the product catalog ([#86c8tzpdf](https://app.clickup.com/t/86c8tzpdf)).
- **Hybrid Rendering Strategy**: Implemented a mixed strategy in `app.routes.server.ts` with prerendering for static auth/landing pages and on-demand SSR for dynamic product and user-specific routes ([#86c8tzpdf](https://app.clickup.com/t/86c8tzpdf)).
- **Cloudflare Workers Assets Deployment**: Configured `wrangler.jsonc` and updated the staging deployment workflow to use `wrangler deploy` for unified server and asset delivery ([#86c8tzpdf](https://app.clickup.com/t/86c8tzpdf)).
- **Server-Side Translation Loading**: Added `ServerTranslateLoader` in `app.config.server.ts` to load i18n JSON files directly from the filesystem during SSR, bypassing network overhead ([#86c8tzpdf](https://app.clickup.com/t/86c8tzpdf)).
- **SSR Documentation**: Created `apps/eco-store/SSR.md` detailing the architecture, configuration, and deployment commands ([#86c8tzpdf](https://app.clickup.com/t/86c8tzpdf)).

### Changed

- **Deployment Workflow**: Migrated `.github/workflows/eco-store-deploy-staging.yml` from GitHub Pages to Cloudflare Workers, removing `_redirects` in favor of server-side routing ([#86c8tzpdf](https://app.clickup.com/t/86c8tzpdf)).
- **CF-Async Script**: Updated `tools/scripts/add-cfasync.cjs` to apply `data-cfasync="false"` to both SSR and CSR index templates, preventing Rocket Loader interference with hydration ([#86c8tzpdf](https://app.clickup.com/t/86c8tzpdf)).
- **App Shell SSR Compatibility**: Refactored `ErrorHandlerService` and `EcoLayoutComponent` with platform checks (`typeof ErrorEvent`, `isTranslationReady` signal) to ensure robust execution in server environments ([#86c8tzpdf](https://app.clickup.com/t/86c8tzpdf)).

## [2026-04-14] - Eco-Store: Cart Merge, Price-Update Notifications & Confirm Dialog Router CTA

### Added

- **Cart merge on login**: Implemented `loadAndMergeUserCart` in `eco-store-cart.store` to automatically merge anonymous localStorage cart items with the authenticated user's remote PocketBase cart on login, summing quantities for duplicate products ([#86c99rw7v](https://app.clickup.com/t/86c99rw7v)).
- **Price-update notification**: Added detection of stale prices when a returning cart is merged; shows an info dialog prompting the user to review updated prices ([#86c99rw7v](https://app.clickup.com/t/86c99rw7v)).
- **Logout cart cleanup**: Added an effect that clears cart entities and localStorage on logout to prevent quantity duplication on the next login session ([#86c99rw7v](https://app.clickup.com/t/86c99rw7v)).
- **Confirm dialog router CTA**: Extended `SharedConfirmDialogService.confirm()` `ok`/`ko` params to accept `{ label, route }` objects that navigate via `[routerLink]` instead of just closing the dialog ([#86c99rw7v](https://app.clickup.com/t/86c99rw7v)).

### Changed

- **i18n (CA/EN/ES)**: Added `cart.mergeNotification` and `cart.priceUpdatedNotification` structured keys (title, message, ko, ok) and `cart.summary.priceChanged` / `cart.summary.priceChangedDescription` keys across all 3 languages ([#86c99rw7v](https://app.clickup.com/t/86c99rw7v)).
- **Alert UI README**: Updated content projection attribute names (`alert-title`, `alert-subtitle`, `alert-extras`) to match the component's current API ([#86c99rw7v](https://app.clickup.com/t/86c99rw7v)).
- **Confirm data-access README**: Updated `confirm()` signature docs to reflect new union-type `ok`/`ko` params and router CTA usage example ([#86c99rw7v](https://app.clickup.com/t/86c99rw7v)).

### Tests

- **Cart store spec**: Expanded `eco-store-cart.store.spec.ts` with comprehensive tests for `loadAndMergeUserCart` (empty carts, merge with remote, quantity summing, price-change notification) and logout behaviour ([#86c99rw7v](https://app.clickup.com/t/86c99rw7v)).

## [2026-04-13] - Eco-Store: Cart UI Refinement and Loading States

### Changed

- **Cart UI Polish**: Removed redundant Material card overrides and refined layout styling across checkout steps ([#86c99ryen](https://app.clickup.com/t/86c99ryen)).
- **Loading States**: Implemented skeleton pulse loaders for cart confirmation and shipping steps to improve perceived performance ([#86c99ryen](https://app.clickup.com/t/86c99ryen)).
- **Order Summary UI**: Refined background styling for the cart order summary card ([#86c99ryen](https://app.clickup.com/t/86c99ryen)).

## [2026-04-12] - Eco-Store: Trial to Active Membership Conversion

### Added

- **Trial Banner Component**: Added `TrialBannerComponent` to `libs/eco-store/profile/basic` to display trial status, days left, and a "Become a Member" call to action ([#86c99eu68](https://www.google.com/search?q=https://github.com/plastikaweb/plastikspace/issues/86c99eu68)).
- **Membership Conversion Logic**: Implemented `convertTrialToActive` in `PocketBaseAuthService` and `pocketBaseUserProfileStore` to allow users to formalize their membership directly from the profile ([#86c99eu68](https://www.google.com/search?q=https://github.com/plastikaweb/plastikspace/issues/86c99eu68)).

### Changed

- **Profile Header Improvements**: Enhanced the profile feature header to display the user's name, role (with icon), and membership date ([#86c99eu68](https://www.google.com/search?q=https://github.com/plastikaweb/plastikspace/issues/86c99eu68)).
- **Refactored Role Icons**: Moved role icon selection logic from individual components to the `pocketBaseUserProfileStore` for better reusability ([#86c99eu68](https://www.google.com/search?q=https://github.com/plastikaweb/plastikspace/issues/86c99eu68)).
- **Translations**: Added multi-language support for trial messages, membership status, and address management empty states ([#86c99eu68](https://www.google.com/search?q=https://github.com/plastikaweb/plastikspace/issues/86c99eu68)).

## [2026-04-11] - Eco-Store: PocketBase Performance Improvements

### Added

- **Benchmark Script**: Added `apps/eco-store/scripts/benchmark-order.ts` to measure order creation performance end-to-end against a running PocketBase instance.

### Performance

- **Order Hook — N+1 Fix**: Refactored `on_create_order.pb.js` to pre-fetch all products and their categories in two bulk queries before processing items, eliminating per-item `findRecordById` calls and significantly reducing order validation time.
- **Order Hook — Cart Cleanup Batching**: Wrapped the post-order cart deletion loop in `e.app.runInTransaction()` so SQLite issues a single commit/fsync for the whole batch instead of one per cart row.
- **Cycle Cron — N+1 Fix**: Refactored `cycle_cron.pb.js` `order_cycle_init` into a three-pass algorithm (plan → pre-fetch existing cycles in one query → create), replacing the previous per-tenant `findFirstRecordByFilter` calls.
- **Cycle Cron — Status Update Batching**: Batched all expired cycle status updates in `order_cycle_status_watcher` inside a single transaction, rolling back the whole batch on failure so the next cron tick retries cleanly.
- **Default Address Hook**: Extracted shared logic from `single_default_address.pb.js` into a reusable `clearOtherDefaults` function and batched the sibling-address `default=false` updates inside a single transaction, reducing N commits to one.
- **Seed Script**: Parallelized initial fixture fetching, order cycle creation, and order generation in `seed.ts` using `Promise.all`. Replaced custom `SeedUser`/`SeedProduct` interfaces with PocketBase's `RecordModel` type.

### Fixed

- **Markdownlint**: Added `**/CLAUDE.md` to the ignore list in `.markdownlint-cli2.yaml` to prevent false linting errors on AI context files.

## [2026-04-10] - Eco-Store: Address Management Enhancements

### Added

- **Edit Address**: Implemented full edit address flow with route-based navigation (`:id`), form pre-population from the store, and optimistic update ([#86c92g5yz](https://app.clickup.com/t/86c92g5yz)).
- **New Address Form**: Implemented a comprehensive form for adding new delivery addresses with full validation ([#86c92g5yz](https://app.clickup.com/t/86c92g5yz)).
- **Spanish Zip Validator**: Added a new custom validator `zipValidator` for Spanish postal codes with associated unit tests ([#86c92g5yz](https://app.clickup.com/t/86c92g5yz)).
- **CanDeactivate Guard**: Added `ecoStoreProfileAddressesCanDeactivateGuard` to prevent accidental data loss when navigating away from modified forms ([#86c92g5yz](https://app.clickup.com/t/86c92g5yz)).
- **Loading UI**: Implemented skeleton loading states for the addresses list to improve perceived performance ([#86c92g5yz](https://app.clickup.com/t/86c92g5yz)).

### Changed

- **Edit Address UX**: The address card being edited is visually dimmed with reduced opacity and disabled interactions to avoid confusion ([#86c92g5yz](https://app.clickup.com/t/86c92g5yz)).
- **Address Card Accessibility**: Enhanced `AddressCardComponent` with computed ARIA labels for better screen reader support ([#86c92g5yz](https://app.clickup.com/t/86c92g5yz)).
- **Localization**: Synchronized Catalan, Spanish, and English translations for all address management features including update notifications ([#86c92g5yz](https://app.clickup.com/t/86c92g5yz)).
- **Profile Store**: Extended `pocketBaseUserProfileStore` with optimistic updates for address creation and editing ([#86c92g5yz](https://app.clickup.com/t/86c92g5yz)).

## [2026-04-09] - Eco-Store: Address Card UI and Profile Addresses Feature

### Added

- **Address Card Component**: Created a new reusable `@plastik/shared/address-card/ui` component for displaying user addresses with selection and action slots ([#86c92g5yn](https://app.clickup.com/t/86c92g5yn)).
- **Profile Addresses Feature**: Implemented a new library `@plastik/eco-store/profile/addresses` for managing user delivery addresses ([#86c92g5yn](https://app.clickup.com/t/86c92g5yn)).
- **Unit Testing**: Implemented unit tests for `AddressCardComponent` and `EcoStoreProfileAddressesFeatureComponent`.
- **Localization**: Added address-related translation strings for Catalan, English, and Spanish.

### Changed

- **Address Selector**: Refactored `AddressSelectorTypeComponent` to use the new `AddressCardComponent`, improving code reuse and visual consistency ([#86c92g5yn](https://app.clickup.com/t/86c92g5yn)).
- **User Profile Store**: Updated `pocketBaseUserProfileStore` to support address management operations (set default, delete).
- **Documentation**: Initialized README files for the new address feature library and updated existing shared UI documentation.
- **PocketBase Hooks**: Renamed and modernized `single_default_address` PocketBase hook to follow `.pb.js` naming convention.

## [2026-04-08] - Eco-Store: Profile Avatar and Image Cropper Integration

### Added

- **Profile Avatar Feature**: Implemented a new library `@plastik/eco-store/profile/avatar` for managing user profile images ([#86c92g5xk](https://app.clickup.com/t/86c92g5xk)).
- **Shared Image Cropper**: Created a reusable `@plastik/shared/img-cropper/ui` component using `ngx-image-cropper` with support for drag and drop and validation ([#86c92g5xk](https://app.clickup.com/t/86c92g5xk)).
- **Avatar Management**: Integrated avatar upload, cropping, and deletion into the profile settings ([#86c92g5xk](https://app.clickup.com/t/86c92g5xk)).
- **Localization**: Added avatar-related translation strings for Catalan, English, and Spanish.
- **Unit Testing**: Added comprehensive test suites for the new avatar and image cropper components.
- **Documentation**: Initialized README files for the new libraries.

### Changed

- **User Profile Store**: Updated `pocketBaseUserProfileStore` and `PocketBaseAuthService` to support avatar updates and deletions ([#86c92g5xk](https://app.clickup.com/t/86c92g5xk)).
- **Profile Navigation**: Integrated the avatar feature into the profile sidenav and routing.
- **UI Consistency**: Refined the profile and product sidenav components for better multi-language support.

## [2026-04-07] - Eco-Store: Profile UI Refinement and Documentation

### Added

- **Profile Form UI**: Applied bolder styling for the Eco-Store profile feature header using outlined components echoing product list views ([#86c92g5x5](https://app.clickup.com/t/86c92g5x5)).
- **Form Layout**: Handled loading state visualization directly on the profile container mapping `profileStore.isLoading()`.
- **Localization**: Added missing profile form translation strings for English and Spanish.
- **Documentation**: Linked profile management feature in core `apps/eco-store/README.md` and initialized feature-specific README doc.

## [2026-04-05] - Eco-Store: Trial Period Expiration Guard

### Added

- **Trial Expired Guard**: Implemented a new guard to prevent checkout when the user's trial has expired, redirecting them to their profile to formalize membership ([#86c93cga0](https://app.clickup.com/t/86c93cga0)).
- **Checkout Protection**: Integrated the trial expiration check into shipping and confirmation steps of the cart checkout flow ([#86c93cga0](https://app.clickup.com/t/86c93cga0)).

## [2026-04-01] - Eco-Store: Authentication Refactoring and Modernization

### Added

- **Modular Auth Features**: Refactored authentication into dedicated standalone feature libraries ([#86c8cjgmy](https://app.clickup.com/t/86c8cjgmy)).
  - `@plastik/eco-store/auth/container`: Shared branded container for auth views.
  - `@plastik/eco-store/auth/feature/login`: Refactored login with modern patterns.
  - `@plastik/eco-store/auth/feature/forgot-password`: New password recovery request feature.
  - `@plastik/eco-store/auth/feature/forgot-password-sent`: New confirmation view for recovery emails.
  - `@plastik/eco-store/auth/feature/reset-password`: New secure password reset feature.
- **Shared Form Providers**: Introduced specialized providers to simplify Formly configuration ([#86c8cjgmy](https://app.clickup.com/t/86c8cjgmy)).
  - `providePlainInputFormly`: Registers standard input types and validation messages.
  - `registerAuthValidatorsTranslateExtension`: Centralized translation for auth-specific validators.
- **Form Configuration Utility**: Created `@plastik/shared/auth/util/config` to centralize auth form structures with full translation support.

### Changed

- **Modern Angular Adoption**: Updated all authentication components to use `inject()`, `signals`, and `ChangeDetectionStrategy.OnPush`.
- **PocketBase Integration**:
  - Refactored `PocketBaseAuthService` and `pocketBaseUserProfileStore` to use modern reactive patterns.
  - Improved password reset logic with better error handling and signal-based loading states.
  - Added `on_password_reset.pb.js` PocketBase hook to send branded, localized HTML emails for password recovery.
- **UI/UX Refinement**:
  - Standardized all auth views to use the new `EcoStoreAuthContainerComponent`.
  - Improved form validation feedback with immediate error visibility.
  - Refined "Back to Store" navigation for PWA standalone mode.
- **Documentation**: Comprehensive updates to README files and JSDoc documentation across authentication and form utility libraries.
- **Localization**: Added missing translation keys for password validation and recovery flows in English, Spanish, and Catalan.

### Fixed

- **Validation Translations**: Resolved issues where password mismatch errors were displayed as untranslated keys by aligning validator return values with Formly's translation mechanism ([#86c8cjgmy](https://app.clickup.com/t/86c8cjgmy)).
- **Type Safety**: Improved `ResetPasswordData` and `LoginData` interfaces for better consistency across the auth stack.

## [2026-03-28] - Eco-Store: Cart Navigation and Shipping Guards

### Added

- **Cart Guards**: Implemented new guards to ensure a smooth cart checkout flow ([#86c8ghha8](https://app.clickup.com/t/86c8ghha8)).
  - `emptyCartGuard`: Automatically redirects the user to the store if the cart is empty.
  - `shippingInfoGuard`: Ensures all required shipping information (address, method, day, time) is selected before proceeding to confirmation.
  - `ecoStoreNotLoggedShippingGuard`: Prompt users to log in or continue as guest when accessing the shipping step.
- **Localization**: Added `notLogged` translation keys for guest checkout prompts.

### Changed

- **ecoStoreCartStore**:
  - Added `isShippingOk` computed signal to centralize shipping validation logic.
  - Automated state reset when all items are removed from the cart.
  - Updated `_recalculatePrices` to handle empty cart states using `withResetEntities`.
- **UI Components**:
  - `EcoMenuComponent` & `EcoMobileNavComponent`: The cart link and buttons are now disabled when the cart is empty, providing immediate visual feedback.
  - Refined translucent background transparency in `_base.scss` and mobile navigation for better readability.
- **Cart Logic**:
  - `cartShippingResolver`: Refactored to use `take(1)` for consistent stream completion.
  - `shippingAvailableGuard`: Integrated `take(1)` for cleaner lifecycle management.

## [2026-03-27] - Eco-Store: Implement Reset Entities and PocketBase Signal State Improvements

### Added

- **Signal State Reset Library**: Created `@plastik/signal-state/reset` to centralize store state resetting logic ([#86c8z1v9g](https://app.clickup.com/t/86c8z1v9g)).
  - Features: `withResetEntities` signal store feature for complete state and entity removal.

### Changed

- **PocketBase Store Features**: Updated `withPocketBaseListFeature`, `withPocketBaseCrud`, and `withPocketBaseGet` to support an `autoLoad` parameter (boolean or function) and a `loaded` state flag ([#86c8z1v9g](https://app.clickup.com/t/86c8z1v9g)).
- **Store Refactoring**:
  - `ecoStoreCartStore`: Replaced manual reset logic with `withResetEntities`.
  - `ecoStoreOrdersStore`: Integrated `withPocketBaseCrud` with `autoLoad` based on authentication state.
- **UI Components**:
  - `EcoMenuComponent` & `EcoMobileNavComponent`: Improved signal usage for cart data and modernized logout navigation logic.
  - `useCartBumpAnimation`: Refactored to accept individual signals for better reactivity and reduced dependency on the full store.

## [2026-03-26] - CSS Compatibility: Fix Styles in Old Systems and Browsers

### Fixed

- **CSS Polyfills**: Added `postcss-preset-env` (`^11.2.0`) to polyfill `light-dark()` and `color-mix()` CSS functions, ensuring consistent visual rendering in older browsers and systems ([#86c909hzm](https://app.clickup.com/t/86c909hzm)).
- **PostCSS Configuration**: Updated `.postcssrc.json` to enable `postcss-preset-env` with `stage: false` and explicit feature flags (`light-dark-function`, `color-mix`) alongside `preserve: true` to maintain modern syntax for supporting browsers.

## [2026-03-26] - Eco-Store: PocketBase Tooling & Asset Refinement

### Changed

- **PocketBase Script Execution**: Modernized `eco-store:pb:seed-gen` and `eco-store:pb:push-gen` scripts in `package.json` to use Node's native `--experimental-strip-types` flag, eliminating the dependency on the deprecated `ts-node/esm` loader.
- **Resource Management**: Renamed the generic `no-results.png` asset to a more descriptive `empty.png` to better align with its use across different empty states and updated all component and documentation references.
- **Documentation**: Updated `POCKETBASE.md` to reflect the latest script usage and environment requirements.

## [2026-03-26] - Eco-Store: Reactive Language Localization

### Added

- **Shared Translation Library**: Created a new `@plastik/shared/translation` library to centralize language management and switching logic ([#86c8cjgh7](https://app.clickup.com/t/86c8cjgh7)).
  - Features: `LanguageSwitcherComponent` for UI and `LanguageSwitcherService` for state management.
  - Implemented persistent language selection using `localStorage`.
- **Reactive i18n**: Integrated `ngx-translate` with Angular Signals for reactive UI updates upon language change ([#86c8cjgh7](https://app.clickup.com/t/86c8cjgh7)).

### Changed

- **State Management**: Refactored `EcoStoreTenantStore` to use reactive signals derived from `TranslateService`, ensuring consistent localization across the application ([#86c8cjgh7](https://app.clickup.com/t/86c8cjgh7)).
- **UI & Accessibility**:
  - Modernized `LanguageSwitcherComponent` with Signal-based inputs and outputs.
  - Updated `index.html` and `AppConfig` to support improved translation initialization.
  - Comprehensive updates to Catalan and Spanish translations with new shared translation keys.
- **Project Configuration**:
  - Added path mapping for `@plastik/shared/translation` in `tsconfig.base.json`.
  - Updated root and app-specific READMEs with a reference to the new translation library.

### Fixed

- **Language Initialization**: Resolved issues where the default language was incorrectly applied on initial load by implementing a robust detection strategy in `LanguageSwitcherService` ([#86c8cjgh7](https://app.clickup.com/t/86c8cjgh7)).
- **Translation Consistency**: Manually synchronized English translations with the new shared translation keys found in Catalan and Spanish versions.

## [2026-03-25] - Eco-Store: Membership Status and Trial Periods

### Added

- **Membership & Trial Periods**: Implemented a comprehensive membership status system supporting `ACTIVE`, `INACTIVE`, `SUSPENDED`, and `TRIAL` states ([#86c90gdxn](https://app.clickup.com/t/86c90gdxn)).
- **Trial Period UX**:
  - Added visual trial status badges in the header and user menu with countdown timers (e.g., "Trial — 5 days left").
  - Implemented an automated "Trial Expired" workflow that prevents checkout and redirects users to formalize their membership.
  - Created a new trial-themed Material symbol (`history_toggle_off`) for the user profile menu.
- **Product Requirements Document (PRD)**: Added `apps/eco-store/eco-store-req.md` containing the full project requirements, objectives, and roadmap for the Eco Store platform.
- **Enhanced PocketBase Tooling**:
  - Added `seed.ts` for automated generation of realistic test data (tenants, users, products, order cycles, and historical orders).
  - Added `push-to-staging.ts` for streamlined deployment of local schema and data to the staging environment.
  - Added new npm scripts for easy seeding and staging management (`eco-store:pb:seed-gen`, `eco-store:pb:push-gen`).
- **Development Agent Skills**: Added a comprehensive set of agent skills and references for Angular development, documentation co-authoring, and frontend design to enhance AI pair programming efficiency.

### Changed

- **User Profile Data Management**:
  - Refactored `pocketBaseUserProfileStore` to include reactive trial logic using signals (`isTrial`, `isTrialExpired`, `trialDaysLeft`).
  - Updated `PocketBaseUser` entity to support the new membership fields.
- **Cart & Checkout Logic**: Updated the cart summary to intercept checkout attempts for expired trials, showing a clear call-to-action dialog.
- **Internationalization**: Comprehensive updates to Catalan and Spanish translations for all trial and membership-related strings.
- **Dependency & Build Config**: Updated `package.json` with new TypeScript-based scripts and `cspell.json` to ignore the new documentation.
- **Code Standardization**:
  - Standardized `EcoStoreAuthLoginComponent` and `PwaNavigationService` to follow project standards by using ES6 private fields (`#`) for injected services.
  - Added missing JSDoc documentation for `goBack` method in the login component.

## [2026-03-24] - Eco-Store: SEO Optimization & PWA Navigation

### Added

- **PWA Standalone Navigation**: Implemented a conditional "Back" button for the login view in PWA standalone mode to ensure iOS users can navigate back to the store.
- **Centralized PWA Detection**: Created `PwaNavigationService` to reliably detect standalone mode across the application with iOS fallbacks.
- **Documentation & Testing**: Added README documentation and comprehensive unit tests for `PwaNavigationService` and updated tests for the login component navigation.

### Fixed

- **SEO Robots Configuration**: Added `robots.txt` to properly manage web crawler access and prevent indexing of private routes like cart and orders. Fixed Lighthouse error where `robots.txt` was returning HTML content.
- **Theme Color Consistency**: Updated `manifest.webmanifest` theme and background colors to match the brand's primary organic aesthetic.

## [2026-03-24] - Eco-Store: Layout Refinement and Global UX Polish

### Added

- **Modern Scrollbar Styling**: Implemented a comprehensive, mode-aware global scrollbar design using both standard `scrollbar-color` and `::-webkit-scrollbar` pseudo-elements. Features primary-hue tinted thumbs, rounded tracks, and smooth hover transitions for a premium, integrated feel across all browsers ([#86c8zmfne](https://app.clickup.com/t/86c8zmfne)).

### Changed

- **Login View Optimization**:
  - Significantly reduced the vertical footprint of the login card to ensure full visibility on smaller viewports (targeted at 725px window height).
  - Refined the "Hero Header" with more compact typography and a scaled-down brand logo (h-24 → h-20).
  - Tightened form field spacing and action button margins for improved informational density without sacrificing readability.
- **Theme Selector Polish**: Re-engineered the floating theme toggle with a subtle glassmorphism backdrop (`backdrop-blur-md` + semi-transparent tint) and refined corner positioning. Added premium hover interactions (opacity and color shifts) to make the utility feel more intentional and integrated with the organic aesthetic.
- **Layout Architecture Simplification**:
  - Removed the redundant `bodyScrollable` route data logic and its associated side-effect in `EcoStoreLayoutService`.
  - Shifted to a cleaner, browser-native overflow strategy that eliminates unnecessary DOM manipulation while maintaining layout stability.
- **View Transitions Refinement**:
  - Streamlined the view transition architecture by removing the manual `ViewTransitionService.setActiveId` dependency from Cart and Product features ([#86c8mf3k6](https://app.clickup.com/t/86c8mf3k6)).
  - Shifted to a cleaner implementation that relies on the native Angular Router `withViewTransitions()` and pure CSS transition names, reducing reactive overhead in component templates.
- **Template Optimization**: Improved `@for` loop efficiency in Product Detail by switching to `$index`-based tracking for images and features, ensuring more robust rendering for dynamic content lists.

### Fixed

- **Viewport Scroll Issues**: Resolved several scroll-related issues ([#86c8mf3k6](https://app.clickup.com/t/86c8mf3k6)):
  - Enabled native `withInMemoryScrolling` in the router configuration for automatic top-scroll restoration and anchor link support.
  - Optimized the global layout scroll logic in `EcoStoreLayoutService` to ensure reliable restoration on mobile (iOS/iPad) by using immediate `auto` behavior and manual `scrollTop` resets.
  - Eliminated restrictive `overflow-y-hidden` enforcements on standalone pages like Login to ensure full viewport scroll.
- **Mobile UX Polish**: Standardized `h-screen` and `overflow-y-auto` combinations across the App Shell to provide a predictable, native-feeling scrolling experience on touch devices.

## [2026-03-23] - Eco-Store: Comprehensive Theming, UI/UX and Performance Overdrive

### Added

- **Light & Dark Mode Integration**: Full mode-aware design system implementation for the `eco-store` application using `light-dark()` CSS functions and OKLCH-derived color scales ([#86c8xhbvw](https://app.clickup.com/t/86c8xhbvw)).
- **Organic and Kind Aesthetic**: Implemented "Earthy Elegance" principles across the workspace, utilizing glassmorphism (`backdrop-blur-xl`), primary-hue organic glows, and earthy tinted neutrals to evoke proximity and warmth.
- **Cinematic Entrance Animations**: Enhanced `reveal-up` utility with organic scale (0.96 → 1) and temporary blur reveals for a premium, "Alive" feel in list item entrances.
- **Fetch Priority Optimization**: Integrated `fetchpriority` attribute logic into `SharedImgContainerComponent` to prioritize critical above-the-fold images (LCP) automatically.

### Changed

- **Login View Redesign**: Completely overhauled the login experience with a modern glassmorphism aesthetic, high-impact editorial typography, and improved semantic hierarchy.
- **Cart & Checkout Refinement**:
  - Enhanced Order Summary card with warmer tinted backgrounds and high-contrast editorial totals.
  - Improved Delivery Summary in the confirmation step to include address names and phone numbers with specialized icon branding.
  - Refined Address and Shipping selectors to integrate selection "checks" perfectly with card borders, eliminating visual gaps.
- **Mobile Menu Contrast Fix**: Re-engineered the floating mobile navigation with mode-aware semantic colors (`neutral-600` light / `neutral-300` dark) and high-impact active states (font-weight 800) for WCAG AA compliance.
- **Sidenav Theming**: Fixed dark mode contrast issues for category buttons by implementing official M3 `secondary-container` tokens and editorial-style group headers.
- **Product Card "Overdrive"**: Upgraded product interactions with multi-layered premium shadows, primary-hue hover glows, and tactile haptic feedback (active scale).
- **State Efficiency**: Optimized `ecoStoreProductsStore` by pre-calculating category lookup Maps, reducing translation complexity from **O(N\*M)** to **O(N+M)** for product lists.
- **Rendering Performance**: Refined `products-grid` with improved padding and Z-index choreography to ensure "overdrive" shadows render perfectly without clipping.
- **Bundle Size Optimization**:
  - **Formly Infrastructure Decoupling**: Moved `EcoStoreFormlyModule` from the initial application shell to specific lazy-loaded routes, significantly reducing the initial bootstrap bundle.
  - **Lazy Store Injection**: Refactored `EcoStorePrefixTitleService` to use dynamic injection, resolving reactive page titles without pulling heavy domain stores into the main chunk.
  - **Deferred Core UI**: Wrapped the global activity overlay in a `@defer` block to prioritize critical path rendering.

### Fixed

- **Shadow Clipping**: Resolved persistent "cut shadow" artifacts by removing restrictive `overflow-hidden` and `content-visibility` properties during active hover states.
- **Corner Radius Synchronization**: Fixed a bug where upper corner radii appeared to disappear on hover by explicitly synchronizing image container and card border-radius variables.
- **Dark Mode Visibility**: Corrected multiple instances of low-contrast elements in dark mode, particularly in sidenav category lists and mobile navigation backgrounds.

## [2026-03-19] - Order Deletion Functionality

### Added

- **Order Deletion**: Integrated a new delete order functionality with a confirmation dialog in the `EcoStoreOrdersListComponent` ([#86c8t8rvr](https://app.clickup.com/t/86c8t8rvr)).

## [2026-03-18] - Order Search and Text Highlighting

### Added

- **Text Highlighting Utility**: Created a new `@plastik/shared/util/highlight` library with a standalone `HighlightPipe` for accent-insensitive text matching ([#86c8r2apa](https://app.clickup.com/t/86c8r2apa)).
- **Search Result Highlighting**: Integrated word highlighting in `OrderCardComponent` to visually emphasize search terms within order item names ([#86c8r2apa](https://app.clickup.com/t/86c8r2apa)).
- **Reactive Autofocus**: Implemented a robust autofocus strategy in `SharedFormFeatureComponent` that correctly tracks signal dependencies and handles re-focusing after data reloads or `inert` state transitions ([#86c8r2apa](https://app.clickup.com/t/86c8r2apa)).

### Changed

- **Refined Search Logic**: Refactored `InputSearchTypeComponent` to enforce a `minLength: 2` requirement for search triggers while maintaining filter reset capability on empty input ([#86c8r2apa](https://app.clickup.com/t/86c8r2apa)).
- **Form Feature Validation**: Updated `SharedFormFeatureComponent` to only emit `temporaryChangeEvent` when the form is valid, preventing premature search reloads on partial inputs ([#86c8r2apa](https://app.clickup.com/t/86c8r2apa)).
- **Order Filter Configuration**: Updated orders filter form config to include explicit `minLength` and `focus` properties for improved UX ([#86c8r2apa](https://app.clickup.com/t/86c8r2apa)).

### Fixed

- **Autofocus Reliability**: Resolved an issue where autofocus failed due to signal access inside asynchronous timers within Angular effects.
- **Search Trigger Consistency**: Fixed cases where searches were firing with a single character, potentially causing unnecessary API calls.

## [2026-03-18] - PocketBase Automation and CI Stability

### Added

- **PocketBase Automation**: Implemented a comprehensive automation suite including `eco-store:pb:seed`, `eco-store:pb:import`, and `eco-store:pb:populate` to streamline local environment setup with staging data and images.
- **ESM Compatibility**: Added local `package.json` in `apps/eco-store/scripts/` with `"type": "module"` and refactored multiple scripts to ES modules, resolving Node 22+ deprecation warnings and ReferenceErrors.
- **CI/CD Resilience**: Enhanced GitHub Action workflows (`ci.yml`, `eco-store-pa11y.yml`, `nasa-images-pa11y.yml`) with dynamic Nx Cloud availability checks to automatically fall back to local execution when cloud limits are exceeded.
- **Schema Synchronization**: Improved `sync-pocketbase-schema.js` with a robust three-pass synchronization logic to handle complex view-to-collection dependencies.

### Changed

- **Intelligent Setup**: Refactored `install:local` to use the new `setup-local.js` orchestrator, consolidating PocketBase binary management, schema synchronization, and data seeding into a single, interactive SERVER lifecycle.
- **Internal Environment Loader**: Updated all PocketBase utilities to use a custom `.env` loader in `load-environment.js`, eliminating external dependencies like `dotenv` in script environments and improving cross-platform compatibility (Linux/macOS).
- **CI Task Visibility**: Improved CI workflow observability by splitting lint, test, and build into distinct steps while suppressing unnecessary Node 22 warnings.

### Fixed

- **PocketBase SDK Alignment**: Fixed authorization and deprecation errors by aligning all scripts with PocketBase SDK v0.23+ (`_superusers` collection, `isSuperuser` checks).
- **Automation Diagnostics**: Enhanced error reporting across `eco-store:pb:import`, `eco-store:pb:seed`, and `eco-store:pb:export` to provide detailed diagnostics for file and record synchronization failures.
- **CI Workflow Logic**: Resolved issues where `nx fix-ci` was incorrectly triggered and fixed workspace-wide Vitest configuration inconsistencies.
- Updated PocketBase to version `0.36.7` in the automated download script.

## [2026-03-17] - Order Sorting and UI Consistency

### Added

- Implemented order sorting by status and update date in the user's order list ([#86c8r2ar3](https://app.clickup.com/t/86c8r2ar3))
- Added localized sort labels for orders list across English, Spanish, and Catalan.
- Automated local PocketBase initialization and schema synchronization via `populate-pocketbase.js` utility.
- Integrated database population into `install:local` and `eco-store:local` workflows.

### Changed

- Updated `EcoStoreOrdersListComponent` to include the `SortSelectorComponent` and unified the sorting navigation logic ([#86c8r2ar3](https://app.clickup.com/t/86c8r2ar3))
- Renamed `sortProducts` to `sort` in `EcoStoreProductsFeatureComponent` for better consistency across feature components.
- Enhanced `EcoStoreOrdersStore` with dynamic sorting options for order status.
- Updated README files for orders and products features to include sorting capabilities.
- Refactored `download-pocketbase.js` to improve code quality, logging standards, and Linux compatibility.
- Made `sort` methods explicitly `public` in feature components to ensure robust type resolution in tests.

### Fixed

- Fixed unit tests for `EcoStoreOrdersListComponent` and `EcoStoreProductsFeatureComponent` by adding missing router context and sort method verification.
- Fixed unit tests for `EcoStoreOrdersStore` to verify the presence of status sort options.

## [2026-03-16] - Refactoring, Performance, and Linux Support

### Added

- Added support for Linux systems in the PocketBase download script, including HTTP redirect handling and a fallback for extraction using `python3 -m zipfile` if `unzip` is missing.

### Changed

- Moved `EcoStoreLayoutService` from `@plastik/eco-store/entities` to `@plastik/eco-store/layout` to correctly align with DDD boundaries.
- Refactored `EcoStoreLayoutService` and `BodyBackgroundService` to use strict ES6 private fields (`#`) for improved internal state management.
- Improved `EcoStoreLayoutService` scrolling logic by replacing manual `requestAnimationFrame` and `setTimeout` with the modern Angular `afterNextRender` hook for more predictable execution timing.
- Optimized `withPocketBaseCrud` store feature by replacing `any` casts with proper `keyof T` type checks in the sorting logic.
- Updated documentation across `core/entities` and `core/layout` libraries to reflect architectural changes and new features.

### Fixed

- Fixed malformed JSDoc return type for `EcoStoreLayoutService.#getRouteData`.
- Resolved potential NG0602 error in `EcoStoreLayoutService` by wrapping the render hook call in `untracked()`.

## [2026-03-16] - Contextual Backgrounds and UI Modernization

### Added

- Implemented dynamic, contextual background illustrations for the `eco-store` application based on the active route.
- Generated a suite of hand-drawn, whimsical assets using AI (Leaf, Strawberries, Basket, Box, Shopping Bag, Wheat) matching the "no-results" style.
- Created `BodyBackgroundService` using Angular Signals to automatically manage `body` background classes based on the first URL segment.
- Integrated `provideEnvironmentInitializer` in layout routes to decouple background management from UI components.
- Installation script for PocketBase binary.

### Changed

- Enhanced visual contrast for body text across `eco-store` components (Shipping Unavailable, Cart Confirmation, Product Detail, Order Cards) to ensure WCAG AA compliance.
- Refined UX copy in internationalization files (`en.json`, `ca.json`, `es.json`) for better clarity and tone.
- Increased global paragraph `line-height` to `1.6` in `_base.scss` for improved reading flow.
- Modernized `SharedImgContainerComponent` template using property-based `[ngTemplateOutlet]` and `@let` for cleaner, more declarative logic.
- Improved `withPocketBaseCrud` store feature to maintain UI sorting when a new entity is created by manually managing state updates instead of using the default `addEntity`.
- Refined global styles in `_base.scss` with CSS variables for background images, including smooth transitions and responsive visibility (desktop only).
- Improved accessibility focus ring color by switching from hardcoded values to the theme-friendly `var(--tertiary-600)`.
- Optimized generated images with a custom Python script to ensure true alpha channel transparency and better blending with background gradients.

### Fixed

- Resolved background image conflict with Tailwind gradients by moving decorative imagery to a `body::before` pseudo-element.
- Fixed "fake" checkerboard transparency issues in generated assets by re-processing them with a custom white-to-alpha threshold script.
- Fixed CI workflow to use correct versions and coverage reporting.
- Updated README files to include installation instructions for PocketBase binary.

## [2026-03-14] - CI Fixes, UI Image Optimization and Accessibility Enhancements

### Added

- Implemented reusable `EcoStoreSharedNoResultsComponent` for consistent empty states across the application ([#86c8ryj2q](https://app.clickup.com/t/86c8ryj2q))

### Changed

- Enhanced accessibility in orders and products lists by implementing semantic landmarks (`<main>`, `role="region"`), list structures (`<ul>`, `<li>`), and establish proper heading hierarchy ([#86c8ryj2q](https://app.clickup.com/t/86c8ryj2q))
- Improved `CartOrderSummaryComponent` by centralizing submission availability logic, simplifying inputs, and enhancing disabled state handling ([#86c8ryj2q](https://app.clickup.com/t/86c8ryj2q))
- Improved loading state announcements with `aria-live` regions, `aria-busy` indicators, and `inert` attribute application ([#86c8ryj2q](https://app.clickup.com/t/86c8ryj2q))
- Enhanced order cards with detailed ARIA labels and `role="article"` for better screen reader support ([#86c8ryj2q](https://app.clickup.com/t/86c8ryj2q))
- Updated translation files (en, es, ca) with comprehensive accessibility and empty state keys ([#86c8ryj2q](https://app.clickup.com/t/86c8ryj2q))
- Refactored cart and orders empty states to use the new shared component with correct content projection and improved "Go to Store" action styling ([#86c8ryj2q](https://app.clickup.com/t/86c8ryj2q))
- Implemented dynamic preconnect links in `AppComponent` for both API and application origins to optimize image delivery and resolve `NgOptimizedImage` warnings ([#86c8ryj2q](https://app.clickup.com/t/86c8ryj2q))
- Updated unit tests with automated accessibility checks using `vitest-axe` and more robust element selectors ([#86c8ryj2q](https://app.clickup.com/t/86c8ryj2q))
- Improved CI coverage reporting logic with better debug logging and more robust calculation ([#86c8tqjma](https://app.clickup.com/t/86c8tqjma))
- Enabled coverage badge updates for pushes to the main branch ([#86c8tqjma](https://app.clickup.com/t/86c8tqjma))
- Synchronized Angular package versions to 21.1.2 to resolve compiler mismatch in CI ([#86c8tqjma](https://app.clickup.com/t/86c8tqjma))
- Optimized image loading in order views using `SharedImgContainerComponent` ([#86c8uj73e](https://app.clickup.com/t/86c8uj73e))
- Exposed local assets under `local/img` via `project.json` and updated storage loader to support path bypass ([#86c8uj73e](https://app.clickup.com/t/86c8uj73e))
- Improved product list loading experience with UI indicators and refined pagination logic ([#86c8ujubv](https://app.clickup.com/t/86c8ujubv))
- Applied `inert` attribute to orders and products lists during loading to prevent keyboard interaction and improve accessibility
- Implemented safer array-based filter concatenation in `EcoStoreProductsApiService` to prevent syntax errors with empty values
- Refactored `EcoStoreProductsFeatureComponent` and `EcoStoreOrdersListComponent` to ensure injected dependencies are `protected readonly`, use host bindings for accessibility, and added missing JSDoc documentation
- Enhanced `pocketBaseStorageLoader` JSDoc to document absolute and local path bypass logic

### Fixed

- Resolved missing i18n keys for orders empty state illustration ([#86c8tqjma](https://app.clickup.com/t/86c8tqjma))
- Corrected attribute order for `NgOptimizedImage` compliance ([#86c8tqjma](https://app.clickup.com/t/86c8tqjma))
- Reverted GitHub Actions to stable versions for better reliability ([#86c8tqjma](https://app.clickup.com/t/86c8tqjma))
- Resolved category routing issue by removing redundant slug from product list resolver ([#86c8ujubv](https://app.clickup.com/t/86c8ujubv))

## [2026-03-13] - Order Filtering and Shared UI Components

### Added

- Implemented order filtering by status in the user's order list ([#86c8r2ajj](https://app.clickup.com/t/86c8r2ajj))
- Created a new `select-with-icons` shared UI component with status-aware styling ([#86c8r2ajj](https://app.clickup.com/t/86c8r2ajj))
- Added localized status labels and status-specific empty state messages for orders ([#86c8r2ajj](https://app.clickup.com/t/86c8r2ajj))

### Changed

- Updated `withPocketBaseListFeature` to correctly format complex filters ([#86c8r2ajj](https://app.clickup.com/t/86c8r2ajj))
- Refactored `EcoStoreOrderStatus` to use centralized status configuration ([#86c8r2ajj](https://app.clickup.com/t/86c8r2ajj))

### Fixed

- Fixed test coverage summary reporting for CI badges ([#86c8tqjma](https://app.clickup.com/t/86c8tqjma))
- Corrected CI workflow test flag from `--code-coverage` to `--coverage` ([#86c8tqjma](https://app.clickup.com/t/86c8tqjma))

## [2026-03-12] - Performance, SEO and Deployment Optimizations

### Added

- Implemented early `preconnect` and `dns-prefetch` for Google Fonts and API backend to improve FCP ([#86c8cjggm](https://app.clickup.com/t/86c8cjggm))
- Added asynchronous loading for Material Symbols stylesheet using `preload` pattern to avoid render-blocking ([#86c8cjggm](https://app.clickup.com/t/86c8cjggm))
- Added dynamic meta description in `AppComponent` based on translated tenant description for better SEO ([#86c8cjggm](https://app.clickup.com/t/86c8cjggm))
- Introduced `build-cf` target and `add-cfasync.js` script to bypass Cloudflare Rocket Loader for application scripts ([#86c8cjggm](https://app.clickup.com/t/86c8cjggm))

### Changed

- Updated `LOADING_STRATEGIES.md` with documentation on `index.html` performance optimizations ([#86c8cjggm](https://app.clickup.com/t/86c8cjggm))
- Refined `ecoStoreTenantStore` to include `tenantDescriptionTranslated` computed signal ([#86c8cjggm](https://app.clickup.com/t/86c8cjggm))
- Optimized `cspell.json` and staging deployment workflow ([#86c8cjggm](https://app.clickup.com/t/86c8cjggm))

### Fixed

- Resolved order creation flow issues to prevent cart reset on failure ([#86c8tkjx7](https://app.clickup.com/t/86c8tkjx7))
- Improved `on_create_order` PocketBase hook with better tax calculation and robust item name handling ([#86c8tkjx7](https://app.clickup.com/t/86c8tkjx7))
- Added unit tests for `AppComponent` ensuring correct preconnect injection and SVG icon registration ([#86c8cjggm](https://app.clickup.com/t/86c8cjggm))

---

## [2026-03-12] - Checkout improvements and PocketBase verification

### Added

- Added server-side price verification and total calculation for orders in PocketBase ([#86c8t0h3e](https://app.clickup.com/t/86c8t0h3e))
- Added timezone-aware scheduling for order cycles in PocketBase ([#86c8t0h3e](https://app.clickup.com/t/86c8t0h3e))

### Changed

- Refactored cart items grouping for better template performance ([#86c8t0h3e](https://app.clickup.com/t/86c8t0h3e))
- Optimized notification durations and actions ([#86c8t0h3e](https://app.clickup.com/t/86c8t0h3e))

### Fixed

- Fixed optional label support in textarea components ([#86c8t0h3e](https://app.clickup.com/t/86c8t0h3e))
- Fixed optional toast ID handling in notification service ([#86c8t0h3e](https://app.clickup.com/t/86c8t0h3e))

---

## [2026-03-11] - Orders List UI, i18n & Accessibility Fixes

### Added

- Improved empty state for the orders list with an icon, description, and "Go to Store" call-to-action button.
- Added missing translation keys (`emptyDescription`, `goToStore`) for the orders list across English, Spanish, and Catalan.
- Synchronized translation files to ensure consistency across all supported languages.

### Changed

- Refined vertical centering for the empty state in `EcoStoreOrdersListComponent` using flexbox and updated CSS.
- Updated `EcoStoreOrdersListComponent` to include `RouterLink` for navigation to the store.
- Fixed accessibility issue by replacing `<header>` with `<div>` in `EcoStoreOrdersListComponent` to avoid landmark nesting violations.
- Updated README for `libs/eco-store/orders/feature/list` to include the "Empty State" feature.
- Standardized the README title and description for `libs/eco-store/orders/feature/created` library.

### Fixed

- Fixed unit tests for `EcoStoreOrdersListComponent` and `OrderCardComponent` by providing necessary router context and improving translation mocks.
- Resolved typo in HTML tag closing in `EcoStoreOrdersListComponent`.

## [2026-03-11] - Orders List, i18n & Documentation

### Added

- Created README documentation for `libs/eco-store/orders/feature/list` and `libs/eco-store/orders/feature/detail` features.
- Implemented comprehensive unit tests with accessibility checks (Axe) for:
  - `SharedChipComponent` in `@plastik/shared/chip/ui`.
  - `OrderCardComponent` in `@plastik/eco-store/orders/feature/list`.
  - `EcoStoreOrdersListComponent` in `@plastik/eco-store/orders/feature/list`.
- Added missing translation keys for orders (`list.list`, `deliveryMethod`) across English, Catalan, and Spanish i18n files.

### Changed

- Updated main `README.md` and `apps/eco-store/README.md` with links to the new order feature libraries.
- Standardized unit test patterns for signal-based components and accessibility validation.

## [2026-03-10] - AI Agent Readiness & Modernization

### Added

- Created a comprehensive set of agent skills for **Cursor**, **Gemini**, and **OpenCode** IDEs, focusing on **Nx workspace management**, **CI monitoring**, and **automated dependency linking** ([#86c8r2534](https://app.clickup.com/t/86c8r2534)).
- Added `AGENTS.md` to track and summarize the integration of agentic infrastructure.
- Added `opencode.json` configuration for the **OpenCode** IDE integration.
- Added pocketbase best practices skills.
- Added a new internal path mapping for `@plastik/eco-store/orders/created` in `tsconfig.base.json`.

### Changed

- Standardized `generateOrderNumber` helper to include the normalized tenant name for better traceability ([#86c8r2534](https://app.clickup.com/t/86c8r2534)).
- Improved `activityStore.setActivity` method with a default message fallback.
- Restructured `eco-store-order-confirmation` feature into a new library `libs/eco-store/orders/feature/created` to follow modern naming conventions.
- Formatted `tsconfig.base.json` for better readability and structure.

### Fixed

- Resolved redundant configuration in `cspell.json`.
- Updated `.mcp.json` by removing legacy project-specific configurations.

---

## [2026-03-10] - Hot Toast Notification

### Added

- Added hot toast shared library (`shared/notification/ui/hot-toast`) and applied it to the `eco-store` app ([#86c8cjgk7](https://app.clickup.com/t/86c8cjgk7))
  - Integrated `SharedNotificationUiHotToastComponent` into `AppComponent`.
  - Added notification configuration to `notificationStore`.
  - Added `productAdded` and `productRemoved` i18n keys for cart notifications.
  - Added path mapping for `@plastik/shared/notification/ui/hot-toast` in `tsconfig.base.json`.

### Changed

- Updated `README.md` with the new hot toast shared library.
- Standardized Vitest setup files and naming conventions (`setup-vitest.d.ts`) across multiple shared libraries.
- Aligned `tsconfig.lib.json` and `tsconfig.spec.json` configurations for better project consistency.

### Fixed

- Fixed `$schema` path in `shared-notification-entities` project configuration.
- Improved `pocketBaseStorageLoader` query parameter handling for better URL generation.

---

## [2026-03-07] - Vitest Migration & Systemic Fixes

### Changed

- Migrated workspace-wide testing from Jest to Vitest ([#86c8nmpfz](https://app.clickup.com/t/86c8nmpfz))
  - Patched 130+ `vite.config.mts` files with `ssr.noExternal` for Firebase and Apollo.
  - Updated `tsconfig.base.json` and `nx.json` to standardize on Vitest.
  - Refactored `done()` callbacks and fixed `IntersectionObserver` mocks in unit tests.

### Fixed

- Resolved "Cannot find type definition" errors by removing legacy Jest types ([#86c8nmpfz](https://app.clickup.com/t/86c8nmpfz))
- Fixed assertion type mismatches in `eco-store` spec files by adding explicit Vitest imports ([#86c8nmpfz](https://app.clickup.com/t/86c8nmpfz))

---

## [2026-03-06] - Themes, UI & PWA Standardization

### Added

- Added honey and test themes for eco-store ([#86c8mnyxt](https://app.clickup.com/t/86c8mnyxt))
- Standardized PWA manifest and updated brand icons for eco-store ([#86c8mhjye](https://app.clickup.com/t/86c8mhjye))
  - Moved and renamed `site.webmanifest` to `public/manifest.webmanifest`.
  - Updated icons to use new brand primary green `#356a1f`.
  - Added JSON schema and VS Code file associations for better manifest linting.

### Changed

- Refined product quantity and cart component material overrides ([#86c8mnyxt](https://app.clickup.com/t/86c8mnyxt))
- Updated transition durations and hover states for buttons across UI components ([#86c8mnyxt](https://app.clickup.com/t/86c8mnyxt))

### Fixed

- Updated Jules analysis workflow with explicit GH_TOKEN export instructions for the GitHub CLI.
- Fixed old iOS Safari and Chrome loading issue by forcing esbuild to transpile static blocks ([#86c8mf42g](https://app.clickup.com/t/86c8mf42g))

---

## [2026-03-05] - Router State, i18n & Accessibility Improvements

### Added

- Created `eco-store-router-data-access` library (`@plastik/eco-store/core/router-state`) with `EcoStorePrefixTitleService`,
  `EcoStoreCategoryRouteTitleService`, and `EcoStoreCategoryProductTitleService` for reactive, signal-based page title resolution
  ([#86c8hgkev](https://app.clickup.com/t/86c8hgkev))
- Added `findProductBySlug` computed signal factory to `ecoStoreProductsStore` for signal-based product title lookup
  ([#86c8hgkev](https://app.clickup.com/t/86c8hgkev))
- Added mock store factories for `ecoStoreProductsStore` and `ecoStoreProductCategoriesStore` accessible via `/testing` sub-paths
  ([#86c8hgkev](https://app.clickup.com/t/86c8hgkev))
- Added `title: 'auth.login.title'` i18n key to the login route for translated browser tab titles
  ([#86c8hgkev](https://app.clickup.com/t/86c8hgkev))
- Added `title` resolver to the order confirmation route using `EcoStoreCategoryRouteTitleService`
  ([#86c8hgkev](https://app.clickup.com/t/86c8hgkev))
- Integrated `EcoStorePrefixTitleService` as the `TitleStrategy` in `eco-store` application configuration
  ([#86c8hgkev](https://app.clickup.com/t/86c8hgkev))
- Updated Catalan, Spanish, and English i18n JSON files with missing translation keys
  ([#86c8hgkev](https://app.clickup.com/t/86c8hgkev))

### Changed

- Refactored core `PrefixTitleService` to be Signal-based and reactive using Angular `effect()`, replacing the previous subscription approach
  ([#86c8hgkev](https://app.clickup.com/t/86c8hgkev))
- Refactored `skeletonItems` logic to use `linkedSignal` across all cart feature steps (shipping, confirmation) for better synchronization with store state
  ([#86c8hgkev](https://app.clickup.com/t/86c8hgkev))
- Improved accessibility by adding `aria-hidden="true"` to skeleton loaders and decorative pulse animations across cart and product components
  ([#86c8hgkev](https://app.clickup.com/t/86c8hgkev))
- Added JSDoc documentation to complex `skeletonItems` computation logic in `EcoStoreProductsFeatureComponent`
  ([#86c8hgkev](https://app.clickup.com/t/86c8hgkev))
- Moved `EcoStoreCategoryRouteTitleService` from `eco-store/core/layout` into the new `eco-store/core/router` library
  ([#86c8hgkev](https://app.clickup.com/t/86c8hgkev))
- Updated `tsconfig.base.json` with path mapping for `@plastik/eco-store/core/router-state`
  ([#86c8hgkev](https://app.clickup.com/t/86c8hgkev))
- Optimized history iteration in `NavigationService` by replacing `for...of` with `Array.prototype.find()`
  ([#949](https://github.com/plastikaweb/plastikspace/pull/949))
- Refactored `eco-store-products` store dependencies to strictly use ES6 private fields
  ([#86c8hgkev](https://app.clickup.com/t/86c8hgkev))

### Fixed

- Fixed Jules analysis workflow by injecting the GitHub token to authenticate the `gh` CLI for PR comments.
- Fixed `ExpressionChangedAfterItHasBeenCheckedError` in `shared-util-dynamic-bg-color` unit test by adjusting the initialization order.
- Fixed missing project references and compiler paths in `eco-store/core/router` and `shared/util/dynamic-bg-color` `tsconfig.spec.json` files.
- Fixed unit tests and tsconfig configurations for `shared-product-price` library
  ([#86c8hgkev](https://app.clickup.com/t/86c8hgkev))

---

## [2026-03-04] - API Loading State Review & Documentation

### Added

- Added `LOADING_STRATEGIES.md` at `apps/eco-store` documenting all five loading-state strategies
  ([#86c8jmwp4](https://app.clickup.com/t/86c8jmwp4))
- Added missing unit tests for `ecoStoreOrdersStore` covering `createOrder()` orchestration, loading-state lifecycle, cart conversion, and post-checkout navigation ([#86c8jmwp4](https://app.clickup.com/t/86c8jmwp4))
- Added missing unit tests for `pocketBaseActivityInterceptor` covering opt-in header behaviour, debounce, and silent-request passthrough ([#86c8jmwp4](https://app.clickup.com/t/86c8jmwp4))

### Changed

- Updated `shared/activity/data-access` README to document the `pocketBaseActivityInterceptor`,
  the opt-in `require-global-loading` header pattern, `setActivity()` manual control, and correct testing ([#86c8jmwp4](https://app.clickup.com/t/86c8jmwp4))
- Updated `eco-store/orders/data-access` README to document the explicit `activityStore` loading strategy used in `createOrder()` and link to the central loading-strategies document ([#86c8jmwp4](https://app.clickup.com/t/86c8jmwp4))
- Updated `eco-store/cart/data-access` and `eco-store/cart/feature` READMEs with loading strategy notes linking to the central document ([#86c8jmwp4](https://app.clickup.com/t/86c8jmwp4))
- Updated `apps/eco-store` README with a link to the new architecture documentation section ([#86c8jmwp4](https://app.clickup.com/t/86c8jmwp4))

---

## [2026-03-03] - Jules PR Analysis, Order Confirmation & Testing Fixes

### Added

- Added Jules PR analysis workflow for automated code review in modern Angular 21 projects. ([#86c8kbgu3](https://app.clickup.com/t/86c8kbgu3))
- Implemented `EcoStoreOrder` confirmation feature with dedicated lazy-loaded feature library, UI component, and routing. ([#86c8cjgmf](https://app.clickup.com/t/86c8cjgmf))
- Added order confirmation email using a translated template inside the `on_create_order` PocketBase hook. ([#86c8hgazq](https://app.clickup.com/t/86c8hgazq))
- Added `language` field to `EcoStoreOrder` entity to determine the language for the confirmation email. ([#86c8hgazq](https://app.clickup.com/t/86c8hgazq))

### Fixed

- Fixed environment mock import paths and standalone spec configurations across multiple test suites.
- Fixed `$app` to `e.app` and `id` to `getId()` calls in PocketBase hooks. ([#86c8hgazq](https://app.clickup.com/t/86c8hgazq))
- Fixed PB hooks documentation to properly reference `on_create_order.pb.js`. ([#86c8hgazq](https://app.clickup.com/t/86c8hgazq))

---

## [2026-03-02] - Signal Store Refactoring & Type Cleanup

### Added

- Created `eco-store-orders-data-access` library with `EcoStoreOrder` entity, API service, and Signal Store. ([#86c8hgazq](https://app.clickup.com/t/86c8hgazq))
- Added `createOrder()` method to orders store orchestrating checkout flow (order creation, cart reset, navigation). ([#86c8hgazq](https://app.clickup.com/t/86c8hgazq))
- Added `CartFinishComponent` and `/cistella/:id` route for post-checkout confirmation page. ([#86c8hgazq](https://app.clickup.com/t/86c8hgazq))
- Added `toOrder()` and `resetCartAfterCheckout()` methods to the cart store. ([#86c8hgazq](https://app.clickup.com/t/86c8hgazq))

### Changed

- Refactored `withPocketBaseCrud` CRUD mutations (`create`, `update`, `delete`) from `rxMethod` to plain `async` methods returning `Promise<T>`. ([#86c8hgazq](https://app.clickup.com/t/86c8hgazq))
- Refactored signal stores across `eco-store` and `shared` libraries to improve type safety and remove unnecessary type assertions.
- Updated `tsconfig.base.json` with correct path mappings and project configurations.
- Fixed `isDevMode` implementation in `PocketBaseTenantStore` for proper conditional DevTools integration.

### Fixed

- Fixed `EcoStoreProduct` and `ProductCategory` type inconsistencies with base PocketBase entities.
- Configured project references in `products-data-access` library `tsconfig` to align with the composite build architecture.
- Fixed cart re-sync error after checkout by keeping `isSynced: true` in `resetCartAfterCheckout()`. ([#86c8hgazq](https://app.clickup.com/t/86c8hgazq))
- Made remote cart lookup in `_loadAndMergeUserCart` gracefully handle missing carts (returns `null` instead of throwing). ([#86c8hgazq](https://app.clickup.com/t/86c8hgazq))

---

## [2026-03-02] - NASA Images Performance & Defer Loading

### Added

- Implemented `@defer` blocks in NASA images search and FAQs features to optimize initial load and improve performance. ([#86c8ftb3j](https://app.clickup.com/t/86c8ftb3j))
- Exported `layout.effects` and `layout.feature` from `core-cms-layout` data-access. ([#86c8ftb3j](https://app.clickup.com/t/86c8ftb3j))

### Changed

- Updated NASA images search routes to include `provideFormlyConfig()` and `NASA_IMAGES_PROVIDERS` for better configuration management. ([#86c8ftb3j](https://app.clickup.com/t/86c8ftb3j))
- Refined NASA images search table configuration with explicit thumbnail dimensions. ([#86c8ftb3j](https://app.clickup.com/t/86c8ftb3j))
- Optimized bundle size by replacing `AngularSvgIconModule` with `SvgIconComponent` in `CoreCmsLayoutFeatureComponent`. ([#86c8ftb3j](https://app.clickup.com/t/86c8ftb3j))
- Reduced `maximumError` bundle size threshold for `nasa-images` application. ([#86c8ftb3j](https://app.clickup.com/t/86c8ftb3j))

---

## [2026-03-01] - Stitch Agent Skills

### Added

- Added stitch skills for UI generation, react components, remotion, and design-md

---

## [2026-03-01] - Store Status Banner & Loading State Enhancements

### Added

- Added local `isLoading` and `error` state management to products and categories signal stores, replacing global activity loaders. ([#86c8hbc26](https://app.clickup.com/t/86c8hbc26))
- Implemented skeleton loading UI pattern in the products grid. ([#86c8hbc26](https://app.clickup.com/t/86c8hbc26))

### Changed

- Made the `store-status-banner`'s countdown and top-bar tenant logo natively responsive. ([#86c8hbc26](https://app.clickup.com/t/86c8hbc26))
- Cleaned up redundant `isActiveForTransition` view transition bindings across product cards. ([#86c8hbc26](https://app.clickup.com/t/86c8hbc26))
- Refactored `shared-img-container` to compute and apply CSS `aspect-ratio` automatically. ([#86c8hbc26](https://app.clickup.com/t/86c8hbc26))
- Restructured product detail breadcrumbs to include the category's icon. ([#86c8hbc26](https://app.clickup.com/t/86c8hbc26))
- Inverted PocketBase interceptor logic to use explicit `require-global-loading`. ([#86c8hbc26](https://app.clickup.com/t/86c8hbc26))

### Fixed

- Fixed typescript composite build errors by removing `composite: true` and external references from `products/data-access` and `shared/store-status-banner` tsconfig files. ([#86c8hbc26](https://app.clickup.com/t/86c8hbc26))

---

## [2026-03-01] - PocketBase Loading Params Fix

### Fixed

- Fixed pocketbase store parameter update loop by properly tracking object equality and preventing redundant fetches. ([#86c8hant7](https://app.clickup.com/t/86c8hant7))
- Fixed the `areObjectEntriesEqual` method to accurately compare objects with different keys or values. ([#86c8hant7](https://app.clickup.com/t/86c8hant7))

---

## [2026-02-28] - View Transitions Service

### Added

- Added ViewTransitionsService and ViewportTransitionNameDirective within a new library (`shared-util-view-transition`) to support view transitions and prevent broken animations ([86c8h2kjj](https://app.clickup.com/t/86c8h2kjj))

### Changed

- Updated products grid, detail view, and custom cards in `eco-store` to use `ViewTransitionsService` for smooth transitions between listing and product details ([86c8h2kjj](https://app.clickup.com/t/86c8h2kjj))

---

## [2026-02-28] - ngx-translate evaluate errors

### Fixed

- Resolved ngx-translate evaluate errors, updated HTML evaluation for csp, and refactored product quantity controls ([86c8h2gjm](https://app.clickup.com/t/86c8h2gjm))

---

## [2026-02-26] - Confirmation Checkout View

### Added

- Implemented the confirmation checkout step and view ([86c8cjgmk](https://app.clickup.com/t/86c8cjgmk))

### Changed

- Enhanced product cards and checkout layout with improved hover states, shadows, and backdrop blur effects
- Implemented ICU pluralization support for character counts in translation files
- Improved form validation UX by triggering on blur for checkout notes

---

## [2026-02-26] - Tailwind Collision Fix

### Fixed

- Fixed collision naming with tailwind ([86c8fq7wh](https://app.clickup.com/t/86c8fq7wh))

---

## [2026-02-26] - Dependencies Update

### Changed

- Bumped the npm_and_yarn group across 1 directory with 2 updates
- Bumped basic-ftp in the npm_and_yarn group across 1 directory

### Added

- Added `ngx-translate-messageformat-compiler` and `@messageformat/core` for ICU message support

---

## [2026-02-26] - Shipping Logic Refactoring

### Changed

- Refactored shipping logic in cart and tenant stores to simplify logistics state and improve code organization ([86c8f9zu0](https://app.clickup.com/t/86c8f9zu0))
- Updated Formly field configurations to use prioritized tenant logistics settings ([86c8f9zu0](https://app.clickup.com/t/86c8f9zu0))
- Simplified logistics state in cart store by removing redundant properties ([86c8f9zu0](https://app.clickup.com/t/86c8f9zu0))
- Improved `getTiersOrInstructions` logic in tenant store to prioritize address-specific configurations ([86c8f9zu0](https://app.clickup.com/t/86c8f9zu0))

### Added

- Added crossorigin attribute to API preconnect link ([#86c8fpm3n](https://app.clickup.com/t/86c8fpm3n))

---

## [2026-02-25] - Checkout Shipping View Responsive

### Changed

- Refactored checkout shipping view and shipping method selector for improved responsiveness and layout stability ([86c8cjggp](https://app.clickup.com/t/86c8cjggp))
- Converted custom label component to use CSS Grid for better alignment and responsive behavior ([86c8cjggp](https://app.clickup.com/t/86c8cjggp))
- Fixed multiple emissions and redundant state updates in cart shipping feature ([86c8cjggp](https://app.clickup.com/t/86c8cjggp))
- Added unit tests and improved accessibility for address and shipping selector components ([86c8cjggp](https://app.clickup.com/t/86c8cjggp))

---

## [2026-02-25] - Tenant Subdomain Resolution Fix

### Fixed

- Simplified tenant slug resolution in `EcoStoreTenantService` to correctly handle `www.` and `admin.` prefixes on staging subdomains (e.g., `el-llevat.9botiga.top`) ([86c8cjggg](https://app.clickup.com/t/86c8cjggg))

---

## [2026-02-24] - Shared Chip Component Refactoring & Bundle Audit

### Added

- Created a reusable `SharedChipComponent` in `@plastik/shared/chip/ui` to standardize semantic badges across the application ([86c8ec5zd](https://app.clickup.com/t/86c8ec5zd))
  - Features: Semantic types (primary, success, warning, error, neutral, tertiary), icon support (MatIcon), built-in accessibility (role="status"), and performance optimization (Angular Signals, OnPush).

### Changed

- Refactored product cards, price display, detail view (ECO, NOVETAT, OFERTA tags), and store status window to use the new shared chip component, ensuring consistent styling and better maintenance ([86c8ec5zd](https://app.clickup.com/t/86c8ec5zd))
- Updated README documentation for all affected libraries to reflect the new shared chip integration ([86c8ec5zd](https://app.clickup.com/t/86c8ec5zd))

### Performance

- Optimized initial bundle size by ensuring `MatChipsModule` remains excluded from the initial payload ([86c8ec5zd](https://app.clickup.com/t/86c8ec5zd))
- Conducted a bundle audit identifying heavy dependencies for future lazy-loading optimizations:
  - `@angular/material/datepicker` (~192kB)
  - `@firebase/auth` (~438kB)
  - `@angular/material/chips` & `list` (~220kB total)

---

## [2026-02-24] - LCP & Security Optimizations

### Changed

- Resolved CSP violation error in staging by adding Google Fonts domains to the `connect-src` directive ([86c8e5jcy](https://app.clickup.com/t/86c8e5jcy))
- Optimized LCP by parallelizing categories and products data fetching in the `eco-store` products resolver ([86c8e5jcy](https://app.clickup.com/t/86c8e5jcy))
- Reduced Cumulative Layout Shift (CLS) in the products grid feature ([86c8e5jcy](https://app.clickup.com/t/86c8e5jcy))
- Updated `cspell.json` configuration ([86c8e5jcy](https://app.clickup.com/t/86c8e5jcy))

### Added

- Enhanced security by implementing dynamic headers generation in the staging deployment workflow ([86c8e5jcy](https://app.clickup.com/t/86c8e5jcy))

---

## [2026-02-24] - Tenant Info Fix & TSConfig Alignment

### Fixed

- Resolved an issue where tenant information was missing on web reload in staging by ensuring session storage is checked when the query parameter is absent ([86c8e10eu](https://app.clickup.com/t/86c8e10eu))
- Fixed TypeScript compilation and IDE errors by aligning `composite` settings across countdown and entity libraries and adding missing project references ([86c8e10eu](https://app.clickup.com/t/86c8e10eu))

### Changed

- Updated Material Symbols icon names in `index.html` ([86c8e10eu](https://app.clickup.com/t/86c8e10eu))

---

## [2026-02-24] - Performance Improvements

### Added

- Implemented browser-side tenant caching in localStorage to improve FCP ([86c8dt3qn](https://app.clickup.com/t/86c8dt3qn))

### Changed

- Optimized initial load by inlining critical CSS, sub setting Material Symbols font, and adding WebP image support ([86c8dt3qn](https://app.clickup.com/t/86c8dt3qn))
- Refactored shipping method selector styles to use SCSS `@each` for theme-based classes ([86c8dt3qn](https://app.clickup.com/t/86c8dt3qn))

## [2026-02-23] - Smooth Transitions

### Added

- Added smooth CSS view transitions in products grid and detail ([86c8d3n0y](https://app.clickup.com/t/86c8d3n0y))

### Changed

- Replaced `transition: all` with explicit properties to prevent non-composited animations and layout shifts ([86c8dmjp4](https://app.clickup.com/t/86c8dmjp4))

## [2026-02-22] - Product Grid & Layout Optimization

### Changed

- Improved LCP by marking critical above-the-fold images (tenant logo and user avatar) for priority loading ([86c8cvpwh](https://app.clickup.com/t/86c8cvpwh))
- Renamed core layout components (Header, Footer, Menu, etc.) for better naming consistency across the codebase ([86c8cvpwh](https://app.clickup.com/t/86c8cvpwh))

### Fixed

- Resolved resolver hang during SSR by providing the necessary `Injector` context to `toObservable` calls ([86c8cvpwh](https://app.clickup.com/t/86c8cvpwh))
- Optimized product data fetching by removing `debounceTime` from the base PocketBase store, ensuring immediate response to parameter changes ([86c8cvpwh](https://app.clickup.com/t/86c8cvpwh))
- Fixed data stale issues by ensuring `initiallyLoaded` is correctly reset to `false` when store parameters change ([86c8cvpwh](https://app.clickup.com/t/86c8cvpwh))

---

## [2026-02-22] - Render-Blocking Optimizations

### Changed

- Optimized Google Fonts loading by adding `preconnect`/`dns-prefetch` hints and using a non-blocking `preload` pattern in `index.html` ([86c8cuxwv](https://app.clickup.com/t/86c8cuxwv))
- Enabled build optimizations and output hashing for the `staging` environment in `project.json` to reduce render-blocking CSS impact ([86c8cuxwv](https://app.clickup.com/t/86c8cuxwv))

---

## [2026-02-22] - cspell add clickup tasks ids to ignoreRegExpList

### Changed

- Added clickup tasks ids to ignoreRegExpList in cspell.json

---

## [2026-02-22] - App Loading Fix

### Fixed

- Resolved an issue where the application would hang on a blank screen during initial load by removing a redundant wait for `initiallyLoaded` in the products resolver ([86c8cu7rd](https://app.clickup.com/t/86c8cu7rd))

---

## [2026-02-22] - Layout Performance

### Changed

- Replaced `@defer` with `@if` in product list and updated route resolver to wait for data, ensuring LCP images are rendered during SSR and immediately discoverable ([86c8ctf0x](https://app.clickup.com/t/86c8ctf0x))

### Fixed

- Prevented synchronous forced reflows during page load by disabling `mat-sidenav` autofocus and `mat-stepper` animations ([86c8cte5c](https://app.clickup.com/t/86c8cte5c))

---

## [2026-02-22] - CI Workflows

### Changed

- Disconnected `pa11y` CI workflows for `eco-store` and `nasa-images` temporarily due to limited Nx Cloud credits ([#912](https://github.com/plastikaweb/plastikspace/pull/912))

---

## [2026-02-22] - Font Display Performance

### Changed

- Updated Google Fonts links to use `display=swap` to fix Lighthouse font-display warnings ([86c8ctctm](https://app.clickup.com/t/86c8ctctm))

---

## [2026-02-21] - Accessibility Contrast Fixes

### Fixed

- Improved contrast ratio for category counts in product list and product category labels ([86c8cnjg3](https://app.clickup.com/t/86c8cnjg3))

---

## [2026-02-21] - Service Worker & Workspace Fixes

### Changed

- Enabled Angular Service Worker for local testing by using `!isDevMode()` instead of environment-based check ([86c8ck3rv](https://app.clickup.com/t/86c8ck3rv))

### Fixed

- Resolved VS Code `package.json` schema loading warning by enabling absolute schema downloads in `settings.json` ([86c8ck3rv](https://app.clickup.com/t/86c8ck3rv))

---

## [2026-02-21] - Tenant Logo A11y & Commitizen Rules

### Fixed

- Replaced redundant `aria-label` with `aria-hidden` and cleared `title` on tenant logo to improve accessibility screen reader behavior ([#906](https://github.com/plastikaweb/plastikspace/issues/906))
- Updated commitizen skill instructions regarding hook behaviors and changelog single-commit rules

---

## [2026-02-21] - Layout Shifts Fixes

### Fixed

- Implemented router data binding for sidenav positioning to prevent layout shifts ([#904](https://github.com/plastikaweb/plastikspace/issues/904))
- Added explicit width and height attributes to prevent image shifts and related lint errors ([#904](https://github.com/plastikaweb/plastikspace/issues/904))

---

## [2026-02-20] - API & Firebase Optimizations

### Changed

- Replaced `getFullList` with `getList(1)` in `getOneBySlug` query to reduce PocketBase API overhead ([#900](https://github.com/plastikaweb/plastikspace/issues/900))
- Replaced quadratic product aggregation logic with a `Map`-based approach in `onChangeUserOrderUpdateOrderListTotal` Firebase trigger, achieving ~29x speedup

---

## [2026-02-20] - Core User Menu Extraction

### Changed

- Extracted header user menu template into a reusable `CoreCmsLayoutUiUserMenuComponent` with signal-based inputs

---

## [2026-02-20] - Test Infrastructure

### Changed

- Added `IntersectionObserver` mock to `test-setup.ts` across all eco-store libs and app to fix CI failures in Jest

---

## [2026-02-20] - Fix Product Grid Reload on Quantity Change

### Fixed

- Restored `getItemCount()` per-product computed signal in cart store to prevent the entire products grid from re-rendering on each quantity control click ([#901](https://github.com/plastikaweb/plastikspace/issues/901))

---

## [2026-02-20] - Performance Improvements

### Changed

- Replaced inline function calls in templates with computed signals to reduce per-render recalculations ([#895](https://github.com/plastikaweb/plastikspace/issues/895))
- Consolidated CSS color palette into theme files, eliminating redundant `color-palette.css` ([#895](https://github.com/plastikaweb/plastikspace/issues/895))
- Refactored cart store and `img-container` component for better performance ([#895](https://github.com/plastikaweb/plastikspace/issues/895))
- Improved PocketBase storage loader efficiency ([#895](https://github.com/plastikaweb/plastikspace/issues/895))

---

## [2026-02-19] - Responsive Design Improvements

### Added

- Added custom Material stepper icons per cart step (`shopping_cart`, `box`, `thumb_up`) via `STEPPER_GLOBAL_OPTIONS` ([#874](https://github.com/plastikaweb/plastikspace/issues/874))
- Added CSS container queries (`@container` / `@xl`) for responsive cart item card layout ([#874](https://github.com/plastikaweb/plastikspace/issues/874))

### Changed

- Refactored core Tailwind breakpoint system to align with Angular Material breakpoints and added descriptive comments ([#874](https://github.com/plastikaweb/plastikspace/issues/874))
- Restructured cart summary and shipping layouts using CSS Grid (`md:grid-cols-3`) ([#874](https://github.com/plastikaweb/plastikspace/issues/874))
- Renamed spacing CSS variables from `eco-space-*` to `space-*` ([#874](https://github.com/plastikaweb/plastikspace/issues/874))
- Updated theme CSS variables across all five eco-store themes ([#874](https://github.com/plastikaweb/plastikspace/issues/874))

---

## [2026-02-18] - README Links & JSDoc Warnings

### Fixed

- Fixed broken links in `eco-store` README ([#892](https://github.com/plastikaweb/plastikspace/issues/892))
- Resolved JSDoc warnings in core entities and layout utilities ([#892](https://github.com/plastikaweb/plastikspace/issues/892))
- Enabled TypeScript project references for `pagination` UI library ([#892](https://github.com/plastikaweb/plastikspace/issues/892))

---

## [2026-02-18] - Test Coverage & Accessibility

### Added

- Added comprehensive unit tests for `UserAvatar`, `EcoStoreUnitChip`, `StoreStatusBanner`, and `ShippingUnavailable` components ([#890](https://github.com/plastikaweb/plastikspace/issues/890))
- Implemented unit tests for multiple shared pipes and directives including `BytesToSize`, `HumanizeUnit`, `PocketBaseImageUrl`, `TableCellTitle`, and `PaginationComponent` ([#890](https://github.com/plastikaweb/plastikspace/issues/890))

### Changed

- Initialized global `jest-axe` configuration in `test-setup.ts` and improved accessibility coverage for multiple `eco-store` components ([#890](https://github.com/plastikaweb/plastikspace/issues/890))

---

## [2026-02-17] - Product Detail Layout

### Fixed

- Refactored product detail media section to use CSS Grid for better responsiveness and layout stability ([#870](https://github.com/plastikaweb/plastikspace/issues/870))

## [2026-02-17] - Eco Store Improvements

### Added

- Added data migration script for eco-store ([#871](https://github.com/plastikaweb/plastikspace/issues/871))
- Added mobile navigation and user menu components ([#873](https://github.com/plastikaweb/plastikspace/issues/873))

### Changed

- Updated layout components (header, footer) and improved products list feature and pagination styles ([#871](https://github.com/plastikaweb/plastikspace/issues/871))
- Refactored layout architecture and updated shared libraries ([#873](https://github.com/plastikaweb/plastikspace/issues/873))

---

## [2026-02-11] - Agent Documentation

### Added

- Added `GEMINI.md` guidance for AI agents and refined project documentation ([#866](https://github.com/plastikaweb/plastikspace/issues/866))

---

## [2026-02-11] - Open Closed Store & Styling

### Added

- Implemented open/closed store logic and components ([#814](https://github.com/plastikaweb/plastikspace/issues/814))
- Added "Closing Soon" state to store status with automated 1-hour threshold logic ([#814](https://github.com/plastikaweb/plastikspace/issues/814))
- Implemented pulsing urgency indicator in store status chip ([#814](https://github.com/plastikaweb/plastikspace/issues/814))
- Added `isStoreOpenGuard` to prevent checkout when the store is closed ([#814](https://github.com/plastikaweb/plastikspace/issues/814))
- Added product detail links to cart summary items ([#857](https://github.com/plastikaweb/plastikspace/issues/857))

### Changed

- Improved Angular style and cleaned up tsconfig configurations across multiple libraries ([#859](https://github.com/plastikaweb/plastikspace/issues/859))
- Fixed duplicate template attributes and unused variables ([#859](https://github.com/plastikaweb/plastikspace/issues/859))
- Enhanced Signal Store features and utility pipes ([#859](https://github.com/plastikaweb/plastikspace/issues/859))

---

## [2026-02-06] - Agent Skills Configuration

### Added

- Added `CHANGELOG.md` with project history ([#854](https://github.com/plastikaweb/plastikspace/issues/854))
- Added commitizen skill integration for automated changelog prompts ([#854](https://github.com/plastikaweb/plastikspace/issues/854))
- Added agent skills configuration for multiple IDE integrations (Cursor, Claude, Trae, Windsurf) ([#854](https://github.com/plastikaweb/plastikspace/issues/854))

---

## [2026-02-06] - CI Test Coverage

### Added

- Added test coverage reporting to CI workflow and PRs ([#853](https://github.com/plastikaweb/plastikspace/pull/853))

---

## [2026-02-05] - Persistent Cart Synchronization

### Added

- Added `NewPriceWarningComponent` to cart summary to display price changes ([#851](https://github.com/plastikaweb/plastikspace/pull/851))
- Added persistent cart synchronization between local and remote storage ([#850](https://github.com/plastikaweb/plastikspace/pull/850), [#848](https://github.com/plastikaweb/plastikspace/pull/848))
- Added cart posting to PocketBase ([#848](https://github.com/plastikaweb/plastikspace/pull/848))

### Changed

- Enhanced cart state management with dedicated properties and PocketBase structure ([#851](https://github.com/plastikaweb/plastikspace/pull/851))
- Refactored cart item as the entity for cart store ([#848](https://github.com/plastikaweb/plastikspace/pull/848))

### Fixed

- Fixed cart store issues reviewed by Claude Code ([#851](https://github.com/plastikaweb/plastikspace/pull/851))
- Fixed `isolatedModules` and removed `types` compiler from tsconfig.spec ([#851](https://github.com/plastikaweb/plastikspace/pull/851))
- Replaced markdownlint-cli with markdownlint-cli2 ([#848](https://github.com/plastikaweb/plastikspace/pull/848))

---

## [2026-02-02] - Claude GitHub Actions & Shipping Improvements

### Added

- Added Claude Code Review and PR Assistant GitHub Actions ([#843](https://github.com/plastikaweb/plastikspace/pull/843))
- Added shipping unavailable route and view ([#842](https://github.com/plastikaweb/plastikspace/pull/842))
- Added i18n validation and CI integration ([#842](https://github.com/plastikaweb/plastikspace/pull/842))

### Changed

- Improved shipping form with centralized tier and instruction handling ([#842](https://github.com/plastikaweb/plastikspace/pull/842))
- Enhanced tenant address slots handling ([#842](https://github.com/plastikaweb/plastikspace/pull/842))
- Added dynamic title to custom-label for shipping type ([#842](https://github.com/plastikaweb/plastikspace/pull/842))

---

## [2026-01-31] - Categories Loading Fix

### Fixed

- Fixed categories loading issue - prevent loading without tenant ([#840](https://github.com/plastikaweb/plastikspace/pull/840))

---

## [2026-01-30] - Nx Upgrade & Cloud Setup

### Changed

- Upgraded Nx to v22.4.3 ([#838](https://github.com/plastikaweb/plastikspace/pull/838), [#837](https://github.com/plastikaweb/plastikspace/pull/837))
- Configured Nx Cloud setup ([#834](https://github.com/plastikaweb/plastikspace/pull/834))

### Fixed

- Fixed CI workflow errors ([#838](https://github.com/plastikaweb/plastikspace/pull/838))

---

## [2026-01-28] - Focus Tab Navigation Fix

### Fixed

- Fixed focus tab navigation ([#831](https://github.com/plastikaweb/plastikspace/pull/831))

---

## [2026-01-27] - Default Address Refactoring

### Changed

- Refactored default address handling ([#830](https://github.com/plastikaweb/plastikspace/pull/830))

---

## [2026-01-26] - Tenant Addresses & Categories Stats

### Changed

- Refactored tenant addresses with dynamic slots handling ([#826](https://github.com/plastikaweb/plastikspace/pull/826), [#825](https://github.com/plastikaweb/plastikspace/pull/825), [#823](https://github.com/plastikaweb/plastikspace/pull/823))

### Fixed

- Fixed categories stats display ([#829](https://github.com/plastikaweb/plastikspace/pull/829), [#828](https://github.com/plastikaweb/plastikspace/pull/828))

---

## [2026-01-25] - Tenant Store & PocketHost

### Changed

- Refactored tenant store architecture ([#821](https://github.com/plastikaweb/plastikspace/pull/821))

### Fixed

- Fixed PocketHost FTP configuration ([#822](https://github.com/plastikaweb/plastikspace/pull/822))

---

## [2026-01-24] - Shipping Form & User Addresses

### Added

- Added shipping form and user addresses feature ([#818](https://github.com/plastikaweb/plastikspace/pull/818))

---

## [2026-01-13] - Tenant Configuration

### Added

- Added tenant configuration system ([#810](https://github.com/plastikaweb/plastikspace/pull/810), [#809](https://github.com/plastikaweb/plastikspace/pull/809))

---

## [2026-01-11] - User Logout

### Added

- Added logout functionality ([#807](https://github.com/plastikaweb/plastikspace/pull/807))

---

## [2026-01-10] - Profile Avatar

### Added

- Added profile avatar feature ([#806](https://github.com/plastikaweb/plastikspace/pull/806))

---

## [2026-01-09] - User Login

### Added

- Added login functionality ([#805](https://github.com/plastikaweb/plastikspace/pull/805))

---

## [2025-12-30] - Auth & Cart View

### Added

- Added PocketBase authentication integration ([#803](https://github.com/plastikaweb/plastikspace/pull/803))
- Added cart view feature ([#802](https://github.com/plastikaweb/plastikspace/pull/802))

---

## [2025-12-27] - Bundle Optimization

### Changed

- Reduced bundle size with optimizations ([#801](https://github.com/plastikaweb/plastikspace/pull/801))

---

## [2025-12-24] - Cart Store & Badge

### Added

- Added cart badge component ([#800](https://github.com/plastikaweb/plastikspace/pull/800))
- Added cart store with state management ([#797](https://github.com/plastikaweb/plastikspace/pull/797))

---

## [2025-12-23] - Angular 21 & CI Staging

### Added

- Added eco-store staging workflow ([#796](https://github.com/plastikaweb/plastikspace/pull/796))

### Changed

- Upgraded to Angular 21 ([#795](https://github.com/plastikaweb/plastikspace/pull/795), [#794](https://github.com/plastikaweb/plastikspace/pull/794), [#793](https://github.com/plastikaweb/plastikspace/pull/793))

---

## [2025-12-22] - Product Detail View

### Added

- Added product detail page ([#792](https://github.com/plastikaweb/plastikspace/pull/792), [#791](https://github.com/plastikaweb/plastikspace/pull/791))

---

## [2025-12-17] - Eco Tokens Fix

### Fixed

- Fixed eco tokens styling issues ([#786](https://github.com/plastikaweb/plastikspace/pull/786))

---

## [2025-12-16] - Products Grid Fixes

### Fixed

- Fixed products grid layout issues ([#784](https://github.com/plastikaweb/plastikspace/pull/784), [#783](https://github.com/plastikaweb/plastikspace/pull/783))

---

## [2025-12-15] - A11y & Image Loading

### Changed

- Humanized units display ([#780](https://github.com/plastikaweb/plastikspace/pull/780))
- Improved accessibility compliance ([#779](https://github.com/plastikaweb/plastikspace/pull/779), [#778](https://github.com/plastikaweb/plastikspace/pull/778))

### Fixed

- Fixed image loading errors ([#782](https://github.com/plastikaweb/plastikspace/pull/782))

---

## [2025-12-12] - Image Loader Refactoring

### Changed

- Refactored image loader component ([#774](https://github.com/plastikaweb/plastikspace/pull/774))

---

## [2025-12-11] - Product Ordering

### Added

- Added product ordering functionality ([#772](https://github.com/plastikaweb/plastikspace/pull/772), [#770](https://github.com/plastikaweb/plastikspace/pull/770))

---

## [2025-12-10] - Categories Menu & NgImage

### Added

- Added categories menu ([#765](https://github.com/plastikaweb/plastikspace/pull/765))

### Changed

- Refactored product component to use NgImage ([#767](https://github.com/plastikaweb/plastikspace/pull/767))

### Fixed

- Fixed image display improvements ([#769](https://github.com/plastikaweb/plastikspace/pull/769))

---

## [2025-12-09] - Loading State & Card Hover

### Added

- Added loading state indicators ([#759](https://github.com/plastikaweb/plastikspace/pull/759))

### Changed

- Refactored card product hover effects ([#761](https://github.com/plastikaweb/plastikspace/pull/761))

### Fixed

- Fixed nasa-images build issues ([#763](https://github.com/plastikaweb/plastikspace/pull/763))

---

## [2025-12-05] - Store Pagination

### Added

- Added store pagination feature ([#756](https://github.com/plastikaweb/plastikspace/pull/756))

---

## [2025-12-03] - PocketBase CI Export

### Added

- Added PocketBase export to CI workflow ([#753](https://github.com/plastikaweb/plastikspace/pull/753) - [#744](https://github.com/plastikaweb/plastikspace/pull/744))

### Fixed

- Fixed PocketBase ignore configuration ([#754](https://github.com/plastikaweb/plastikspace/pull/754))

---

## [2025-12-02] - Products List

### Added

- Added products list view ([#743](https://github.com/plastikaweb/plastikspace/pull/743))

---

## [2025-11-28] - API Store Refactoring

### Changed

- Refactored API store architecture ([#740](https://github.com/plastikaweb/plastikspace/pull/740))

---

## [2025-11-21] - Nx 22.1.0 Upgrade

### Changed

- Upgraded Nx to v22.1.0 ([#739](https://github.com/plastikaweb/plastikspace/pull/739))

---

## [2025-11-20] - Store Layout

### Added

- Added store layout structure ([#738](https://github.com/plastikaweb/plastikspace/pull/738))

---

## [2025-11-18] - Products Feature

### Added

- Added products feature ([#735](https://github.com/plastikaweb/plastikspace/pull/735))

---

## [2025-11-17] - Translation Support

### Added

- Added translation/i18n support ([#734](https://github.com/plastikaweb/plastikspace/pull/734))

---

## [2025-11-14] - Categories Store

### Added

- Added categories store with state management ([#733](https://github.com/plastikaweb/plastikspace/pull/733))

---

## [2025-11-12] - Store Layout & CI Fixes

### Added

- Added initial store layout ([#729](https://github.com/plastikaweb/plastikspace/pull/729))

### Fixed

- Fixed pa11y accessibility issues ([#731](https://github.com/plastikaweb/plastikspace/pull/731))
- Fixed CI pipeline failures ([#730](https://github.com/plastikaweb/plastikspace/pull/730))

---

## [2025-11-04] - Environment Configuration

### Added

- Added environment configuration setup ([#726](https://github.com/plastikaweb/plastikspace/pull/726))

---

## [2025-10-30] - Nx 22 & Products/Categories

### Added

- Created products and categories structure ([#723](https://github.com/plastikaweb/plastikspace/pull/723))

### Changed

- Upgraded Nx to v22 ([#725](https://github.com/plastikaweb/plastikspace/pull/725))

---

## [2025-10-29] - Project Setup

### Added

- Initial eco-store project setup ([#720](https://github.com/plastikaweb/plastikspace/pull/720))

---

## [2025-10-22] - CI Error Fixes

### Fixed

- Fixed CI pipeline errors ([#683](https://github.com/plastikaweb/plastikspace/pull/683))
- Fixed CI pipeline errors ([#682](https://github.com/plastikaweb/plastikspace/pull/682))
- Fixed CI pipeline errors ([#681](https://github.com/plastikaweb/plastikspace/pull/681))
- Fixed CI pipeline errors ([#680](https://github.com/plastikaweb/plastikspace/pull/680))
- Fixed CI pipeline errors ([#679](https://github.com/plastikaweb/plastikspace/pull/679))
- Fixed CI pipeline errors ([#678](https://github.com/plastikaweb/plastikspace/pull/678))
- Fixed CI pipeline errors ([#677](https://github.com/plastikaweb/plastikspace/pull/677))
- Fixed CI pipeline errors ([#676](https://github.com/plastikaweb/plastikspace/pull/676))

### Added

- Added AI instructions for development ([#675](https://github.com/plastikaweb/plastikspace/pull/675))

---

## [2025-10-21] - Nx 21.6.5 Upgrade

### Changed

- Upgraded Nx to v21.6.5 ([#674](https://github.com/plastikaweb/plastikspace/pull/674))

---

## [2025-07-03] - Styles Review

### Changed

- Reviewed and refactored styles ([#673](https://github.com/plastikaweb/plastikspace/pull/673))

---

## [2025-06-27] - Mini Cart

### Added

- Added mini cart feature ([#672](https://github.com/plastikaweb/plastikspace/pull/672))

---

## [2025-06-20] - Order Local Storage

### Added

- Added order persistence with local storage ([#668](https://github.com/plastikaweb/plastikspace/pull/668))

---

## [2025-06-18] - Nx 21 Upgrade

### Changed

- Upgraded Nx to v21 ([#666](https://github.com/plastikaweb/plastikspace/pull/666))

---

## [2025-06-17] - Nx Cloud Setup

### Added

- Added Nx Cloud setup ([#665](https://github.com/plastikaweb/plastikspace/pull/665))

---

## [2025-06-06] - Public Store

### Added

- Added public store feature ([#663](https://github.com/plastikaweb/plastikspace/pull/663))

---

## [2025-05-27] - Profile State Refactoring

### Changed

- Refactored profile state management ([#660](https://github.com/plastikaweb/plastikspace/pull/660))

---

## [2025-05-20] - Date.js & Image Upload

### Changed

- Improved date handling with Date.js ([#656](https://github.com/plastikaweb/plastikspace/pull/656))

### Fixed

- Fixed image upload functionality ([#655](https://github.com/plastikaweb/plastikspace/pull/655))

---

## [2025-05-16] - Performance Improvements

### Changed

- Performance improvements to application ([#654](https://github.com/plastikaweb/plastikspace/pull/654))

---

## [2025-05-05] - Storage Rules Fix

### Fixed

- Fixed Firebase storage rules ([#647](https://github.com/plastikaweb/plastikspace/pull/647))

---

## [2025-05-01] - A11y Focus Fix

### Fixed

- Fixed accessibility focus issues ([#645](https://github.com/plastikaweb/plastikspace/pull/645))

---

## [2025-04-30] - A11y Review

### Changed

- Comprehensive accessibility review and improvements ([#643](https://github.com/plastikaweb/plastikspace/pull/643))

---

## [2025-04-26] - A11y Lists & Login Modal

### Changed

- Improved accessibility for list components ([#641](https://github.com/plastikaweb/plastikspace/pull/641))

### Fixed

- Fixed login modal issues ([#640](https://github.com/plastikaweb/plastikspace/pull/640))

---

## [2025-04-25] - Error Handler Fix

### Fixed

- Fixed error handler issues ([#639](https://github.com/plastikaweb/plastikspace/pull/639))

---

## [2025-04-24] - Query Params & Filter Input

### Changed

- Improved user query params handling ([#636](https://github.com/plastikaweb/plastikspace/pull/636))

### Fixed

- Fixed product query params ([#635](https://github.com/plastikaweb/plastikspace/pull/635))
- Fixed filter input component ([#634](https://github.com/plastikaweb/plastikspace/pull/634))

---

## [2025-04-23] - Product Image

### Added

- Added product image feature ([#633](https://github.com/plastikaweb/plastikspace/pull/633))

---

## [2025-04-09] - Plastikaweb Skills

### Added

- Added plastikaweb skills configuration ([#631](https://github.com/plastikaweb/plastikspace/pull/631))

---

## [2025-04-08] - Plastikaweb Init

### Added

- Initialized plastikaweb application ([#630](https://github.com/plastikaweb/plastikspace/pull/630))

---

## [2025-04-06] - Category Params

### Changed

- Improved category params handling ([#622](https://github.com/plastikaweb/plastikspace/pull/622))

---

## [2025-04-04] - Form Disabled & Product Categories

### Fixed

- Fixed form disabled state handling ([#615](https://github.com/plastikaweb/plastikspace/pull/615))
- Fixed product edit categories list ([#614](https://github.com/plastikaweb/plastikspace/pull/614))

---

## [2025-04-03] - Menu Users & User Loading

### Fixed

- Fixed menu users display ([#613](https://github.com/plastikaweb/plastikspace/pull/613))
- Fixed user loading state ([#612](https://github.com/plastikaweb/plastikspace/pull/612))

---

## [2025-04-02] - Orders List Refactoring

### Changed

- Refactored orders list component ([#611](https://github.com/plastikaweb/plastikspace/pull/611))

---

## [2025-03-25] - Social Login & Order Status

### Added

- Added user order status feature ([#606](https://github.com/plastikaweb/plastikspace/pull/606))

### Fixed

- Fixed social login functionality ([#607](https://github.com/plastikaweb/plastikspace/pull/607))

---

## [2025-03-20] - Order List Cancel/Delete

### Fixed

- Fixed order list cancel and delete functionality ([#602](https://github.com/plastikaweb/plastikspace/pull/602))

---

## [2025-03-19] - Deliver Action & Order Status

### Added

- Added deliver action feature ([#599](https://github.com/plastikaweb/plastikspace/pull/599))

### Fixed

- Fixed no edit order issue ([#601](https://github.com/plastikaweb/plastikspace/pull/601))
- Fixed order status handling ([#598](https://github.com/plastikaweb/plastikspace/pull/598))

---

## [2025-03-17] - Product Categories Fix

### Fixed

- Fixed product categories functionality ([#591](https://github.com/plastikaweb/plastikspace/pull/591))

---

## [2025-03-04] - User Name Registration

### Added

- Added user name during registration ([#577](https://github.com/plastikaweb/plastikspace/pull/577))

---

## [2025-03-01] - Password Form & Category Pagination

### Changed

- Improved category pagination performance ([#572](https://github.com/plastikaweb/plastikspace/pull/572))

### Fixed

- Fixed request password form ([#573](https://github.com/plastikaweb/plastikspace/pull/573))

---

## [2025-02-11] - Products Pagination

### Changed

- Improved products pagination performance ([#562](https://github.com/plastikaweb/plastikspace/pull/562))

---

## [2025-02-04] - Zoneless Refactoring

### Changed

- Refactored to zoneless change detection ([#561](https://github.com/plastikaweb/plastikspace/pull/561))

---

## [2025-01-28] - Sort Category Product Fix

### Fixed

- Fixed sort category product functionality ([#558](https://github.com/plastikaweb/plastikspace/pull/558))

---

## [2025-01-23] - Overlay & Cell Refactoring

### Changed

- Refactored category name cell component ([#555](https://github.com/plastikaweb/plastikspace/pull/555))

### Fixed

- Fixed overlay overflow issues ([#556](https://github.com/plastikaweb/plastikspace/pull/556))

---

## [2025-01-22] - Product Name UI

### Changed

- Refactored product name UI component ([#554](https://github.com/plastikaweb/plastikspace/pull/554))

---

## [2025-01-21] - User Order & Notifications

### Fixed

- Fixed user order count display ([#549](https://github.com/plastikaweb/plastikspace/pull/549))
- Fixed dismiss notification on routing ([#547](https://github.com/plastikaweb/plastikspace/pull/547))
- Fixed link hover styling ([#545](https://github.com/plastikaweb/plastikspace/pull/545))

---

## [2025-01-08] - Material 19 Upgrade

### Changed

- Upgraded to Angular Material 19 ([#522](https://github.com/plastikaweb/plastikspace/pull/522))

---

## [2024-12-31] - Order Total

### Added

- Added order total feature ([#520](https://github.com/plastikaweb/plastikspace/pull/520))

---

## [2024-12-19] - NgRx 19 & View Config

### Changed

- Upgraded to NgRx 19 ([#517](https://github.com/plastikaweb/plastikspace/pull/517))

### Fixed

- Fixed view config issues ([#516](https://github.com/plastikaweb/plastikspace/pull/516))

---

## [2024-12-18] - ES6 Private Fields

### Changed

- Refactored to use ES6 private fields ([#515](https://github.com/plastikaweb/plastikspace/pull/515))

---

## [2024-12-13] - NgOptimizedImage

### Changed

- Implemented NgOptimizedImage for performance ([#513](https://github.com/plastikaweb/plastikspace/pull/513))

---

## [2024-12-12] - Angular 19 Upgrade

### Changed

- Upgraded to Angular 19 ([#511](https://github.com/plastikaweb/plastikspace/pull/511))

---

## [2024-12-11] - User Order Resume

### Added

- Added user order resume feature ([#509](https://github.com/plastikaweb/plastikspace/pull/509))

---

## [2024-12-06] - Deactivate Guard

### Added

- Added deactivate guard functionality ([#506](https://github.com/plastikaweb/plastikspace/pull/506))

---

## [2024-12-05] - Shared Form UI

### Changed

- Refactored shared form UI components ([#497](https://github.com/plastikaweb/plastikspace/pull/497))

---

## [2024-12-03] - User Order Form & Activity Store

### Changed

- Refactored activity store ([#493](https://github.com/plastikaweb/plastikspace/pull/493))

### Fixed

- Fixed user order form issues ([#495](https://github.com/plastikaweb/plastikspace/pull/495))

---

## [2024-11-29] - Llecoop Layout

### Changed

- Refactored llecoop layout ([#489](https://github.com/plastikaweb/plastikspace/pull/489))

---

## [2024-11-27] - Color Picker Spec Fix

### Fixed

- Fixed input color picker spec ([#486](https://github.com/plastikaweb/plastikspace/pull/486))

---

## [2024-11-26] - Nx 20 & Nasa Images Fixes

### Changed

- Upgraded to Nx 20 and Angular 19 ([#477](https://github.com/plastikaweb/plastikspace/pull/477))

### Fixed

- Fixed nasa images e2e tests ([#482](https://github.com/plastikaweb/plastikspace/pull/482))
- Fixed workflow errors ([#481](https://github.com/plastikaweb/plastikspace/pull/481))
- Fixed nasa images serve ([#480](https://github.com/plastikaweb/plastikspace/pull/480))

---

## [2024-11-23] - Order List UI Improvements

### Changed

- Improved status icon in order list ([#475](https://github.com/plastikaweb/plastikspace/pull/475))

### Fixed

- Fixed status column width ([#473](https://github.com/plastikaweb/plastikspace/pull/473))
- Fixed order products sort ([#472](https://github.com/plastikaweb/plastikspace/pull/472))

---

## [2024-11-22] - Deactivate Order & Submit Config

### Added

- Added deactivate order button ([#471](https://github.com/plastikaweb/plastikspace/pull/471))

### Changed

- Refactored submit configuration ([#466](https://github.com/plastikaweb/plastikspace/pull/466))

---

## [2024-11-20] - User Order UI Improvements

### Changed

- Improved user order styles ([#463](https://github.com/plastikaweb/plastikspace/pull/463))
- Refactored new order modal ([#462](https://github.com/plastikaweb/plastikspace/pull/462))

### Fixed

- Fixed cart button issues ([#461](https://github.com/plastikaweb/plastikspace/pull/461))
- Fixed disable edit user order ([#460](https://github.com/plastikaweb/plastikspace/pull/460))

---

## [2024-11-19] - Shared Documentation

### Added

- Added shared component documentation ([#457](https://github.com/plastikaweb/plastikspace/pull/457))

---

## [2024-11-15] - Order Detail & Modal Styles

### Changed

- Refactored modal styles ([#449](https://github.com/plastikaweb/plastikspace/pull/449))
- Improved mobile UI ([#448](https://github.com/plastikaweb/plastikspace/pull/448))

### Fixed

- Fixed order detail form ([#456](https://github.com/plastikaweb/plastikspace/pull/456))

---

## [2024-11-14] - Staging Workflow

### Added

- Added staging workflow ([#438](https://github.com/plastikaweb/plastikspace/pull/438))

---

## [2024-11-13] - Cloud Hosting

### Added

- Added cloud hosting configuration ([#437](https://github.com/plastikaweb/plastikspace/pull/437), [#436](https://github.com/plastikaweb/plastikspace/pull/436), [#435](https://github.com/plastikaweb/plastikspace/pull/435))

---

## [2024-11-11] - Order List Orders View

### Added

- Added order list orders view ([#432](https://github.com/plastikaweb/plastikspace/pull/432))

---

## [2024-10-23] - Orders Count & Edit User Order

### Added

- Added orders count feature ([#428](https://github.com/plastikaweb/plastikspace/pull/428))
- Added edit user order functionality ([#426](https://github.com/plastikaweb/plastikspace/pull/426))

---

## [2024-10-21] - Order Totals & Filters

### Added

- Added totals to order view ([#424](https://github.com/plastikaweb/plastikspace/pull/424))
- Added filters functionality ([#422](https://github.com/plastikaweb/plastikspace/pull/422))

---

## [2024-10-19] - Product Category Filter

### Added

- Added product category filter ([#418](https://github.com/plastikaweb/plastikspace/pull/418))

---

## [2024-10-18] - Layout Fix

### Changed

- Refactored and fixed layout issues ([#415](https://github.com/plastikaweb/plastikspace/pull/415))

---

## [2024-10-17] - Order Detail Header

### Added

- Added header for order detail view ([#413](https://github.com/plastikaweb/plastikspace/pull/413))

---

## [2024-10-16] - Delete User Order & Order List

### Added

- Added delete user order functionality ([#410](https://github.com/plastikaweb/plastikspace/pull/410))
- Added user order list ([#408](https://github.com/plastikaweb/plastikspace/pull/408))

---

## [2024-10-15] - Close List Order & User Order

### Added

- Added close list order functionality ([#407](https://github.com/plastikaweb/plastikspace/pull/407))
- Added user order feature ([#404](https://github.com/plastikaweb/plastikspace/pull/404))

---

## [2024-10-09] - Activate Order & Delete User

### Added

- Added activate order functionality ([#402](https://github.com/plastikaweb/plastikspace/pull/402))
- Added delete user functionality ([#400](https://github.com/plastikaweb/plastikspace/pull/400))

### Fixed

- Fixed product stock unit change ([#398](https://github.com/plastikaweb/plastikspace/pull/398))

---

## [2024-10-08] - Login Activity & Order Management

### Added

- Added delete order functionality ([#394](https://github.com/plastikaweb/plastikspace/pull/394))
- Added new order feature ([#392](https://github.com/plastikaweb/plastikspace/pull/392))

### Changed

- Refactored login activity handling ([#396](https://github.com/plastikaweb/plastikspace/pull/396))

---

## [2024-10-07] - Hide Admin Button Fix

### Fixed

- Fixed hide admin button functionality ([#389](https://github.com/plastikaweb/plastikspace/pull/389))

---

## [2024-10-05] - Categories Fix

### Fixed

- Fixed categories functionality ([#386](https://github.com/plastikaweb/plastikspace/pull/386))

---

## [2024-10-04] - Admin Claim & User Registration

### Added

- Added admin claim functionality ([#384](https://github.com/plastikaweb/plastikspace/pull/384))
- Added admin claim functionality ([#381](https://github.com/plastikaweb/plastikspace/pull/381))
- Added admin claim functionality ([#378](https://github.com/plastikaweb/plastikspace/pull/378))
- Added admin claim functionality ([#376](https://github.com/plastikaweb/plastikspace/pull/376))

### Changed

- Set email header style ([#384](https://github.com/plastikaweb/plastikspace/pull/384))

### Fixed

- Fixed block duplicate user creation ([#375](https://github.com/plastikaweb/plastikspace/pull/375))

---

## [2024-10-03] - Improved Registration & White List

### Added

- Added white listed users feature ([#368](https://github.com/plastikaweb/plastikspace/pull/368))

### Changed

- Improved registration flow ([#372](https://github.com/plastikaweb/plastikspace/pull/372), [#370](https://github.com/plastikaweb/plastikspace/pull/370))

---

## [2024-10-02] - Auth Activity & Password Recovery

### Added

- Added auth activity display ([#364](https://github.com/plastikaweb/plastikspace/pull/364))
- Added password recovery functionality ([#362](https://github.com/plastikaweb/plastikspace/pull/362))
- Added auth links ([#360](https://github.com/plastikaweb/plastikspace/pull/360))
- Added user list feature ([#357](https://github.com/plastikaweb/plastikspace/pull/357))

---

## [2024-10-01] - User List

### Added

- Added user list functionality ([#354](https://github.com/plastikaweb/plastikspace/pull/354))

---

## [2024-09-30] - User List Enhancements

### Added

- Enhanced user list features ([#352](https://github.com/plastikaweb/plastikspace/pull/352), [#351](https://github.com/plastikaweb/plastikspace/pull/351))

---

## [2024-09-29] - Auth Session Fixes

### Fixed

- Removed Firebase session issues ([#348](https://github.com/plastikaweb/plastikspace/pull/348))
- Fixed auth persistence in production ([#346](https://github.com/plastikaweb/plastikspace/pull/346))

---

## [2024-09-28] - Workflows & Firebase Functions

### Added

- Added CRUD products triggers ([#338](https://github.com/plastikaweb/plastikspace/pull/338))

### Fixed

- Fixed workflows configuration ([#343](https://github.com/plastikaweb/plastikspace/pull/343))
- Fixed budget max size ([#340](https://github.com/plastikaweb/plastikspace/pull/340))

---

## [2024-09-27] - Firebase Functions

### Added

- Added Firebase functions ([#336](https://github.com/plastikaweb/plastikspace/pull/336))

---

## [2024-09-26] - Assets Fix

### Fixed

- Fixed assets configuration ([#335](https://github.com/plastikaweb/plastikspace/pull/335))

---

## [2024-09-25] - Products List Refactoring

### Changed

- Refactored products list ([#333](https://github.com/plastikaweb/plastikspace/pull/333))

---

## [2024-09-23] - Product Management

### Added

- Added product availability toggle ([#331](https://github.com/plastikaweb/plastikspace/pull/331))
- Added delete product functionality ([#329](https://github.com/plastikaweb/plastikspace/pull/329))
- Added delete category functionality ([#327](https://github.com/plastikaweb/plastikspace/pull/327))

---

## [2024-09-22] - Notifications

### Added

- Added notifications system ([#325](https://github.com/plastikaweb/plastikspace/pull/325))

---

## [2024-09-21] - Bundle Size Optimization

### Fixed

- Fixed bundle size issues ([#323](https://github.com/plastikaweb/plastikspace/pull/323))

---

## [2024-09-20] - Product & Category Edit

### Added

- Added product edit functionality ([#321](https://github.com/plastikaweb/plastikspace/pull/321))
- Added category edit functionality ([#320](https://github.com/plastikaweb/plastikspace/pull/320))

---

## [2024-09-19] - Form Validators & Firebase Emulator

### Added

- Added Firebase emulator for llecoop ([#315](https://github.com/plastikaweb/plastikspace/pull/315))

### Fixed

- Fixed form validators ([#318](https://github.com/plastikaweb/plastikspace/pull/318))

---

## [2024-09-18] - Products Filter

### Added

- Added products filter functionality ([#313](https://github.com/plastikaweb/plastikspace/pull/313))

---

## [2024-09-16] - New Product Form

### Added

- Added new product form ([#311](https://github.com/plastikaweb/plastikspace/pull/311))

---

## [2024-09-14] - New Category Form

### Added

- Added new category form ([#309](https://github.com/plastikaweb/plastikspace/pull/309))

---

## [2024-09-13] - Llecoop Login

### Added

- Added llecoop login functionality ([#307](https://github.com/plastikaweb/plastikspace/pull/307))

---

## [2024-09-06] - Abstract Facade Refactoring

### Changed

- Refactored abstract facade pattern ([#305](https://github.com/plastikaweb/plastikspace/pull/305))

---

## [2024-09-05] - Products List

### Added

- Added products list feature ([#303](https://github.com/plastikaweb/plastikspace/pull/303))

---

## [2024-09-03] - Llecoop Deploy CI

### Added

- Added llecoop deployment CI workflow ([#297](https://github.com/plastikaweb/plastikspace/pull/297) - [#293](https://github.com/plastikaweb/plastikspace/pull/293))

---

## [2024-09-02] - Categories Filter

### Added

- Added categories filter functionality ([#290](https://github.com/plastikaweb/plastikspace/pull/290))

---

## [2024-08-29] - Sort Categories Table

### Added

- Added sort functionality for categories table ([#287](https://github.com/plastikaweb/plastikspace/pull/287))

---

## [2024-08-28] - Shared List View

### Changed

- Refactored shared list view component ([#285](https://github.com/plastikaweb/plastikspace/pull/285))

---

## [2024-08-27] - Menu Skeleton Llecoop

### Changed

- Refactored menu skeleton for llecoop ([#284](https://github.com/plastikaweb/plastikspace/pull/284))

---

## [2024-08-24] - Llecoop Favicon

### Added

- Added llecoop favicon ([#283](https://github.com/plastikaweb/plastikspace/pull/283))

---

## [2024-08-23] - Loading Indicator & Categories

### Added

- Added loading indicator ([#281](https://github.com/plastikaweb/plastikspace/pull/281))
- Added categories title ([#279](https://github.com/plastikaweb/plastikspace/pull/279))
- Added categories list ([#270](https://github.com/plastikaweb/plastikspace/pull/270))

### Fixed

- Fixed llevat title ([#277](https://github.com/plastikaweb/plastikspace/pull/277))

---

## [2024-08-08] - Angular 18 Upgrade

### Changed

- Upgraded to Angular 18 ([#268](https://github.com/plastikaweb/plastikspace/pull/268))

---

## [2024-07-09] - Llecoop Layout

### Added

- Added llecoop layout ([#266](https://github.com/plastikaweb/plastikspace/pull/266))

---

## [2024-06-29] - Llecoop Init

### Added

- Initialized llecoop application ([#264](https://github.com/plastikaweb/plastikspace/pull/264))

---

## [2024-01-06] - Angular 17 Upgrade

### Changed

- Upgraded to Angular 17 ([#261](https://github.com/plastikaweb/plastikspace/pull/261))

---

## [2023-11-21] - Material Tailwind

### Added

- Added Material Tailwind integration ([#259](https://github.com/plastikaweb/plastikspace/pull/259))

---

## [2023-09-12] - Nx Upgrade

### Changed

- Upgraded Nx version ([#256](https://github.com/plastikaweb/plastikspace/pull/256))

---

## [2023-09-10] - Highlight Directive

### Added

- Added highlight directive ([#253](https://github.com/plastikaweb/plastikspace/pull/253))

---

## [2023-09-09] - Search Images E2E

### Added

- Added search images e2e tests ([#251](https://github.com/plastikaweb/plastikspace/pull/251))

---

## [2023-08-24] - FAQs E2E Tests

### Added

- Added FAQs e2e tests ([#250](https://github.com/plastikaweb/plastikspace/pull/250))

---

## [2023-08-21] - App E2E Tests

### Added

- Added app e2e tests ([#249](https://github.com/plastikaweb/plastikspace/pull/249))

---

## [2023-08-14] - API Cache

### Changed

- Implemented API caching for performance ([#247](https://github.com/plastikaweb/plastikspace/pull/247))

---

## [2023-08-03] - NgRx Refactoring

### Changed

- Refactored to use ngrxLet directive ([#244](https://github.com/plastikaweb/plastikspace/pull/244))
- Refactored NgRx state management ([#242](https://github.com/plastikaweb/plastikspace/pull/242))

---

## [2023-07-28] - Remove CoreCMS

### Changed

- Removed CoreCMS dependency ([#241](https://github.com/plastikaweb/plastikspace/pull/241))

---

## [2023-07-19] - CSS Performance

### Changed

- CSS performance improvements ([#238](https://github.com/plastikaweb/plastikspace/pull/238))

---

## [2023-07-17] - Experimental Features

### Added

- Added experimental features ([#237](https://github.com/plastikaweb/plastikspace/pull/237))

---

## [2023-07-14] - FAQs Titles Refactoring

### Changed

- Refactored FAQs titles ([#235](https://github.com/plastikaweb/plastikspace/pull/235))

---

## [2023-07-13] - Angular 16.5.1 Upgrade

### Changed

- Upgraded to Angular 16.5.1 ([#234](https://github.com/plastikaweb/plastikspace/pull/234))

---

## [2023-06-15] - Search Form & Year Picker

### Added

- Added year picker component ([#227](https://github.com/plastikaweb/plastikspace/pull/227))

### Fixed

- Fixed search form mobile issues ([#229](https://github.com/plastikaweb/plastikspace/pull/229))

---

## [2023-05-22] - Query Reset Fix

### Fixed

- Fixed query reset functionality ([#225](https://github.com/plastikaweb/plastikspace/pull/225))

---

## [2023-05-20] - Remove Enum

### Changed

- Removed enum for performance ([#224](https://github.com/plastikaweb/plastikspace/pull/224))

---

## [2023-05-18] - Test Warnings Fix

### Fixed

- Fixed test warnings ([#221](https://github.com/plastikaweb/plastikspace/pull/221))

---

## [2023-04-06] - Shared Entities Documentation

### Added

- Added shared entities documentation ([#166](https://github.com/plastikaweb/plastikspace/pull/166))

---

## [2023-02-10] - Custom Index & API

### Added

- Added custom index functionality ([#77](https://github.com/plastikaweb/plastikspace/pull/77))
- Added API integration ([#76](https://github.com/plastikaweb/plastikspace/pull/76))

---

## [2023-02-02] - Header Social

### Added

- Added header social links ([#74](https://github.com/plastikaweb/plastikspace/pull/74))

---

## [2023-01-29] - Header Title & Sidenav

### Added

- Added sidenav component ([#71](https://github.com/plastikaweb/plastikspace/pull/71))

### Fixed

- Fixed header title on small screens ([#72](https://github.com/plastikaweb/plastikspace/pull/72))

---

## [2023-01-12] - App Scope & Favicon

### Added

- Added head favicon ([#66](https://github.com/plastikaweb/plastikspace/pull/66))
- Added Nx boundaries configuration ([#64](https://github.com/plastikaweb/plastikspace/pull/64))

### Fixed

- Fixed app scope issues ([#67](https://github.com/plastikaweb/plastikspace/pull/67))

---

## [2022-12-21] - Plastik Path Style

### Changed

- Styled plastik path component ([#61](https://github.com/plastikaweb/plastikspace/pull/61))

---

## [2022-12-20] - Commitizen Fix

### Fixed

- Fixed commitizen configuration ([#60](https://github.com/plastikaweb/plastikspace/pull/60))

---

## [2022-12-15] - README & JSDoc

### Added

- Added README documentation ([#55](https://github.com/plastikaweb/plastikspace/pull/55))

### Changed

- Updated JSDoc format ([#54](https://github.com/plastikaweb/plastikspace/pull/54))

---

## [2022-12-01] - ESLint & Code Quality

### Added

- Added utils library ([#43](https://github.com/plastikaweb/plastikspace/pull/43))

### Changed

- Fixed deprecation warnings ([#52](https://github.com/plastikaweb/plastikspace/pull/52))
- Added readonly rule ([#50](https://github.com/plastikaweb/plastikspace/pull/50))
- Added no-console rule ([#49](https://github.com/plastikaweb/plastikspace/pull/49))
- Added ESLint NgRx rules ([#48](https://github.com/plastikaweb/plastikspace/pull/48))

---

## [2022-11-30] - NgRx 15 Upgrade

### Changed

- Upgraded to NgRx 15 ([#39](https://github.com/plastikaweb/plastikspace/pull/39))
- Upgraded to Nx 15 ([#38](https://github.com/plastikaweb/plastikspace/pull/38))

---

## [2022-11-20] - Core Components

### Added

- Added core components library ([#35](https://github.com/plastikaweb/plastikspace/pull/35))

---

## [2022-11-15] - Nx 15 Upgrade

### Changed

- Upgraded to Nx 15 ([#32](https://github.com/plastikaweb/plastikspace/pull/32))

---

## [2022-11-10] - Initial Setup

### Added

- Initial project setup ([#1](https://github.com/plastikaweb/plastikspace/pull/1))
