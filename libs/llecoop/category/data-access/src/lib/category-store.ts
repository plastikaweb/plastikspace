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
import { ProductCategory } from '@plastik/llecoop/entities';
import { activityActions } from '@plastik/shared/activity/data-access';
import { FilterArrayPipeConfig } from '@plastik/shared/filter-array-pipe';
import { TableSorting } from '@plastik/shared/table/entities';
import { pipe, switchMap, tap } from 'rxjs';
import { CategoryFireService } from './category-fire.service';

type CategoryState = {
  loaded: boolean;
  lastUpdated: Date;
  sorting: TableSorting;
  filter: FilterArrayPipeConfig<ProductCategory>[];
};

export const LlecoopCategoryStore = signalStore(
  { providedIn: 'root' },
  withDevtools('categories'),
  withState<CategoryState>({
    loaded: false,
    lastUpdated: new Date(),
    sorting: { active: 'name', direction: 'asc' },
    filter: [
      {
        fields: ['name', 'description'],
        value: '',
      },
    ],
  }),
  withEntities({ entity: type<ProductCategory>(), collection: 'category' }),
  withComputed(({ categoryIds }) => ({
    count: computed(() => categoryIds().length),
    // getCategoriesByCriteria: computed(() => {
    //   const categoriesList = categoryEntities()
    //     .filter(({ name, description }) => {
    //       return (
    //         name?.toLowerCase().includes(criteria.filter.text().toLowerCase()) ||
    //         description?.toLowerCase().includes(criteria.filter.text().toLowerCase())
    //       );
    //     })
    //     .sort((a, b) => {
    //       if (criteria.sorting.direction() === 'asc') {
    //         return a[criteria.sorting.active] > b[criteria.sorting.active] ? 1 : -1;
    //       } else {
    //         return a[criteria.sorting.active] < b[criteria.sorting.active] ? 1 : -1;
    //       }
    //     });
    //   return categoriesList;
    // }),
  })),
  withMethods((store, categoryService = inject(CategoryFireService), state = inject(Store)) => ({
    getAll: rxMethod<TableSorting>(
      pipe(
        tap(() => patchState(store, { loaded: false })),
        tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
        switchMap(() =>
          categoryService.getAll().pipe(
            tapResponse({
              next: categories => {
                const lastUpdated = new Date();
                patchState(
                  store,
                  setAllEntities(categories, {
                    collection: 'category',
                    selectId: entity => entity.id || '',
                  })
                );
                patchState(store, { loaded: true, lastUpdated });
                state.dispatch(activityActions.setActivity({ isActive: false }));
              },
              // eslint-disable-next-line no-console
              error: error => console.error('Error loading categories', error),
            })
          )
        )
      )
    ),
    setSorting: (sorting: CategoryState['sorting']) => patchState(store, { sorting }),
    setFilter: (filter: CategoryState['filter']) => patchState(store, { filter }),
  })),
  withHooks({
    // onInit({ getAll }) {
    //   const tableConfig = inject(LlecoopCategorySearchFeatureTableConfig);
    //   const tableStructure = tableConfig.getTableStructure();
    //   getAll({ active: tableStructure().sort?.[0] || 'name', direction: tableStructure().sort?.[1] || 'asc' });
    // },
    onDestroy() {
      // eslint-disable-next-line no-console
      console.log('Destroying category store');
    },
  })
);
