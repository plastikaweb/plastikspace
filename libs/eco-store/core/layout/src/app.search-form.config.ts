import { FormConfig } from '@plastik/core/entities';

/**
 * @description Main Site Search form configuration.
 * @returns {FormConfig<{ query: string }>} Search form configuration.
 */
export function appSearchFormConfig(): FormConfig<{ query: string }> {
  const searchConfig = [
    {
      fieldGroupClassName: 'input--eco',
      fieldGroup: [
        {
          key: 'query',
          type: 'input-search',
          props: {
            label: 'store.search.label',
            placeholder: 'store.search.placeholder',
            noButton: true,
            resetSearch: true,
            translate: true,
            maxLength: 17,
            buttonEnabledIfValue: true,
            attributes: {
              autocomplete: 'off',
            },
          },
          modelOptions: {
            updateOn: 'change' as const,
          },
        },
      ],
    },
  ];

  return {
    getConfig: () => searchConfig,
    getSubmitFormConfig: () => ({
      submitAvailable: false,
      disableOnSubmit: false,
      label: 'store.search.submit',
      buttonStyle: 'hidden!',
    }),
  };
}
