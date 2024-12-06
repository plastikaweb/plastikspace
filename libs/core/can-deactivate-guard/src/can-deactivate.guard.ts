import { inject, Signal } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { take } from 'rxjs';

export interface CanDeactivateComponent {
  pendingChanges: Signal<boolean> | (() => boolean);
}

export const canDeactivateGuard: CanDeactivateFn<CanDeactivateComponent> = (
  component: CanDeactivateComponent
) => {
  const confirmService = inject(SharedConfirmDialogService);

  if (component.pendingChanges()) {
    return confirmService
      .confirm(
        'Canvis pendents',
        'Segur que vols sortir sense guardar els canvis?<br>Els canvis es perdran.',
        'Cancel·lar',
        'Sortir de la pàgina'
      )
      .pipe(take(1));
  }

  return true;
};
