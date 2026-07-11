import { ConfigOption } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * @description Register auth-specific validator translation messages for Formly.
 * Use alongside `registerValidatorsTranslateExtension` in routes that use password fields.
 * Requires `@ngx-translate` (eco-store). For LOCALE_ID-based apps (llecoop), use `registerValidatorsMessageExtension` instead.
 * @param {TranslateService} translate TranslateService instance.
 * @returns {ConfigOption} ConfigOption with auth validation messages.
 */
export function registerAuthValidatorsTranslateExtension(
  translate: TranslateService
): ConfigOption {
  return {
    validationMessages: [
      {
        name: 'username',
        message() {
          return translate.stream('common.form.error.invalid-username');
        },
      },
      {
        name: 'password',
        message() {
          return translate.stream(`auth.resetPassword.passwordError`);
        },
      },
      {
        name: 'passwordMatch',
        message() {
          return translate.stream(`auth.resetPassword.passwordMatchError`);
        },
      },
    ],
  };
}
