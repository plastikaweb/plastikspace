import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { routerMockState } from '../../mocks/router.mock';
import {
  selectRouteData,
  selectRouteDataName,
  selectRouteParams,
  selectRouteQueryParams,
  selectRouteUrl,
} from './router-state.selectors';

describe('RouterState selectors', () => {
  const { state } = routerMockState;
  const initialState = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), provideExperimentalZonelessChangeDetection()],
    });
  });

  it('should return Url', () => {
    expect(selectRouteUrl.projector(routerMockState)).toBe(state.url);
  });

  it('should return Params', () => {
    expect(selectRouteParams.projector(routerMockState)).toBe(state.params);
  });

  it('should return QueryParams', () => {
    expect(selectRouteQueryParams.projector(routerMockState)).toBe(state.queryParams);
  });

  it('should return Data', () => {
    expect(selectRouteData.projector(routerMockState)).toBe(state.data);
  });

  it('should return Data Name', () => {
    expect(selectRouteDataName.projector(state.data)).toBe(state.data['name']);
  });
});
