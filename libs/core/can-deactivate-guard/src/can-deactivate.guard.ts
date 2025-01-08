import { take } from 'rxjs';

import { inject, Signal } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';

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
        `<div class="flex flex-col justify-center items-center ">
          <p>Segur que vols sortir de la pàgina?</p>
          <p>Els canvis es perdran.</p>
        </div>`,
        'Cancel·lar',
        'Sortir'
      )
      .pipe(take(1));
  }

  return true;
};
