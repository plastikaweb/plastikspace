# Eco-Store Loading Strategies

This document describes the loading (activity/progress) strategies used across the Eco Store application and its libraries.
All strategies ultimately control the shared `activityStore`, which drives the global overlay loader rendered by `SharedActivityUiOverlayComponent` in `AppComponent`.

## Overview

The app has **three complementary strategies** for loading states:

| Strategy                              | Mechanism                                               | Who Controls It                                    | Scope                  |
| ------------------------------------- | ------------------------------------------------------- | -------------------------------------------------- | ---------------------- |
| **1. Bootstrap initializer**          | `activityStore.setActivity(true/false)`                 | `app.config.ts` + `AppComponent.ngOnInit()`        | App bootstrap          |
| **2. Opt-in PocketBase Interceptor**  | `require-global-loading: 'true'` HTTP header            | Caller (store/service)                             | Per-request            |
| **3. Signal Store `isLoading`**       | `isLoading` state signal in `withPocketBaseListFeature` | `withPocketBaseCrud` / `withPocketBaseListFeature` | Per-list-reload        |
| **4. Explicit `activityStore` calls** | `activityStore.setActivity(true/false, message?)`       | Any store method                                   | Multi-step async flows |
| **5. In-component cart sync state**   | `cartStore.isSyncing()` signal                          | `ecoStoreCartStore`                                | Cart sync UX           |

---

## Strategy 1 — Bootstrap Initializer (Global Overlay)

**File:** [`apps/eco-store/src/app/app.config.ts`](./src/app/app.config.ts)

During app startup, the global loader is shown immediately and dismissed once the tenant configuration has been loaded:

```typescript
provideAppInitializer(async () => {
  inject(activityStore).setActivity(true);   // show loader
  pocketBaseActivityInterceptor();            // register PocketBase interceptor
  await inject(ecoStoreTenantStore).getTenant(); // await critical bootstrap data
}),
```

Then in `AppComponent.ngOnInit()`:

```typescript
this.activityStore.setActivity(false); // dismiss loader once app shell is ready
```

**UI Result:** The `SharedActivityUiOverlayComponent` overlay is shown until the app is initialized.

---

## Strategy 2 — Opt-in PocketBase Interceptor (Per-Request)

**File:** [`libs/shared/activity/data-access/src/lib/interceptors/pocketbase-activity.interceptor.ts`](../../libs/shared/activity/data-access/src/lib/interceptors/pocketbase-activity.interceptor.ts)

The `pocketBaseActivityInterceptor()` patches PocketBase's internal `send()` method. By **default, all requests are silent**.
A request opts in to the global loader by passing the `require-global-loading: 'true'` header.

```typescript
// ✅ Silent — no loader shown (default behaviour)
store._cartsService.getFirstListItem(`user = "${user.id}"`, {
  sort: '-updated',
  requestKey: 'cart_sync_find',
});

// ✅ Opt-in — global overlay shown for the duration of the request
store._cartsService.getFirstListItem(`user = "${user.id}"`, {
  headers: { 'require-global-loading': 'true' },
});
```

**Debounce:** A 100 ms debounce prevents the loader from flashing for very fast requests. The overlay only appears if the request takes longer than the debounce timeout.

**Use cases:**

- Cart merge on login (the initial remote cart fetch is silent by design to avoid flicker).
- Specific tenant fetches that need a visible loading state.

---

## Strategy 3 — Signal Store `isLoading` Signal (Per-List-Reload)

**File:** [`libs/shared/signal-state/data-access-pocketbase/src/lib/pocketbase.features.ts`](../../libs/shared/signal-state/data-access-pocketbase/src/lib/pocketbase.features.ts)

Every store that uses `withPocketBaseListFeature` (and thus `withPocketBaseCrud` or `withPocketBaseGetList`) automatically gets an `isLoading` signal that is `true` while the list is being fetched:

```typescript
// In getList rxMethod:
tap(() => {
  updateState(store, `[${featureName}] getList`, { isLoading: true, error: null });
}),
// ... switchMap to API call ...
// On success:
updateState(store, `[${featureName}] getList success`, ..., { isLoading: false });
// On error:
updateState(store, `[${featureName}] getList error`, { isLoading: false, error: message });
```

**Use cases:** Component-level skeleton loaders, shimmer effects, and inline spinners.

Example usage in a component:

```typescript
// order-confirmation.component.ts
protected readonly isLoading = this.#ordersStore.isLoading;
```

```html
@if (isLoading()) {
<div class="skeleton animate-pulse ..."></div>
} @else {
<!-- real content -->
}
```

---

## Strategy 4 — Explicit `activityStore` Calls (Multi-Step Async Flows)

**File:** [`libs/eco-store/orders/data-access/src/eco-store-orders.store.ts`](../../libs/eco-store/orders/data-access/src/eco-store-orders.store.ts)

For orchestration flows that span multiple async steps (and where the caller cannot use headers), the store directly calls `activityStore.setActivity()` with an optional i18n message key:

```typescript
async createOrder() {
  store._activityStore.setActivity(true, 'cart.finish.creatingOrder');
  const data = store._cartStore.toOrder();
  const newOrder = await store.create(data);       // PocketBase create
  store._cartStore.resetCartAfterCheckout();
  await store._router.navigate(['/comanda', newOrder.id]);
  store._activityStore.setActivity(false);
}
```

The `message` parameter is an i18n key resolved by `ngx-translate` in the overlay UI. This gives the user context-specific feedback (e.g., "Creating your order…") instead of the generic "Loading…".

**Use cases:**

- `ecoStoreOrdersStore.createOrder()` — full checkout flow.
- Any future multi-step operation where a single HTTP header is insufficient.

---

## Strategy 5 — Cart Sync State (`isSyncing` / `isSynced`)

**File:** [`libs/eco-store/cart/data-access/src/eco-store-cart.store.ts`](../../libs/eco-store/cart/data-access/src/eco-store-cart.store.ts)

The cart store manages its own sync lifecycle with two dedicated state signals, **fully separate from the global activity store**:

| Signal      | Meaning                                                |
| ----------- | ------------------------------------------------------ |
| `isSyncing` | A remote cart sync operation is in progress.           |
| `isSynced`  | The cart has been successfully synced with the remote. |

These signals drive **in-place skeleton/opacity effects** within the confirmation UI, rather than a full-screen overlay:

```html
<!-- cart-confirmation.component.html -->
<div
  [class.pointer-events-none]="cartStore.isSyncing()"
  [class.opacity-60]="cartStore.isSyncing() && cartStore.isSynced()">
  <!-- content -->
</div>

@if (cartStore.isSyncing() && !cartStore.isSynced()) {
<div class="h-[134px] w-full animate-pulse rounded-2xl bg-neutral-100"></div>
} @else {
<eco-cart-product-card ... />
}
```

**Key design decisions:**

- Cart sync requests are made **without** the `require-global-loading` header to avoid full-screen interference during a background merge.
- `isSyncing` is guarded with `untracked()` inside the `effect()` hook to prevent re-triggering loops.
- `isSynced` persists across page transitions so the merge is not re-triggered unnecessarily.

---

## Decision Guide

Use this table to decide which strategy to apply to a new loading scenario:

| Scenario                                          | Recommended Strategy                   |
| ------------------------------------------------- | -------------------------------------- |
| App bootstrap / critical one-time data            | Strategy 1 (Bootstrap initializer)     |
| A single PocketBase request needs a global loader | Strategy 2 (Opt-in header)             |
| Component needs skeleton while list reloads       | Strategy 3 (`isLoading` signal)        |
| Multi-step async flow with custom message         | Strategy 4 (Explicit `activityStore`)  |
| Background sync that should NOT block the UI      | Strategy 5 (custom `isSyncing` signal) |

---

## Related Libraries

- [`@plastik/shared/activity/data-access`](../../libs/shared/activity/data-access/README.md) — `activityStore` + `pocketBaseActivityInterceptor`
- [`@plastik/shared/activity/ui`](../../libs/shared/activity/ui/README.md) — `SharedActivityUiOverlayComponent` overlay UI
- [`@plastik/shared/signal-state/data-access-pocketbase`](../../libs/shared/signal-state/data-access-pocketbase/README.md) — `withPocketBaseCrud`, `isLoading` state
- [`@plastik/eco-store/cart/data-access`](../../libs/eco-store/cart/data-access/README.md) — Cart sync state
- [`@plastik/eco-store/orders/data-access`](../../libs/eco-store/orders/data-access/README.md) — `createOrder()` explicit loading
