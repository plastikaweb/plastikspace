import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { EcoStoreAuthContainerComponent } from '@plastik/eco-store/auth/container';
import { SharedFormFeatureComponent } from '@plastik/shared/form';

@Component({
  selector: 'eco-store-auth-forgot-password',
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    EcoStoreAuthContainerComponent,
    SharedFormFeatureComponent,
  ],
  templateUrl: './eco-store-auth-forgot-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreAuthForgotPasswordComponent {
  protected readonly facade = inject(AUTH_FORM_FACADE);
}
