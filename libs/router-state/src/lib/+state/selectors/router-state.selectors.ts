import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { routerKey } from '../../router-state';
import { RouterStateUrl } from '../reducer/router-state.reducer';

export const selectRouteFeatureState = createFeatureSelector<RouterReducerState<RouterStateUrl>>(routerKey);

export const selectRouteQueryParams = createSelector(
  selectRouteFeatureState,
  (state: RouterReducerState<RouterStateUrl>) => state?.state?.queryParams,
);

export const selectRouteUrl = createSelector(selectRouteFeatureState, (state: RouterReducerState<RouterStateUrl>) => state?.state?.url);

export const selectRouteParams = createSelector(
  selectRouteFeatureState,
  (state: RouterReducerState<RouterStateUrl>) => state?.state?.params,
);

export const selectRouteData = createSelector(selectRouteFeatureState, (state: RouterReducerState<RouterStateUrl>) => state?.state?.data);

export const selectRouteDataName = createSelector(selectRouteData, data => data?.['name']);
