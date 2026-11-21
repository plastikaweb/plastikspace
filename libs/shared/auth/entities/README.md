# @plastik/auth/entities

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

## Description

The **types, tokens and fixed messages** every auth screen, form and facade of the workspace agrees on. Nothing here draws or asks a server.
Project `shared-auth-entities`.

## Contents

| File                              | What it holds                                                                                                                          |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `auth-facade.type.ts`             | `AuthFacade` and its token `AUTH_SERVICE`: what an auth backend offers (`loggedIn`, `login`, `logout`, `register`, `requestPassword`). |
| `auth-form-facade.type.ts`        | What a form sends, what a screen reads, and what an application says about its auth screens. See below.                                |
| `auth-login-errors.ts`            | `AUTH_LOGIN_ERRORS`: the two failures every login screen shares, `wrong` and `secondStep`.                                             |
| `auth-reset-password-messages.ts` | `AUTH_RESET_PASSWORD_MESSAGES`: `done` (links to `/accedir`) and `expired` (links to `/recuperar-contrasenya`).                        |

### What a form sends

`LoginData`, `RegisterData`, `RequestPasswordData`, `ResetPasswordData` (`password`, `confirmPassword`, `token`), `ChangePasswordData`, `ConfirmEmailChangeData`.

### What a screen reads

```ts
interface AuthFormFacade<T = LoginData> {
  formConfig: FormConfig<T>;
  extraLinks?: Signal<AuthExtraLink[]>;
  isLoading?: Signal<boolean>;
  error?: Signal<AuthFormMessage | null>;
  success?: Signal<AuthFormMessage | null>;
  canSubmit?: Signal<boolean>;
  onSubmit(data: T): void | Promise<void>;
  clearError?(): void;
}
```

A route provides one under `AUTH_FORM_FACADE`; the view and the shared screen (`@plastik/auth/feature`) inject it.
`error` and `success` are `AuthFormMessage`s — `{ type?, title, body?, link? }`, where `title`, `body` and `link.label` are translation keys —
which the shared screen draws over the form. An attempt never ends in a toast.

`canSubmit` says whether sending the form can still lead anywhere. A view takes its form away while it is false and leaves the screen to say what comes next.
`error` cannot say that on its own: it is also set by a request that failed and may be tried again. A facade without `canSubmit` always shows its form.

### What an application says about its auth screens

`AuthScreenDefaults`, provided once under `AUTH_SCREEN_DEFAULTS`: the name, the line under it, the mark (`logo` or `icon`), the foot of the card,
classes for the card, and the way back. The texts are signals. The README of `@plastik/auth/feature` lists each key.

### Messages with fixed routes

`AUTH_RESET_PASSWORD_MESSAGES` links to `/accedir` and `/recuperar-contrasenya` by name, so an application that uses the shared recovery facades must serve those paths.
The reset views hand them to the `outcome` of the shared screen, which draws a heading, a sentence and one filled link and does not read their `type`.

## Running unit tests

Run `nx test shared-auth-entities` to execute the unit tests.
