import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ResolveFn, Route } from '@angular/router';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { filter, map, take } from 'rxjs';

import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import { withFormlyFieldCheckbox } from '@ngx-formly/material/checkbox';
import { withFormlyFormField } from '@ngx-formly/material/form-field';
import { withFormlyFieldInput } from '@ngx-formly/material/input';
import { TranslateService } from '@ngx-translate/core';
import {
  registerFormFieldGroupTranslateExtension,
  registerFormFieldTranslateExtension,
  registerValidatorsTranslateExtension,
} from '@plastik/shared/form/util';
import { ecoStoreProfileAddressesCanDeactivateGuard } from './eco-store-profile-addresses-can-deactivate.guard';
import { EcoStoreProfileAddressesFeatureComponent } from './eco-store-profile-addresses-feature/eco-store-profile-addresses-feature.component';

const profileAddressesResolver: ResolveFn<boolean> = () => {
  const profileStore = inject(pocketBaseUserProfileStore);
  if (!profileStore.addressesLoaded()) {
    profileStore.getUserAddresses();
  }

  return toObservable(profileStore.addressesLoaded).pipe(
    filter(Boolean),
    take(1),
    map(() => true)
  );
};

export const ecoStoreProfileAddressesFeatureRoutes: Route[] = [
  {
    path: '',
    component: EcoStoreProfileAddressesFeatureComponent,
    resolve: { addressesLoaded: profileAddressesResolver },
  },
  {
    path: 'nova',
    component: EcoStoreProfileAddressesFeatureComponent,
    providers: [
      provideFormlyCore([withFormlyFormField(), withFormlyFieldInput(), withFormlyFieldCheckbox()]),
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
        useFactory: registerFormFieldGroupTranslateExtension,
        deps: [TranslateService],
      },
    ],
    resolve: { addressesLoaded: profileAddressesResolver },
    canDeactivate: [ecoStoreProfileAddressesCanDeactivateGuard],
  },
  {
    path: ':id',
    component: EcoStoreProfileAddressesFeatureComponent,
    providers: [provideFormlyCore([withFormlyFormField(), withFormlyFieldInput()])],
    resolve: { addressesLoaded: profileAddressesResolver },
    canDeactivate: [ecoStoreProfileAddressesCanDeactivateGuard],
  },
];
