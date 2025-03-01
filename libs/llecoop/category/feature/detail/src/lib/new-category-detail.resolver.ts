import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { llecoopCategoryStore } from '@plastik/llecoop/category/data-access';

export const newCategoryDetailResolver: ResolveFn<boolean> = () => {
  const store = inject(llecoopCategoryStore);

  store.setSelectedItemId(null);
  return true;
};
