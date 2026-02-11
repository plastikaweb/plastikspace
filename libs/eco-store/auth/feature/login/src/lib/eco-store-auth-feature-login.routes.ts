import { importProvidersFrom } from '@angular/core';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { Route } from '@angular/router';
import { EcoStoreFormlyModule } from '@plastik/eco-store/formly';
import { EcoStoreAuthLoginComponent } from './eco-store-auth-login/eco-store-auth-login.component';

import { IMAGE_LOADER } from '@angular/common';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { loginFormConfig } from '@plastik/auth/login';
import { pocketBaseIsNotLoggedGuard } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN } from '@plastik/core/entities';
import { getEnvironment } from '@plastik/core/environments';
import { pocketBaseStorageLoader } from '@plastik/storage/data-access';
import { EcoStoreAuthLoginFacadeService } from './eco-store-auth-login/eco-store-auth-login-facade.service';

export const ecoStoreAuthLoginRoutes: Route[] = [
  {
    path: '',
    component: EcoStoreAuthLoginComponent,
    canActivate: [pocketBaseIsNotLoggedGuard],
    providers: [
      {
        provide: IMAGE_LOADER,
        useFactory: () => pocketBaseStorageLoader(getEnvironment().baseApiUrl),
      },
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
      importProvidersFrom(EcoStoreFormlyModule),
    ],
  },
];
