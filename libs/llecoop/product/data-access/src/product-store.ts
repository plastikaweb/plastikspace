import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  type,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { activityActions } from '@plastik/shared/activity/data-access';
import { FilterArrayPipeConfig } from '@plastik/shared/filter-array-pipe';
import { TableSorting } from '@plastik/shared/table/entities';
import { pipe, switchMap, tap } from 'rxjs';
import { LlecoopProductFireService } from './product-fire.service';

type ProductState = {
  loaded: boolean;
  lastUpdated: Date;
  sorting: TableSorting;
  filter: FilterArrayPipeConfig<LlecoopProduct>[];
};

export const LlecoopProductStore = signalStore(
  { providedIn: 'root' },
  withDevtools('products'),
  withState<ProductState>({
    loaded: false,
    lastUpdated: new Date(),
    sorting: { active: 'name', direction: 'asc' },
    filter: [
      {
        fields: ['name', 'info'],
        value: '',
      },
    ],
  }),
  withEntities({ entity: type<LlecoopProduct>(), collection: 'product' }),
  withComputed(({ productIds }) => ({
    count: computed(() => productIds().length),
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
                      collection: 'product',
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
      setSorting: (sorting: ProductState['sorting']) => patchState(store, { sorting }),
      setFilter: (filter: ProductState['filter']) => patchState(store, { filter }),
    })
  ),
  withHooks({
    onDestroy() {
      // eslint-disable-next-line no-console
      console.log('Destroying product store');
    },
  })
);
