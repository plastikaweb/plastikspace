import { Inject, inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ViewConfig } from '@plastik/core/entities';

import { CORE_CMS_LAYOUT_HEADER_CONFIG, CoreCmsLayoutHeaderConfig } from '../core-cms-layout-header-config';
import { CORE_CMS_LAYOUT_SIDENAV_CONFIG } from '../core-cms-layout-sidenav-config';
import { setIsMobile, toggleSidenav } from './layout.actions';
import { selectIsMobile, selectSidenavOpened } from './layout.selectors';

@Injectable({ providedIn: 'root' })
export class LayoutFacade {
  private readonly store = inject(Store);

  sidenavOpened$ = this.store.select(selectSidenavOpened);
  isMobile$ = this.store.select(selectIsMobile);
  headerConfig = this.header;
  sidenavConfig = this.sidenav;

  constructor(
    @Inject(CORE_CMS_LAYOUT_HEADER_CONFIG) private readonly header: CoreCmsLayoutHeaderConfig,
    @Inject(CORE_CMS_LAYOUT_SIDENAV_CONFIG) private readonly sidenav: ViewConfig<unknown>[],
  ) {}

  toggleSidenav(opened: boolean | undefined) {
    this.store.dispatch(toggleSidenav({ opened }));
  }

  setIsMobile(isMobile: boolean) {
    this.store.dispatch(setIsMobile({ isMobile }));
  }
}
