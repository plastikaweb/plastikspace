# @plastik/eco-admin/auth/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![PocketBase](https://img.shields.io/badge/PocketBase-%23b8dbe4.svg?style=for-the-badge&logo=PocketBase&logoColor=black)

- [@plastik/eco-admin/auth/data-access](#plastikeco-adminauthdata-access)
  - [What it holds](#what-it-holds)
  - [Roles and homes](#roles-and-homes)
  - [Guards](#guards)
    - [Why not the shared guards](#why-not-the-shared-guards)
  - [Return address](#return-address)
  - [Limits](#limits)
  - [Running unit tests](#running-unit-tests)

Who may enter **eco-admin**, and where each one lands (AP-0 0.7).
Project `eco-admin-auth-data-access`, tags `scope:eco-admin` + `type:data-access`.

## What it holds

The session itself lives in `pocketBaseUserProfileStore` (`@plastik/auth/pocketbase/data-access`).
This library adds only what is particular to eco-admin: the roles it admits, the first screen of each role,
the two route guards, and the check of the `returnUrl` query parameter. It has no state of its own.

## Roles and homes

| Export                    | Value                                                       |
| ------------------------- | ----------------------------------------------------------- |
| `ECO_ADMIN_ALLOWED_ROLES` | `['TENANT_ADMIN', 'GLOBAL_ADMIN']`                          |
| `EcoAdminRole`            | The union of those two.                                     |
| `isEcoAdminRole(role)`    | Type guard. `false` for `PARTNER`, `null` and `undefined`.  |
| `ecoAdminHomeFor(role)`   | `/tauler` for a tenant administrator, `/cooperatives` else. |
| `ECO_ADMIN_LOGIN_URL`     | `/accedir`                                                  |

A storefront member (`PARTNER`) is the only role eco-admin refuses.

## Guards

Both are functional (`CanActivateFn`) and both call `checkAuth()` first, because the token may have changed in another tab.

- `ecoAdminSessionGuard` protects the application. Without a session it redirects to `/accedir`
  and keeps the address that was asked for as `returnUrl` (left out when it is `/`).
  With a session of a role that is not admitted it closes the session and redirects to `/accedir`.
- `ecoAdminAnonymousGuard` protects the login screen. An administrator with a session is sent to their home.
  A session of any other role is closed and the login screen is shown.

```ts
export const appRoutes: Route[] = [
  {
    path: 'accedir',
    canActivate: [ecoAdminAnonymousGuard],
    loadComponent: () =>
      import('@plastik/eco-admin/auth/login').then(m => m.EcoAdminAuthLoginComponent),
  },
  {
    path: '',
    canActivate: [ecoAdminSessionGuard, ecoAdminTenantContextGuard],
    loadChildren: () => import('@plastik/eco-admin/shell').then(m => m.routes),
  },
];
```

### Why not the shared guards

`pocketBaseIsNotLoggedGuard` sends anyone with a session to `/`, and a role guard sends anyone who is not an administrator to `/` too.
A member session on the admin origin would bounce between `/accedir` and `/` for ever.
The login screen never opens such a session, but a token stored by hand or by a test can.
These two guards close it before they redirect, so the pair cannot loop.

## Return address

`resolveReturnUrl(raw, fallback)` decides whether the `returnUrl` query parameter may be followed. Anyone can write that value in the address bar.
It is followed only when it is a path inside the application:

- one leading `/`, never two (`//evil.example` is another host);
- no backslash and no control character (a browser turns `/\evil.example` and `/<tab>/evil.example` into another host);
- not the login screen itself, with or without a query, a fragment or a child path;
- something the Angular router can parse.

Anything else returns `fallback`.

## Limits

- The role is read from the user record PocketBase saved at login and is not refreshed:
  a demoted administrator passes the guards until the session ends. The API rules are the real barrier.
- `/tauler` and `/cooperatives` are the homes this library names. The routes themselves arrive with the application shell.

## Running unit tests

Run `nx test eco-admin-auth-data-access` to execute the unit tests.
