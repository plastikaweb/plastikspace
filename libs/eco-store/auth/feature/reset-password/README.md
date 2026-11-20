# @plastik/eco-store/auth/reset-password

- [@plastik/eco-store/auth/reset-password](#plastikeco-storeauthreset-password)
  - [Description](#description)
  - [The route](#the-route)
  - [Behavior](#behavior)
  - [Running unit tests](#running-unit-tests)

## Description

The screen of **eco-store** where a member sets a new password with the link of the email. Project `eco-store-auth-feature-reset-password`.
The view projects the shared form into `plastik-auth-feature` (`@plastik/auth/feature`); the frame around it comes from `provideEcoStoreAuthScreen()`.

## The route

```typescript
{
  path: 'restablir-contrasenya',
  loadChildren: () =>
    import('@plastik/eco-store/auth/reset-password').then(
      m => m.ecoStoreAuthFeatureResetPasswordRoutes
    ),
}
```

The email links to `/restablir-contrasenya?token=…`. `ecoStoreAuthFeatureResetPasswordRoutes` is one route with `title: 'auth.resetPassword.title'`,
`canActivate: [pocketBaseIsNotLoggedGuard]` and these providers:

- `AUTH_FORM_FACADE` → `EcoStoreAuthResetPasswordFacadeService`.
- `FORM_TOKEN` → `resetPasswordFormConfig` (`@plastik/auth/config/util`): the password typed twice, 8 to 25 characters, and the check that both match. eco-admin uses the same form.
- `MAT_FORM_FIELD_DEFAULT_OPTIONS` (`appearance: 'outline'`), `MAT_ICON_DEFAULT_OPTIONS` (`material-symbols-outlined`), `providePlainInputFormly()`,
  `providePasswordWithVisibilityFormly()` and `provideFormlyAddons()`.

## Behavior

`EcoStoreAuthResetPasswordFacadeService` extends `PocketBaseResetPasswordFacadeService` (`@plastik/auth/pocketbase/data-access`) and only adds the activity bar
(`auth.resetPassword.loading`). The logic is the shared facade's:

- How the attempt ended is said **on the screen, never in a toast**, and the screen stays where it is: there is no automatic redirect.
  The view hands it to the `outcome` of the shared screen, which draws it **in place of the heading**: a heading, one sentence and one filled link to the next step.
  There is no coloured box and no icon, and the panel takes the focus. The form goes away with it (`canSubmit()` is false).
- Password changed: «Contrasenya canviada», with the link «Iniciar sessió» to `/accedir`. The screen does not open a session by itself.
- The change is refused, or the request breaks: «Aquest enllaç ja no serveix», with the link «Demanar un altre enllaç» to `/recuperar-contrasenya`.
  Both cases share one text, because the store answers with a boolean only. **A network failure therefore also takes the form away**; reloading the address brings it back.
- An address with no `token`: that same end from the start, and the server is never asked.
- Under it, a link back to `/accedir` (`auth.forgotPassword.backToLogin`) until the password is changed. eco-admin's reset screen is the same template.

## Running unit tests

Run `nx test eco-store-auth-feature-reset-password` to execute the unit tests via Vitest.
