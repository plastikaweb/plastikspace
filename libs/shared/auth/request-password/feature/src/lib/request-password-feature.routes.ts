import { Route } from '@angular/router';
import { AUTH_FORM_FACADE, AUTH_SERVICE, AuthFeatureComponent } from '@plastik/auth';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { FORM_TOKEN } from '@plastik/core/entities';
import { RequestPasswordFacadeService } from './request-password-facade.service';
import { getRequestPasswordFormConfig } from './request-password-form.config';

export const authRequestPasswordRoutes: Route[] = [
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
        useClass: RequestPasswordFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useValue: getRequestPasswordFormConfig(),
      },
    ],
  },
];
