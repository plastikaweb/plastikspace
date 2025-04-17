import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { llecoopProductStore } from '@plastik/llecoop/product/data-access';
import { FirebaseStorageService } from '@plastik/shared/firebase-storage/data-access';

export const newProductDetailResolver: ResolveFn<boolean> = () => {
  const store = inject(llecoopProductStore);
  const firebaseStorage = inject(FirebaseStorageService);

  firebaseStorage.reset();

  store.setSelectedItemId(null);

  return true;
};
