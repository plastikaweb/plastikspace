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
import { LlecoopFeatureStore } from '@plastik/llecoop/data-access';
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
    sorting: { active: 'name', direction: 'asc' },
  }),
  withEntities<LlecoopProduct>(),
  withComputed(({ ids }) => ({
    count: computed(() => ids().length),
  })),
  withMethods(
    (store, productService = inject(LlecoopProductFireService), state = inject(Store)) => ({
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
                // eslint-disable-next-line no-console
                error: error => console.error('Error loading products', error),
              })
            )
          )
        )
      ),
      create: rxMethod<Partial<LlecoopProduct>>(
        pipe(
          tap(() => patchState(store, { loaded: false })),
          tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
          switchMap((category: Partial<LlecoopProduct>) => {
            return productService.create(category).pipe(
              tapResponse({
                next: () => {
                  patchState(store, { loaded: true });
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                  state.dispatch(routerActions.go({ path: ['/admin/producte'] }));
                },
                // eslint-disable-next-line no-console
                error: error => console.error('Error creating product', error),
              })
            );
          })
        )
      ),
      setSorting: (sorting: ProductState['sorting']) => patchState(store, { sorting }),
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
