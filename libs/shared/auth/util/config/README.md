# plastik-auth-config-util

## Table of Contents

- [plastik-auth-config-util](#plastik-auth-config-util)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Usage](#usage)
  - [Running unit tests](#running-unit-tests)

## Description

The **Shared Auth Config Util** library provides centralized Formly configurations for authentication-related forms across the application.
It ensures consistent form structures and validation rules for login, registration, and password recovery processes.

## Usage

This library exports three functions, each returning the Formly configuration of one authentication form. A route provides one under `FORM_TOKEN`:

- `loginFormConfig(options?)`: the login form.
- `requestPasswordFormConfig(options?)`: the "forgot password" form.
- `resetPasswordFormConfig(options?)`: the form that sets a new password.

```ts
{ provide: FORM_TOKEN, useFactory: loginFormConfig }
```

These configurations are designed to be used with `@plastik/shared/form` and integrate with shared validation and translation systems.

### One set of forms for every app

The three functions say which fields a form has, what they ask for and how they look:

| Form            | Fields                        | Rules                                                                                            |
| --------------- | ----------------------------- | ------------------------------------------------------------------------------------------------ |
| Login           | `email`, `password`           | Both required; a valid address; the password between 8 and 25 characters.                        |
| Forgot password | `email`                       | Required; a valid address.                                                                       |
| Reset password  | `password`, `confirmPassword` | Both required, between 8 and 25 characters, and equal (`passwordMatch`, shown under the second). |

Every field says what it holds (`name`, and `autocomplete` set to `email`, `current-password` or `new-password`), so a browser or a password manager can fill it.

The email field says `email`, not `username`. The HTML standard allows `username` on a `type="email"` input,
but the HTML_CodeSniffer rules behind Pa11y still reject it (WCAG 1.3.5), and Pa11y gates every eco-store push.

The look is the same wherever a form is drawn, and is written once, in `auth-form-fields.ts`, which the library does not export:

- The label rests inside the field and floats to its border once the field has the focus or a value (no `floatLabel`). The placeholder shows once it floats.
- No required asterisk is drawn.
- A field always keeps the room of one message line under it (`subscriptSizing: 'fixed'`), so a form does not grow when an error shows.
- Each field opens with an icon (`mail`, `key`).
- Stacked fields are spaced by `FIELD_GROUP_CLASSES` (`flex flex-col gap-2`).

eco-store and eco-admin both take the three forms **with no option**: their auth forms are the same.

### Options

An app that needs a difference passes options and writes no form of its own. Options change how the fields look, never which fields there are or what they ask for:

| Function                    | Options                                                                      |
| --------------------------- | ---------------------------------------------------------------------------- |
| `loginFormConfig`           | `fieldGroupClassName`, `fieldProps`, `emailProps`, `passwordProps`           |
| `requestPasswordFormConfig` | `fieldProps`                                                                 |
| `resetPasswordFormConfig`   | `fieldGroupClassName`, `fieldProps`, `passwordProps`, `confirmPasswordProps` |

```ts
{
  provide: FORM_TOKEN,
  useFactory: () => loginFormConfig({ fieldProps: { subscriptSizing: 'dynamic' } }),
}
```

`fieldProps` reaches every field of the form; the others one field each, laid over `fieldProps`, which is laid over the defaults.
Props are laid key by key, so a nested value such as `attributes` is replaced whole. A key set to `undefined` takes the default away.
In the reset form a longer `maxLength` belongs in `fieldProps`: the second field must take whatever the first one does.

### What the route must bring

- The field types: `providePlainInputFormly()` for the address, `providePasswordWithVisibilityFormly()` for a password.
- The addons wrapper, `provideFormlyAddons()` of `@plastik/shared/form/util`, for the leading icons. Without it Formly drops them in silence.
- An icon font that holds `mail` and `key` (and `visibility`, `visibility_off` for the password toggle).

## Running unit tests

Run `nx test plastik-auth-config-util` to execute the unit tests via Vitest.
