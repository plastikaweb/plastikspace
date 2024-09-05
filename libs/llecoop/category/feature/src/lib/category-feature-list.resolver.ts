import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';

export const LlecoopCategoryListResolver: ResolveFn<boolean> = (): boolean => {
  const store = inject(LlecoopCategoryStore);

  store.getAll();

  return true;
};
