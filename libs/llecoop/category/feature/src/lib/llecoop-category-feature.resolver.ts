import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { activityActions } from '@plastik/shared/activity/data-access';

export const LlecoopCategoryFeatureResolver: ResolveFn<boolean> = (): boolean => {
  const store = inject(LlecoopCategoryStore);
  const state = inject(Store);

  if (store.loaded()) {
    state.dispatch(activityActions.setActivity({ isActive: false }));
    return true;
  }

  return false;
};
