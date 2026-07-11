# eco-store-profile-access-security-feature

Profile "Accés i seguretat" section for the eco-store app. Hosts two independent forms:

- **Email change (PRV-02b)** — requests PocketBase's verified email-change flow;
  the account is unchanged until the user confirms from the email link (`/confirmar-correu`).
- **In-session password change (PRV-02c)** — current / new / confirm fields.
  PocketBase validates the current password server-side; on success the session is preserved
  via silent re-auth and the form resets to its pristine state, on failure the
  current-password field is re-focused with its content selected.

Form definitions live in the `*.config.ts` files next to the feature component —
including behavior hooks like `focusCurrentPassword()` — so the component never touches
the form's field layout. Field keys `newPassword`/`confirmPassword` intentionally match
the shared `passwordMatch` group validator.

## Running unit tests

Run `nx test eco-store-profile-access-security-feature` to execute the unit tests via Vitest.
