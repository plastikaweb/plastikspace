import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { accessSecurityEmailFormConfig } from './access-security-email-form.config';
import {
  accessSecurityPasswordFormConfig,
  ChangePasswordFormModel,
} from './access-security-password-form.config';

@Component({
  selector: 'eco-eco-store-profile-access-security-feature',
  imports: [SharedFormFeatureModule, TranslateModule, MatIconModule],
  templateUrl: './eco-store-profile-access-security-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProfileAccessSecurityFeatureComponent {
  readonly #profileStore = inject(pocketBaseUserProfileStore);

  protected readonly currentEmail = computed(() => this.#profileStore.user()?.email || '');
  protected readonly emailFormConfig = computed(() =>
    accessSecurityEmailFormConfig(this.currentEmail())
  );
  protected readonly passwordFormConfig = accessSecurityPasswordFormConfig();
  protected readonly passwordFormReset = signal(0);
  protected readonly emailFormReset = signal(0);

  async onEmailSubmit({ email }: { email: string }): Promise<void> {
    if (!email) {
      return;
    }

    const requested = await this.#profileStore.requestEmailChange(email);
    if (requested) {
      this.emailFormReset.update(count => count + 1);
    }
  }

  async onPasswordSubmit({
    oldPassword,
    newPassword,
    confirmPassword,
  }: ChangePasswordFormModel): Promise<void> {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return;
    }

    const changed = await this.#profileStore.changePassword({
      oldPassword,
      password: newPassword,
      passwordConfirm: confirmPassword,
    });

    if (changed) {
      this.passwordFormReset.update(count => count + 1);
    } else {
      this.passwordFormConfig.focusCurrentPassword();
    }
  }
}
