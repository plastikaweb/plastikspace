import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { EcoStoreAuthContainerComponent } from '@plastik/eco-store/auth/container';
import { SharedFormFeatureComponent } from '@plastik/shared/form';

@Component({
  selector: 'eco-store-auth-reset-password',
  imports: [TranslateModule, EcoStoreAuthContainerComponent, SharedFormFeatureComponent],
  templateUrl: './eco-store-auth-reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreAuthResetPasswordComponent {
  protected readonly facade = inject(AUTH_FORM_FACADE);
}
