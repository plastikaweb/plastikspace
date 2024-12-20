import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuthFacade {
  login(email: string, password: string): Observable<unknown>;
  register(email: string, password: string): Observable<unknown>;
  requestPassword(email: string): Observable<unknown>;
}

export const AUTH_SERVICE = new InjectionToken<AuthFacade>('AUTH_SERVICE');
