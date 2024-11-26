import { Route } from '@angular/router';
import { AUTH_FORM_FACADE, AUTH_SERVICE, AuthFeatureComponent } from '@plastik/auth';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { FORM_TOKEN } from '@plastik/core/entities';
import { RegisterFacadeService } from './register-facade.service';
import { registerFormConfig } from './register-form.config';

export const authRegisterFeatureRoutes: Route[] = [
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
        useClass: RegisterFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useFactory: registerFormConfig,
      },
    ],
  },
];
