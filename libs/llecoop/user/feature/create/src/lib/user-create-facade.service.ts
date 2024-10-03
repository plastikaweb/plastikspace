/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { DetailItemViewFacade } from '@plastik/core/detail-edit-view';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { LLecoopUserStore } from '@plastik/llecoop/user/data-access';
import { getLlecoopUserCreateFormConfig } from './user-feature-create-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserCreateFacadeService implements DetailItemViewFacade<LlecoopUser> {
  private readonly store = inject(LLecoopUserStore);
  private readonly view = inject(VIEW_CONFIG).filter(item => item.name === 'user')[0];
  viewConfig = signal({
    ...this.view,
    title: 'Afegir usuari',
  });

  formStructure = signal(getLlecoopUserCreateFormConfig());

  onSubmit(user: Pick<LlecoopUser, 'email'>): void {
    this.store.addWhiteListedUser(user);
  }
}
