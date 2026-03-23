import { ConfigOption, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * @description Register validators translate extension for Formly.
 * @param { TranslateService } translate TranslateService instance.
 * @returns { ConfigOption } ConfigOption.
 */
export function registerValidatorsTranslateExtension(translate: TranslateService): ConfigOption {
  return {
    validationMessages: [
      {
        name: 'required',
        message() {
          return translate.stream('common.form.error.required');
        },
      },
      {
        name: 'email',
        message() {
          return translate.stream('common.form.error.email');
        },
      },
      {
        name: 'minLength',
        message(_: string, config: FormlyFieldConfig) {
          return translate.stream('common.form.error.minLength', {
            value: config.props?.minLength,
          });
        },
      },
      {
        name: 'maxLength',
        message(_: string, config: FormlyFieldConfig) {
          return translate.stream('common.form.error.maxLength', {
            value: config.props?.maxLength,
          });
        },
      },
      {
        name: 'min',
        message(_: string, config: FormlyFieldConfig) {
          return translate.stream('common.form.error.min', { value: config.props?.min });
        },
      },
      {
        name: 'max',
        message(_: string, config: FormlyFieldConfig) {
          return translate.stream('common.form.error.max', { value: config.props?.max });
        },
      },
      {
        name: 'url',
        message() {
          return translate.stream('common.form.error.url');
        },
      },
      {
        name: 'phone',
        message() {
          return translate.stream('common.form.error.phone');
        },
      },
      {
        name: 'username',
        message() {
          return translate.stream('common.form.error.invalid-username');
        },
      },
    ],
  };
}
