import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { RouterFacade } from './router.facade';

describe('RouterFacade', () => {
  let facade: RouterFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideExperimentalZonelessChangeDetection(), RouterFacade, provideMockStore({})],
    });

    facade = TestBed.inject(RouterFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });
});
