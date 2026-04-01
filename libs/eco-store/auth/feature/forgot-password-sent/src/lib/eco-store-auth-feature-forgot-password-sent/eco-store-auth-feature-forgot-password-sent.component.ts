import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreAuthContainerComponent } from '@plastik/eco-store/auth/container';
import { activityStore } from '@plastik/shared/activity/data-access';

/**
 * @description Success view for the Eco Store Auth Forgot Password feature.
 * Displays a confirmation message after a recovery email has been sent.
 */
@Component({
  selector: 'eco-store-auth-forgot-password-sent',
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    EcoStoreAuthContainerComponent,
  ],
  templateUrl: './eco-store-auth-feature-forgot-password-sent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreAuthFeatureForgotPasswordSentComponent {
  readonly #activityStore = inject(activityStore);

  readonly isLoading = this.#activityStore.isActive;

  constructor() {
    this.#activityStore.setActivity(false);
  }
}
