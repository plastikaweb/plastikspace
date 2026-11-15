import { Route } from '@angular/router';
import { loginFormConfig } from '@plastik/auth/config/util';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { FORM_TOKEN } from '@plastik/core/entities';
import { ecoAdminAnonymousGuard } from '@plastik/eco-admin/auth/data-access';
import { providePasswordWithVisibilityFormly } from '@plastik/shared/form/password';
import { provideFormlyAddons, providePlainInputFormly } from '@plastik/shared/form/util';

import { EcoAdminAuthLoginFacadeService } from './eco-admin-auth-login-facade.service';
import { EcoAdminAuthLoginComponent } from './eco-admin-auth-login.component';

/**
 * The login screen, laid out like `ecoStoreAuthLoginRoutes`: the route says its title and its guard
 * and provides the facade, the form and the Formly pieces the form is built from. Load it with
 * `loadChildren`, so that all of it travels in the chunk of this screen and not in the main bundle.
 *
 * The form is the one every app shares, with no option of its own: the fields of this screen and
 * those of the storefront login are the same.
 */
export const ecoAdminAuthLoginRoutes: Route[] = [
  {
    path: '',
    title: 'auth.login.title',
    component: EcoAdminAuthLoginComponent,
    canActivate: [ecoAdminAnonymousGuard],
    providers: [
      {
        provide: AUTH_FORM_FACADE,
        useClass: EcoAdminAuthLoginFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useFactory: loginFormConfig,
      },
      providePlainInputFormly(),
      providePasswordWithVisibilityFormly(),
      // The leading icons of the shared login form.
      provideFormlyAddons(),
    ],
  },
];
