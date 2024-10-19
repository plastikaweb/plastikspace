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
import { pipe, switchMap, tap } from 'rxjs';
import { LlecoopCategoryFireService } from './category-fire.service';

type CategoryState = LlecoopFeatureStore;

export const LlecoopCategoryStore = signalStore(
  { providedIn: 'root' },
  withDevtools('categories'),
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
          value: category.name?.toLowerCase(),
        }))
        .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
      return [{ label: 'Totes les categories', value: '' }, ...options];
    }),
  })),
  withMethods(
    (
      store,
      categoryService = inject(LlecoopCategoryFireService),
      storeNotificationService = inject(StoreNotificationService),
      state = inject(Store),
      firebaseAuthService = inject(FirebaseAuthService)
    ) => ({
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
                error: error => {
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                  if (firebaseAuthService.loggedIn()) {
                    storeNotificationService.create(
                      `No s'ha pogut carregar les categories: ${error}`,
                      'ERROR'
                    );
                  }
                },
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
                  storeNotificationService.create(`Categoria "${category.name}" creada`, 'SUCCESS');
                },
                error: error => {
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                  storeNotificationService.create(
                    `No s'ha pogut crear la categoria "${category.name}": ${error}`,
                    'ERROR'
                  );
                },
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
                  storeNotificationService.create(
                    `Categoria "${category.name}" actualitzada`,
                    'SUCCESS'
                  );
                },
                error: error => {
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                  storeNotificationService.create(
                    `No s'ha pogut actualitzar la categoria "${category.name}": ${error}`,
                    'ERROR'
                  );
                },
              })
            );
          })
        )
      ),
      delete: rxMethod<LlecoopProductCategory>(
        pipe(
          tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
          switchMap(category => {
            return categoryService.delete(category).pipe(
              tapResponse({
                next: () => {
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                  storeNotificationService.create(
                    `Categoria "${category.name}" eliminada`,
                    'SUCCESS'
                  );
                },
                error: error => {
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                  storeNotificationService.create(
                    `No s'ha pogut eliminar la categoria "${category.name}": ${error}`,
                    'ERROR'
                  );
                },
              })
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
      if (!loaded()) getAll();
    },
    onDestroy() {
      // eslint-disable-next-line no-console
      console.log('Destroying category store');
    },
  })
);
