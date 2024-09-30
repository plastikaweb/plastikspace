/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';

import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { DetailItemViewFacade } from '@plastik/core/detail-edit-view';
import { BaseEntity } from '@plastik/core/entities';
import { LLecoopUserStore } from '@plastik/llecoop/user/data-access';
import { getLlecoopUserCreateFormConfig } from './user-feature-create-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserCreateFacadeService implements DetailItemViewFacade<BaseEntity> {
  private readonly store = inject(LLecoopUserStore);
  private readonly view = inject(VIEW_CONFIG).filter(item => item.name === 'user')[0];
  private readonly authService = inject(FirebaseAuthService);
  viewConfig = signal({
    ...this.view,
    title: 'Afegir usuari',
  });

  formStructure = signal(getLlecoopUserCreateFormConfig());

  onSubmit(data: any): void {
    console.log(data);
    this.authService.registerUserWithLink(data.email);
  }
}
