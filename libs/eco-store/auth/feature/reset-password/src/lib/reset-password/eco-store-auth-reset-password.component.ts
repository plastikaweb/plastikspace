import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { AuthFeatureComponent } from '@plastik/auth/feature';
import { SharedFormFeatureComponent } from '@plastik/shared/form';

/**
 * @description The screen that sets a new password with the link of the email, on the shared auth
 * screen: the route gives it the facade and the form. How the flow ended (the password was changed,
 * the link no longer works) is handed to the `outcome` of the shared screen, which draws it in place
 * of the heading; the form goes away with it. An address with no token starts there. The way back to
 * the login screen stays under it, except once the password was changed.
 */
@Component({
  selector: 'eco-store-auth-reset-password',
  imports: [
    TranslateModule,
    AuthFeatureComponent,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    SharedFormFeatureComponent,
  ],
  templateUrl: './eco-store-auth-reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreAuthResetPasswordComponent {
  protected readonly facade = inject(AUTH_FORM_FACADE);
}
