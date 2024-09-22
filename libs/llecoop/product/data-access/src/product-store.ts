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
import { routerActions } from '@plastik/core/router-state';
import { LlecoopFeatureStore, StoreNotificationService } from '@plastik/llecoop/data-access';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { activityActions } from '@plastik/shared/activity/data-access';
import { pipe, switchMap, tap } from 'rxjs';
import { LlecoopProductFireService } from './product-fire.service';

type ProductState = LlecoopFeatureStore<LlecoopProduct>;

export const LlecoopProductStore = signalStore(
  { providedIn: 'root' },
  withDevtools('products'),
  withState<ProductState>({
    loaded: false,
    lastUpdated: new Date(),
    sorting: ['name', 'desc'],
    selectedItem: null,
  }),
  withEntities<LlecoopProduct>(),
  withComputed(({ ids }) => ({
    count: computed(() => ids().length),
  })),
  withMethods(
    (
      store,
      productService = inject(LlecoopProductFireService),
      storeNotificationService = inject(StoreNotificationService),
      state = inject(Store)
    ) => ({
      getAll: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loaded: false })),
          tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
          switchMap(() =>
            productService.getAll().pipe(
              tapResponse({
                next: products => {
                  const lastUpdated = new Date();
                  patchState(
                    store,
                    setAllEntities(products, {
                      selectId: entity => entity.id || '',
                    })
                  );
                  patchState(store, { loaded: true, lastUpdated });
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                },
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut carregar els productes: ${error}`,
                    'ERROR'
                  ),
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
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                  state.dispatch(routerActions.go({ path: ['/admin/producte'] }));
                  storeNotificationService.create(
                    `Producte "${product.name}" creat correctament`,
                    'SUCCESS'
                  );
                  patchState(store, { sorting: ['createdAt', 'desc'] });
                },
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut crear el producte "${product.name}": ${error}`,
                    'ERROR'
                  ),
              })
            );
          })
        )
      ),
      update: rxMethod<Partial<LlecoopProduct>>(
        pipe(
          tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
          switchMap((product: Partial<LlecoopProduct>) => {
            return productService.update(product).pipe(
              tapResponse({
                next: () => {
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                  state.dispatch(routerActions.go({ path: ['/admin/producte'] }));
                  storeNotificationService.create(
                    `Producte "${product.name}" actualitzat correctament`,
                    'SUCCESS'
                  );
                  patchState(store, { sorting: ['updatedAt', 'desc'] });
                },
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut actualitzar el producte "${product.name}": ${error}`,
                    'ERROR'
                  ),
              })
            );
          })
        )
      ),
      setSorting: (sorting: ProductState['sorting']) => patchState(store, { sorting }),
      setSelectedItem: (id: string | null) =>
        patchState(store, {
          selectedItem: id ? store.entityMap()[id] : null,
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
