import { Action } from '@ngrx/store';

import { createDummyNasaImagesSearch } from '../nasa-images.mock';
import { loadNasaImages, loadNasaImagesFailure, loadNasaImagesSuccess } from './nasa-images.actions';
import { initialNasaImagesState, NasaImagesState, nasaMediaReducer } from './nasa-images.reducer';

describe('NasaImages Reducer', () => {
  const { items, count } = createDummyNasaImagesSearch(3);
  describe('valid NasaImages actions', () => {
    it('loadNasaImages should return a valid state', () => {
      const action = loadNasaImages({ params: { q: 'pluto' } });

      const result: NasaImagesState = nasaMediaReducer(initialNasaImagesState, action);

      expect(result.error).toBeNull();
    });

    it('loadNasaImagesSuccess should return a valid state', () => {
      const action = loadNasaImagesSuccess({ items, count });

      const result: NasaImagesState = nasaMediaReducer(initialNasaImagesState, action);

      expect(result.ids.length).toBe(3);
    });

    it('loadNasaImagesFailure should return a valid state', () => {
      const action = loadNasaImagesFailure({ error: 'ERROR' });

      const result: NasaImagesState = nasaMediaReducer(initialNasaImagesState, action);

      expect(result.error).toEqual('ERROR');
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = nasaMediaReducer(initialNasaImagesState, action);

      expect(result).toBe(initialNasaImagesState);
    });
  });
});
