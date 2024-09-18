import { TestBed } from '@angular/core/testing';
import { createAction, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { CORE_CMS_LAYOUT_HEADER_CONFIG } from '@plastik/core/cms-layout/entities';
import { VIEW_CONFIG } from '../core-cms-view-config';
import { layoutActions } from './layout.actions';
import { LayoutFacade } from './layout.facade';

describe('LayoutFacade', () => {
  let facade: LayoutFacade;
  let store: Store;

  describe('used in NgModule', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          LayoutFacade,
          provideMockStore({}),
          {
            provide: CORE_CMS_LAYOUT_HEADER_CONFIG,
            useValue: null,
          },
          {
            provide: VIEW_CONFIG,
            useValue: null,
          },
        ],
      });

      store = TestBed.inject(Store);
      facade = TestBed.inject(LayoutFacade);
      jest.spyOn(store, 'dispatch');
    });

    it('should be created', () => {
      expect(facade).toBeTruthy();
    });

    it('should dispatch a toggleSidenav action', () => {
      const opened = true;
      const action = layoutActions.toggleSidenav({ opened });
      facade.toggleSidenav(opened);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should dispatch a setIsMobile action', () => {
      const isMobile = true;
      const action = layoutActions.setIsMobile({ isMobile });
      facade.setIsMobile(isMobile);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should dispatch a dispatchAction action', () => {
      const anyAction = createAction('[Action] do');
      facade.dispatchAction(anyAction);
      expect(store.dispatch).toHaveBeenCalledWith(anyAction());
    });
  });
});
