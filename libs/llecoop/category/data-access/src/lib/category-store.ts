import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ProductCategory } from '@plastik/llecoop/entities';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { CategoryFireService } from './category-fire.service';

type CategoryState = {
  categories: ProductCategory[];
  loaded: boolean;
  lastUpdated: Date;
};

const initialState: CategoryState = {
  categories: [],
  loaded: false,
  lastUpdated: new Date(),
};

export const LlecoopCategoryStore = signalStore(
  withState(initialState),
  withComputed(({ categories }) => ({
    count: computed(() => categories().length),
  })),
  withMethods((store, categoryService = inject(CategoryFireService)) => ({
    getAll: rxMethod<void>(
      pipe(
        distinctUntilChanged(),
        tap(() => patchState(store, { loaded: false })),
        switchMap(() =>
          categoryService.getAll().pipe(
            tapResponse({
              next: categories => {
                const lastUpdated = new Date();
                patchState(store, () => ({ categories, lastUpdated }));
              },
              // eslint-disable-next-line no-console
              error: error => console.error('Error loading categories', error),
              finalize: () => patchState(store, { loaded: true }),
            }),
          ),
        ),
      ),
    ),
  })),
  withHooks({
    onInit({ getAll }) {
      getAll();
    },
  }),
);
