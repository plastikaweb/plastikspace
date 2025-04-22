import { Signal } from '@angular/core';
import { FormlyFieldProps } from '@ngx-formly/core';

export interface InputImgLoaderProps extends FormlyFieldProps {
  title: Signal<string>;
  progress: Signal<number>;
  upload: (file: File | null, folder?: string) => Promise<void> | void;
  fileUrl: Signal<string | null>;
  maxSize?: Signal<number>;
  minHeight?: Signal<number>;
  minWidth?: Signal<number>;
  imgHeight?: Signal<number>;
  imgWidth?: Signal<number>;
  folder?: Signal<string>;
  cdnUrl?: Signal<string>;
  lcpImage?: Signal<boolean>;
}
