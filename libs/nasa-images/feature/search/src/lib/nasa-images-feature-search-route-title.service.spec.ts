import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectRouteQueryParams } from '@plastik/core/router-state';

import { NasaImagesFeatureSearchRouterTitleService } from './nasa-images-feature-search-route-title.service';

describe('NasaImagesFeatureSearchRouterTitleService', () => {
  let service: NasaImagesFeatureSearchRouterTitleService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        NasaImagesFeatureSearchRouterTitleService,
        provideMockStore({
          selectors: [
            {
              selector: selectRouteQueryParams,
              value: { q: 'pluto', page: '2' },
            },
          ],
        }),
      ],
    });
    service = TestBed.inject(NasaImagesFeatureSearchRouterTitleService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('resolve method', () => {
    it('should return the correct html title for nasa images route if "q" query param is present', () => {
      let result = '';
      service.resolve().subscribe(value => (result = value));
      expect(result).toBe('search by "pluto" (pag. 2)');
    });

    it('should return the correct html title for nasa images route if no "q" query param is present', () => {
      store.overrideSelector(selectRouteQueryParams, { q: '', page: '3' });

      let result = '';
      service.resolve().subscribe(value => (result = value));
      expect(result).toBe('search');
    });
  });
});
