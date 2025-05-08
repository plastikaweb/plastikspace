/* eslint-disable jsdoc/require-jsdoc */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormConfig } from '@plastik/core/entities';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { AddonConfig } from '@plastik/shared/form/util';

const getProfileFeatureFormConfig: FormlyFieldConfig[] = [
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
          addonLeft: {
            icon: 'person',
            aria: 'person',
            type: 'icon',
          } as AddonConfig,
          addonRight: {
            text: 'cancel',
            aria: 'empty value',
            type: 'text',
          } as AddonConfig,
          attributes: {
            autocomplete: 'off',
          },
        },
      },
      // {
      //   key: 'email',
      //   type: 'input',
      //   props: {
      //     type: 'email',
      //     label: 'Adreça electrònica',
      //     placeholder: 'Adreça electrònica',
      //     required: true,
      //     addonLeft: {
      //       icon: 'email',
      //       aria: 'email',
      //     },
      //     attributes: {
      //       autocomplete: 'off',
      //     },
      //   },
      //   validators: {
      //     validation: [Validators.email],
      //   },
      // },
      {
        key: 'address',
        type: 'input',
        className: 'w-full',
        props: {
          type: 'text',
          label: "Adreça d'entrega",
          placeholder: "Adreça d'entrega",
          required: false,
          maxLength: 256,
          minLength: 5,
          hintEnd:
            "Aquesta serà l'adreça d'entrega de les comandes per defecte, al fer una comanda pots sobreescriure-la",
          addonLeft: {
            icon: 'home',
            aria: 'home',
            type: 'icon',
          } as AddonConfig,
          attributes: {
            autocomplete: 'off',
          },
        },
      },
      {
        key: 'phone',
        type: 'input',
        className: 'w-full',
        props: {
          type: 'tel',
          label: 'Telèfon',
          placeholder: 'Telèfon',
          required: false,
          addonLeft: {
            icon: 'phone',
            aria: 'phone',
            type: 'icon',
          } as AddonConfig,
          attributes: {
            autocomplete: 'off',
          },
        },
        validators: {
          validation: ['phone'],
        },
      },
    ],
  },
];

export function profileFeatureFormConfig(): FormConfig<LlecoopUser> {
  return {
    getConfig: () => getProfileFeatureFormConfig,
    getSubmitFormConfig: () => ({
      label: 'Desar perfil',
      disableOnSubmit: false,
    }),
  };
}
