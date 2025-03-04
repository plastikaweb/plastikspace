import { Observable } from 'rxjs';

import { InjectionToken } from '@angular/core';

export interface AuthFacade {
  login(email: string, password: string): Observable<unknown>;
  register(email: string, password: string, name: string): Observable<unknown>;
  requestPassword(email: string): Observable<unknown>;
}

export const AUTH_SERVICE = new InjectionToken<AuthFacade>('AUTH_SERVICE');
