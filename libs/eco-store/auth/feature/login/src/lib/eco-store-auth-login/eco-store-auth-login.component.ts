import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { PasswordWithVisibilityFormlyModule } from '@plastik/shared/form/password';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';

@Component({
  selector: 'eco-eco-store-auth-login',
  imports: [
    SharedFormFeatureModule,
    PasswordWithVisibilityFormlyModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    TranslateModule,
    RouterLink,
    SharedImgContainerComponent,
    PocketBaseImageUrlPipe,
  ],
  templateUrl: './eco-store-auth-login.component.html',
  styleUrl: './eco-store-auth-login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreAuthLoginComponent {
  protected readonly facade = inject(AUTH_FORM_FACADE);
  protected readonly profileStore = inject(pocketBaseUserProfileStore);
  protected readonly tenantStore = inject(ecoStoreTenantStore);
}
