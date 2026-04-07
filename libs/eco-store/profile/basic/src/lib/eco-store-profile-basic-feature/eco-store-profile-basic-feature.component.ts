import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { PocketBaseUser } from '@plastik/core/entities';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { ecoStoreProfileFeatureFormConfig } from './eco-store-profile-feature-form.config';

@Component({
  selector: 'eco-eco-store-profile-basic-feature',
  imports: [SharedFormFeatureModule],
  templateUrl: './eco-store-profile-basic-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProfileBasicFeatureComponent {
  protected readonly profileStore = inject(pocketBaseUserProfileStore);

  protected readonly model = computed(() => {
    const user = this.profileStore.user();
    return {
      name: user?.name || '',
      phone: user?.phone || '',
    };
  });

  protected readonly formConfig = ecoStoreProfileFeatureFormConfig();

  onSubmit(event: Partial<PocketBaseUser>) {
    if (event.name) {
      this.profileStore.updateProfile({ name: event.name, phone: event.phone || '' });
    }
  }
}
