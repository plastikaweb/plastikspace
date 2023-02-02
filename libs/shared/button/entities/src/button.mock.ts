import { createAction } from '@ngrx/store';

import { ButtonConfig } from './button';

export const buttonMock: ButtonConfig = {
  type: 'button',
  elements: [
    'GO',
    {
      iconPath: 'assets/svg/go.svg',
    },
  ],
  ariaLabel: 'click here to go!',
  doAction: () => createAction('[Action] go'),
};

export const buttonAsLinkMock: ButtonConfig = {
  type: 'link',
  elements: [
    'GO',
    {
      iconPath: 'assets/svg/go.svg',
    },
  ],
  ariaLabel: 'click here to go!',
  link: '',
};
