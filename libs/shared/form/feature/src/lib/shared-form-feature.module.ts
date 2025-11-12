import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

import { SharedFormFeatureComponent } from './shared-form-feature.component';

@NgModule({
  imports: [SharedFormFeatureComponent, FormlyMaterialModule, FormlyModule],
  exports: [SharedFormFeatureComponent],
})
export class SharedFormFeatureModule {}
