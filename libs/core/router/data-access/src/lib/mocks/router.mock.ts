/* eslint-disable jsdoc/require-jsdoc */
import { ROUTER_NAVIGATION, ROUTER_REQUEST } from '@ngrx/router-store';

import { RouterStateUrl } from '../+state/reducer/router-state.reducer';

export const routerMockState: {
  navigationId: number;
  state: RouterStateUrl;
} = {
  navigationId: 1,
  state: {
    params: { key: '1' },
    title: 'The title',
    queryParams: {
      key: 'value',
    },
    data: { title: 'The title', name: 'Title' },
    url: 'path1/sub_path1',
  },
};

export function getMockedRouterNavigation(url: string) {
  return {
    type: ROUTER_NAVIGATION,
    payload: {
      event: {
        url,
      },
    },
  };
}

export function getMockedRouterRequest(url: string) {
  return {
    type: ROUTER_REQUEST,
    payload: {
      event: {
        url,
      },
    },
  };
}
