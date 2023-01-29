import { ROUTER_NAVIGATION, ROUTER_REQUEST } from '@ngrx/router-store';

import { RouterStateUrl } from '../+state/reducer/router-state.reducer';

interface Payload {
  event: { url: string };
}

/* eslint-disable jsdoc/require-jsdoc */
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

export function getMockedRouterNavigation(url: string): { type: typeof ROUTER_NAVIGATION; payload: Payload } {
  return {
    type: ROUTER_NAVIGATION,
    payload: {
      event: {
        url,
      },
    },
  };
}

export function getMockedRouterRequest(url: string): { type: typeof ROUTER_REQUEST; payload: Payload } {
  return {
    type: ROUTER_REQUEST,
    payload: {
      event: {
        url,
      },
    },
  };
}
