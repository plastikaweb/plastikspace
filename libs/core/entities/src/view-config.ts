import { signal, Signal } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { collectionToArray } from '@plastik/shared/objects';

/**
 * @description A shape for a concrete UI view.
 */
export interface ViewConfig<T extends string> {
  id: number;
  name: Lowercase<T>;
  title: string;
  ariaLabel?: string;
  icon?: string;
  svgClass?: {
    menu?: string;
    header: string;
  };
  children?: Array<ViewConfig<T>>;
  route: [ViewConfigRoute<T>];
  includedInNavigation?: boolean;
  routerLinkActiveOptionsExact?: RouterLinkActive['routerLinkActiveOptions'];
  divider?: boolean;
}

export type ViewConfigRoute<T extends string> = `/${Lowercase<T>}`;

/**
 * @description A Record shape for UI views.
 */
export type ViewsConfigRecord<T extends string> = Record<T, ViewConfig<T>>;

/**
 * @description Returns an array with just the includedInNavigation ViewConfig elements.
 * @param {ViewsConfigRecord} viewsConfig The app views configuration.
 * @returns {Signal<ViewConfig[]>}.
 */
export function getVisibleNavigationList<T extends string>(
  viewsConfig: ViewsConfigRecord<T>
): Signal<ViewConfig<T>[]> {
  return signal(
    collectionToArray<ViewConfig<T>>(viewsConfig).filter(
      viewConfig => viewConfig.includedInNavigation
    )
  );
}

export type ViewConfigUI = Pick<ViewConfig<string>, 'icon' | 'title'>;
