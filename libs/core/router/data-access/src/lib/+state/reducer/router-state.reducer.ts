import { Params, RouterStateSnapshot } from '@angular/router';
import { routerReducer, RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';
import { Action, ActionReducerMap } from '@ngrx/store';

import { routerKey } from '../../router-state';

export interface RouterStateUrl {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  url: any;
  params: Params;
  queryParams: Params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  title: string;
}

export type RouterState = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in typeof routerKey]: RouterReducerState<any>;
};

export const routerReducers: ActionReducerMap<RouterState, Action> = {
  [routerKey]: routerReducer,
};

export class CustomRouterSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;
    const params: { [key: string]: unknown } = {};

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
