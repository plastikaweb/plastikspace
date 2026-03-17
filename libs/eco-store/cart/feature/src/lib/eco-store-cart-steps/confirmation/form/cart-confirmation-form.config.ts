import { inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { FormConfig } from '@plastik/core/entities';

/** Model shape for the confirmation notes form. */
export interface CartConfirmationFormModel {
  notes: string;
}

/**
 * Form configuration for the cart confirmation step.
 * Provides a single textarea-with-counter field for order notes.
 * @returns { FormConfig<CartConfirmationFormModel> } Form configuration object.
 */
export function getCartConfirmationFormConfig(): FormConfig<CartConfirmationFormModel> {
  const translateService = inject(TranslateService);

  const config: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'flex flex-col',
      fieldGroup: [
        {
          key: 'notes',
          type: 'textarea-with-counter',
          className: 'w-full',
          defaultValue: '',
          props: {
            label: translateService.instant('cart.confirmation.notes'),
            placeholder: translateService.instant('cart.confirmation.notesPlaceholder'),
            maxLength: 200,
            maxRows: 3,
            attributes: {
              autocomplete: 'off',
            },
          },
          modelOptions: {
            updateOn: 'blur',
          },
        },
      ],
    },
  ];

  return {
    getConfig: () => config,
    getSubmitFormConfig: () => ({
      visible: false,
      submitAvailable: false,
      emitOnChange: true,
      buttonStyle: 'hidden!',
    }),
  };
}
