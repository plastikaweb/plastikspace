import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';

export const LlecoopProductListResolver: ResolveFn<boolean> = (): boolean => {
  const store = inject(LlecoopProductStore);

  store.getAll();

  return true;
};
