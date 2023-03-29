import { InjectionToken } from '@angular/core';
import { ViewConfig } from '@plastik/core/entities';

export const VIEW_CONFIG = new InjectionToken<ViewConfig<unknown>[]>('VIEW_CONFIG');
