import { Observable } from 'rxjs';

import { InjectionToken, Signal } from '@angular/core';

export interface AuthFacade {
  loggedIn: Signal<boolean>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Observable<unknown> | Promise<unknown>;
  requestPassword: (email: string) => Observable<unknown> | Promise<unknown>;
  login: (email: string, password: string) => Observable<unknown> | Promise<unknown>;
  logout: () => Observable<void> | Promise<void> | void;
}

export const AUTH_SERVICE = new InjectionToken<AuthFacade>('AUTH_SERVICE');
