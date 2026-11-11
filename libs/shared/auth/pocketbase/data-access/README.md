# @plastik/auth/pocketbase/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![PocketBase](https://img.shields.io/badge/PocketBase-%23b8dbe4.svg?style=for-the-badge&logo=PocketBase&logoColor=black)

- [@plastik/auth/pocketbase/data-access](#plastikauthpocketbasedata-access)
  - [Services](#services)
  - [Store](#store)
    - [**`pocketBaseUserProfileStore`**](#pocketbaseuserprofilestore)
      - [State Signals](#state-signals)
      - [Methods](#methods)
    - [Login outcome and roles](#login-outcome-and-roles)
    - [Second factor (email code)](#second-factor-email-code)
  - [Guards](#guards)
  - [Running unit tests](#running-unit-tests)

This library provides the **PocketBase implementation** of the authentication logic. It implements the `AuthFacade` contract defined in [`@plastik/shared/auth/feature`](../../feature/README.md).

**Key Features:**

- **Automatic Session Restoration**: Persists authentication across page reloads using PocketBase's built-in localStorage.
- **Type-Safe**: Full TypeScript support with `PocketBaseUser` entity.
- **DevTools Integration**: State changes tracked in Redux DevTools.

## Services

- **`PocketBaseAuthService`**: Implements `AuthFacade`. Lightweight wrapper around the PocketBase JS SDK for authentication operations.
  - `login`: Authenticates a user with email and password.
  - `requestOtp(email)`: Asks PocketBase to email a one-time code and returns the `otpId`. PocketBase answers with an id even for an unknown address.
  - `loginWithOtp(otpId, code, mfaId)`: Completes a pending login with the emailed code as the second factor.
  - `logout`: Clears the authentication state.
  - `register`: Registers a new user.
  - `requestPassword`: Sends a password reset email.
  - `requestEmailChange` / `confirmEmailChange`: PocketBase's verified email-change flow (PRV-02b).
  - `changePassword`: PATCHes `oldPassword`/`password`/`passwordConfirm` and silently re-authenticates
    with the new password — the change rotates the user's `tokenKey`, so without the re-auth the session would die (PRV-02c).
  - `authModel`: (getter) Gets the currently authenticated user.

## Store

### **`pocketBaseUserProfileStore`**

An NgRx Signal Store for reactive authentication state management.

#### State Signals

- `user()` - `Signal<PocketBaseUser | null>`: Currently authenticated user.
- `isAuthenticated()` - `Signal<boolean>`: Authentication status.
- `userInitials()` - `Signal<string | undefined>`: Initials of the authenticated user (max 2 characters).
- `userFirstName()` - `Signal<string>`: First name of the authenticated user.
- `isLoading()` - `Signal<boolean>`: Loading state during operations.
- `isTenantAdmin()` - `Signal<boolean>`: The signed-in user has the `TENANT_ADMIN` role.
- `isGlobalAdmin()` - `Signal<boolean>`: The signed-in user has the `GLOBAL_ADMIN` role.
- `loginChallenge()` - `Signal<PocketBaseLoginChallenge | null>`: A login that passed the password check and waits for the emailed code (`{ email, mfaId, otpId }`); `null` otherwise.

#### Methods

- `login(credentials, options?)`: Authenticate with email/password. Resolves to a `PocketBaseLoginOutcome`; see [Login outcome and roles](#login-outcome-and-roles).
- `requestLoginCode()`: Email the one-time code for the pending login (first send and resend).
- `verifyLoginCode(code, options?)`: Complete the pending login with the code. Resolves to a `PocketBaseLoginCodeOutcome`.
- `cancelLoginChallenge()`: Drop the pending login.
- `logout()`: Clear authentication and reset state.
- `checkAuth()`: Check and restore session from localStorage (auto-called on init).
- `getUserAddresses()`: Fetch all addresses for the current user.
- `createAddress(data)`: Create a new address with optimistic update.
- `updateAddress(id, data)`: Update an existing address with optimistic update.
- `deleteAddress(id)`: Delete an address by ID.
- `setDefaultAddress(id)`: Set an address as the default.
- `updateProfile(data)`: Update the user's name and phone.
- `updateAvatar(file)`: Upload a new profile avatar.
- `deleteAvatar()`: Remove the profile avatar.
- `requestPassword(data)`: Send a password reset email.
- `resetPassword(data)`: Confirm a password reset with token.
- `requestEmailChange(newEmail)`: Request PocketBase's verified email change; maps the 400 invalid-new-email response to its own toast.
- `confirmEmailChange(data)`: Confirm the email change with token + current password.
- `changePassword(data)`: In-session password change (`ChangePasswordData`); keeps the session alive via silent re-auth and maps the 400 wrong-old-password response to its own toast.

### Login outcome and roles

`login()` never throws. It resolves to one of:

| Outcome           | Meaning                                                                   | Store state                            | Toast              |
| ----------------- | ------------------------------------------------------------------------- | -------------------------------------- | ------------------ |
| `'authenticated'` | The session is open.                                                      | `user` set, `isAuthenticated` true     | none               |
| `'mfa-required'`  | The password is right and the collection demands a second factor.         | `loginChallenge` set, no session       | none               |
| `'role-rejected'` | The credentials are valid but the role is outside `options.allowedRoles`. | no session, the saved token is cleared | none               |
| `'failed'`        | Anything else: wrong credentials, network, server.                        | no session                             | `auth.error.login` |

An app that only admits some roles passes them on login, and the store rejects the others before `isAuthenticated` is ever true:

```typescript
const outcome = await profileStore.login(credentials, {
  allowedRoles: ['TENANT_ADMIN', 'GLOBAL_ADMIN'],
});
```

Without `allowedRoles` every role is accepted. The message for `'role-rejected'` belongs to the calling screen; the store shows none.

### Second factor (email code)

The flow follows PocketBase's MFA protocol and only runs when the `users` collection has `otp` and `mfa` enabled; with both off, `login()` never resolves `'mfa-required'`.

1. `login()` resolves `'mfa-required'` and fills `loginChallenge`. No email is sent yet: an app with no screen to type the code must not trigger one.
2. `requestLoginCode()` emails the code. Call it again to resend; each call replaces the `otpId`.
3. `verifyLoginCode(code, options?)` checks it, with the same `allowedRoles` given to `login()`.
4. `cancelLoginChallenge()` goes back to the password form. `logout()` and a new `login()` also drop the pending login.

`verifyLoginCode()` resolves to one of:

| Outcome               | Meaning                                                                                 | Pending login |
| --------------------- | --------------------------------------------------------------------------------------- | ------------- |
| `'authenticated'`     | The session is open.                                                                    | dropped       |
| `'role-rejected'`     | Right code, role outside `allowedRoles`. The saved token is cleared.                    | dropped       |
| `'invalid-code'`      | Wrong, expired or already used code. A wrong try does not burn the code.                | kept          |
| `'too-many-attempts'` | PocketBase answered 429: five checks per user every three minutes, right code included. | kept          |
| `'challenge-expired'` | The pending login ran out (`mfa.duration`). PocketBase burns the code: start again.     | dropped       |
| `'failed'`            | No pending login, no code requested, or the request got no answer.                      | kept          |

These outcomes were checked against a local PocketBase 0.36 with `otp` and `mfa` enabled (2026-11-11).
A wrong code and an expired pending login are both a 400 with an empty body, so `'challenge-expired'` is read from the server message ("Invalid or expired MFA session.").
If that text changes it degrades to `'invalid-code'`.

## Guards

- **`pocketBaseRoleGuard(roles, options?)`**: Guard factory that allows access only to signed-in users holding one of `roles`.
  A visitor with no session is sent to `options.loginUrl` (default `/accedir`); a signed-in user with another role is sent to `options.redirectTo` (default `/`).
  It never closes the session.

  ```typescript
  canActivate: [
    pocketBaseRoleGuard(['TENANT_ADMIN', 'GLOBAL_ADMIN'], { redirectTo: '/sense-acces' }),
  ];
  ```

- **`pocketBaseIsLoggedGuard`**: Route guard that allows access only to authenticated users. Redirects to login if unauthorized.
- **`pocketBaseIsNotLoggedGuard`**: Route guard that allows access only to **unauthenticated** users (guests). Redirects to home if already logged in.

## Running unit tests

Run `nx test auth-pocketbase-data-access` to execute the unit tests.
