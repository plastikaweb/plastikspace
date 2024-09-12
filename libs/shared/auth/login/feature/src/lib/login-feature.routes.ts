import { Route } from '@angular/router';
import { AUTH_FACADE, AUTH_FORM_FACADE, AuthFeatureComponent } from '@plastik/auth';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { FORM_TOKEN } from '@plastik/core/entities';
import { LoginFacadeService } from './login-facade.service';
import { getLoginFormConfig } from './login-form.config';

export const authLoginFeatureRoutes: Route[] = [
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
        useClass: LoginFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useValue: getLoginFormConfig(),
      },
    ],
    runGuardsAndResolvers: 'always',
  },
];
