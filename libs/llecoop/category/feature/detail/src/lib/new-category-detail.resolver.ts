import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';

export const NewCategoryDetailResolver: ResolveFn<boolean> = () => {
  const store = inject(LlecoopCategoryStore);

  store.setSelectedItemId(null);
  return true;
};
