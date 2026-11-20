# @plastik/eco-admin/auth/login

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![PocketBase](https://img.shields.io/badge/PocketBase-%23b8dbe4.svg?style=for-the-badge&logo=PocketBase&logoColor=black)

- [@plastik/eco-admin/auth/login](#plastikeco-adminauthlogin)
  - [Structure](#structure)
  - [The route](#the-route)
  - [The screen](#the-screen)
  - [Outcomes](#outcomes)
  - [Facade](#facade)
  - [Accessibility](#accessibility)
  - [What the mock has and this screen has not](#what-the-mock-has-and-this-screen-has-not)
  - [Translation keys](#translation-keys)
  - [Running unit tests](#running-unit-tests)

The login screen of **eco-admin**: address and password, for administrators only (AP-0 0.7, rebuilt in 0.7b).
Project `eco-admin-auth-login`, tags `scope:eco-admin` + `type:feature`.

## Structure

The library is built like the storefront's login (`@plastik/eco-store/auth/login`), part for part:

| Part      | File                                       | What it does                                                                                |
| --------- | ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Route     | `eco-admin-auth-login.routes.ts`           | Title, guard, and the providers of the screen: the facade, the form and the Formly types.   |
| Component | `eco-admin-auth-login.component.{ts,html}` | A thin view over the shared auth screen. It injects `AUTH_FORM_FACADE` and holds no state.  |
| Facade    | `eco-admin-auth-login-facade.service.ts`   | `AuthFormFacade<LoginData>`: opens the session, says how the attempt ended, navigates home. |

The library exports `EcoAdminAuthLoginComponent` and `ecoAdminAuthLoginRoutes`. The facade is reached through the route only.

## The route

The application mounts the route table and nothing else:

```ts
{
  path: 'accedir',
  loadChildren: () => import('@plastik/eco-admin/auth/login').then(m => m.ecoAdminAuthLoginRoutes),
}
```

`ecoAdminAuthLoginRoutes` is one route that carries:

- `title: 'auth.login.title'` and `canActivate: [ecoAdminAnonymousGuard]`: an administrator with a session never sees the screen.
- `{ provide: AUTH_FORM_FACADE, useClass: EcoAdminAuthLoginFacadeService }`.
- `{ provide: FORM_TOKEN, useFactory: loginFormConfig }`: the login form every app shares (`@plastik/auth/config/util`), with **no option of its own**.
  Fields, labels, icons, validation and the longest password (25 characters, eco-store BUG-016) are the storefront's.
- `providePlainInputFormly()`, `providePasswordWithVisibilityFormly()` and `provideFormlyAddons()`, so Formly and the field types travel in the chunk of this route and not in the main bundle.
  Loading the component alone leaves the fields without their types.

## The screen

`EcoAdminAuthLoginComponent` (`eco-admin-auth-login`) projects three things into `plastik-auth-feature` (`@plastik/auth/feature`):

- `[title]`: the heading `auth.login.title`.
- `[content]`: `plastik-shared-form-feature` over the fields and the submit of the facade's form, with the link to `/recuperar-contrasenya` in its `.extra-links` slot.
- No register block under the form (Carlos, 2026-11-20). The panel has no public sign-up: «Vista Login» says so since its freeze (AUTH-01, «sense registre
  públic aquí — les altes van per PRV-06»), and the administrator role is granted by the cooperative, never requested on this screen.

Everything around them — the mark, the name «Eco Admin», the line under it, the Material card, the notice over the form and the theme control — is drawn by the shared screen
from what `provideEcoAdminAuthScreen()` (`apps/eco-admin/src/app/auth-screen.provider.ts`) says once for the whole application under `AUTH_SCREEN_DEFAULTS`.
The fill and the hairline edge of the card come from the partial both eco applications load (`eco_auth_card`, `libs/eco/styles`);
the panel names its fill in `--eco-auth-card-background` (`apps/eco-admin/src/styles/_base.scss`).
The login screen of eco-admin is the same for every cooperative: it shows the mark of the panel, never a tenant's.

Every control is an Angular Material component drawn by Formly. The screen has no stylesheet: how a field looks is said by the shared form configuration and by the
eco field style (`eco_form_field`, in `libs/eco/styles`), which the application loads from its global stylesheet.

## Outcomes

The facade asks `pocketBaseUserProfileStore.login()` with `allowedRoles` set to the two administrator roles and `notifyOnFailure: false`:
how an attempt ended is said inside the card, never in a toast.

| Store outcome    | What the screen shows                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| `authenticated`  | The success notice (`global` or `tenant`), an announcement, and the navigation.                                    |
| `failed`         | `auth.login.error.wrong`. The same text whether or not the address exists.                                         |
| `role-rejected`  | `auth.login.error.member`, as a warning: the account belongs to a storefront member.                               |
| `mfa-required`   | `auth.login.error.secondStep`, and the pending login is dropped. Temporary, see below.                             |
| _(store throws)_ | `auth.login.error.wrong`.                                                                                          |
| _(invalid form)_ | No request and no notice: the submit shows the message of each field and moves the focus to the first invalid one. |

After a login the facade navigates to `resolveReturnUrl(returnUrl, ecoAdminHomeFor(role))`, reading `returnUrl` from the query parameters of the route,
so a value that is not a path of this application is ignored.

The notice goes away as soon as a field is edited (`pendingChangesEvent` of the shared form), and when the screen is left.
It also goes away while the next attempt runs and comes back with its answer, which is what shakes the card again (`eco-shake-on-error`, `libs/eco/styles`).

The emailed-code step is not built yet. Both PocketBase switches (`otp`, `mfa`) are off in every environment until B-34,
so `mfa-required` cannot happen today; the `secondStep` notice exists so that an early switch does not leave the screen silent.

## Facade

`EcoAdminAuthLoginFacadeService` implements `AuthFormFacade<LoginData>` (`@plastik/auth/entities`).

- `formConfig`: the form the route provides under `FORM_TOKEN`.
- `isLoading()`: whether an attempt is running.
- `error()`: one of `ECO_ADMIN_LOGIN_ERRORS` (`wrong`, `secondStep`, `member`) or `null`. The first two are the ones every login screen shares (`AUTH_LOGIN_ERRORS`).
- `success()`: one of `ECO_ADMIN_LOGIN_SUCCESSES` (`global`, `tenant`) or `null`. It is set only between the login and the end of the navigation.
- `onSubmit(credentials)`: never rejects. It ignores an attempt made while another one runs or after a session was opened.
  The address is trimmed; the password is sent as typed.
- `clearError()`: hides the error, unless an attempt is running.

A session whose role is not an administrator's is closed again, even if the store reported it as authenticated.
The route may keep one instance of the facade across visits, which is why the shared screen calls `clearError()` when it is destroyed.

## Accessibility

- The notice is the shared alert (`role="alert"`). A failure also takes the focus, so the keyboard goes on from it.
- The success is announced through `LiveAnnouncer`: the navigation destroys the screen, and a live region inside it would be cut short.
- Each field is named once, by the `<mat-label>` of its form field; the messages under a field are `mat-error` (`common.form.error.*`), tied to it by Material.
  Every field keeps the room of one message line (`subscriptSizing: 'fixed'`), so the card does not grow when one shows.
- The password toggle is a 44×44 button with `aria-pressed` and a label that says what a press will do.
- The icons that lead the fields and the ones inside the links are hidden from assistive technology.
- The shake is switched off under `prefers-reduced-motion: reduce`.
- The submit is the shared form's with `alwaysEnabled` (Carlos, 2026-11-20): it never carries `disabled`, so it stays in the tab order and a press on an invalid form
  says why where the user is looking.

## What the mock has and this screen has not

Design redrew «10 Superadmin/Vista Login» on 2026-11-15 from captures of this screen (round «41B · com a l'app»). The mock now has two modes:

- **«Com a l'app»**, the default: this screen as it is — the shared `plastik-auth-feature` on a Material card, the label that rests inside the field and floats,
  the submit disabled until the form is valid, the shared alert as the notice, the storefront's texts and the register block. Two of those changed on 2026-11-20:
  the submit stays enabled and the register block is gone, so this mode no longer matches the screen.
- **«Proposta»**: what Design suggests and nobody has ruled on. None of it is built.

What the mock still draws and the screen does not:

- **«Proposta»**: a busy label with a spinner; no 8-character minimum
  on the login password; an invitation line as the foot of the card. Each one would change the shared form or the shared login configuration, so the storefront with it.
- «Va a la botiga →» in the member notice: neither `tenants` nor the admin environment knows the storefront's address.
- The notice for a producer account: no role in the schema stands behind it.
- «obre'l ara» in the success notice: `ECO_ADMIN_LOGIN_SUCCESSES` carries no link, and the navigation follows by itself.
- Small measures the mock read off a capture differently from what the screen measures (the weight of the name, the size of the leading icon and of the password toggle,
  the height of the links): they go back to Design, they are not defects of the screen.

The mock still calls the screen `eco-store-auth-container`, the name it had before it moved to `@plastik/auth/feature`, and says the column is 420px wide (it is 450px).

## Translation keys

In `apps/eco-admin/public/i18n/{ca,es}.json`:

- `auth.frame.subtitle`, read by `provideEcoAdminAuthScreen()`.
- `auth.login.{title,email,password,submit,recoverAccess}`.
- `auth.login.success.{title,redirectTenant,redirectGlobal}` and `auth.login.error.{wrong,member,secondStep}.{title,body}`.
- `common.form.{password,showPassword,hidePassword}` and `common.form.error.{required,email,minLength,maxLength}`, read by the shared field types.
- `common.theme.*`, read by the theme control.

The keys carry the same names and the same texts as the storefront's. They live in two copies; nothing but
`apps/eco-admin/src/app/i18n-parity.spec.ts` (which aligns the two languages of this app) checks them.

## Running unit tests

Run `nx test eco-admin-auth-login` to execute the unit tests.
