import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { ProductCategory } from '@plastik/llecoop/entities';
import { activityActions } from '@plastik/shared/activity/data-access';
import { pipe, switchMap, tap } from 'rxjs';
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
  { providedIn: 'root' },
  withDevtools('categories'),
  withState(initialState),
  withComputed(({ categories }) => ({
    count: computed(() => categories().length),
  })),
  withMethods((store, categoryService = inject(CategoryFireService), state = inject(Store)) => ({
    getAll: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loaded: false })),
        tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
        switchMap(() =>
          categoryService.getAll().pipe(
            tapResponse({
              next: categories => {
                const lastUpdated = new Date();
                patchState(store, () => ({ categories, lastUpdated, loaded: true }));
                state.dispatch(activityActions.setActivity({ isActive: false }));
              },
              // eslint-disable-next-line no-console
              error: error => console.error('Error loading categories', error),
            })
          )
        )
      )
    ),
  }))
);
