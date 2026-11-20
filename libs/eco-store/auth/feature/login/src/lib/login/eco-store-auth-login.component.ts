import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { AuthFeatureComponent } from '@plastik/auth/feature';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
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
    AuthFeatureComponent,
  ],
  templateUrl: './eco-store-auth-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreAuthLoginComponent {
  protected readonly facade = inject(AUTH_FORM_FACADE);
  readonly #tenant = inject(ecoStoreTenantStore).tenant;
  readonly #joinSubject = toSignal(inject(TranslateService).stream('auth.login.join.subject'), {
    initialValue: '',
  });

  /** The cooperative's address, where a visitor who is not a member yet asks how to become one. */
  protected readonly joinEmail = computed(() => this.#tenant()?.email?.trim() || null);

  /** A message to the cooperative with the subject filled in, or nothing while it has no address. */
  protected readonly joinHref = computed(() => {
    const email = this.joinEmail();

    return email ? `mailto:${email}?subject=${encodeURIComponent(this.#joinSubject())}` : null;
  });
}
