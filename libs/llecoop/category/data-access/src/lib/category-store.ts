import { pipe, switchMap, tap } from 'rxjs';

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
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { activityActions } from '@plastik/shared/activity/data-access';

import { LlecoopCategoryFireService } from './category-fire.service';

type CategoryState = LlecoopFeatureStore;

export const LlecoopCategoryStore = signalStore(
  { providedIn: 'root' },
  withDevtools('category'),
  withState<CategoryState>({
    loaded: false,
    lastUpdated: new Date(),
    sorting: ['name', 'asc'],
    selectedItemId: null,
  }),
  withEntities<LlecoopProductCategory>(),
  withComputed(({ ids, entities, selectedItemId, entityMap }) => ({
    count: computed(() => ids().length || 0),
    selectedItem: computed(() => {
      const id = selectedItemId();
      return id !== null ? entityMap()[id] : null;
    }),
    selectOptions: computed(() => {
      return entities()
        .map(category => ({
          label: category.name?.toLowerCase(),
          value: `category/${category.id}`,
        }))
        .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
    }),
    selectByNameOptions: computed(() => {
      const options = entities()
        .map(category => ({
          label: category.name?.toLowerCase(),
          value: category.id,
        }))
        .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
      return options;
    }),
  })),
  withMethods(
    (
      store,
      categoryFireService = inject(LlecoopCategoryFireService),
      storeNotificationService = inject(StoreNotificationService),
      state = inject(Store),
      firebaseAuthService = inject(FirebaseAuthService)
    ) => ({
      getAll: rxMethod<void>(
        pipe(
          switchMap(() => {
            if (!store.loaded()) {
              state.dispatch(activityActions.setActivity({ isActive: true }));

              return categoryFireService.getAll().pipe(
                tapResponse({
                  next: categories => {
                    patchState(
                      store,
                      setAllEntities(categories, {
                        selectId: entity => entity.id || '',
                      }),
                      {
                        loaded: true,
                        lastUpdated: new Date(),
                      }
                    );
                  },
                  error: error => {
                    if (firebaseAuthService.loggedIn()) {
                      storeNotificationService.create(
                        `No s'ha pogut carregar les categories: ${error}`,
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
      create: rxMethod<Partial<LlecoopProductCategory>>(
        pipe(
          switchMap((category: Partial<LlecoopProductCategory>) => {
            state.dispatch(activityActions.setActivity({ isActive: true }));

            return categoryFireService.create(category).pipe(
              tapResponse({
                next: () => {
                  state.dispatch(routerActions.go({ path: ['/admin/categoria'] }));
                  storeNotificationService.create(`Categoria "${category.name}" creada`, 'SUCCESS');
                },
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut crear la categoria "${category.name}": ${error}`,
                    'ERROR'
                  ),
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      update: rxMethod<Partial<LlecoopProductCategory>>(
        pipe(
          switchMap((category: Partial<LlecoopProductCategory>) => {
            state.dispatch(activityActions.setActivity({ isActive: true }));

            return categoryFireService.update(category).pipe(
              tapResponse({
                next: () => {
                  state.dispatch(routerActions.go({ path: ['/admin/categoria'] }));
                  storeNotificationService.create(
                    `Categoria "${category.name}" actualitzada`,
                    'SUCCESS',
                    false
                  );
                },
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut actualitzar la categoria "${category.name}": ${error}`,
                    'ERROR'
                  ),
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      delete: rxMethod<LlecoopProductCategory>(
        pipe(
          switchMap(category => {
            state.dispatch(activityActions.setActivity({ isActive: true }));

            return categoryFireService.delete(category).pipe(
              tapResponse({
                next: () =>
                  storeNotificationService.create(
                    `Categoria "${category.name}" eliminada`,
                    'SUCCESS'
                  ),
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut eliminar la categoria "${category.name}": ${error}`,
                    'ERROR'
                  ),
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      setSorting: (sorting: CategoryState['sorting']) => patchState(store, { sorting }),
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
  })
);
