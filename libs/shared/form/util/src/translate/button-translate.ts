import { ConfigOption, FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * @description Button translate extension for Formly.
 * Translates button labels when props.translate is true.
 */
class ButtonTranslateExtension implements FormlyExtension {
  constructor(private readonly translateService: TranslateService) {}

  prePopulate(field: FormlyFieldConfig): void {
    if (field.type !== 'button') {
      return;
    }

    const props = field.props || {};
    if (!props['translate']) {
      return;
    }

    field.expressions = {
      ...(field.expressions || {}),
      ...(props['buttonLabel'] && {
        'props.buttonLabel': this.translateService.stream(props['buttonLabel'], {
          value: props['buttonLabelPlaceholder'] || '',
        }),
      }),
    };
  }
}

/**
 * @description Register button translate extension for Formly.
 * @param { TranslateService } translate TranslateService instance.
 * @returns { ConfigOption } ConfigOption.
 */
export function registerButtonTranslateExtension(translate: TranslateService): ConfigOption {
  return {
    extensions: [
      {
        name: 'translate-button',
        extension: new ButtonTranslateExtension(translate),
      },
    ],
  };
}
