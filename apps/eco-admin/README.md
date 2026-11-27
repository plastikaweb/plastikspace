# Eco-Admin

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![PocketBase](https://img.shields.io/badge/pocketbase-%23b8dbe4.svg?style=for-the-badge&logo=Pocketbase&logoColor=black)

- [Eco-Admin](#eco-admin)
  - [Description](#description)
  - [Quick Start](#quick-start)
  - [Development Commands](#development-commands)
  - [Backends](#backends)
  - [Routes](#routes)
  - [Who Can Sign In](#who-can-sign-in)
  - [Language and Theme](#language-and-theme)
  - [Architecture \& Libraries](#architecture--libraries)
  - [Testing](#testing)
    - [Unit tests](#unit-tests)
    - [Accessibility](#accessibility)
    - [End to end](#end-to-end)
  - [Documentation](#documentation)

## Description

**Eco-Admin** is the administration panel of the eco platform: the place where the team of a cooperative runs its store, and where the platform team runs the cooperatives.

It is a client-rendered single-page application (no SSR, no service worker) built with **Angular 21** (zoneless, signals, standalone) on the **PocketBase** instance it shares with [eco-store](../eco-store/README.md).
It is served from its own origin, and it takes the cooperative from the signed-in account, never from the domain.

The application is being built row by row (`TASKS.md`, phase AP-0). Today it has a login screen and one provisional page behind it; the application shell and its views come next.

## Quick Start

1. **Start the backend**: `yarn eco-store:pocketbase:run` (the local PocketBase on `http://127.0.0.1:8090`).
2. **Run the app**: `yarn eco-admin:serve`, then open `http://localhost:4204`. The script also runs `eco-admin:watch-scss`: the dev server does not rebuild the global stylesheet when a partial changes, so the watcher touches `src/styles/styles.scss` for it. `yarn nx run eco-admin:serve` starts the server alone.

## Development Commands

| Task                   | Command                    |
| :--------------------- | :------------------------- |
| **Serve (local data)** | `yarn eco-admin:serve`     |
| **Build**              | `yarn eco-admin:build`     |
| **Test**               | `yarn eco-admin:test`      |
| **Lint**               | `yarn eco-admin:lint`      |
| **E2E Tests**          | `yarn eco-admin:e2e`       |
| **E2E (interactive)**  | `yarn eco-admin:e2e:local` |
| **Accessibility**      | `yarn eco-a11y:e2e`        |

## Backends

The configuration decides which PocketBase the application talks to. Check it before signing in with anything.

| Configuration | Used by                                         | PocketBase                                               |
| :------------ | :---------------------------------------------- | :------------------------------------------------------- |
| `development` | `yarn eco-admin:serve` (the default of `serve`) | `http://127.0.0.1:8090/` (local)                         |
| `production`  | `yarn eco-admin:build` (the default of `build`) | the hosted instance in `src/environments/environment.ts` |

The accessibility suite and the `serve-static` target serve the **production** build: never type test credentials into them.

## Routes

| Path       | Guards                                               | What it shows                              |
| :--------- | :--------------------------------------------------- | :----------------------------------------- |
| `/accedir` | `ecoAdminAnonymousGuard`                             | The login screen (lazy-loaded).            |
| `/`        | `ecoAdminSessionGuard`, `ecoAdminTenantContextGuard` | A provisional page with a way to sign out. |
| `**`       | —                                                    | Redirects to `/`.                          |

This table is temporary. The application shell replaces `/` with its own route table (`/tauler`, `/cooperatives` and the rest).
Until then the homes the login navigates to fall through the wildcard to the provisional page, and a deep link loses its `returnUrl` on the way.

## Who Can Sign In

| Role           | Result                                                                                    |
| :------------- | :---------------------------------------------------------------------------------------- |
| `TENANT_ADMIN` | Signs in; home `/tauler`.                                                                 |
| `GLOBAL_ADMIN` | Signs in; home `/cooperatives`.                                                           |
| `PARTNER`      | Refused. The session is closed and the screen says the account belongs to a store member. |

The guards close a stored session whose role is not admitted before they redirect, so a session pasted in by hand cannot bounce between `/accedir` and `/`.
The API rules of PocketBase are the real barrier; the guards only keep the interface honest.

## Language and Theme

- **Languages**: Catalan (`ca`, the default) and Spanish (`es`). The files live in `public/i18n/` and are loaded over HTTP; messages use the ICU compiler, so an apostrophe is written twice (`l''adreça`).
  `src/app/i18n-parity.spec.ts` fails when the two files do not hold the same keys.
- **Language choice**: `localStorage['eco-lang']`, then the browser language, then `ca`. `<html lang>` follows it.
- **Theme**: `localStorage['eco-theme']` (`light` or `dark`), then the system preference. A script in `index.html` applies it before the first paint.
- **Page title**: `{view title} · Eco Admin`, translated again when the language changes (`EcoAdminTitleStrategy`).

## Architecture & Libraries

| Library                                                                        | Alias                                  | What it holds                                                       |
| :----------------------------------------------------------------------------- | :------------------------------------- | :------------------------------------------------------------------ |
| [**Auth · data access**](../../libs/eco-admin/auth/data-access/README.md)      | `@plastik/eco-admin/auth/data-access`  | Admitted roles, home per role, the two guards, `resolveReturnUrl`.  |
| [**Auth · login**](../../libs/eco-admin/auth/feature/login/README.md)          | `@plastik/eco-admin/auth/login`        | The login screen and its facade.                                    |
| [**Tenant context**](../../libs/eco-admin/core/tenant-context/README.md)       | `@plastik/eco-admin/tenant-context`    | The cooperative of the signed-in administrator, and its wait guard. |
| [**Eco styles**](../../libs/eco/styles/README.md)                              | Sass include path `eco_tokens`         | The colour tokens shared with eco-store.                            |
| [**PocketBase auth**](../../libs/shared/auth/pocketbase/data-access/README.md) | `@plastik/auth/pocketbase/data-access` | The session store both eco applications use.                        |

The application's own styles live in `src/styles/`: `styles.scss` wires Tailwind, the shared tokens and Material; `_base.scss` holds the admin-only variables (`--admin-*`) and the 15 px root.

## Testing

### Unit tests

```bash
yarn eco-admin:test
```

Nx hides most of Vitest's output. To read a failure, run Vitest from the project directory:

```bash
cd apps/eco-admin && npx vitest run
```

### Accessibility

```bash
yarn eco-a11y:e2e
```

Builds eco-admin and eco-store (production configuration) and runs the Playwright + axe suite of `apps/eco-a11y-e2e` (META-40), which replaced Pa11y here.
For eco-admin it audits the login screen and the first screen after signing in, at 320 px light and dark and at 1280 px, with PocketBase answered from fixtures: it never signs in to a real instance.
The CI workflow is `.github/workflows/eco-a11y.yml`.

### End to end

```bash
yarn eco-admin:e2e          # headless
yarn eco-admin:e2e:local    # interactive
```

A Playwright suite (`apps/eco-admin-e2e`) for the flows that need the real local PocketBase, such as AMBR-07 and AORD-03 (REQUIREMENTS §6).
Nx starts `eco-admin:serve` (development configuration, local PocketBase) on port 4204, or uses the one already running, and the suite runs in the system Chrome.
The local mode opens Playwright's UI. No hook or CI job runs it, and Nx never caches it.

The `signedInAs` option starts a test with a session, without going through the login screen:

```ts
import { expect, test } from './support/test';

test.use({ signedInAs: 'TENANT_ADMIN' });
```

It reads the credentials of a test user from the environment:

| Role           | Variables                                                         |
| :------------- | :---------------------------------------------------------------- |
| `TENANT_ADMIN` | `ECO_ADMIN_TENANT_ADMIN_EMAIL`, `ECO_ADMIN_TENANT_ADMIN_PASSWORD` |
| `GLOBAL_ADMIN` | `ECO_ADMIN_GLOBAL_ADMIN_EMAIL`, `ECO_ADMIN_GLOBAL_ADMIN_PASSWORD` |
| `PARTNER`      | `ECO_ADMIN_PARTNER_EMAIL`, `ECO_ADMIN_PARTNER_PASSWORD`           |

It signs in against `http://127.0.0.1:8090` and nothing else. The address is a constant on purpose: no variable can point a test login at a hosted instance.
The request goes through Node's `fetch`, so Playwright's trace and report never hold the credentials.
Keep them in the shell or in `apps/eco-admin-e2e/.env`, which git ignores and the config loads; never in a committed file.

## Documentation

- [REQUIREMENTS.md](./REQUIREMENTS.md): what the panel must do, and the decisions behind it.
- [TASKS.md](./TASKS.md): the build order and the state of each row.
- [DESIGN-BRIEF.md](./DESIGN-BRIEF.md): the design contract.
- [DESIGN-REVIEWS.md](./DESIGN-REVIEWS.md): the record of the design rounds.
