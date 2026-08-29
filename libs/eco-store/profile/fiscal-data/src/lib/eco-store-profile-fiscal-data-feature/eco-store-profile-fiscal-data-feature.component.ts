import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { UserFiscalProfileForm } from '@plastik/core/entities';
import { SharedFormFeatureModule } from '@plastik/shared/form';

import { ecoStoreProfileFiscalDataFeatureFormConfig } from './eco-store-profile-fiscal-data-feature-form.config';

/**
 * Profile "Dades fiscals" section: 0..1 fiscal identity per member.
 */
@Component({
  selector: 'eco-eco-store-profile-fiscal-data-feature',
  imports: [SharedFormFeatureModule, TranslateModule],
  templateUrl: './eco-store-profile-fiscal-data-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProfileFiscalDataFeatureComponent {
  readonly #profileStore = inject(pocketBaseUserProfileStore);

  protected readonly model = computed<UserFiscalProfileForm>(() => {
    const profile = this.#profileStore.fiscalProfile();

    return {
      fiscalName: profile?.fiscalName || '',
      nif: profile?.nif || '',
      address: profile?.address || '',
      city: profile?.city || '',
      zip: profile?.zip || '',
    };
  });

  protected readonly formConfig = ecoStoreProfileFiscalDataFeatureFormConfig();

  /**
   * Persists the fiscal profile (create or update).
   * @param {UserFiscalProfileForm} data - The submitted form model.
   */
  onSubmit(data: UserFiscalProfileForm): void {
    this.#profileStore.saveFiscalProfile(data);
  }
}
