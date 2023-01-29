import { InjectionToken } from '@angular/core';
import { SvgIconConfig } from '@plastik/shared/entities';

export interface CoreCmsLayoutHeaderConfig {
  showToggleMenuButton: boolean;
  mainTitle: string;
  mainIcon?: SvgIconConfig;
}

export const CORE_CMS_LAYOUT_HEADER_CONFIG = new InjectionToken<CoreCmsLayoutHeaderConfig>('CORE_CMS_LAYOUT_HEADER_CONFIG');
