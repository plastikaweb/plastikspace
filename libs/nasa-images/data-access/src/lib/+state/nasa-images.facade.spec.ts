import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideEnvironmentMock } from '@plastik/core/environments';

import { NasaImagesFacade } from './nasa-images.facade';

describe('NasaImagesFacade', () => {
  let facade: NasaImagesFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [NasaImagesFacade, provideMockStore({}), provideEnvironmentMock()],
    });

    facade = TestBed.inject(NasaImagesFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });
});
