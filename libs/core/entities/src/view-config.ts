import { Type } from '@angular/core';
import { Resolve } from '@angular/router';
import { collectionToArray } from '@plastik/shared/objects';

export interface ViewConfig<T> {
  title: T | string | Type<Resolve<string>>;
  icon?: string;
  svgClass?: {
    menu?: string;
    header: string;
  };
  children?: Array<ViewConfig<T>>;
  route: string[];
  includedInNavigation?: boolean;
}

export type ViewsConfigRecord<T> = Record<string, ViewConfig<T>>;

/**
 * Returns an array with just the includedInNavigation ViewConfig elements.
 *
 * @param {ViewsConfigRecord} viewsConfig The app views configuration.
 * @returns {ViewConfig[]}.
 */
export function getVisibleNavigationList<T>(viewsConfig: ViewsConfigRecord<T>): ViewConfig<T>[] {
  return collectionToArray<ViewConfig<T>>(viewsConfig).filter(viewConfig => viewConfig.includedInNavigation);
}
