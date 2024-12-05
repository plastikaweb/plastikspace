import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { addonsExtension, FormlyAddonsWrapperComponent } from '@plastik/shared/form/util';
import { TextareaWithCounterTypeComponent } from './textarea-with-counter-type.component';

@NgModule({
  imports: [
    FormlyModule.forChild({
      types: [
        {
          name: 'textarea-with-counter',
          component: TextareaWithCounterTypeComponent,
        },
      ],
      extensions: [{ name: 'addons', extension: { onPopulate: addonsExtension } }],
      wrappers: [
        {
          name: 'addons',
          component: FormlyAddonsWrapperComponent,
        },
      ],
    }),
  ],
})
export class TextAreaWithCounterFormlyModule {}
