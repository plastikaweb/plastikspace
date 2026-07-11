import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';

import { SharedFormUiSelectWithIconsComponent } from './shared-form-ui-select-with-icons.component';

@NgModule({
  imports: [
    FormlyModule.forChild({
      types: [
        {
          name: 'select-with-icons',
          component: SharedFormUiSelectWithIconsComponent,
        },
      ],
    }),
  ],
})
export class SelectWithIconsFormlyModule {}
