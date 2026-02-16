import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';
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
  protected readonly isSidenavOpen = signal(false);
  protected readonly hasSidenav = signal(false);
  protected readonly isBannerDismissed = signal(false);
  protected readonly isMobile = toSignal(
    inject(LayoutObserverService).getMatches([Breakpoints.XSmall, Breakpoints.Small])
  );
  private readonly sidenavContent = viewChild<MatSidenavContent>('sidenavContent');
  readonly #destroyRef = inject(DestroyRef);
  readonly #router = inject(Router);

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
        this.sidenavContent()?.scrollTo({ top: 0, behavior: 'smooth' });
      });

    effect(() => {
      if (this.isMobile()) {
        this.isSidenavOpen.set(false);
      } else {
        this.isSidenavOpen.set(this.hasSidenav());
      }
    });
  }

  protected shouldShowBanner(): boolean {
    return (
      this.tenantStore.storeStatus() === 'CLOSED' ||
      this.tenantStore.storeStatus() === 'CANCELLED' ||
      this.tenantStore.storeStatus() === 'OPENING_SOON' ||
      this.tenantStore.storeStatus() === 'CLOSING_SOON' ||
      this.tenantStore.storeStatus() === 'CLOSED_MANUALLY'
    );
  }

  protected onSearchSubmit(): void {
    // console.log(_event);
  }
}
