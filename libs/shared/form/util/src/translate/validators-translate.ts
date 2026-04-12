import { ConfigOption, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * @description Register common validator translation messages for Formly.
 * Requires `@ngx-translate` (eco-store). For LOCALE_ID-based apps (llecoop), use `registerValidatorsMessageExtension` instead.
 * For auth-specific validators (password, passwordMatch, username), use `registerAuthValidatorsTranslateExtension`.
 * @param {TranslateService} translate TranslateService instance.
 * @returns {ConfigOption} ConfigOption with common validation messages.
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
        name: 'zip',
        message() {
          return translate.stream('common.form.error.zip');
        },
      },
    ],
  };
}
