import { createAction, props } from '@ngrx/store';

import { NavigationProps } from '../../navigation';

export const go = createAction(
  '[Router] Go',
  props<{
    path: NavigationProps['path'];
    query?: NavigationProps['query'];
    extras?: NavigationProps['extras'];
  }>(),
);
export const back = createAction(
  '[Router] Back',
  props<{
    url?: string;
    regex?: RegExp;
  }>(),
);
export const forward = createAction('[Router] Forward');
