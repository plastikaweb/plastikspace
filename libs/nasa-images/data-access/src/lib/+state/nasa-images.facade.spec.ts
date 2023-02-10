import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { provideEnvironmentMock } from '@plastik/core/environments';

import { NasaImagesFacade } from './nasa-images.facade';

describe('NasaImagesFacade', () => {
  let facade: NasaImagesFacade;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [NasaImagesFacade, provideMockStore({}), provideEnvironmentMock()],
    });

    store = TestBed.inject(Store);
    facade = TestBed.inject(NasaImagesFacade);
    jest.spyOn(store, 'dispatch');
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should dispatch a loadNasaImages action', () => {
    facade.load();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });
});
