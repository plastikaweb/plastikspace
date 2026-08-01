import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'eco-eco-store-profile-sidenav-feature',
  imports: [
    MatCardModule,
    TranslateModule,
    MatNavList,
    MatListItem,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './eco-store-profile-sidenav-feature.component.html',
  styleUrl: './eco-store-profile-sidenav-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProfileSidenavFeatureComponent {
  readonly #router = inject(Router);
  readonly #tenantStore = inject(ecoStoreTenantStore);

  protected readonly currentUrl = toSignal(
    this.#router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects),
      startWith(this.#router.url)
    ),
    { initialValue: this.#router.url }
  );

  protected readonly fiscalDataEnabled = computed(
    () => !!this.#tenantStore.tenant()?.fiscalDataEnabled
  );
}
