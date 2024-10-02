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
  withDevtools('products'),
  withState<ProductState>({
    loaded: false,
    lastUpdated: new Date(),
    sorting: ['name', 'asc'],
    selectedItemId: null,
  }),
  withEntities<LlecoopProduct>(),
  withComputed(({ ids, selectedItemId, entityMap }) => ({
    count: computed(() => ids().length),
    selectedItem: computed(() => {
      const id = selectedItemId();
      return id !== null ? entityMap()[id] : null;
    }),
  })),
  withMethods(
    (
      store,
      productService = inject(LlecoopProductFireService),
      storeNotificationService = inject(StoreNotificationService),
      firebaseAuthService = inject(FirebaseAuthService),
      state = inject(Store)
    ) => ({
      getAll: rxMethod<void>(
        pipe(
          tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
          switchMap(() =>
            productService.getAll().pipe(
              tapResponse({
                next: products => {
                  patchState(
                    store,
                    setAllEntities(products, {
                      selectId: entity => entity.id || '',
                    }),
                    { loaded: true, lastUpdated: new Date() }
                  );
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                },
                error: error => {
                  if (firebaseAuthService.loggedIn()) {
                    storeNotificationService.create(
                      `No s'ha pogut carregar els productes: ${error}`,
                      'ERROR'
                    );
                  }
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                },
              })
            )
          )
        )
      ),
      create: rxMethod<Partial<LlecoopProduct>>(
        pipe(
          tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
          switchMap((product: Partial<LlecoopProduct>) => {
            return productService.create(product).pipe(
              tapResponse({
                next: () => {
                  state.dispatch(routerActions.go({ path: ['/admin/producte'] }));
                },
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut crear el producte "${product.name}": ${error}`,
                    'ERROR'
                  ),
                complete: () => {
                  storeNotificationService.create(
                    `Producte "${product.name}" creat correctament`,
                    'SUCCESS'
                  );
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                },
              })
            );
          })
        )
      ),
      update: rxMethod<LlecoopProductWithUpdateNotification>(
        pipe(
          tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
          switchMap(({ product, showNotification }) => {
            return productService.update(product).pipe(
              tapResponse({
                next: () => {
                  state.dispatch(routerActions.go({ path: ['/admin/producte'] }));
                },
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut actualitzar el producte "${product.name}": ${error}`,
                    'ERROR'
                  ),
                complete: () => {
                  if (showNotification) {
                    storeNotificationService.create(
                      `Producte "${product.name}" actualitzat correctament`,
                      'SUCCESS'
                    );
                    state.dispatch(activityActions.setActivity({ isActive: false }));
                  }
                },
              })
            );
          })
        )
      ),
      delete: rxMethod<LlecoopProduct>(
        pipe(
          tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
          switchMap(product => {
            return productService.delete(product).pipe(
              tapResponse({
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                next: () => {},
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut eliminar el producte "${product.name}": ${error}`,
                    'ERROR'
                  ),
                complete: () => {
                  storeNotificationService.create(`Producte "${product.name}" eliminat`, 'SUCCESS'),
                    state.dispatch(activityActions.setActivity({ isActive: false }));
                },
              })
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
      if (!loaded()) getAll();
    },
    onDestroy() {
      // eslint-disable-next-line no-console
      console.log('Destroying product store');
    },
  })
);
