import { ConfigOption, FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, isObservable, map, Observable, of, switchMap } from 'rxjs';

class FieldTranslateExtension implements FormlyExtension {
  constructor(private readonly translate: TranslateService) {}

  prePopulate(field: FormlyFieldConfig) {
    const props = field.props || {};
    if (!props['translate'] || props['translated']) {
      return;
    }

    props['translated'] = true;
    field.expressions = {
      ...(field.expressions || {}),
      ...(props['label'] && { 'props.label': this.translate.stream(props['label']) }),
      ...(props['placeholder'] && {
        'props.placeholder': this.translate.stream(props['placeholder']),
      }),
      ...(props['addLabel'] && {
        'props.addLabel': this.translate.stream(props['addLabel']),
      }),
      ...(props['removeLabel'] && {
        'props.removeLabel': this.translate.stream(props['removeLabel']),
      }),
      ...(props['replaceLabel'] && {
        'props.replaceLabel': this.translate.stream(props['replaceLabel']),
      }),
      ...(props['title'] && {
        'props.title': this.translate.stream(props['title']),
      }),
      ...(props['options'] && {
        'props.options': (() => {
          const options = props.options;

          if (Array.isArray(options)) {
            const items = options as { label: string; value: unknown }[];
            return combineLatest(items.map(option => this.translate.stream(option.label))).pipe(
              map((labels: string[]) => items.map((option, i) => ({ ...option, label: labels[i] })))
            );
          }

          if (isObservable(options)) {
            return (options as Observable<{ label: string; value: unknown }[]>).pipe(
              switchMap(opts =>
                opts && opts.length
                  ? combineLatest(opts.map(o => this.translate.stream(o.label))).pipe(
                      map((labels: string[]) => opts.map((o, i) => ({ ...o, label: labels[i] })))
                    )
                  : of(opts)
              )
            );
          }
          return props.options;
        })(),
      }),
    };
  }
}

/**
 * @description Register field translate extension for Formly.
 * @param { TranslateService } translate TranslateService instance.
 * @returns { ConfigOption } ConfigOption.
 */
export function registerFormFieldTranslateExtension(translate: TranslateService): ConfigOption {
  return {
    extensions: [
      {
        name: 'translate-field',
        extension: new FieldTranslateExtension(translate),
      },
    ],
  };
}
