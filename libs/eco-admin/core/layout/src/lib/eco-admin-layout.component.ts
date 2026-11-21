import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ECO_ADMIN_APP_NAME, ECO_ADMIN_PLATFORM_NAME } from '@plastik/eco-admin/entities';
import { EcoAdminNavigation } from '@plastik/eco-admin/layout-config';
import { ecoAdminTenantContextStore } from '@plastik/eco-admin/tenant-context';
import { SwipeToCloseDirective } from '@plastik/shared/util/swipe-to-close';
import { filter, map } from 'rxjs';

import { EcoAdminShellState } from './eco-admin-shell-state';
import { EcoAdminNavPanelComponent } from './nav-panel/eco-admin-nav-panel.component';
import { EcoAdminTopBarComponent } from './top-bar/eco-admin-top-bar.component';

/** The ids of the rail and of the drawer: what the rail's header, the «menu» button, controls. */
const RAIL_ID = 'eco-admin-nav';
const DRAWER_ID = 'eco-admin-nav-drawer';

/**
 * The title key of the deepest route, which every view under the shell sets to its rail label.
 * @param {ActivatedRouteSnapshot} root The root of the router state.
 * @returns {string} The key, or an empty string when the route has none.
 */
function deepestTitleKey(root: ActivatedRouteSnapshot): string {
  let route = root;

  while (route.firstChild) {
    route = route.firstChild;
  }

  const title = route.routeConfig?.title;

  return typeof title === 'string' ? title : '';
}

/**
 * The application shell of eco-admin (AP-0 0.7, part 2): the side navigation, the top bar and the
 * main landmark every signed-in view renders in.
 *
 * The rail is a plain column beside the content, 256 or 72 px wide. The drawer of PLEGAT is
 * Material's `mat-sidenav` in `over` mode, which brings the scrim, Escape, the focus trap, the focus
 * back to «menu» and the animation; `plastikSwipeToClose` adds the swipe of the mock (80 px, its default).
 */
@Component({
  selector: 'eco-admin-layout',
  imports: [
    EcoAdminNavPanelComponent,
    EcoAdminTopBarComponent,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    RouterOutlet,
    SwipeToCloseDirective,
    TranslatePipe,
  ],
  templateUrl: './eco-admin-layout.component.html',
  styleUrl: './eco-admin-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EcoAdminShellState],
  host: { class: 'eco-admin-layout' },
})
export class EcoAdminLayoutComponent {
  protected readonly shell = inject(EcoAdminShellState);
  protected readonly navigation = inject(EcoAdminNavigation);
  protected readonly railId = RAIL_ID;
  protected readonly drawerId = DRAWER_ID;
  protected readonly appName = ECO_ADMIN_APP_NAME;

  readonly #tenantContext = inject(ecoAdminTenantContextStore);
  readonly #router = inject(Router);

  protected readonly isPlatform = computed(() => this.navigation.variant() === 'platform');

  /** The first line of the rail header: the tenant's name, or the platform's. */
  protected readonly heading = computed(() =>
    this.isPlatform() ? ECO_ADMIN_PLATFORM_NAME : this.#tenantContext.tenantName()
  );

  protected readonly titleKey = toSignal(
    this.#router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => deepestTitleKey(this.#router.routerState.snapshot.root))
    ),
    { initialValue: deepestTitleKey(this.#router.routerState.snapshot.root) }
  );

  /** In AMPLE the button says whether the rail is expanded; in PLEGAT, whether the drawer is open. */
  protected readonly menuExpanded = computed(() =>
    this.shell.width() ? !this.shell.rail() : this.shell.drawerOpen()
  );

  /**
   * The rail in AMPLE; in PLEGAT the drawer while it is open, and nothing while it is not, since an
   * `aria-controls` must name an element that is shown.
   */
  protected readonly menuControls = computed(() => {
    if (this.shell.width()) {
      return RAIL_ID;
    }

    return this.shell.drawerOpen() ? DRAWER_ID : '';
  });
}
