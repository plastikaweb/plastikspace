import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { NasaImage } from '@plastik/nasa-images/search/entities';

import { createDummyNasaImagesSearch, createNasaImagesEntity } from '../nasa-images.mock';
import { nasaImagesAPIActions, nasaImagesPageActions } from './nasa-images.actions';
import {
  initialNasaImagesState,
  name,
  NasaImagesPartialState,
  NasaImagesState,
  nasaMediaAdapter,
  reducer,
  selectNasaImagesFeature,
} from './nasa-images.feature';

describe('NasaImages Reducer', () => {
  const { items, count } = createDummyNasaImagesSearch(3);
  describe('valid NasaImages actions', () => {
    it('loadNasaImages should return a valid state', () => {
      const action = nasaImagesPageActions.load({ params: { q: 'pluto' } });

      const result: NasaImagesState = reducer(initialNasaImagesState, action);

      expect(result.error).toBeNull();
      expect(result.isActiveSearch).toBeFalsy();
    });

    it('loadNasaImagesSuccess should return a valid state', () => {
      const action = nasaImagesAPIActions.loadSuccess({ items, count });

      const result: NasaImagesState = reducer(initialNasaImagesState, action);

      expect(result.ids.length).toBe(3);
      expect(result.isActiveSearch).toBeTruthy();
    });

    it('loadNasaImagesFailure should return a valid state', () => {
      const action = nasaImagesAPIActions.loadFailure({ error: 'ERROR' });

      const result: NasaImagesState = reducer(initialNasaImagesState, action);

      expect(result.error).toEqual('ERROR');
      expect(result.isActiveSearch).toBeFalsy();
    });

    it('cleanupNasaImages should return a valid state', () => {
      const action = nasaImagesPageActions.cleanUp();

      const result: NasaImagesState = reducer(initialNasaImagesState, action);

      expect(result.error).toBeNull();
      expect(result.ids.length).toBe(0);
      expect(result.count).toBe(0);
      expect(result.isActiveSearch).toBeFalsy();
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialNasaImagesState, action);

      expect(result).toBe(initialNasaImagesState);
    });
  });
});

describe('NasaImages Selectors', () => {
  const ERROR_MSG = 'Error occurred.';
  const getNasaImagesId = (it: NasaImage) => it.id;
  let state: NasaImagesPartialState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    state = {
      [name]: nasaMediaAdapter.setAll(
        [
          createNasaImagesEntity('PRODUCT-AAA'),
          createNasaImagesEntity('PRODUCT-BBB'),
          createNasaImagesEntity('PRODUCT-CCC'),
        ],
        {
          ...initialNasaImagesState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loading: false,
          isActiveSearch: true,
          count: 3,
        }
      ),
    };
  });

  describe('NasaImages Selectors', () => {
    it('selectAllNasaImages should return the list of NasaImages', () => {
      const results = selectNasaImagesFeature.selectAll(state);
      const selId = getNasaImagesId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectNasaImagesCount should return the selected total images count', () => {
      const result = selectNasaImagesFeature.selectCount(state);

      expect(result).toBe(3);
    });

    it('selectNasaImagesIsActiveSearch should return the isActiveSearch value', () => {
      const result = selectNasaImagesFeature.selectIsActiveSearch(state);

      expect(result).toBeTruthy();
    });

    describe('selectSelectedEntity', () => {
      it('should return the selected Entity', () => {
        const result = selectNasaImagesFeature.selectSelectedEntity(state) as NasaImage;
        const selId = getNasaImagesId(result);

        expect(selId).toBe('PRODUCT-BBB');
      });

      it('should return undefined if ID is not set', () => {
        const customState = { ...state };
        customState[name].selectedId = null;

        const result = selectNasaImagesFeature.selectSelectedEntity(customState) as NasaImage;

        expect(result).toBeNull();
      });
    });

    it('selectNasaImagesError should return the current "error" state', () => {
      const result = selectNasaImagesFeature.selectError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
