import { FormlyFieldProps } from '@ngx-formly/core';

export interface ColorPickerProps extends FormlyFieldProps {
  acceptLabel: string;
  cancelLabel: string;
  colorPalette: string[];
  hideColorPicker: boolean;
  hideTextInput: boolean;
}
