import { ConfigOption } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * @description Register the access-security validator translation messages for Formly.
 * Complements the common messages from `registerValidatorsTranslateExtension`
 * (provided by `providePlainInputFormly()` on the parent route).
 * @param {TranslateService} translate TranslateService instance.
 * @returns {ConfigOption} ConfigOption with the access-security validation messages.
 */
export function registerAccessSecurityValidatorsTranslateExtension(
  translate: TranslateService
): ConfigOption {
  return {
    validationMessages: [
      {
        name: 'notCurrent',
        message() {
          return translate.stream('profile.accessSecurity.error.sameEmail');
        },
      },
    ],
  };
}
