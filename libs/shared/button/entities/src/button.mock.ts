import { createAction } from '@ngrx/store';

import { ButtonConfig } from './button';

export const buttonMock: ButtonConfig = {
  id: 1,
  type: 'button',
  elements: [
    {
      type: 'icon',
      content: { iconPath: 'assets/svg/go.svg' },
    },
  ],
  ariaLabel: 'click here to go!',
  doAction: () => createAction('[Action] go'),
};

export const buttonAsLinkMock: ButtonConfig = {
  id: 1,
  type: 'link',
  elements: [
    {
      type: 'text',
      content: 'GO',
    },
    {
      type: 'icon',
      content: { iconPath: 'assets/svg/go.svg' },
    },
  ],
  ariaLabel: 'click here to go!',
  link: '',
};
