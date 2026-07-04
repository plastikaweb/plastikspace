# PRV-02b — Email change with async verification — Design

**Task:** PRV-02b · **ClickUp:** [`86c9uq8mt`](https://app.clickup.com/t/86c9uq8mt) · **Date:** 2026-06-27
**App:** eco-store (Angular 21 + PocketBase 0.36.7) · **Priority:** MUST · **Estimate:** ~2 dev-days

> **ID drift note:** `apps/eco-store/TASKS.md` / `BACKLOG.md` carry the **wrong** ClickUp ID for
> this task (`86c92g6ek`). The real task is `86c9uq8mt`. The whole `PRV-02*` series (`86c92g…`)
> looks mis-IDed and should be reconciled (`/sync-eco-store-tasks`); fix at least PRV-02b's ID when
> this ships.

---

## 1. Goal & context

Let a logged-in member change their account email through PocketBase's **native, verified**
email-change flow. The change is **not applied immediately**: PocketBase emails a confirmation link
to the **new** address; only after the user confirms (proving ownership _and_ re-entering their
current password) does the email actually change.

This is the first feature of a new **"Accés i seguretat"** profile section, which will later also
host PRV-02c (in-session password change) and PRV-08 (account deletion). **This task builds only the
email change**, but the new lib is structured so those siblings drop in later (YAGNI: no scaffolding
for them now).

### Why PocketBase-native (not a custom flow)

The PocketBase SDK already exposes `requestEmailChange(newEmail)` and
`confirmEmailChange(token, currentPassword)` on the `users` auth collection. Nothing in the app wires
them yet, but they give us verification, token issuance, and email delivery for free. We mirror the
**existing PRV-03 reset-password flow**, which is the proven precedent for an async-email + public
token-confirmation page in this codebase.

### Hard constraints imposed by PocketBase (shape the UX)

1. **Confirmation needs the current password.** `confirmEmailChange(token, password)` requires it, so
   the confirmation step cannot be a bare link-click — it needs a password field.
2. **Token invalidation on success.** A confirmed email change invalidates the auth token → the user
   must **re-login**. The confirmation page therefore ends at `/accedir`.
3. **The confirmation link is clicked from an email, likely while logged out** → the confirmation
   page must be a **public route** (guarded `pocketBaseIsNotLoggedGuard`), not an in-shell profile
   screen. This is the one part that cannot be "inline".

---

## 2. UX decisions (locked)

- **Request side is inline** in `/perfil/access-i-seguretat`: a Formly form with the new-email field;
  submit → triggers the verification email → success toast ("we sent a link to `<newEmail>`"). Nothing
  on the account changes yet.
- **Confirmation side is a separate public page** `/confirmar-correu?token=…`, mirroring
  `restablir-contrasenya`: reads the token from the URL, asks for the **current password**, calls
  `confirmEmailChange`, then redirects to `/accedir` (forced re-login).
- **Public route name:** `confirmar-correu`.
- **Same-email guard:** the request form blocks submit when the new email equals the current one.
- **Styling:** the new profile section reuses the same wrappers/styles as `dades-personals` /
  `avatar` / `adreces`.

---

## 3. Architecture & components

### 3a. New profile feature lib (request side, inline, authenticated)

- **Lib:** `libs/eco-store/profile/access-security` · project `eco-store-profile-access-security-feature`
  · alias `@plastik/eco-store/profile/access-security` · tags `scope:eco-store,type:feature`.
- **Component:** `EcoStoreProfileAccessSecurityFeatureComponent` — standalone, OnPush, mirrors
  `profile/basic`'s use of `<plastik-shared-form-feature>` + a `FormConfig`.
- **Form config:** `access-security-email-form.config.ts` — one field `email` (type `input`,
  `email` validator, required), plus a same-as-current expression/validator that disables submit.
  Provides the plain input Formly type via `providePlainInputFormly()` (as `profile/basic` does).
- **Submit:** `onSubmit({ email }) → pocketBaseUserProfileStore.requestEmailChange(email)`.
- **Feedback:** via the store → `StoreNotificationService` (`profile.accessSecurity.success.requested`
  / `profile.accessSecurity.error.requested`), consistent with how `profile/basic` surfaces results.
- **Routes:** `eco-store-profile-access-security-feature.routes.ts` exporting
  `ecoStoreProfileAccessSecurityFeatureRoutes`; barrel `index.ts`.

### 3b. New auth confirmation lib (confirm side, public)

- **Lib:** `libs/eco-store/auth/feature/confirm-email-change` · project
  `eco-store-auth-feature-confirm-email-change` · tags `scope:eco-store,type:feature`.
- **Component:** `EcoStoreAuthConfirmEmailChangeComponent` — a near-copy of
  `EcoStoreAuthResetPasswordComponent` (same `EcoStoreAuthContainerComponent` shell, same
  `AUTH_FORM_FACADE` + `FORM_TOKEN` provider pattern, `providePasswordWithVisibilityFormly()`).
- **Facade:** `eco-store-auth-confirm-email-change-facade.service.ts` — reads
  `new URL(window.location.href).searchParams.get('token')`; `onSubmit({ password }) →
pocketBaseUserProfileStore.confirmEmailChange({ token, password })`; on success →
  `StoreNotificationService.create('auth.confirmEmailChange.success','SUCCESS')` + navigate
  `/accedir`; on failure → error toast (token expired / wrong password) and a route back.
- **Form:** single field — current `password` (password-with-visibility type).

### 3c. Data-access (shared) — `libs/shared/auth/pocketbase/data-access`

Mirror the existing `requestPassword` / `resetPassword` pair exactly.

- **`PocketBaseAuthService`** (`pocketbase-auth.service.ts`):
  - `requestEmailChange(newEmail: string): Promise<void>` → `this.#pb.collection('users').requestEmailChange(newEmail)`.
  - `confirmEmailChange(token: string, password: string): Promise<void>` →
    `this.#pb.collection('users').confirmEmailChange(token, password)`.
- **`pocketBaseUserProfileStore`** (`pocketbase-user-profile.store.ts`):
  - `requestEmailChange(newEmail)` and `confirmEmailChange({ token, password })` methods that toggle
    `isLoading`, delegate to the service, and return a `boolean` success flag (same shape as
    `resetPassword`).
- Update the store **mock** (`pocketbase-user-profile.store.mock.ts`) and any `AuthFacade`
  interface in `@plastik/auth/entities` if the new methods belong there.

### 3d. Backend — PocketBase email template (the blocker, in scope)

- In the **Admin UI**, edit the `users` collection's **Confirm email change** template
  (`confirmEmailChangeTemplate` in `apps/eco-store/pocketbase/pb_schema.json`):
  - Point the action URL at the **app** route: `{APP_URL}/confirmar-correu?token={TOKEN}`
    (currently the PocketBase default `{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}` → admin dash).
  - Translate the subject/body to Catalan to match the password-reset template.
  - Confirm `{APP_URL}` resolves **per-tenant** (tenant resolution is host-based at app init);
    if a single `APP_URL` can't be per-tenant in the template, document the limitation and follow
    whatever the password-reset template already does.
- Then `yarn eco-store:pb:export` to version `pb_schema.json`; the schema syncs to staging on merge
  via `.github/workflows/pocketbase-schema.yml`.
- **Check for a hook precedent:** `on_password_reset.pb.js` exists; see whether email change needs an
  analogous hook (likely not — `requestEmailChange` sends the mail itself — but verify).

### 3e. Routing & navigation

- **`apps/eco-store/src/app/app.routes.ts`:** add public route `confirmar-correu` →
  `EcoStoreAuthConfirmEmailChangeComponent`, guarded `pocketBaseIsNotLoggedGuard` (sits beside
  `restablir-contrasenya`).
- **Profile routes** (`eco-store-profile-feature.routes.ts`): add child
  `access-i-seguretat` → `ecoStoreProfileAccessSecurityFeatureRoutes`.
- **Profile nav/menu:** add an "Accés i seguretat" entry alongside `dades-personals` / `avatar` /
  `adreces` (locate the profile nav component during planning).

### 3f. i18n (`apps/eco-store/public/i18n/{ca,es,en}.json`)

- `profile.accessSecurity.title`, `.description`, `.email.label`, `.email.currentLabel`,
  `.submitButton`, `.success.requested`, `.error.requested`, `.error.sameEmail`.
- `auth.confirmEmailChange.title`, `.description`, `.password.label`, `.submitButton`,
  `.success`, `.error.invalidToken`, `.error.wrongPassword`.
- Reuse the existing email-format message and `auth.*.email` label where possible.
- `yarn i18n:validate` must stay green (runs in pre-commit).

---

## 4. Data flow

```text
/perfil/access-i-seguretat   (authenticated, inline)
  email form → submit
    → store.requestEmailChange(newEmail)
        → PocketBaseAuthService.requestEmailChange
            → pb.collection('users').requestEmailChange(newEmail)
    → success toast "T'hem enviat un enllaç a <newEmail>"   (account unchanged)

PocketBase emails the NEW address a link → /confirmar-correu?token=…   (likely logged out)
  password form (current password) → submit
    → store.confirmEmailChange({ token, password })
        → PocketBaseAuthService.confirmEmailChange
            → pb.collection('users').confirmEmailChange(token, password)
    → email changed + token invalidated
    → success toast + redirect /accedir   (re-login with the new email)
```

---

## 5. Error handling

- **Request:** invalid email (Formly `email` validator); new == current (same-email guard, submit
  disabled + `error.sameEmail`); backend failure → `error.requested` toast. Do **not** leak whether
  the new address already exists (PocketBase handles uniqueness server-side; surface a generic error).
- **Confirm:** missing/expired/invalid token, or wrong current password → PocketBase rejects;
  show `error.invalidToken` / `error.wrongPassword` toast and offer a route back to login.
- **Stale state:** never trust in-memory `user().email` after a request; the change is only real
  post-confirmation, and confirmation forces re-login, so no manual `authRefresh()` is needed.

---

## 6. Testing

- **Data-access:** specs for `requestEmailChange` / `confirmEmailChange` on both the service and the
  store, with a mocked `pb` (assert the right SDK calls + `isLoading` toggling + success flag).
- **access-security feature:** spec that a valid new email submit calls `store.requestEmailChange`;
  that the same-email case disables submit.
- **confirm-email-change:** spec mirroring reset-password's — token read from URL, submit calls
  `store.confirmEmailChange`, success navigates to `/accedir` (use a router test harness as the
  reset-password spec does).
- Pa11y (`yarn eco-store:a11y`) covers the new authenticated profile screen; keep the new public
  route accessible (labels, focus) like reset-password.

---

## 7. Scope

**In scope:** the two new libs, the data-access methods, the PocketBase template reconfig + export,
routing + profile nav entry, i18n, tests, the TASKS/BACKLOG flip (with the corrected ClickUp ID).

**Out of scope (explicit non-goals):** PRV-02c password change and PRV-08 account deletion (future
siblings in the same section); reconciling the rest of the `PRV-02*` ClickUp ID drift beyond PRV-02b;
any change to the password-reset flow.

---

## 8. Open items to resolve during planning (not blockers)

- Exact profile-nav component + how entries are registered (locate it).
- Whether `AuthFacade` (`@plastik/auth/entities`) should grow the two new methods or they live only
  on the store/service.
- Confirm the per-tenant `{APP_URL}` behaviour in the PocketBase template matches the password-reset
  template's approach.
