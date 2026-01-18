import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';

export const cartShippingResolver: ResolveFn<boolean> = () => {
  const userProfileStore = inject(pocketBaseUserProfileStore);
  userProfileStore.getUserAddresses();
  return true;
};
