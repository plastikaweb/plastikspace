import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectRouteQueryParams } from '@plastik/core/router-state';

import { NasaImagesSearchSearchRouterTitleService } from './nasa-images-search-feature-route-title.service';

describe('NasaImagesSearchSearchRouterTitleService', () => {
  let service: NasaImagesSearchSearchRouterTitleService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        NasaImagesSearchSearchRouterTitleService,
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
    service = TestBed.inject(NasaImagesSearchSearchRouterTitleService);
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
