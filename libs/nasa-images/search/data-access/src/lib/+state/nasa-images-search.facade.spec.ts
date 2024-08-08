import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { provideEnvironmentMock } from '@plastik/core/environments';
import { routerActions, selectRouteQueryParams } from '@plastik/core/router-state';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NasaImagesSearchFacade } from './nasa-images-search.facade';

describe('NasaImagesSearchFacade', () => {
  let facade: NasaImagesSearchFacade;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NasaImagesSearchFacade,
        provideHttpClientTesting(),
        provideMockStore({
          selectors: [
            {
              selector: selectRouteQueryParams,
              value: {
                q: 'pluto',
                page: '1',
              },
            },
          ],
        }),
        provideEnvironmentMock(),
        { provide: VIEW_CONFIG, useValue: null },
      ],
    });

    facade = TestBed.inject(NasaImagesSearchFacade);
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should dispatch go action on search', () => {
    const action = routerActions.go({ path: [], extras: { queryParams: { q: 'pluto', page: '1' }, queryParamsHandling: 'merge' } });
    facade.search({ q: 'pluto' });
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch go action on changePagination', () => {
    const action = routerActions.go({ path: [], extras: { queryParams: { q: 'pluto', page: 3 }, queryParamsHandling: 'merge' } });
    facade.changePagination({ pageIndex: 2, pageSize: 100 });
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
