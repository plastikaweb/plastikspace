import { InjectionToken, Signal, Type } from '@angular/core';
import { LayoutPosition, SvgIconConfig } from '@plastik/shared/entities';

export type ViewConfigRoute<T extends string> =
  | `/${Lowercase<T>}`
  | `/${Lowercase<string>}/${Lowercase<T>}`;

interface HeaderMenuConfigBase<T extends string> {
  id: number;
  name: Lowercase<T>;
  title: string;
  icon?: string;
}

export type HeaderMenuConfigWithRoute<T extends string> = HeaderMenuConfigBase<T> & {
  route: [ViewConfigRoute<T>];
};

export type HeaderMenuConfigWithAction<T extends string> = HeaderMenuConfigBase<T> & {
  action: () => void;
};

export type HeaderMenuConfig<T extends string> = HeaderMenuConfigBase<T> & {
  route?: [ViewConfigRoute<T>];
  action?: () => void;
};

export type CoreCmsLayoutHeaderWidget = {
  id: number;
  component: () => Promise<Type<unknown>>;
  inputs?: Record<string, unknown>;
};

/**
 * A header content elements configuration for CMS layouts.
 */
export interface CoreCmsLayoutHeaderConfig {
  showToggleMenuButton: boolean;
  sidenavPosition?: LayoutPosition;
  title: string;
  extendedTitle?: string;
  mainIcon?: SvgIconConfig;
  widgetsConfig?: {
    position: LayoutPosition;
    widgets: CoreCmsLayoutHeaderWidget[];
  };
  menu?: {
    label?: Signal<string>;
    position: LayoutPosition;
    config: HeaderMenuConfig<string>[];
  };
}

export const CORE_CMS_LAYOUT_HEADER_CONFIG = new InjectionToken<CoreCmsLayoutHeaderConfig>(
  'CORE_CMS_LAYOUT_HEADER_CONFIG'
);
