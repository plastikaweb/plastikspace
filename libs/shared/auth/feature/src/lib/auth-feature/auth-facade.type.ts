import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuthFacade {
  login(email: string, password: string): Observable<unknown>;
}

export const AUTH_FACADE = new InjectionToken<AuthFacade>('AUTH_FACADE');
