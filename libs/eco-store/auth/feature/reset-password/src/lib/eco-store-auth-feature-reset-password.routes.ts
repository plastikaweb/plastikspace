import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { Route } from '@angular/router';
import { resetPasswordFormConfig } from '@plastik/auth/config/util';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { pocketBaseIsNotLoggedGuard } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN } from '@plastik/core/entities';
import { providePasswordWithVisibilityFormly } from '@plastik/shared/form/password';
import { providePlainInputFormly } from '@plastik/shared/form/util';
import { EcoStoreAuthResetPasswordFacadeService } from './reset-password/eco-store-auth-reset-password-facade.service';
import { EcoStoreAuthResetPasswordComponent } from './reset-password/eco-store-auth-reset-password.component';

export const ecoStoreAuthFeatureResetPasswordRoutes: Route[] = [
  {
    path: '',
    title: 'auth.resetPassword.title',
    component: EcoStoreAuthResetPasswordComponent,
    canActivate: [pocketBaseIsNotLoggedGuard],
    providers: [
      {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: { appearance: 'outline' },
      },
      {
        provide: AUTH_FORM_FACADE,
        useClass: EcoStoreAuthResetPasswordFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useFactory: resetPasswordFormConfig,
      },
      {
        provide: MAT_ICON_DEFAULT_OPTIONS,
        useValue: { fontSet: 'material-symbols-outlined' },
      },
      providePlainInputFormly(),
      providePasswordWithVisibilityFormly(),
    ],
  },
];
