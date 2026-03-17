import { Route } from '@angular/router';
import { FORM_TOKEN } from '@plastik/core/entities';
import { AuthFeatureComponent } from '@plastik/auth/feature';
import { AUTH_SERVICE, AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { LoginFacadeService } from './login-facade.service';
import { loginFormConfig } from './login-form.config';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';

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
    ],
  },
];
