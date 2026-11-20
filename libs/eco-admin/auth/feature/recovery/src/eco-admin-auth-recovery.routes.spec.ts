import { Route } from '@angular/router';
import { requestPasswordFormConfig, resetPasswordFormConfig } from '@plastik/auth/config/util';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import {
  PocketBaseRequestPasswordFacadeService,
  PocketBaseResetPasswordFacadeService,
} from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN } from '@plastik/core/entities';
import { ecoAdminAnonymousGuard } from '@plastik/eco-admin/auth/data-access';

import { EcoAdminAuthForgotPasswordSentComponent } from './eco-admin-auth-forgot-password-sent.component';
import { EcoAdminAuthForgotPasswordComponent } from './eco-admin-auth-forgot-password.component';
import {
  ecoAdminAuthForgotPasswordRoutes,
  ecoAdminAuthForgotPasswordSentRoutes,
  ecoAdminAuthResetPasswordRoutes,
} from './eco-admin-auth-recovery.routes';
import { EcoAdminAuthResetPasswordComponent } from './eco-admin-auth-reset-password.component';

/**
 * What a route provides under a token, whichever way it says it.
 * @param {Route} route The route.
 * @param {unknown} token The token.
 * @returns {unknown} The class or the factory given for the token.
 */
function provided(route: Route, token: unknown): unknown {
  const provider = (route.providers ?? []).find(
    candidate =>
      typeof candidate === 'object' && 'provide' in candidate && candidate.provide === token
  ) as { useClass?: unknown; useFactory?: unknown } | undefined;

  return provider?.useClass ?? provider?.useFactory;
}

describe('the routes that set a new password', () => {
  it('give the screen that asks for the email its title, guard, shared facade and shared form', () => {
    const [route] = ecoAdminAuthForgotPasswordRoutes;

    expect(route.title).toBe('auth.forgotPassword.title');
    expect(route.component).toBe(EcoAdminAuthForgotPasswordComponent);
    expect(route.canActivate).toEqual([ecoAdminAnonymousGuard]);
    expect(provided(route, AUTH_FORM_FACADE)).toBe(PocketBaseRequestPasswordFacadeService);
    expect(provided(route, FORM_TOKEN)).toBe(requestPasswordFormConfig);
  });

  it('give the screen that says the email is on its way its title and guard, and nothing else', () => {
    const [route] = ecoAdminAuthForgotPasswordSentRoutes;

    expect(route.title).toBe('auth.forgotPasswordSent.title');
    expect(route.component).toBe(EcoAdminAuthForgotPasswordSentComponent);
    expect(route.canActivate).toEqual([ecoAdminAnonymousGuard]);
    expect(route.providers).toBeUndefined();
  });

  it('give the screen that sets the password its title, guard, shared facade and shared form', () => {
    const [route] = ecoAdminAuthResetPasswordRoutes;

    expect(route.title).toBe('auth.resetPassword.title');
    expect(route.component).toBe(EcoAdminAuthResetPasswordComponent);
    expect(route.canActivate).toEqual([ecoAdminAnonymousGuard]);
    expect(provided(route, AUTH_FORM_FACADE)).toBe(PocketBaseResetPasswordFacadeService);
    expect(provided(route, FORM_TOKEN)).toBe(resetPasswordFormConfig);
  });
});
