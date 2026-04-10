import { take } from 'rxjs';

import { inject, Signal } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';

export interface EcoStoreProfileAddressesCanDeactivateComponent {
  pendingChanges: Signal<boolean> | (() => boolean);
}

export const ecoStoreProfileAddressesCanDeactivateGuard: CanDeactivateFn<
  EcoStoreProfileAddressesCanDeactivateComponent
> = (component: EcoStoreProfileAddressesCanDeactivateComponent) => {
  const confirmService = inject(SharedConfirmDialogService);

  if (component.pendingChanges()) {
    return confirmService
      .confirm(
        'profile.addresses.modified.title',
        `profile.addresses.modified.description`,
        'profile.addresses.modified.cancel',
        'profile.addresses.modified.leave'
      )
      .pipe(take(1));
  }

  return true;
};
