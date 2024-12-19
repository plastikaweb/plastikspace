import { InjectionToken, Signal } from '@angular/core';
import { ViewConfig } from '@plastik/core/entities';

export const VIEW_CONFIG = new InjectionToken<Signal<ViewConfig<string>[]>>('VIEW_CONFIG');
