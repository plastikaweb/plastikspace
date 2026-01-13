import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { appSearchFormConfig } from '@plastik/eco-store/formly';
import { EcoStoreTenantBaseService } from '@plastik/eco-store/tenant';

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
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LayoutComponent {
  protected searchFormConfig = appSearchFormConfig();
  protected readonly isSidenavOpen = signal(false);
  private readonly sidenavContent = viewChild<MatSidenavContent>('sidenavContent');
  readonly #destroyRef = inject(DestroyRef);
  readonly tenantService = inject(EcoStoreTenantBaseService);
  readonly #router: Router = inject(Router);

  constructor() {
    this.#router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(() => {
        this.sidenavContent()?.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  protected onSearchSubmit(event: { query: string }): void {
    // eslint-disable-next-line no-console
    console.log(event);
  }
}
