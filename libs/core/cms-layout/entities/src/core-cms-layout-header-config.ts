import { InjectionToken, Signal } from '@angular/core';
import { ButtonConfig } from '@plastik/shared/button';
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

/**
 * A header content elements configuration for CMS layouts.
 */
export interface CoreCmsLayoutHeaderConfig {
  showToggleMenuButton: boolean;
  sidenavPosition?: LayoutPosition;
  title: string;
  extendedTitle?: string;
  mainIcon?: SvgIconConfig;
  headerActions?: {
    position: LayoutPosition;
    config: ButtonConfig[];
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
