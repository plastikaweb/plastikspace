import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { AuthFeatureComponent } from '@plastik/auth/feature';
import { SharedFormFeatureComponent } from '@plastik/shared/form';

@Component({
  selector: 'eco-admin-auth-login',
  imports: [
    AuthFeatureComponent,
    SharedFormFeatureComponent,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './eco-admin-auth-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoAdminAuthLoginComponent {
  protected readonly facade = inject(AUTH_FORM_FACADE);
}
