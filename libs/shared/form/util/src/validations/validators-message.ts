import { inject, LOCALE_ID } from '@angular/core';
import { ConfigOption, FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Registers translation extensions for form validators.
 * @returns {ConfigOption} The configuration options for validation messages.
 */
export function registerValidatorsMessageExtension(): ConfigOption {
  const locale = inject(LOCALE_ID);

  return {
    validationMessages: [
      {
        name: 'required',
        message() {
          switch (locale) {
            case 'ca-ES':
              return 'camp obligatori';
            case 'es-ES':
              return 'campo obligatorio';
            default:
              return 'required field';
          }
        },
      },
      {
        name: 'email',
        message() {
          switch (locale) {
            case 'ca-ES':
              return 'email no vàlid';
            case 'es-ES':
              return 'email no válido';
            default:
              return 'invalid email';
          }
        },
      },
      {
        name: 'minLength',
        message(_: string, config: FormlyFieldConfig) {
          switch (locale) {
            case 'ca-ES':
              return `mínim ${config.props?.minLength} caràcters`;
            case 'es-ES':
              return `mínimo ${config.props?.minLength} caracteres`;
            default:
              return `minimum ${config.props?.minLength} characters`;
          }
        },
      },
      {
        name: 'maxLength',
        message(_: string, config: FormlyFieldConfig) {
          switch (locale) {
            case 'ca-ES':
              return `màxim ${config.props?.maxLength} caràcters`;
            case 'es-ES':
              return `máximo ${config.props?.maxLength} caracteres`;
            default:
              return `maximum ${config.props?.maxLength} characters`;
          }
        },
      },
      {
        name: 'min',
        message(_: string, config: FormlyFieldConfig) {
          switch (locale) {
            case 'ca-ES':
              return `valor mínim ${config.props?.min}`;
            case 'es-ES':
              return `valor mínimo ${config.props?.min}`;
            default:
              return `minimum value ${config.props?.min}`;
          }
        },
      },
      {
        name: 'max',
        message(_: string, config: FormlyFieldConfig) {
          switch (locale) {
            case 'ca-ES':
              return `valor màxim ${config.props?.max}`;
            case 'es-ES':
              return `valor máximo ${config.props?.max}`;
            default:
              return `maximum value ${config.props?.max}`;
          }
        },
      },
      {
        name: 'url',
        message() {
          switch (locale) {
            case 'ca-ES':
              return `URL no vàlida`;
            case 'es-ES':
              return `URL no válida`;
            default:
              return `invalid URL`;
          }
        },
      },
    ],
  };
}
