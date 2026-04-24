import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { ecoStoreOrdersStore } from '@plastik/eco-store/orders/data-access';

export const ecoStoreOrdersDetailResolver: ResolveFn<boolean | RedirectCommand> = async (
  route: ActivatedRouteSnapshot
) => {
  const ordersStore = inject(ecoStoreOrdersStore);
  const router = inject(Router);
  const id = route.paramMap.get('id');

  if (!id) {
    return new RedirectCommand(router.parseUrl('/comandes'));
  }

  if (ordersStore.setSelected(id)) {
    return true;
  }

  try {
    await ordersStore.getOne(id);
    return true;
  } catch {
    return new RedirectCommand(router.parseUrl('/comandes'));
  }
};
