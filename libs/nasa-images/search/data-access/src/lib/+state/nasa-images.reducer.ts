import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { NasaImage } from '@plastik/nasa-images/search/entities';

import { cleanupNasaImages, loadNasaImages, loadNasaImagesFailure, loadNasaImagesSuccess } from './nasa-images.actions';

export const NASA_IMAGES_FEATURE_KEY = 'images';

export interface NasaImagesState extends EntityState<NasaImage> {
  selectedId?: string;
  count: number;
  error?: string | null;
  isActiveSearch: boolean;
}

export interface NasaImagesPartialState {
  readonly [NASA_IMAGES_FEATURE_KEY]: NasaImagesState;
}

export const nasaMediaAdapter: EntityAdapter<NasaImage> = createEntityAdapter<NasaImage>();

export const initialNasaImagesState: NasaImagesState = nasaMediaAdapter.getInitialState({
  count: 0,
  isActiveSearch: false,
});

const reducer = createReducer(
  initialNasaImagesState,
  on(loadNasaImages, (state): NasaImagesState => ({ ...state, error: null, isActiveSearch: false })),
  on(
    loadNasaImagesSuccess,
    (state, { items, count }): NasaImagesState => nasaMediaAdapter.setAll(items, { ...state, count, isActiveSearch: true }),
  ),
  on(loadNasaImagesFailure, (state, { error }): NasaImagesState => ({ ...state, error, isActiveSearch: false })),
  on(cleanupNasaImages, (state): NasaImagesState => nasaMediaAdapter.removeAll({ ...state, count: 0, error: null, isActiveSearch: false })),
);

// eslint-disable-next-line jsdoc/require-jsdoc
export function nasaMediaReducer(state: NasaImagesState | undefined, action: Action) {
  return reducer(state, action);
}
