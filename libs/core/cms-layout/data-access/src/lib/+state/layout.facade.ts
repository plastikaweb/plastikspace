import { Inject, inject, Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { ViewConfig } from '@plastik/core/entities';
import { selectIsActive } from '@plastik/shared/activity/data-access';

import { CORE_CMS_LAYOUT_HEADER_CONFIG } from '@plastik/core/cms-layout/entities';
import { VIEW_CONFIG } from '../core-cms-view-config';
import { layoutActions } from './layout.actions';
import { selectIsMobile, selectSidenavOpened } from './layout.feature';

@Injectable({ providedIn: 'root' })
export class LayoutFacade {
  private readonly store = inject(Store);

  sidenavOpened$ = this.store.select(selectSidenavOpened);
  isMobile$ = this.store.select(selectIsMobile);
  isActive$ = this.store.select(selectIsActive);
  headerConfig = inject(CORE_CMS_LAYOUT_HEADER_CONFIG);
  sidenavConfig = this.sidenav;

  constructor(@Inject(VIEW_CONFIG) private readonly sidenav: ViewConfig<string>[]) {}

  toggleSidenav(opened: boolean | undefined): void {
    this.store.dispatch(layoutActions.toggleSidenav({ opened }));
  }

  setIsMobile(isMobile: boolean): void {
    this.store.dispatch(layoutActions.setIsMobile({ isMobile }));
  }

  dispatchAction(action: () => Action): void {
    this.store.dispatch(action());
  }
}
