import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { PocketBaseUser } from '@plastik/core/entities';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { ecoStoreProfileFeatureFormConfig } from './eco-store-profile-feature-form.config';

@Component({
  selector: 'eco-eco-store-profile-basic-feature',
  imports: [SharedFormFeatureModule, TranslateModule],
  templateUrl: './eco-store-profile-basic-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProfileBasicFeatureComponent {
  readonly #profileStore = inject(pocketBaseUserProfileStore);

  protected readonly model = computed(() => {
    const user = this.#profileStore.user();
    return {
      name: user?.name || '',
      phone: user?.phone || '',
    };
  });

  protected readonly formConfig = ecoStoreProfileFeatureFormConfig();

  onSubmit({ name, phone }: Partial<PocketBaseUser>) {
    if (name) {
      this.#profileStore.updateProfile({ name, phone: phone || '' });
    }
  }
}
