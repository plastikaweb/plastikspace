import { computed, inject, Injectable } from '@angular/core';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { DetailItemViewFacade } from '@plastik/core/detail-edit-view';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { llecoopProfileStore } from '@plastik/llecoop/profile/data-access';

import { profileFeatureFormConfig } from './profile-feature-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProfileFeatureFacadeService implements DetailItemViewFacade<LlecoopUser> {
  readonly #store = inject(llecoopProfileStore);
  readonly #view = inject(VIEW_CONFIG)().filter(item => item.name === 'profile')[0];
  model = this.#store.user;

  viewConfig = computed(() => ({
    ...this.#view,
    title: this.model()?.name ?? 'El meu perfil',
    icon: this.model()?.isAdmin ? 'shield' : 'face',
  }));

  formConfig = profileFeatureFormConfig();

  onSubmit(item: Partial<LlecoopUser>): void {
    this.#store.update(item);
  }
}
