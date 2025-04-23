import { FormlyFieldProps } from '@ngx-formly/core';

export interface DatepickerProps extends FormlyFieldProps {
  dataTest?: string;
  touchUi?: boolean;
  disabled: boolean;
  min?: number;
  max?: number;
  startView?: 'multi-year' | 'year';
}
