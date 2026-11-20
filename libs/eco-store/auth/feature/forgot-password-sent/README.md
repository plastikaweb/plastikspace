# @plastik/eco-store/auth/forgot-password-sent

- [@plastik/eco-store/auth/forgot-password-sent](#plastikeco-storeauthforgot-password-sent)
  - [Description](#description)
  - [The route](#the-route)
  - [Running unit tests](#running-unit-tests)

## Description

The screen of **eco-store** that says the email with the reset link is on its way. Project `eco-store-auth-feature-forgot-password-sent`.
It shows the title and description, a note about the spam folder, and a link back to `/accedir`, inside the shared `plastik-auth-feature` screen (`@plastik/auth/feature`).
It has no form and no facade.

## The route

```typescript
{
  path: 'recuperar-contrasenya-enviada',
  loadChildren: () =>
    import('@plastik/eco-store/auth/forgot-password-sent').then(
      m => m.ecoStoreAuthFeatureForgotPasswordSentRoutes
    ),
}
```

The path is not free to choose: the shared request facade navigates to `POCKETBASE_REQUEST_PASSWORD_SENT_URL` (`@plastik/auth/pocketbase/data-access`) after every request.
The route has `title: 'auth.forgotPasswordSent.title'` and **no guard**: the address can be opened directly, with or without a session.

## Running unit tests

Run `nx test eco-store-auth-feature-forgot-password-sent` to execute the unit tests via Vitest.
