import { InjectionToken } from '@angular/core';
import { ViewConfig } from '@plastik/core/entities';

export const CORE_CMS_LAYOUT_SIDENAV_CONFIG = new InjectionToken<ViewConfig<unknown>[]>('CORE_CMS_LAYOUT_SIDENAV_CONFIG');
