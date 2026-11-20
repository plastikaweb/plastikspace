import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { AuthFeatureComponent } from '@plastik/auth/feature';
import { SharedFormFeatureComponent } from '@plastik/shared/form';

/**
 * @description The screen that asks for the email to set a new password. It is the storefront one,
 * on the shared auth screen: the route gives it the facade and the form.
 */
@Component({
  selector: 'eco-admin-auth-forgot-password',
  imports: [
    AuthFeatureComponent,
    SharedFormFeatureComponent,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './eco-admin-auth-forgot-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoAdminAuthForgotPasswordComponent {
  protected readonly facade = inject(AUTH_FORM_FACADE);
}
