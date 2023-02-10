import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { NasaImage } from '@plastik/nasa-images/entities';

import { loadNasaImages, loadNasaImagesFailure, loadNasaImagesSuccess } from './nasa-images.actions';

export const NASA_IMAGES_FEATURE_KEY = 'images';

export interface NasaImagesState extends EntityState<NasaImage> {
  selectedId?: string;
  loading: boolean;
  count: number;
  error?: string | null;
}

export interface NasaImagesPartialState {
  readonly [NASA_IMAGES_FEATURE_KEY]: NasaImagesState;
}

export const nasaMediaAdapter: EntityAdapter<NasaImage> = createEntityAdapter<NasaImage>();

export const initialNasaImagesState: NasaImagesState = nasaMediaAdapter.getInitialState({
  loading: false,
  count: 0,
});

const reducer = createReducer(
  initialNasaImagesState,
  on(loadNasaImages, (state): NasaImagesState => ({ ...state, loading: true, error: null })),
  on(
    loadNasaImagesSuccess,
    (state, { items, count }): NasaImagesState => nasaMediaAdapter.setAll(items, { ...state, count, loading: false }),
  ),
  on(loadNasaImagesFailure, (state, { error }): NasaImagesState => ({ ...state, error, loading: false })),
);

// eslint-disable-next-line jsdoc/require-jsdoc
export function nasaMediaReducer(state: NasaImagesState | undefined, action: Action) {
  return reducer(state, action);
}
