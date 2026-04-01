import { Route } from '@angular/router';
import { AUTH_FORM_FACADE, AUTH_SERVICE } from '@plastik/auth/entities';
import { AuthFeatureComponent } from '@plastik/auth/feature';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { loginFormConfig } from '@plastik/auth/config/util';
import { FORM_TOKEN } from '@plastik/core/entities';
import { providePasswordWithVisibilityFormly } from '@plastik/shared/form/password';
import { LoginFacadeService } from './login-facade.service';

export const firebaseAuthLoginFeatureRoutes: Route[] = [
  {
    path: '',
    component: AuthFeatureComponent,
    providers: [
      {
        provide: AUTH_SERVICE,
        useClass: FirebaseAuthService,
      },
      {
        provide: AUTH_FORM_FACADE,
        useClass: LoginFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useFactory: loginFormConfig,
      },
      providePasswordWithVisibilityFormly(),
    ],
  },
];
