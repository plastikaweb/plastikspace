import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { Route } from '@angular/router';
import { EcoStoreAuthLoginComponent } from './login/eco-store-auth-login.component';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { loginFormConfig } from '@plastik/auth/config/util';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { pocketBaseIsNotLoggedGuard } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN } from '@plastik/core/entities';
import { providePasswordWithVisibilityFormly } from '@plastik/shared/form/password';
import { providePlainInputFormly } from '@plastik/shared/form/util';
import { EcoStoreAuthLoginFacadeService } from './login/eco-store-auth-login-facade.service';

export const ecoStoreAuthLoginRoutes: Route[] = [
  {
    path: '',
    title: 'auth.login.title',
    component: EcoStoreAuthLoginComponent,
    canActivate: [pocketBaseIsNotLoggedGuard],
    providers: [
      {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: { appearance: 'outline' },
      },
      {
        provide: AUTH_FORM_FACADE,
        useClass: EcoStoreAuthLoginFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useFactory: loginFormConfig,
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
