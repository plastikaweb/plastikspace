import { Params, RouterStateSnapshot } from '@angular/router';
import { BaseRouterStoreState, routerReducer, RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';
import { Action, ActionReducerMap } from '@ngrx/store';

import { routerKey } from '../../router-state';

/**
 * @description The base blueprint for router state.
 */
export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
  data: Record<string, unknown>;
  title: string;
}

/**
 * @description The router state object.
 */
export type RouterState = {
  [key in typeof routerKey]: RouterReducerState<BaseRouterStoreState>;
};

/**
 * @description The router state reducer map.
 */
export const routerReducers: ActionReducerMap<RouterState, Action> = {
  [routerKey]: routerReducer,
};

/**
 * @description The router state serializer.
 */
export class CustomRouterSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;
    const params: Record<string, unknown> = {};

    while (route.firstChild) {
      route = route.firstChild;
      Object.keys(route.params).forEach(key => (params[key] = route.params?.[key]));
    }

    const {
      url,
      root: { queryParams },
    } = routerState;
    const { data } = route;

    return {
      url,
      params,
      queryParams,
      data,
      title: data['title'] || '',
    };
  }
}
