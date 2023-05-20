import { InjectionToken } from '@angular/core';
import { ViewConfig } from '@plastik/core/entities';

export const VIEW_CONFIG = new InjectionToken<ViewConfig<string>[]>('VIEW_CONFIG');
