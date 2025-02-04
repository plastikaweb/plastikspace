import { provideExperimentalZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';

import { NasaImagesFacade } from './nasa-images.facade';

describe('NasaImagesFacade', () => {
  let facade: NasaImagesFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        NasaImagesFacade,
        { provide: VIEW_CONFIG, useValue: signal([]) },
        provideMockStore({}),
        provideExperimentalZonelessChangeDetection(),
      ],
    });

    facade = TestBed.inject(NasaImagesFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });
});
