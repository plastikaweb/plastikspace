import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  linkedSignal,
  PLATFORM_ID,
} from '@angular/core';

import { Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ActivatedRoute,
  ActivationEnd,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { filter, map } from 'rxjs';
import { EcoFooterComponent } from './footer/footer.component';
import { EcoHeaderComponent } from './header/header.component';
import { EcoMenuComponent } from './menu/menu.component';
import { EcoMobileNavComponent } from './mobile-nav/mobile-nav.component';
import { EcoTenantLogoComponent } from './tenant-logo/tenant-logo.component';

import { MatDivider } from '@angular/material/divider';
import { SkipLinkComponent } from '@plastik/shared/skip-link';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { LayoutObserverService } from '@plastik/core/cms-layout/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { activityStore } from '@plastik/shared/activity/data-access';
import { appSearchFormConfig } from './app.search-form.config';

@Component({
  imports: [
    NgTemplateOutlet,
    RouterOutlet,
    MatSidenavContainer,
    MatSidenavContent,
    EcoHeaderComponent,
    EcoFooterComponent,
    EcoMenuComponent,
    MatSidenav,
    TranslatePipe,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    EcoTenantLogoComponent,
    EcoMobileNavComponent,
    MatDivider,
    SkipLinkComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EcoLayoutComponent {
  protected readonly platformId = inject(PLATFORM_ID);
  protected readonly tenantStore = inject(ecoStoreTenantStore);
  protected readonly profileStore = inject(pocketBaseUserProfileStore);
  protected readonly searchFormConfig = appSearchFormConfig();
  readonly #translateService = inject(TranslateService);
  readonly activityStore = inject(activityStore);
  protected readonly isMobile = toSignal(
    inject(LayoutObserverService).getMatches([Breakpoints.XSmall, Breakpoints.Small])
  );
  protected readonly isTranslationReady = toSignal(this.#translateService.onLangChange, {
    initialValue: null,
  });
  readonly #activatedRoute = inject(ActivatedRoute);

  readonly #router = inject(Router);

  readonly #navigationTrigger = toSignal(
    this.#router.events.pipe(filter(event => event instanceof NavigationEnd))
  );

  readonly hasSidenav = toSignal(
    this.#router.events.pipe(
      filter((event): event is ActivationEnd => event instanceof ActivationEnd),
      map(() => this.#getSidenavDataFromActiveRoute())
    ),
    { initialValue: this.#getSidenavDataFromActiveRoute() }
  );

  protected readonly isSidenavOpen = linkedSignal(() =>
    this.isMobile() ? false : (this.hasSidenav() ?? false)
  );

  constructor() {
    effect(() => {
      this.#navigationTrigger();

      if (this.isMobile()) {
        this.isSidenavOpen.set(false);
      }
    });
    this.activityStore.setActivity(false);
  }

  #getSidenavDataFromActiveRoute(): boolean {
    let route = this.#activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return Boolean(route.snapshot?.data['hasSidenav']);
  }

  protected onSearchSubmit(): void {
    // console.log(_event);
  }
}
