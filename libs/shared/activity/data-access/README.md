# @plastik/shared/activity/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx Signals](https://img.shields.io/badge/ngrx%20signals-%23270341.svg?style=for-the-badge&logo=ngrx&logoColor=white)

- [@plastik/shared/activity/data-access](#plastiksharedactivitydata-access)
  - [Description](#description)
  - [How to use](#how-to-use)
    - [1. Provide and initialize the store](#1-provide-and-initialize-the-store)
    - [2. Opt-in global loading via HTTP header](#2-opt-in-global-loading-via-http-header)
    - [3. Manual activity control](#3-manual-activity-control)
    - [4. Use in components](#4-use-in-components)
    - [5. In tests](#5-in-tests)
  - [Running unit tests](#running-unit-tests)

## Description

This library contains the **data access layer for the global activity (loading) feature**. It uses **NgRx Signals** for efficient state management and exposes:

- **`activityStore`** – Signal Store exposing `isActive` and `message` state signals.
- **`pocketBaseActivityInterceptor`** – A PocketBase `send`-level interceptor that tracks in-flight requests and automatically toggles global loading state.

> [!TIP]
> For a comprehensive overview of all loading strategies used in the Eco Store, see the
> [Eco Store Loading Strategies](../../../../apps/eco-store/LOADING_STRATEGIES.md) document.

## How to use

### 1. Provide and initialize the store

Call `pocketBaseActivityInterceptor()` and seed the initial loading state in your `appConfig` initializer:

```typescript
import { activityStore, pocketBaseActivityInterceptor } from '@plastik/shared/activity/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(async () => {
      inject(activityStore).setActivity(true); // show loader during bootstrap
      pocketBaseActivityInterceptor(); // register PocketBase interceptor
      await inject(ecoStoreTenantStore).getTenant();
    }),
  ],
};
```

### 2. Opt-in global loading via HTTP header

The PocketBase interceptor only activates for requests that explicitly opt in with the
`require-global-loading: 'true'` HTTP header. All other requests run silently.

```typescript
// Silent background request (default — no loader shown)
store._cartsService.getFirstListItem(`user = "${user.id}"`);

// Opt-in: shows the global overlay loader
store._cartsService.getFirstListItem(`user = "${user.id}"`, {
  headers: { 'require-global-loading': 'true' },
});
```

### 3. Manual activity control

Use `setActivity()` for imperative, non-HTTP loading flows (e.g., complex async orchestration):

```typescript
import { activityStore } from '@plastik/shared/activity/data-access';

@Injectable({ providedIn: 'root' })
export class OrdersStore {
  readonly #activityStore = inject(activityStore);

  async createOrder(): Promise<void> {
    this.#activityStore.setActivity(true, 'cart.finish.creatingOrder');
    try {
      // ... async work
    } finally {
      this.#activityStore.setActivity(false);
    }
  }
}
```

### 4. Use in components

```typescript
import { Component, inject } from '@angular/core';
import { activityStore } from '@plastik/shared/activity/data-access';

@Component({
  selector: 'app-my-component',
  template: `
    @if (store.isActive()) {
      <div role="status" aria-live="polite">{{ store.message() | translate }}</div>
    }
  `,
})
export class MyComponent {
  protected readonly store = inject(activityStore);
}
```

### 5. In tests

```typescript
import { TestBed } from '@angular/core/testing';
import { activityStore } from '@plastik/shared/activity/data-access';

describe('MyComponent', () => {
  const mockActivityStore = { setActivity: jest.fn(), isActive: signal(false) };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: activityStore, useValue: mockActivityStore }],
    });
  });

  it('should set activity state', () => {
    component.someMethod();
    expect(mockActivityStore.setActivity).toHaveBeenCalledWith(true);
  });
});
```

## Running unit tests

Run `nx test shared-activity-data-access` to execute the unit tests.
