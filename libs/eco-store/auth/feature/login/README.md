# @plastik/eco-store/auth/login

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Material](https://img.shields.io/badge/material_ui-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/auth/login](#plastikeco-storeauthlogin)
  - [Structure](#structure)
  - [The route](#the-route)
  - [The screen](#the-screen)
  - [Outcomes](#outcomes)
  - [Running unit tests](#running-unit-tests)

The login screen of **eco-store**: address and password. Project `eco-store-auth-feature-login`, tags `scope:eco-store` + `type:feature`.
The login of eco-admin (`@plastik/eco-admin/auth/login`) is built the same way, part for part; keep the two alike.

## Structure

| Part      | File                                             | What it does                                                                               |
| --------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Route     | `eco-store-auth-feature-login.routes.ts`         | Title, guard, and the providers of the screen: the facade, the form and the Formly types.  |
| Component | `login/eco-store-auth-login.component.{ts,html}` | A thin view over the shared auth screen. It injects `AUTH_FORM_FACADE` and holds no state. |
| Facade    | `login/eco-store-auth-login-facade.service.ts`   | `AuthFormFacade<LoginData>`: opens the session, says how the attempt ended, navigates.     |

## The route

The application mounts the route table and nothing else:

```typescript
{
  path: 'accedir',
  loadChildren: () => import('@plastik/eco-store/auth/login').then(m => m.ecoStoreAuthLoginRoutes),
}
```

`ecoStoreAuthLoginRoutes` is one route that carries:

- `title: 'auth.login.title'`, resolved by `EcoStorePrefixTitleService`, and `canActivate: [pocketBaseIsNotLoggedGuard]`.
- `{ provide: AUTH_FORM_FACADE, useClass: EcoStoreAuthLoginFacadeService }`.
- `{ provide: FORM_TOKEN, useFactory: loginFormConfig }`: the login form every app shares (`@plastik/auth/config/util`), with no option of its own.
- `MAT_FORM_FIELD_DEFAULT_OPTIONS` (`appearance: 'outline'`), `providePlainInputFormly()`, `providePasswordWithVisibilityFormly()` and `provideFormlyAddons()` (the leading icons).

## The screen

`EcoStoreAuthLoginComponent` projects into `plastik-auth-feature` (`@plastik/auth/feature`), the auth screen both eco apps share:

- `[title]`: the heading `auth.login.title`.
- `[content]`: `plastik-shared-form-feature` over the fields and the submit of the facade's form, with the link to `/recuperar-contrasenya` in its `.extra-links` slot.
- Under the form, the register block: a line of text and an outlined link to `/activar-compte`. **No app serves that path yet**, so the link falls through the wildcard route.

Everything around them is drawn by the shared screen from what `provideEcoStoreAuthScreen()` (`apps/eco-store/src/app/auth-screen.provider.ts`) says once for the whole
application under `AUTH_SCREEN_DEFAULTS`: the tenant's logo, name and slogan, the terms line, the shake of the card on an error, and the «Back» button
shown when the app runs installed (standalone), where the browser offers none.

## Outcomes

The facade asks `pocketBaseUserProfileStore.login()` with `notifyOnFailure: false`: how an attempt ended is said inside the card, never in a toast.

| What happened                              | What the screen shows                                                                |
| ------------------------------------------ | ------------------------------------------------------------------------------------ |
| `authenticated`, account of this tenant    | Nothing: the facade navigates to `returnUrl` when it is a path of this app, or home. |
| `authenticated`, account of another tenant | The session is closed again and `AUTH_LOGIN_ERRORS.wrong` is shown, on purpose.      |
| `failed`, or the store throws              | `AUTH_LOGIN_ERRORS.wrong`. The same text whether or not the address exists.          |
| `mfa-required`                             | `AUTH_LOGIN_ERRORS.secondStep`, and the pending login is dropped.                    |

The notice goes away as soon as a field is edited (`pendingChangesEvent` of the shared form) and when the screen is left. It also goes away while the next
attempt runs and comes back with its answer, which is what shakes the card again (`eco-shake-on-error`, `libs/eco/styles`).
While an attempt runs the facade shows the activity bar with `auth.login.loading`.

## Running unit tests

Run `nx test eco-store-auth-feature-login` to execute the unit tests via Vitest.
