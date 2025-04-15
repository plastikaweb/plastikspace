import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';

import { InputImgLoaderTypeComponent } from './input-img-loader-type.component';

@NgModule({
  imports: [
    FormlyModule.forChild({
      types: [
        {
          name: 'img-loader',
          component: InputImgLoaderTypeComponent,
        },
      ],
    }),
  ],
})
export class ImgLoaderFormlyModule {}
