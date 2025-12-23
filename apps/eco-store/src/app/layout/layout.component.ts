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
import { appSearchFormConfig } from '@plastik/eco-store/formly';
import { filter } from 'rxjs';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';

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
/**
 * Main layout component for eco-store.
 * Handles header, footer, sidenav and main content area.
 */
export default class LayoutComponent {
  protected readonly searchFormConfig = appSearchFormConfig();
  protected readonly isSidenavOpen = signal(false);
  private readonly sidenavContent = viewChild<MatSidenavContent>('sidenavContent');
  readonly #destroyRef = inject(DestroyRef);
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
