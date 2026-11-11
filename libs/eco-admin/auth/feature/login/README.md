# @plastik/eco-admin/auth/login

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![PocketBase](https://img.shields.io/badge/PocketBase-%23b8dbe4.svg?style=for-the-badge&logo=PocketBase&logoColor=black)

- [@plastik/eco-admin/auth/login](#plastikeco-adminauthlogin)
  - [The screen](#the-screen)
  - [Outcomes](#outcomes)
  - [Facade](#facade)
  - [Accessibility](#accessibility)
  - [What the frozen mock has and this screen has not](#what-the-frozen-mock-has-and-this-screen-has-not)
  - [Translation keys](#translation-keys)
  - [Running unit tests](#running-unit-tests)

The login screen of **eco-admin**: address and password, for administrators only (AP-0 0.7).
Project `eco-admin-auth-login`, tags `scope:eco-admin` + `type:feature`.

## The screen

`EcoAdminAuthLoginComponent` (`eco-admin-auth-login`) is a whole page. It carries its own `<main id="mainContent">`, so it is routed outside the application shell.

```ts
{
  path: 'accedir',
  title: 'auth.login.title',
  canActivate: [ecoAdminAnonymousGuard],
  loadComponent: () => import('@plastik/eco-admin/auth/login').then(m => m.EcoAdminAuthLoginComponent),
}
```

The input `returnUrl` is bound from the query parameter of the same name (`withComponentInputBinding()`).
After a login the screen navigates to `resolveReturnUrl(returnUrl, ecoAdminHomeFor(role))`, so a value that is not a path of this application is ignored.

The markup is its own, not `plastik-auth-feature` nor a formly form: that component has a fixed width of 425px,
disables its button with `disabled` and sets no `autocomplete`. The measures follow the frozen mock «Vista Login».

## Outcomes

The screen asks `pocketBaseUserProfileStore.login()` with `allowedRoles` set to the two administrator roles and `notifyOnFailure: false`:
a failed login is explained inside the card, never in a toast.

| Store outcome     | What the screen shows                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `authenticated`   | The success notice, an announcement, and the navigation.                                     |
| `failed`          | `auth.login.error.wrong`. The same text whether or not the address exists.                   |
| `role-rejected`   | `auth.login.error.member`: the account belongs to a storefront member.                       |
| `mfa-required`    | `auth.login.error.secondStep`, and the pending login is dropped. Temporary, see below.       |
| _(store throws)_  | `auth.login.error.wrong`.                                                                    |
| _(empty a field)_ | `auth.login.error.wrong`, without a request. The fields have no validators and no red state. |

The emailed-code step is not built yet. Both PocketBase switches (`otp`, `mfa`) are off in every environment until B-34,
so `mfa-required` cannot happen today; the `secondStep` notice exists so that an early switch does not leave the screen silent.

## Facade

`EcoAdminAuthLoginFacade` is provided by the component and holds the state of one visit to the screen.

- `status()`: `'idle' | 'submitting' | 'success'`.
- `error()`: `'wrong' | 'member' | 'secondStep' | null`.
- `role()`: the administrator role once `status()` is `success`.
- `shake()`: `'odd' | 'even' | null`. It alternates on every failure, because a CSS animation restarts only when its name changes.
- `submit(credentials)`: resolves to `'authenticated'`, `'rejected'` or `'ignored'` (an attempt is running, or one already succeeded).
  The address is trimmed; the password is sent as typed.
- `clearResult()`: hides the error. The fields call it on every keystroke.

A session whose role is not an administrator's is closed again, even if the store reported it as authenticated.

## Accessibility

- The submit button uses `aria-disabled` while a request runs, so it keeps the focus and stays announced. A second submit is ignored by the facade.
- The error notice sits in an `aria-live="assertive"` region and takes the focus, as the frozen mock specifies.
- The success is announced through `LiveAnnouncer`: the navigation destroys the screen, and a live region inside it would be cut short.
- The password toggle is a 44×44 button with `aria-pressed` and a label that says what a press will do.
- Keyboard focus draws the ring of the global system (`core_a11y`); the fields carry `make-it-focusable` for it.
  A field focused with the pointer shows a primary border instead.
- The shake is switched off under `prefers-reduced-motion: reduce`.
- The theme button lives in a `<header>`, so no content is outside a landmark.

## What the frozen mock has and this screen has not

- «Va a la botiga →» in the member notice: neither `tenants` nor the admin environment knows the storefront's address.
- «Has oblidat la contrasenya?»: eco-admin has no such route yet.
- The notice for a producer account: no role in the schema stands behind it.
- The ids `li-email` / `li-pw`: they are `eco-admin-login-email` / `eco-admin-login-password` here.

## Translation keys

All under `auth.login` in `apps/eco-admin/public/i18n/{ca,es}.json`:
`subtitle`, `email`, `password`, `showPassword`, `hidePassword`, `submit`, `submitting`, `themeToDark`, `themeToLight`,
`success.{title,redirectTenant,redirectGlobal}` and `error.{wrong,member,secondStep}.{title,body}`.

The error keys are built in the template from the error code, so `yarn i18n:validate` does not see them.
`apps/eco-admin/src/app/i18n-parity.spec.ts` keeps the two languages aligned.

## Running unit tests

Run `nx test eco-admin-auth-login` to execute the unit tests.
