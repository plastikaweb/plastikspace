import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { provideEnvironmentMock } from '@plastik/core/environments';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';

import { NasaImagesApiService } from '../nasa-images-api.service';
import { createDummyNasaImagesSearch } from '../nasa-images.mock';
import * as NasaImagesActions from './nasa-images.actions';
import { NasaImagesEffects } from './nasa-images.effects';

describe('NasaImagesEffects', () => {
  const { items, count } = createDummyNasaImagesSearch();
  const ERROR_MSG = 'Error occurred.';

  let actions: Observable<Action>;
  let effects: NasaImagesEffects;
  let metadata: EffectsMetadata<NasaImagesEffects>;
  let service: NasaImagesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NasaImagesEffects,
        provideMockActions(() => actions),
        provideMockStore(),
        provideEnvironmentMock(),
        {
          provide: NasaImagesApiService,
          useValue: {
            getList: jest.fn(),
          },
        },
      ],
    });

    effects = TestBed.inject(NasaImagesEffects);
    service = TestBed.inject(NasaImagesApiService);

    metadata = getEffectsMetadata(effects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('load$', () => {
    const action = NasaImagesActions.loadNasaImages({ params: { q: 'pluto' } });
    it('should work on success', () => {
      jest.spyOn(service, 'getList').mockImplementation(() => of({ items, count }));
      actions = hot('-a-|', { a: action });
      const expected = hot('-a-|', { a: NasaImagesActions.loadNasaImagesSuccess({ items, count }) });

      expect(effects.load$).toBeObservable(expected);
    });

    it('should work on failure', () => {
      jest.spyOn(service, 'getList').mockImplementation(() => throwError(() => ERROR_MSG));
      actions = hot('-a-#', { a: action });
      const expected = cold('-b-#', { b: NasaImagesActions.loadNasaImagesFailure({ error: ERROR_MSG }) });

      expect(effects.load$).toBeObservable(expected);
    });

    it('should be registered', () => {
      expect(metadata.load$).toEqual({
        dispatch: true,
        useEffectsErrorHandler: true,
      });
    });
  });
});
