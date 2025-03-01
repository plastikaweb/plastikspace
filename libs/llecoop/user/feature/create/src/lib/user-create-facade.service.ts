import { computed, inject, Injectable } from '@angular/core';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { DetailItemViewFacade } from '@plastik/core/detail-edit-view';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { llecoopUserStore } from '@plastik/llecoop/user/data-access';
import { StoreNotificationService } from '@plastik/shared/signal-state-data-access';

import { userFeatureCreateFormConfig } from './user-feature-create-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserCreateFacadeService implements DetailItemViewFacade<LlecoopUser> {
  readonly #store = inject(llecoopUserStore);
  readonly #view = inject(VIEW_CONFIG)().filter(item => item.name === 'user')[0];
  readonly #storeNotificationService = inject(StoreNotificationService);

  viewConfig = computed(() => ({
    ...this.#view,
    title: 'Afegir usuari',
  }));

  formConfig = userFeatureCreateFormConfig();

  onSubmit(user: Pick<LlecoopUser, 'email'>): void {
    if (this.#store.entities().some((u: LlecoopUser) => u.email === user.email)) {
      this.#storeNotificationService.create(
        `El correu electrònic ${user.email} ja està en la llista d'usuaris`,
        'ERROR'
      );
      return;
    }
    this.#store.create(user);
  }
}
