import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';

import { SharedFormFeatureComponent } from './shared-form-feature.component';

@NgModule({
  imports: [SharedFormFeatureComponent, FormlyModule],
  exports: [SharedFormFeatureComponent],
})
export class SharedFormFeatureModule {}
