import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { llecoopProductStore } from '@plastik/llecoop/product/data-access';

export const newProductDetailResolver: ResolveFn<boolean> = () => {
  const store = inject(llecoopProductStore);

  store.setSelectedItemId(null);

  return true;
};
