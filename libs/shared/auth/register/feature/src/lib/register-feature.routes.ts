import { Route } from '@angular/router';
import { AUTH_FACADE, AUTH_FORM_FACADE, AuthFeatureComponent } from '@plastik/auth';
import { getRegisterFormConfig } from './register-form.config';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { RegisterFacadeService } from './register-facade.service';
import { FORM_TOKEN } from '@plastik/core/entities';

export const authRegisterFeatureRoutes: Route[] = [
  {
    path: '',
    component: AuthFeatureComponent,
    providers: [
      {
        provide: AUTH_FACADE,
        useClass: FirebaseAuthService,
      },
      {
        provide: AUTH_FORM_FACADE,
        useClass: RegisterFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useValue: getRegisterFormConfig(),
      },
    ],
    runGuardsAndResolvers: 'always',
  },
];
