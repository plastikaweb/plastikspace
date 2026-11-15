# @plastik/eco-store/auth/forgot-password

- [@plastik/eco-store/auth/forgot-password](#plastikeco-storeauthforgot-password)
  - [Description](#description)
  - [The route](#the-route)
  - [Behavior](#behavior)
  - [Running unit tests](#running-unit-tests)

## Description

The screen of **eco-store** where a member asks for the email that resets the password. Project `eco-store-auth-feature-forgot-password`.
The view projects the shared form into `plastik-auth-feature` (`@plastik/auth/feature`); the frame around it comes from `provideEcoStoreAuthScreen()`.

## The route

```typescript
{
  path: 'recuperar-contrasenya',
  loadChildren: () =>
    import('@plastik/eco-store/auth/forgot-password').then(m => m.ecoStoreAuthForgotPasswordRoutes),
}
```

`ecoStoreAuthForgotPasswordRoutes` is one route with `title: 'auth.forgotPassword.title'`, `canActivate: [pocketBaseIsNotLoggedGuard]` and these providers:

- `AUTH_FORM_FACADE` → `EcoStoreAuthForgotPasswordFacadeService`.
- `FORM_TOKEN` → `requestPasswordFormConfig` (`@plastik/auth/config/util`), the form eco-admin uses too.
- `MAT_FORM_FIELD_DEFAULT_OPTIONS` (`appearance: 'outline'`), `MAT_ICON_DEFAULT_OPTIONS` (`material-symbols-outlined`), `providePlainInputFormly()` and `provideFormlyAddons()`.

## Behavior

`EcoStoreAuthForgotPasswordFacadeService` extends `PocketBaseRequestPasswordFacadeService` (`@plastik/auth/pocketbase/data-access`) and only adds the activity bar
(`auth.forgotPassword.loading`). The logic is the shared facade's: the request never rejects and **always** ends on `/recuperar-contrasenya-enviada`,
whether it worked or broke, so the screen never tells whether an address has an account.

## Running unit tests

Run `nx test eco-store-auth-feature-forgot-password` to execute the unit tests via Vitest.
