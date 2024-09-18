/* eslint-disable jsdoc/require-jsdoc */
import { FormlyFieldConfig } from '@ngx-formly/core';

export function getLlecoopCategoryDetailFormConfig(): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'flex flex-row flex-wrap gap-sm',
      fieldGroup: [
        {
          key: 'name',
          type: 'input',
          className: 'w-full',
          props: {
            type: 'text',
            label: 'Nom',
            placeholder: 'Nom',
            required: true,
            maxLength: 256,
            minLength: 2,
          },
        },
        {
          key: 'color',
          type: 'color-picker',
          props: {
            label: 'Color',
            placeholder: 'Color',
            required: true,
            acceptLabel: 'Acceptar',
            cancelLabel: 'Cancel·lar',
          },
        },
        {
          key: 'description',
          type: 'textarea',
          className: 'w-full',
          props: {
            label: 'Descripció',
            placeholder: 'Descripció',
            rows: 5,
            required: false,
          },
        },
      ],
    },
  ];
}
