import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { Route } from '@angular/router';
import { requestPasswordFormConfig } from '@plastik/auth/config/util';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { pocketBaseIsNotLoggedGuard } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN } from '@plastik/core/entities';
import { providePlainInputFormly } from '@plastik/shared/form/util';
import { EcoStoreAuthForgotPasswordFacadeService } from './forgot-password/eco-store-auth-forgot-password-facade.service';
import { EcoStoreAuthForgotPasswordComponent } from './forgot-password/eco-store-auth-forgot-password.component';

export const ecoStoreAuthForgotPasswordRoutes: Route[] = [
  {
    path: '',
    title: 'auth.forgotPassword.title',
    component: EcoStoreAuthForgotPasswordComponent,
    canActivate: [pocketBaseIsNotLoggedGuard],
    providers: [
      {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: { appearance: 'outline' },
      },
      {
        provide: AUTH_FORM_FACADE,
        useClass: EcoStoreAuthForgotPasswordFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useFactory: requestPasswordFormConfig,
      },
      {
        provide: MAT_ICON_DEFAULT_OPTIONS,
        useValue: { fontSet: 'material-symbols-outlined' },
      },
      providePlainInputFormly(),
    ],
  },
];
