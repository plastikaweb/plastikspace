import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { PocketBaseUser } from '@plastik/core/entities';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { filter, take } from 'rxjs';
import { TrialBannerComponent } from '../trial-banner/trial-banner.component';
import { ecoStoreProfileFeatureFormConfig } from './eco-store-profile-feature-form.config';

@Component({
  selector: 'eco-eco-store-profile-basic-feature',
  imports: [SharedFormFeatureModule, TranslateModule, TrialBannerComponent],
  templateUrl: './eco-store-profile-basic-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProfileBasicFeatureComponent {
  readonly #profileStore = inject(pocketBaseUserProfileStore);
  readonly #confirmDialog = inject(SharedConfirmDialogService);

  protected readonly isTrial = this.#profileStore.isTrial;
  protected readonly trialEndsAt = this.#profileStore.trialEndsAtDate;

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

  onBecomeMember(): void {
    this.#confirmDialog
      .confirm(
        'store.trial.dialog.title',
        'store.trial.dialog.body',
        'store.trial.dialog.cancel',
        'store.trial.dialog.confirm'
      )
      .pipe(filter(Boolean), take(1))
      .subscribe(() => this.#profileStore.convertTrialToActive());
  }
}
