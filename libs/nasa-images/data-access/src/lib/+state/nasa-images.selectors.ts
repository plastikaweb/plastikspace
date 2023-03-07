import { createFeatureSelector, createSelector } from '@ngrx/store';

import { NasaImagesState, nasaMediaAdapter, NASA_IMAGES_FEATURE_KEY } from './nasa-images.reducer';

export const selectNasaImagesState = createFeatureSelector<NasaImagesState>(NASA_IMAGES_FEATURE_KEY);

const { selectAll, selectEntities } = nasaMediaAdapter.getSelectors();

export const selectNasaImagesLoading = createSelector(selectNasaImagesState, (state: NasaImagesState) => state.loading);

export const selectNasaImagesError = createSelector(selectNasaImagesState, (state: NasaImagesState) => state.error);

export const selectAllNasaImages = createSelector(selectNasaImagesState, (state: NasaImagesState) => selectAll(state));

export const selectNasaImagesEntities = createSelector(selectNasaImagesState, (state: NasaImagesState) => selectEntities(state));

export const selectNasaImagesSelectedId = createSelector(selectNasaImagesState, (state: NasaImagesState) => state.selectedId);

export const selectNasaImagesEntity = createSelector(selectNasaImagesEntities, selectNasaImagesSelectedId, (entities, selectedId) =>
  selectedId ? entities[selectedId] : undefined,
);

export const selectNasaImagesCount = createSelector(selectNasaImagesState, (state: NasaImagesState) => state.count);
