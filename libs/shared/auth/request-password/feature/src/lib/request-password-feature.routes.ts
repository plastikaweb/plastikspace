import { Route } from '@angular/router';
import { AUTH_FACADE, AUTH_FORM_FACADE, AuthFeatureComponent } from '@plastik/auth';
import { getRequestPasswordFormConfig } from './request-password-form.config';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { RequestPasswordFacadeService } from './request-password-facade.service';
import { FORM_TOKEN } from '@plastik/core/entities';

export const authRequestPasswordRoutes: Route[] = [
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
        useClass: RequestPasswordFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useValue: getRequestPasswordFormConfig(),
      },
    ],
    runGuardsAndResolvers: 'always',
  },
];
