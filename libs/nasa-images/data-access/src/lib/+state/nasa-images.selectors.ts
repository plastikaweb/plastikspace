import { createFeatureSelector, createSelector } from '@ngrx/store';

import { NASA_IMAGES_FEATURE_KEY, NasaImagesState, nasaMediaAdapter } from './nasa-images.reducer';

export const selectNasaImagesState = createFeatureSelector<NasaImagesState>(NASA_IMAGES_FEATURE_KEY);

const { selectAll, selectEntities } = nasaMediaAdapter.getSelectors();

export const selectNasaImagesLoading = createSelector(selectNasaImagesState, (state: NasaImagesState) => state.loading);

export const selectNasaImagesError = createSelector(selectNasaImagesState, (state: NasaImagesState) => state.error);

export const selectAllNasaImages = createSelector(selectNasaImagesState, (state: NasaImagesState) => selectAll(state));

export const selectNasaImagesEntities = createSelector(selectNasaImagesState, (state: NasaImagesState) => selectEntities(state));

export const selectSelectedId = createSelector(selectNasaImagesState, (state: NasaImagesState) => state.selectedId);

export const selectEntity = createSelector(selectNasaImagesEntities, selectSelectedId, (entities, selectedId) =>
  selectedId ? entities[selectedId] : undefined,
);
