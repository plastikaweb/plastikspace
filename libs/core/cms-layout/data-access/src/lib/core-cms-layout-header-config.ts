import { InjectionToken } from '@angular/core';
import { ButtonConfig } from '@plastik/shared/button';
import { LayoutPosition, SvgIconConfig } from '@plastik/shared/entities';

/**
 * A header content elements configuration for CMS layouts.
 */
export interface CoreCmsLayoutHeaderConfig {
  showToggleMenuButton: boolean;
  title: string;
  extendedTitle?: string;
  mainIcon?: SvgIconConfig;
  socialLinks?: {
    position: LayoutPosition;
    config: ButtonConfig[];
  };
}

export const CORE_CMS_LAYOUT_HEADER_CONFIG = new InjectionToken<CoreCmsLayoutHeaderConfig>('CORE_CMS_LAYOUT_HEADER_CONFIG');
