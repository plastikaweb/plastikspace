import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { EcoStoreAuthContainerComponent } from '@plastik/eco-store/auth/container';
import { SharedFormFeatureComponent } from '@plastik/shared/form';

@Component({
  selector: 'eco-store-auth-login',
  imports: [
    SharedFormFeatureComponent,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    TranslateModule,
    RouterLink,
    EcoStoreAuthContainerComponent,
  ],
  templateUrl: './eco-store-auth-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreAuthLoginComponent {
  protected readonly facade = inject(AUTH_FORM_FACADE);
}
