# @plastik/eco-admin/tenant-context

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![PocketBase](https://img.shields.io/badge/PocketBase-%23b8dbe4.svg?style=for-the-badge&logo=PocketBase&logoColor=black)

- [@plastik/eco-admin/tenant-context](#plastikeco-admintenant-context)
  - [What it answers](#what-it-answers)
  - [Store](#store)
    - [State](#state)
    - [Derived signals](#derived-signals)
    - [Methods](#methods)
    - [When it loads](#when-it-loads)
    - [Failures](#failures)
  - [Guard](#guard)
  - [Testing](#testing)
  - [Limits](#limits)
  - [Running unit tests](#running-unit-tests)

The tenant the signed-in administrator of **eco-admin** works on (AP-0 0.6 · AREF-03).
Project `eco-admin-tenant-context`, tags `scope:eco-admin` + `type:data-access`.

## What it answers

- **Which tenant is this administrator's?** The one on their own user record. Nobody chooses it.
- **Does the tenant sell through a weekly order window, or continuously?**
- **Does the Cicles section exist for this tenant?**

A tenant administrator (`TENANT_ADMIN`) has a tenant context. A global administrator (`GLOBAL_ADMIN`) has none:
`users.tenant` is a required field, so their record carries a tenant too, and the store ignores it on purpose.
A global administrator opens a tenant from the Cooperatives list like any other record (AQ-04); there is no tenant switcher.

The storefront resolves its tenant from the host name (`provideEcoStoreTenant`, `scope:eco-store`).
This library shares nothing with it but the `EcoStoreTenant` type from `@plastik/eco/entities`.

## Store

`ecoAdminTenantContextStore` is an NgRx Signal Store provided in root.

```ts
import { ecoAdminTenantContextStore } from '@plastik/eco-admin/tenant-context';

readonly #tenantContext = inject(ecoAdminTenantContextStore);
protected readonly tenantName = this.#tenantContext.tenantName;
```

### State

| Signal        | Type                                         | Meaning                                                                      |
| ------------- | -------------------------------------------- | ---------------------------------------------------------------------------- |
| `tenant()`    | `EcoStoreTenant \| null`                     | The last record fetched for the current tenant.                              |
| `status()`    | `'idle' \| 'loading' \| 'loaded' \| 'error'` | How the last fetch ended. `idle` means there is no tenant to load.           |
| `hasCycles()` | `boolean \| null`                            | Whether a continuous tenant holds a cycle. `null` when unknown or not asked. |

### Derived signals

| Signal               | Type             | Meaning                                                                                      |
| -------------------- | ---------------- | -------------------------------------------------------------------------------------------- |
| `tenantId()`         | `string \| null` | The tenant on the user record, for a tenant administrator only. `null` for everyone else.    |
| `hasTenant()`        | `boolean`        | `tenantId()` is not `null`.                                                                  |
| `tenantName()`       | `string`         | `shortName`, else `name`, else `''`.                                                         |
| `isContinuous()`     | `boolean`        | The tenant is loaded and `logisticsConfig.orderWindow.enabled` is `false` or absent.         |
| `hasCyclesSection()` | `boolean`        | `false` only for a continuous tenant that holds no cycle at all. `true` in every other case. |

`hasCyclesSection()` follows the «Operating modes» rule of `apps/eco-admin/DESIGN-BRIEF.md`: Cicles exists when the tenant has an order window
**or** holds at least one cycle. While the answer is unknown (nothing loaded, a failed load, the cycle lookup unavailable) it stays `true`,
and during a reload it keeps its previous value, so a navigation entry bound to it never flickers.

### Methods

- `load(): Promise<void>` loads the tenant once. A loaded tenant is not fetched again, and concurrent calls share one request.
  Without a tenant it empties the store. It never rejects.
- `reload(): Promise<void>` fetches again whatever the store holds. Call it after the tenant's settings or its cycles changed.
  The record already in the store stays readable meanwhile, and survives a failed reload.

Each load is one `getOne` on `tenants`. Only when the result is continuous, a second request asks `order_cycles` for a single id.

### When it loads

The store follows the session by itself. An effect bound to `tenantId()` loads when a tenant administrator signs in or a session is restored,
and empties the store on logout. The effect depends on the id alone, so a profile edit that replaces the user object fetches nothing.

An answer is written only while its request is still the running one.
What arrives after a logout, a change of user or a newer reload is dropped.

### Failures

A tenant that cannot be fetched leaves `status()` at `error` and raises no notification: the screen decides what to show.
The next `load()` tries again. A failed cycle lookup is not an error: the tenant counts as loaded and `hasCycles()` stays `null`.

## Guard

`ecoAdminTenantContextGuard` holds a navigation until the store is settled, then always returns `true`. It waits; it never blocks.

```ts
{
  path: '',
  canActivate: [sessionGuard, ecoAdminTenantContextGuard],
  loadChildren: () => import('@plastik/eco-admin/shell').then(m => m.routes),
}
```

Put it after the guard that checks the session. A failed load still activates the route, with `status()` at `error`.

## Testing

`mockEcoAdminTenantContextStore` has every signal as a writable signal and both methods as `vi.fn()`.
It has its own alias so it stays out of the library build.

```ts
import { ecoAdminTenantContextStore } from '@plastik/eco-admin/tenant-context';
import { mockEcoAdminTenantContextStore } from '@plastik/eco-admin/tenant-context/testing';

TestBed.configureTestingModule({
  providers: [{ provide: ecoAdminTenantContextStore, useValue: mockEcoAdminTenantContextStore }],
});
```

## Limits

- The role and the tenant come from the user record PocketBase saved at login. They are not refreshed here:
  a demoted administrator keeps their tenant context in the client until the session ends. The API rules are the real barrier.
- A suspended or closed tenant loads like any other. What its administrator should see is not designed yet.
- No run against a live PocketBase yet: eco-admin does not provide `POCKETBASE_INSTANCE` until AP-0 0.7. The unit tests use a fake client.

## Running unit tests

Run `nx test eco-admin-tenant-context` to execute the unit tests.
