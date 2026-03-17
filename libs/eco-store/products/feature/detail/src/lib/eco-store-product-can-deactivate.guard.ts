import { take } from 'rxjs';

import { inject, Signal } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';

export interface EcoStoreProductCanDeactivateComponent {
  pendingChanges: Signal<boolean> | (() => boolean);
}

export const ecoStoreProductCanDeactivateGuard: CanDeactivateFn<
  EcoStoreProductCanDeactivateComponent
> = (component: EcoStoreProductCanDeactivateComponent) => {
  const confirmService = inject(SharedConfirmDialogService);

  if (component.pendingChanges()) {
    return confirmService
      .confirm(
        'products.modified.title',
        `products.modified.description`,
        'products.modified.cancel',
        'products.modified.leave'
      )
      .pipe(take(1));
  }

  return true;
};
