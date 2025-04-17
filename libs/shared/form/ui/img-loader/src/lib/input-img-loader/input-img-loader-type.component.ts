import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldTypeConfig, FormlyFieldProps, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FieldType } from '@ngx-formly/material/form-field';

import { InputImgLoaderComponent } from './input-img-loader.component';

interface InputImgLoaderProps extends FormlyFieldProps {
  title: Signal<string>;
  progress: Signal<number>;
  upload: (file: File | null, folder?: string) => Promise<void> | void;
  fileUrl: Signal<string | null>;
  maxSize?: Signal<number>;
  folder?: Signal<string>;
  cdnUrl: Signal<string | null>;
}

@Component({
  selector: 'plastik-input-img-loader-type',
  standalone: true,
  templateUrl: './input-img-loader-type.component.html',
  imports: [ReactiveFormsModule, FormlyMaterialModule, FormlyModule, InputImgLoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputImgLoaderTypeComponent extends FieldType<
  FieldTypeConfig<Partial<InputImgLoaderProps>>
> {}
