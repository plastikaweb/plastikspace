import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { Route } from '@angular/router';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { pocketBaseIsNotLoggedGuard } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN } from '@plastik/core/entities';
import { providePasswordWithVisibilityFormly } from '@plastik/shared/form/password';
import { providePlainInputFormly } from '@plastik/shared/form/util';
import { confirmEmailChangeFormConfig } from './confirm-email-change/confirm-email-change-form.config';
import { EcoStoreAuthConfirmEmailChangeFacadeService } from './confirm-email-change/eco-store-auth-confirm-email-change-facade.service';
import { EcoStoreAuthConfirmEmailChangeComponent } from './confirm-email-change/eco-store-auth-confirm-email-change.component';

export const ecoStoreAuthFeatureConfirmEmailChangeRoutes: Route[] = [
  {
    path: '',
    title: 'auth.confirmEmailChange.title',
    component: EcoStoreAuthConfirmEmailChangeComponent,
    canActivate: [pocketBaseIsNotLoggedGuard],
    providers: [
      { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
      { provide: AUTH_FORM_FACADE, useClass: EcoStoreAuthConfirmEmailChangeFacadeService },
      { provide: FORM_TOKEN, useFactory: confirmEmailChangeFormConfig },
      { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },
      providePlainInputFormly(),
      providePasswordWithVisibilityFormly(),
    ],
  },
];
