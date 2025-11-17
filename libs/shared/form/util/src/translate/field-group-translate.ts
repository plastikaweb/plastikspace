import { ConfigOption, FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * @description Field group translate extension for Formly.
 * Translates field group titles when props.translate is true.
 */
class FieldGroupTranslateExtension implements FormlyExtension {
  constructor(private readonly translateService: TranslateService) {}

  prePopulate(field: FormlyFieldConfig): void {
    const props = field.props || {};
    if (!field.fieldGroup || !props['translate'] || props['translated']) {
      return;
    }

    props['translated'] = true;
    field.expressions = {
      ...(field.expressions || {}),
      ...(props['title'] && { 'props.title': this.translateService.stream(props['title']) }),
    };
  }
}

/**
 * @description Register field group translate extension for Formly.
 * @param { TranslateService } translate TranslateService instance.
 * @returns { ConfigOption } ConfigOption.
 */
export function registerFormFieldGroupTranslateExtension(
  translate: TranslateService
): ConfigOption {
  return {
    extensions: [
      {
        name: 'translate-field-group',
        extension: new FieldGroupTranslateExtension(translate),
      },
    ],
  };
}
