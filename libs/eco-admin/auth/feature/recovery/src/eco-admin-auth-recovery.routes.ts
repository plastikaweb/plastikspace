import { Route } from '@angular/router';
import { requestPasswordFormConfig, resetPasswordFormConfig } from '@plastik/auth/config/util';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import {
  PocketBaseRequestPasswordFacadeService,
  PocketBaseResetPasswordFacadeService,
} from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN } from '@plastik/core/entities';
import { ecoAdminAnonymousGuard } from '@plastik/eco-admin/auth/data-access';
import { providePasswordWithVisibilityFormly } from '@plastik/shared/form/password';
import { provideFormlyAddons, providePlainInputFormly } from '@plastik/shared/form/util';

import { EcoAdminAuthForgotPasswordSentComponent } from './eco-admin-auth-forgot-password-sent.component';
import { EcoAdminAuthForgotPasswordComponent } from './eco-admin-auth-forgot-password.component';
import { EcoAdminAuthResetPasswordComponent } from './eco-admin-auth-reset-password.component';

/**
 * The screen that asks for the email, laid out like `ecoStoreAuthForgotPasswordRoutes`. The facade
 * and the form are the shared ones, with no option of their own: this app adds nothing to them.
 * Mount it at `/recuperar-contrasenya`, where the login screen and the "expired link" notice point.
 */
export const ecoAdminAuthForgotPasswordRoutes: Route[] = [
  {
    path: '',
    title: 'auth.forgotPassword.title',
    component: EcoAdminAuthForgotPasswordComponent,
    canActivate: [ecoAdminAnonymousGuard],
    providers: [
      {
        provide: AUTH_FORM_FACADE,
        useClass: PocketBaseRequestPasswordFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useFactory: requestPasswordFormConfig,
      },
      providePlainInputFormly(),
      // The leading icon of the shared form.
      provideFormlyAddons(),
    ],
  },
];

/**
 * The screen that says the email is on its way. Mount it at `/recuperar-contrasenya-enviada`, where
 * the shared facade goes after every request (`POCKETBASE_REQUEST_PASSWORD_SENT_URL`).
 */
export const ecoAdminAuthForgotPasswordSentRoutes: Route[] = [
  {
    path: '',
    title: 'auth.forgotPasswordSent.title',
    component: EcoAdminAuthForgotPasswordSentComponent,
    canActivate: [ecoAdminAnonymousGuard],
  },
];

/**
 * The screen that sets the new password, laid out like `ecoStoreAuthFeatureResetPasswordRoutes`.
 * Mount it at `/restablir-contrasenya`: the link of the email carries the token as `?token=`.
 */
export const ecoAdminAuthResetPasswordRoutes: Route[] = [
  {
    path: '',
    title: 'auth.resetPassword.title',
    component: EcoAdminAuthResetPasswordComponent,
    canActivate: [ecoAdminAnonymousGuard],
    providers: [
      {
        provide: AUTH_FORM_FACADE,
        useClass: PocketBaseResetPasswordFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useFactory: resetPasswordFormConfig,
      },
      providePlainInputFormly(),
      providePasswordWithVisibilityFormly(),
      // The leading icons of the shared form.
      provideFormlyAddons(),
    ],
  },
];
