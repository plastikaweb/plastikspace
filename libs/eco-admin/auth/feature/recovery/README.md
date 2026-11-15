# @plastik/eco-admin/auth/recovery

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![PocketBase](https://img.shields.io/badge/PocketBase-%23b8dbe4.svg?style=for-the-badge&logo=PocketBase&logoColor=black)

- [@plastik/eco-admin/auth/recovery](#plastikeco-adminauthrecovery)
  - [The three screens](#the-three-screens)
  - [Routes](#routes)
  - [What is shared and what is not](#what-is-shared-and-what-is-not)
  - [Where the email leads](#where-the-email-leads)
  - [What does not work yet](#what-does-not-work-yet)
  - [Translation keys](#translation-keys)
  - [Running unit tests](#running-unit-tests)

The three screens an administrator of **eco-admin** sets a new password with (AP-0 0.7b), built on the storefront's design.
Project `eco-admin-auth-recovery`, tags `scope:eco-admin` + `type:feature`.

## The three screens

| Screen                                    | Path                             | What it does                                                                          |
| ----------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------- |
| `EcoAdminAuthForgotPasswordComponent`     | `/recuperar-contrasenya`         | Asks for the address of the account and requests the email.                           |
| `EcoAdminAuthForgotPasswordSentComponent` | `/recuperar-contrasenya-enviada` | Says the email is on its way. Shown whether or not the address belongs to an account. |
| `EcoAdminAuthResetPasswordComponent`      | `/restablir-contrasenya?token=…` | Takes the new password twice and sets it with the token of the link.                  |

Each one is a thin view projected into `plastik-auth-feature` (`@plastik/auth/feature`), like the login screen. None holds state: the two with a form
inject `AUTH_FORM_FACADE`, and the "sent" screen is text and a link back to `/accedir`.

## Routes

The library exports one route table per screen, and the application mounts each under the storefront's path:

```ts
{
  path: 'recuperar-contrasenya',
  loadChildren: () => import('@plastik/eco-admin/auth/recovery').then(m => m.ecoAdminAuthForgotPasswordRoutes),
},
{
  path: 'recuperar-contrasenya-enviada',
  loadChildren: () => import('@plastik/eco-admin/auth/recovery').then(m => m.ecoAdminAuthForgotPasswordSentRoutes),
},
{
  path: 'restablir-contrasenya',
  loadChildren: () => import('@plastik/eco-admin/auth/recovery').then(m => m.ecoAdminAuthResetPasswordRoutes),
},
```

**The paths are not free to choose.** The shared facades and messages navigate to them by name: the request facade to `/recuperar-contrasenya-enviada`,
the "password changed" message to `/accedir` and the "link no longer works" message to `/recuperar-contrasenya`.

Every route is guarded by `ecoAdminAnonymousGuard` and carries its title and its providers:

| Route table                            | Facade under `AUTH_FORM_FACADE`          | Form under `FORM_TOKEN`     | Formly providers                                                                              |
| -------------------------------------- | ---------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------- |
| `ecoAdminAuthForgotPasswordRoutes`     | `PocketBaseRequestPasswordFacadeService` | `requestPasswordFormConfig` | `providePlainInputFormly()`, `provideFormlyAddons()`                                          |
| `ecoAdminAuthForgotPasswordSentRoutes` | —                                        | —                           | —                                                                                             |
| `ecoAdminAuthResetPasswordRoutes`      | `PocketBaseResetPasswordFacadeService`   | `resetPasswordFormConfig`   | `providePlainInputFormly()`, `providePasswordWithVisibilityFormly()`, `provideFormlyAddons()` |

## What is shared and what is not

- **Shared with the storefront**: the two facades (`@plastik/auth/pocketbase/data-access`), the two forms (`@plastik/auth/config/util`, taken with no option of their own),
  the messages (`AUTH_RESET_PASSWORD_MESSAGES`), the screen around the form and the names of the translation keys.
- **Not shared**: the three templates. They repeat the storefront's almost line for line, because a library of one eco app cannot import the other's.
  Moving the screens themselves to a shared library is the next step of ClickUp `123kjkdqcdb`.

How the reset screen behaves is the shared facade's doing:

- Without a `token` in the address it opens on «Aquest enllaç ja no serveix», with the link «Demanar un altre enllaç», and never asks the server.
- A link the server refuses, and a request that fails, end there too: the store answers only yes or no.
  **A network failure therefore also takes the form away**; reloading the address brings it back.
- A changed password ends in «Contrasenya canviada», with the link «Iniciar sessió» to `/accedir`. There is no toast, no automatic redirect, and no session is opened.

The view hands either end to the `outcome` of the shared screen, which draws it **in place of the heading** — a heading, one sentence and one filled link,
with no coloured box and no icon — and gives it the focus, because the button the user pressed has just left the screen. The form goes away with it:
the facade says `canSubmit()` is false. These are the states «contrasenya canviada» and «enllaç caducat» of the mock «10 Superadmin/Vista Recuperació» (2026-11-15).

Under it the reset screen keeps a link back to `/accedir` (`auth.forgotPassword.backToLogin`), as the request screen does. It is gone once the password is changed:
the filled link already goes there.

Not built from the mock: «Demanar un altre enllaç» does not put the focus on the address field of the request screen, and nothing of its «Proposta» mode.

## Where the email leads

PocketBase builds the link of the reset email in the hook `apps/eco-store/pocketbase/pb_hooks/on_password_reset.pb.js`, one file for both applications.
The link opens this application when two things hold, and the storefront of the user's cooperative otherwise:

| Who asks           | From where             | The link opens |
| ------------------ | ---------------------- | -------------- |
| An administrator   | The panel              | The panel      |
| An administrator   | The storefront         | The storefront |
| A member           | The panel              | The storefront |
| Anyone, no request | The PocketBase console | The storefront |

- «From the panel» is the `Origin` header of the request, which the browser writes. The hook only **compares** it with the address of the panel that it works out
  from the server settings (`http://localhost:4204` on a local instance, `https://admin.<domain>` elsewhere); it never copies it into the link.
  A forged header therefore gets the storefront's link, not a link to the forger's host.
- A member who asks from the panel gets the storefront's link because this application would not let them in after the change.
- This screen needs nothing for it: `requestPasswordReset(email)` is the storefront's call, unchanged.

## What does not work yet

- The panel's address outside a local instance, `admin.9botiga.top`, is not deployed: the rule has been exercised on a local PocketBase only.
- A second factor is not asked for when a password is reset.
- The email is signed with the name of the user's cooperative, a global administrator's included.

## Translation keys

In `apps/eco-admin/public/i18n/{ca,es}.json`, with the storefront's names and texts:

- `auth.forgotPassword.{title,description,email,submit,backToLogin}`.
- `auth.forgotPasswordSent.{title,description,checkSpam,backToLogin}`.
- `auth.resetPassword.{title,passwordLabel,passwordPlaceholder,passwordConfirmLabel,passwordConfirmPlaceholder,passwordHint,passwordError,passwordMatchError,submitButton}`.
- `auth.resetPassword.done.{title,description,action}` and `auth.resetPassword.expired.{title,description,action}`.

## Running unit tests

Run `nx test eco-admin-auth-recovery` to execute the unit tests.
