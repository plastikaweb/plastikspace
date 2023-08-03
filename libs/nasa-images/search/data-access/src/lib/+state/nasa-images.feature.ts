import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { NasaImage } from '@plastik/nasa-images/search/entities';

import { nasaImagesAPIActions, nasaImagesPageActions } from './nasa-images.actions';

const NASA_IMAGES_FEATURE_KEY = 'images';

export interface NasaImagesState extends EntityState<NasaImage> {
  selectedId: string | null;
  count: number;
  error: string | null;
  isActiveSearch: boolean;
}

export interface NasaImagesPartialState {
  readonly [NASA_IMAGES_FEATURE_KEY]: NasaImagesState;
}

export const nasaMediaAdapter: EntityAdapter<NasaImage> = createEntityAdapter<NasaImage>();

export const initialNasaImagesState: NasaImagesState = nasaMediaAdapter.getInitialState({
  count: 0,
  isActiveSearch: false,
  error: null,
  selectedId: null,
});

const nasaImagesReducer = createReducer(
  initialNasaImagesState,
  on(nasaImagesPageActions.load, (state): NasaImagesState => ({ ...state, error: null, isActiveSearch: false })),
  on(
    nasaImagesAPIActions.loadSuccess,
    (state, { items, count }): NasaImagesState => nasaMediaAdapter.setAll(items, { ...state, count, isActiveSearch: true }),
  ),
  on(nasaImagesAPIActions.loadFailure, (state, { error }): NasaImagesState => ({ ...state, error, isActiveSearch: false })),
  on(
    nasaImagesPageActions.cleanUp,
    (state): NasaImagesState => nasaMediaAdapter.removeAll({ ...state, count: 0, error: null, isActiveSearch: false }),
  ),
);

export const selectNasaImagesFeature = createFeature({
  name: NASA_IMAGES_FEATURE_KEY,
  reducer: nasaImagesReducer,
  extraSelectors: ({ selectImagesState, selectEntities, selectSelectedId }) => {
    return {
      ...nasaMediaAdapter.getSelectors(selectImagesState),
      selectSelectedEntity: createSelector(selectEntities, selectSelectedId, (entities, id) => (entities && id ? entities[id] : null)),
    };
  },
});

export const { name, reducer } = selectNasaImagesFeature;
