import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';

export const NewProductDetailResolver: ResolveFn<boolean> = () => {
  const store = inject(LlecoopProductStore);

  store.setSelectedItemId(null);

  return true;
};
