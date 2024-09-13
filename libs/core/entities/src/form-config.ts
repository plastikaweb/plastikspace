import { InjectionToken, Signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';

export interface FormConfig<T> {
  getConfig: (editMode?: boolean, extra?: unknown) => FormlyFieldConfig[];
  getExtraActions?: (model: T, editMode?: boolean) => ExtraFormAction<T>[];
  executeAction?: (extraFormAction: ExtraFormAction<T>, element$: Observable<T>) => void;
  getExtraSubmitActions?: (editMode: boolean) => ExtraSubmitFormAction<T>[];
  getSubmitFormConfig?: (editMode?: boolean) => SubmitFormConfig;
}

export const FORM_TOKEN = new InjectionToken<Signal<FormConfig<unknown>>>('FORM_TOKEN');

export interface ExtraFormAction<T> {
  label: string;
  actionName: string;
  classes?: [string, string];
  action: (model: T) => void;
}

export type ExtraSubmitFormAction<T> = Omit<ExtraFormAction<T>, 'label' | 'classes'>;

export interface SubmitFormConfig {
  label?: string;
  disabled?: boolean;
  enabledByDefault?: boolean;
  buttonStyle?: string;
  resetOnSubmit?: boolean;
  compareCommonKeysOnly?: boolean;
  ignoredKeysWhileComparing?: string[];
}
