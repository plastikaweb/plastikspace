/* eslint-disable jsdoc/require-jsdoc */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormConfig } from '@plastik/core/entities';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';

const getLlecoopCategoryDetailFormConfig: FormlyFieldConfig[] = [
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
          hideColorPicker: false,
          hideTextInput: false,
          colorPalette: [
            '#FF4500', // OrangeRed
            '#DC143C', // Crimson
            '#8B0000', // DarkRed
            '#B22222', // FireBrick
            '#FF8C00', // DarkOrange
            '#DAA520', // GoldenRod
            '#B8860B', // DarkGoldenRod
            '#808000', // Olive
            '#556B2F', // DarkOliveGreen
            '#6B8E23', // OliveDrab
            '#2E8B57', // SeaGreen
            '#008080', // Teal
            '#4682B4', // SteelBlue
            '#5F9EA0', // CadetBlue
            '#00008B', // DarkBlue
            '#4B0082', // Indigo
            '#800080', // Purple
            '#8B008B', // DarkMagenta
            '#9400D3', // DarkViolet
            '#9932CC', // DarkOrchid
            '#8A2BE2', // BlueViolet
            '#A52A2A', // Brown
            '#A0522D', // Sienna
            '#D2691E', // Chocolate
            '#8B4513', // SaddleBrown
          ],
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
      {
        key: 'productCount',
        defaultValue: 0,
      },
    ],
  },
];

export function categoryFeatureDetailFormConfig(): FormConfig<LlecoopProductCategory> {
  return {
    getConfig: () => getLlecoopCategoryDetailFormConfig,
    getSubmitFormConfig: (editMode = false) => ({
      label: editMode ? 'Desar categoria' : 'Crear categoria',
    }),
  };
}
