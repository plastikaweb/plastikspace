import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';

import { Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import {
  ActivatedRoute,
  ActivationEnd,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter, map } from 'rxjs';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { MobileNavComponent } from './mobile-nav/mobile-nav.component';
import { TenantLogoComponent } from './tenant-logo/tenant-logo.component';

import { LayoutObserverService } from '@plastik/core/cms-layout/data-access';
import { appSearchFormConfig } from '@plastik/eco-store/formly';
import { StoreStatusBannerComponent } from '@plastik/eco-store/status-banner';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';

@Component({
  selector: 'eco-layout',
  imports: [
    NgTemplateOutlet,
    RouterModule,
    MatSidenavContainer,
    MatSidenavContent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    MatSidenav,
    TranslateModule,
    StoreStatusBannerComponent,
    MatIconModule,
    MatButtonModule,
    TenantLogoComponent,
    MobileNavComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LayoutComponent {
  protected readonly tenantStore = inject(ecoStoreTenantStore);
  protected readonly searchFormConfig = appSearchFormConfig();
  protected readonly isBannerDismissed = signal(false);
  protected readonly isMobile = toSignal(
    inject(LayoutObserverService).getMatches([Breakpoints.XSmall, Breakpoints.Small])
  );
  private readonly sidenavContent = viewChild<MatSidenavContent>('sidenavContent');
  readonly #activatedRoute = inject(ActivatedRoute);

  readonly #destroyRef = inject(DestroyRef);
  readonly #router = inject(Router);

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
    this.#router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(() => {
        if (this.isMobile()) {
          this.isSidenavOpen.set(false);
        }
        // Delay scroll to avoid synchronous forced reflows during view transitions / router navigation
        setTimeout(() => {
          this.sidenavContent()?.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
  }

  #getSidenavDataFromActiveRoute(): boolean {
    let route = this.#activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return Boolean(route.snapshot?.data['hasSidenav']);
  }

  protected shouldShowBanner(): boolean {
    const status = this.tenantStore.storeStatus();
    return ['CLOSED', 'CANCELLED', 'OPENING_SOON', 'CLOSING_SOON', 'CLOSED_MANUALLY'].includes(
      status as string
    );
  }

  protected onSearchSubmit(): void {
    // console.log(_event);
  }
}
