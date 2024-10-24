/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { DetailItemViewFacade } from '@plastik/core/detail-edit-view';
import { StoreNotificationService } from '@plastik/llecoop/data-access';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { LLecoopUserStore } from '@plastik/llecoop/user/data-access';
import { getLlecoopUserCreateFormConfig } from './user-feature-create-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserCreateFacadeService implements DetailItemViewFacade<LlecoopUser> {
  private readonly store = inject(LLecoopUserStore);
  private readonly view = inject(VIEW_CONFIG).filter(item => item.name === 'user')[0];
  private readonly storeNotificationService = inject(StoreNotificationService);

  viewConfig = signal({
    ...this.view,
    title: 'Afegir usuari',
  });

  formStructure = getLlecoopUserCreateFormConfig();

  onSubmit(user: Pick<LlecoopUser, 'email'>): void {
    if (this.store.entities().some(u => u.email === user.email)) {
      this.storeNotificationService.create(
        `El correu electrònic ${user.email} ja està en la llista d'usuaris`,
        'ERROR'
      );
      return;
    }
    this.store.create(user);
  }
}
