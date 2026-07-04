import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { accessSecurityEmailFormConfig } from './access-security-email-form.config';

@Component({
  selector: 'eco-eco-store-profile-access-security-feature',
  imports: [SharedFormFeatureModule, TranslateModule],
  templateUrl: './eco-store-profile-access-security-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProfileAccessSecurityFeatureComponent {
  readonly #profileStore = inject(pocketBaseUserProfileStore);

  protected readonly currentEmail = computed(() => this.#profileStore.user()?.email || '');
  protected readonly formConfig = computed(() =>
    accessSecurityEmailFormConfig(this.currentEmail())
  );

  onSubmit({ email }: { email: string }) {
    if (email) {
      this.#profileStore.requestEmailChange(email);
    }
  }
}
