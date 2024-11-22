import { Route } from '@angular/router';
import { AUTH_FORM_FACADE, AUTH_SERVICE, AuthFeatureComponent } from '@plastik/auth';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { FORM_TOKEN } from '@plastik/core/entities';
import { LoginFacadeService } from './login-facade.service';
import { loginFormConfig } from './login-form.config';

export const authLoginFeatureRoutes: Route[] = [
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
    ],
  },
];
