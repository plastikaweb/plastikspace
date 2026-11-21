import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthFeatureComponent } from '@plastik/auth/feature';

/**
 * @description The screen that says the email is on its way. It says the same whether the address has
 * an account or not, so it holds no state of its own.
 */
@Component({
  selector: 'eco-admin-auth-forgot-password-sent',
  imports: [AuthFeatureComponent, MatButtonModule, MatIconModule, RouterLink, TranslatePipe],
  templateUrl: './eco-admin-auth-forgot-password-sent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoAdminAuthForgotPasswordSentComponent {}
