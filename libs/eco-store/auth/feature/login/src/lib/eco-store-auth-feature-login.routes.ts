import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { Route } from '@angular/router';
import { EcoStoreAuthLoginComponent } from './eco-store-auth-login/eco-store-auth-login.component';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import { withFormlyFormField } from '@ngx-formly/material/form-field';
import { withFormlyFieldInput } from '@ngx-formly/material/input';
import { TranslateService } from '@ngx-translate/core';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { loginFormConfig } from '@plastik/auth/login';
import { pocketBaseIsNotLoggedGuard } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN } from '@plastik/core/entities';
import {
  registerFormFieldTranslateExtension,
  registerValidatorsTranslateExtension,
} from '@plastik/shared/form/util';
import { EcoStoreAuthLoginFacadeService } from './eco-store-auth-login/eco-store-auth-login-facade.service';

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
      provideFormlyCore([withFormlyFormField(), withFormlyFieldInput()]),
      {
        provide: FORMLY_CONFIG,
        multi: true,
        useFactory: registerFormFieldTranslateExtension,
        deps: [TranslateService],
      },
      {
        provide: FORMLY_CONFIG,
        multi: true,
        useFactory: registerValidatorsTranslateExtension,
        deps: [TranslateService],
      },
    ],
  },
];
