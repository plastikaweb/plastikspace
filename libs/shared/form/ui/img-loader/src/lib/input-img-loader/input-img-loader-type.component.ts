import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FieldType } from '@ngx-formly/material/form-field';

import { InputImgLoaderProps } from './input-img-loader-props';
import { InputImgLoaderComponent } from './input-img-loader.component';

@Component({
  selector: 'plastik-input-img-loader-type',
  standalone: true,
  templateUrl: './input-img-loader-type.component.html',
  imports: [
    ReactiveFormsModule,
    FormlyMaterialModule,
    MatInputModule,
    FormlyModule,
    InputImgLoaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputImgLoaderTypeComponent extends FieldType<
  FieldTypeConfig<Partial<InputImgLoaderProps>>
> {
  protected readonly maxSize = 1 * 1024 * 1024;
  protected readonly minHeight = 1024;
  protected readonly minWidth = 1024;
}
