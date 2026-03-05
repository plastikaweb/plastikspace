import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { RouterFacade } from './router.facade';

describe('RouterFacade', () => {
  let facade: RouterFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideZonelessChangeDetection(), RouterFacade, provideMockStore({})],
    });

    facade = TestBed.inject(RouterFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });
});
