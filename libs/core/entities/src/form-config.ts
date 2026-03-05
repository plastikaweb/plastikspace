import { Observable } from 'rxjs';

import { InjectionToken } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

export interface FormConfig<T> {
  getConfig: (editMode?: boolean, extra?: unknown) => FormlyFieldConfig[];
  getExtraActions?: (model: T, editMode?: boolean) => ExtraFormAction<T>[];
  executeAction?: (extraFormAction: ExtraFormAction<T>, element$: Observable<T>) => void;
  getExtraSubmitActions?: (editMode: boolean) => ExtraSubmitFormAction<T>[];
  getSubmitFormConfig?: (editMode?: boolean) => SubmitFormConfig;
  getFormFullWidth?: boolean;
}

export const FORM_TOKEN = new InjectionToken<FormConfig<unknown>>('FORM_TOKEN');

export interface ExtraFormAction<T> {
  label: string;
  actionName: string;
  classes?: [string, string];
  action: (model: T) => void;
}

export type ExtraSubmitFormAction<T> = Omit<ExtraFormAction<T>, 'label' | 'classes'>;

export interface SubmitFormConfig {
  /** Control type. Defaults to 'button'. */
  type?: 'button' | 'icon';
  /** i18n key for the label (used by button type). */
  label?: string;
  /** Material icon name (used by icon type). */
  icon?: string;
  /** Whether the submit control is disabled. */
  disabled?: boolean;
  /** Whether it should be enabled by default. */
  enabledByDefault?: boolean;
  /** Additional CSS classes for the button. */
  buttonStyle?: string;
  /** Whether the form should be reset on submit. */
  resetOnSubmit?: boolean;
  /** Whether to emit on model change (not only on submit). */
  emitOnChange?: boolean;
  /** Whether to disable submit while submitting. */
  disableOnSubmit?: boolean;
  /** Whether the submit control is rendered. */
  submitAvailable?: boolean;
  /** Whether to compare common keys only. */
  compareCommonKeysOnly?: boolean;
  /** Keys to ignore while comparing. */
  ignoredKeysWhileComparing?: string[];
}

export interface FormSelectOption {
  label: string;
  value: string;
}
