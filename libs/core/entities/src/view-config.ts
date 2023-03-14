import { Type } from '@angular/core';
import { collectionToArray } from '@plastik/shared/objects';

/**
 * @description A shape for a concrete UI view.
 */
export interface ViewConfig<T> {
  title: T | string | Type<string>;
  icon?: string;
  svgClass?: {
    menu?: string;
    header: string;
  };
  children?: Array<ViewConfig<T>>;
  route: string[];
  includedInNavigation?: boolean;
}

/**
 * @description A Record shape for UI views.
 */
export type ViewsConfigRecord<T> = Record<string, ViewConfig<T>>;

/**
 * @description Returns an array with just the includedInNavigation ViewConfig elements.
 * @param {ViewsConfigRecord} viewsConfig The app views configuration.
 * @returns {ViewConfig[]}.
 */
export function getVisibleNavigationList<T>(viewsConfig: ViewsConfigRecord<T>): ViewConfig<T>[] {
  return collectionToArray<ViewConfig<T>>(viewsConfig).filter(viewConfig => viewConfig.includedInNavigation);
}
