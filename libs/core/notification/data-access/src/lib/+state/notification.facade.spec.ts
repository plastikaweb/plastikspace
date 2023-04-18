import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { dismissNotification } from './notification.actions';
import { NotificationFacade } from './notification.facade';

describe('NotificationFacade', () => {
  let facade: NotificationFacade;
  let store: Store;

  describe('used in NgModule', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideMockStore()],
      });

      store = TestBed.inject(Store);
      facade = TestBed.inject(NotificationFacade);
      jest.spyOn(store, 'dispatch');
    });

    it('should be created', () => {
      expect(facade).toBeTruthy();
    });

    it('should dispatch dismissNotification action on dismiss', () => {
      const action = dismissNotification();
      facade.dismiss();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
});
