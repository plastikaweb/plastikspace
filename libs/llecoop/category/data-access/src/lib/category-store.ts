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
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { activityActions } from '@plastik/shared/activity/data-access';
import { pipe, switchMap, tap } from 'rxjs';
import { LlecoopCategoryFireService } from './category-fire.service';

type CategoryState = LlecoopFeatureStore<LlecoopProductCategory>;

export const LlecoopCategoryStore = signalStore(
  { providedIn: 'root' },
  withDevtools('categories'),
  withState<CategoryState>({
    loaded: false,
    lastUpdated: new Date(),
    sorting: { active: 'name', direction: 'asc' },
    selectedItem: null,
  }),
  withEntities<LlecoopProductCategory>(),
  withComputed(({ ids, entities }) => ({
    count: computed(() => ids().length),
    selectOptions: computed(() => {
      return entities()
        .map(category => ({
          label: category.name?.toLowerCase(),
          value: category,
        }))
        .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
    }),
    selectByNameOptions: computed(() => {
      const options = entities()
        .map(category => ({
          label: category.name?.toLowerCase(),
          value: category.name?.toLowerCase(),
        }))
        .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
      return [{ label: 'Totes les categories', value: '' }, ...options];
    }),
  })),
  withMethods(
    (store, categoryService = inject(LlecoopCategoryFireService), state = inject(Store)) => ({
      getAll: rxMethod<void>(
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
      create: rxMethod<Partial<LlecoopProductCategory>>(
        pipe(
          tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
          switchMap((category: Partial<LlecoopProductCategory>) => {
            return categoryService.create(category).pipe(
              tapResponse({
                next: () => {
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                  state.dispatch(routerActions.go({ path: ['/admin/categoria'] }));
                  patchState(store, { selectedItem: null });
                },
                // eslint-disable-next-line no-console
                error: error => console.error('Error creating category', error),
              })
            );
          })
        )
      ),
      update: rxMethod<Partial<LlecoopProductCategory>>(
        pipe(
          tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
          switchMap((category: Partial<LlecoopProductCategory>) => {
            return categoryService.update(category).pipe(
              tapResponse({
                next: () => {
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                  state.dispatch(routerActions.go({ path: ['/admin/categoria'] }));
                  patchState(store, { selectedItem: null });
                },
                // eslint-disable-next-line no-console
                error: error => console.error('Error updating category', error),
              })
            );
          })
        )
      ),
      setSorting: (sorting: CategoryState['sorting']) => patchState(store, { sorting }),
      setSelectedItem: (id: string | null) =>
        patchState(store, {
          selectedItem: store.entities().filter(entity => entity.id === id)[0] || null,
        }),
    })
  ),
  withHooks({
    onInit({ getAll, loaded }) {
      if (!loaded()) getAll();
    },
    onDestroy() {
      // eslint-disable-next-line no-console
      console.log('Destroying category store');
    },
  })
);
