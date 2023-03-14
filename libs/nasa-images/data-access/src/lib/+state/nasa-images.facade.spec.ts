import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { provideEnvironmentMock } from '@plastik/core/environments';
import { go } from '@plastik/core/router-state';

import { NasaImagesFacade } from './nasa-images.facade';

describe('NasaImagesFacade', () => {
  let facade: NasaImagesFacade;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [NasaImagesFacade, provideMockStore({}), provideEnvironmentMock()],
    });

    facade = TestBed.inject(NasaImagesFacade);
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should dispatch go action on search', () => {
    const action = go({ path: [], extras: { queryParams: { q: 'pluto', page: '1' }, queryParamsHandling: 'merge' } });
    facade.search({ q: 'pluto' });
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
