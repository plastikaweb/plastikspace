import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { NavigationProps } from '../../navigation';

export const routerActions = createActionGroup({
  source: 'Router',
  events: {
    Go: props<{ path: NavigationProps['path']; query?: NavigationProps['query']; extras?: NavigationProps['extras'] }>(),
    Back: props<{ url?: string; regex?: RegExp }>(),
    Forward: emptyProps(),
  },
});
