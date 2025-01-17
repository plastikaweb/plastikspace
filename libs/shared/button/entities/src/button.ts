import { Action } from '@ngrx/store';
import { SvgIconConfig } from '@plastik/shared/entities';
import { Observable } from 'rxjs';

interface ButtonBaseConfig {
  id: number;
  elements: ButtonElement[];
  ariaLabel: string;
  classes?: string;
  dataTestId?: string;
  disabled?: boolean | Observable<boolean>;
  link?: string;
  doAction?(): Action;
}

type ButtonConfigWithAction = Omit<ButtonBaseConfig, 'link'> & {
  type: 'button';
};
type ButtonConfigAsLink = Omit<ButtonBaseConfig, 'doAction'> & {
  type: 'link';
};

/**
 * @description Configuration for shared button.
 */
export type ButtonConfig = ButtonConfigWithAction | ButtonConfigAsLink;

/**
 * @description The type of inner elements a Button configuration will accept.
 */
export type ButtonElement =
  | {
      type: 'text';
      content: string | Observable<string>;
    }
  | {
      type: 'icon';
      content: SvgIconConfig | Observable<SvgIconConfig>;
    };

/**
 * @description Checks if button config is of type ButtonConfigAsLink.
 * @param { ButtonConfig } toBeDetermined The button instance to be checked.
 * @returns { boolean } Returns true if type button is a link.
 */
export function buttonHasALinkGuard(
  toBeDetermined: ButtonConfig
): toBeDetermined is ButtonConfigAsLink {
  return (toBeDetermined as ButtonConfigAsLink).type === 'link';
}
