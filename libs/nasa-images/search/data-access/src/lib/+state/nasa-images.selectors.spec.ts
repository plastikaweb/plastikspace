import { NasaImage } from '@plastik/nasa-images/search/entities';

import { createNasaImagesEntity } from '../nasa-images.mock';
import {
  initialNasaImagesState, NasaImagesPartialState,
  nasaMediaAdapter, NASA_IMAGES_FEATURE_KEY
} from './nasa-images.reducer';
import * as NasaImagesSelectors from './nasa-images.selectors';

describe('NasaImages Selectors', () => {
  const ERROR_MSG = 'Error occurred.';
  const getNasaImagesId = (it: NasaImage) => it.id;
  let state: NasaImagesPartialState;

  beforeEach(() => {
    state = {
      [NASA_IMAGES_FEATURE_KEY]: nasaMediaAdapter.setAll(
        [createNasaImagesEntity('PRODUCT-AAA'), createNasaImagesEntity('PRODUCT-BBB'), createNasaImagesEntity('PRODUCT-CCC')],
        {
          ...initialNasaImagesState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loading: false,
          count: 3,
        },
      ),
    };
  });

  describe('NasaImages Selectors', () => {
    it('selectAllNasaImages() should return the list of NasaImages', () => {
      const results = NasaImagesSelectors.selectAllNasaImages(state);
      const selId = getNasaImagesId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectNasaImagesCount() should return the selected total images count', () => {
      const result = NasaImagesSelectors.selectNasaImagesCount(state);

      expect(result).toBe(3);
    });

    describe('selectEntity()', () => {
      it('should return the selected Entity', () => {
        const result = NasaImagesSelectors.selectNasaImagesEntity(state) as NasaImage;
        const selId = getNasaImagesId(result);

        expect(selId).toBe('PRODUCT-BBB');
      });

      it('should return undefined if ID is not set', () => {
        const customState = { ...state };
        customState[NASA_IMAGES_FEATURE_KEY].selectedId = undefined;

        const result = NasaImagesSelectors.selectNasaImagesEntity(customState) as NasaImage;

        expect(result).toBeUndefined();
      });
    });

    it('selectNasaImagesError() should return the current "error" state', () => {
      const result = NasaImagesSelectors.selectNasaImagesError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
