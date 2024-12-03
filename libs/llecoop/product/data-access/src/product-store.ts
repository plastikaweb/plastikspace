import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { routerActions } from '@plastik/core/router-state';
import { LlecoopFeatureStore, StoreNotificationService } from '@plastik/llecoop/data-access';
import { LlecoopProduct, LlecoopProductWithUpdateNotification } from '@plastik/llecoop/entities';
import { activityActions } from '@plastik/shared/activity/data-access';
import { pipe, switchMap, tap } from 'rxjs';
import { LlecoopProductFireService } from './product-fire.service';

type ProductState = LlecoopFeatureStore;

export const LlecoopProductStore = signalStore(
  { providedIn: 'root' },
  withDevtools('product'),
  withState<ProductState>({
    loaded: false,
    lastUpdated: new Date(),
    sorting: ['name', 'asc'],
    selectedItemId: null,
  }),
  withEntities<LlecoopProduct>(),
  withComputed(({ ids, selectedItemId, entityMap, entities }) => ({
    count: computed(() => ids().length),
    selectedItem: computed(() => {
      const id = selectedItemId();
      return id !== null ? entityMap()[id] : null;
    }),
    getAvailableProducts: computed(() => {
      return entities().filter(product => product.isAvailable);
    }),
  })),
  withMethods(
    (
      store,
      productService = inject(LlecoopProductFireService),
      storeNotificationService = inject(StoreNotificationService),
      authService = inject(FirebaseAuthService),
      state = inject(Store)
    ) => ({
      getAll: rxMethod<void>(
        pipe(
          switchMap(() => {
            if (!store.loaded()) {
              state.dispatch(activityActions.setActivity({ isActive: true }));
              return productService.getAll().pipe(
                tapResponse({
                  next: products =>
                    patchState(
                      store,
                      setAllEntities(products, {
                        selectId: entity => entity.id || '',
                      }),
                      { loaded: true, lastUpdated: new Date() }
                    ),
                  error: error => {
                    if (authService.loggedIn()) {
                      storeNotificationService.create(
                        `No s'ha pogut carregar els productes: ${error}`,
                        'ERROR'
                      );
                    }
                  },
                }),
                tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
              );
            }
            return [];
          })
        )
      ),
      create: rxMethod<Partial<LlecoopProduct>>(
        pipe(
          switchMap((product: Partial<LlecoopProduct>) => {
            state.dispatch(activityActions.setActivity({ isActive: true }));
            return productService.create(product).pipe(
              tapResponse({
                next: () => state.dispatch(routerActions.go({ path: ['/admin/producte'] })),
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut crear el producte "${product['name']}": ${error}`,
                    'ERROR'
                  ),
                complete: () =>
                  storeNotificationService.create(
                    `Producte "${product['name']}" creat correctament`,
                    'SUCCESS'
                  ),
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      update: rxMethod<LlecoopProductWithUpdateNotification>(
        pipe(
          switchMap(({ product, showNotification }) => {
            state.dispatch(activityActions.setActivity({ isActive: true }));
            return productService.update(product).pipe(
              tapResponse({
                next: () => state.dispatch(routerActions.go({ path: ['/admin/producte'] })),
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut actualitzar el producte "${product['name']}": ${error}`,
                    'ERROR'
                  ),
                complete: () => {
                  if (showNotification) {
                    storeNotificationService.create(
                      `Producte "${product['name']}" actualitzat correctament`,
                      'SUCCESS'
                    );
                  }
                },
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      delete: rxMethod<LlecoopProduct>(
        pipe(
          switchMap(product => {
            state.dispatch(activityActions.setActivity({ isActive: true }));
            return productService.delete(product).pipe(
              tapResponse({
                next: () =>
                  storeNotificationService.create(`Producte "${product.name}" eliminat`, 'SUCCESS'),
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut eliminar el producte "${product.name}": ${error}`,
                    'ERROR'
                  ),
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      setSorting: (sorting: ProductState['sorting']) => patchState(store, { sorting }),
      setSelectedItemId: (id: string | null) =>
        patchState(store, {
          selectedItemId: id,
        }),
    })
  ),
  withHooks({
    onInit({ getAll, loaded }) {
      if (!loaded()) {
        getAll();
      }
    },
    onDestroy() {
      // eslint-disable-next-line no-console
      console.log('Destroying product store');
    },
  })
);
