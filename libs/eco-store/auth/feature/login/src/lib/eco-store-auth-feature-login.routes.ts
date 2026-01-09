import { Route } from '@angular/router';
import { EcoStoreAuthLoginComponent } from './eco-store-auth-login/eco-store-auth-login.component';
import { importProvidersFrom } from '@angular/core';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { EcoStoreFormlyModule } from '@plastik/eco-store/formly';

import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { FORM_TOKEN } from '@plastik/core/entities';
import { loginFormConfig } from '@plastik/auth/login';
import { EcoStoreAuthLoginFacadeService } from './eco-store-auth-login/eco-store-auth-login-facade.service';
import { pocketBaseIsNotLoggedGuard } from '@plastik/auth/pocketbase/data-access';

export const ecoStoreAuthLoginRoutes: Route[] = [
  {
    path: '',
    component: EcoStoreAuthLoginComponent,
    canActivate: [pocketBaseIsNotLoggedGuard],
    providers: [
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
      importProvidersFrom(EcoStoreFormlyModule),
    ],
  },
];
