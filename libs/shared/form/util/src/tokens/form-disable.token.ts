import { InjectionToken, signal, Signal } from '@angular/core';

export const FORM_DISABLE_TOKEN = new InjectionToken<Signal<boolean>>('FORM_DISABLE_TOKEN', {
  providedIn: 'root',
  factory: () => signal(false),
});
