import { Route } from '@angular/router';
import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import { withFormlyFormField } from '@ngx-formly/material/form-field';
import { withFormlyFieldInput } from '@ngx-formly/material/input';
import { TranslateService } from '@ngx-translate/core';
import { providePasswordWithVisibilityFormly } from '@plastik/shared/form/password';
import {
  registerFormFieldTranslateExtension,
  registerValidatorsTranslateExtension,
} from '@plastik/shared/form/util';
import { registerAccessSecurityValidatorsTranslateExtension } from './access-security-validators-translate';
import { EcoStoreProfileAccessSecurityFeatureComponent } from './eco-store-profile-access-security-feature/eco-store-profile-access-security-feature.component';

export const ecoStoreProfileAccessSecurityFeatureRoutes: Route[] = [
  {
    path: '',
    data: { hasSidenav: true, title: 'profile.accessSecurity.title', icon: 'security' },
    // Formly core must be provided in the same injector as the FORMLY_CONFIG entries —
    // a config-only child injector yields a FormlyConfig without the core extension
    // ("missing forRoot()" at runtime). Mirrors profile/addresses' `nova` route.
    providers: [
      provideFormlyCore([withFormlyFormField(), withFormlyFieldInput()]),
      providePasswordWithVisibilityFormly(),
      {
        provide: FORMLY_CONFIG,
        multi: true,
        useFactory: registerFormFieldTranslateExtension,
        deps: [TranslateService],
      },
      {
        provide: FORMLY_CONFIG,
        multi: true,
        useFactory: registerValidatorsTranslateExtension,
        deps: [TranslateService],
      },
      {
        provide: FORMLY_CONFIG,
        multi: true,
        useFactory: registerAccessSecurityValidatorsTranslateExtension,
        deps: [TranslateService],
      },
    ],
    component: EcoStoreProfileAccessSecurityFeatureComponent,
  },
];
