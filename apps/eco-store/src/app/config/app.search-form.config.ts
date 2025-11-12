import { FormConfig } from '@plastik/core/entities';

/**
 * @description Main Site Search form configuration.
 * @returns {FormConfig<{ query: string }>} Search form configuration.
 */
export function appSearchFormConfig(): FormConfig<{ query: string }> {
  const searchConfig = [
    {
      fieldGroupClassName: 'w-full rounded-input--lg',
      fieldGroup: [
        {
          key: 'query',
          type: 'input-search',
          props: {
            label: 'Search products or categories',
            placeholder: 'Search products or categories',
            className: 'w-full',
            noButton: true,
            resetSearch: true,
            maxLength: 17,
            attributes: {
              autocomplete: 'off',
            },
            buttonEnabledIfValue: true,
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
    }),
  };
}
