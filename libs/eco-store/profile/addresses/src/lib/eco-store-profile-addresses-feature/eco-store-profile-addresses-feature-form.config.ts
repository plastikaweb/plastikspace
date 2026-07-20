import { FormConfig, UserContactForm } from '@plastik/core/entities';
import { phoneValidator, zipValidator } from '@plastik/shared/form/util';

/**
 * @description Returns the Formly configuration for the profile addresses.
 * @returns {FormConfig<UserContactForm>} The profile addresses form configuration.
 */
export function ecoStoreProfileAddressesFeatureFormConfig(): FormConfig<UserContactForm> {
  const formConfig = [
    {
      fieldGroupClassName: 'flex flex-col md:flex-row md:flex-nowrap md:gap-4 md:mb-2',
      fieldGroup: [
        {
          key: 'name',
          type: 'input',
          className: 'w-full md:flex-1',
          props: {
            label: 'profile.addresses.form.name.label',
            placeholder: 'profile.addresses.form.name.placeholder',
            required: true,
            translate: true,
            minLength: 2,
            maxLength: 25,
            attributes: {
              autocomplete: 'name',
            },
          },
        },
        {
          key: 'address',
          type: 'input',
          className: 'w-full md:flex-2',
          props: {
            label: 'profile.addresses.form.address.label',
            placeholder: 'profile.addresses.form.address.placeholder',
            required: true,
            translate: true,
            minLength: 5,
            // A full Catalan address with floor, door and stairwell runs past 50
            // ("Carrer de la Mare de Déu del Coll, 74, 3r 2a, escala B" is 54).
            // Formly binds maxLength to the native attribute, so a tighter cap
            // truncates as the member types, with no error shown.
            maxLength: 100,
            attributes: {
              autocomplete: 'street-address',
            },
          },
        },
      ],
    },
    {
      fieldGroupClassName: 'flex flex-col md:flex-row md:flex-nowrap md:gap-4',
      fieldGroup: [
        {
          key: 'city',
          type: 'input',
          className: 'w-full md:flex-2',
          props: {
            label: 'profile.addresses.form.city.label',
            placeholder: 'profile.addresses.form.city.placeholder',
            required: true,
            translate: true,
            // Spain's shortest municipality is Ea (2); its longest run past 25
            // characters (Santa Margarida i els Monjos). Mirrors the schema.
            minLength: 2,
            maxLength: 50,
            attributes: {
              autocomplete: 'address-level2',
            },
          },
        },
        {
          key: 'zip',
          type: 'input',
          className: 'w-full md:flex-1',
          props: {
            label: 'profile.addresses.form.zip.label',
            placeholder: 'profile.addresses.form.zip.placeholder',
            required: true,
            translate: true,
            minLength: 5,
            maxLength: 5,
            attributes: {
              autocomplete: 'postal-code',
            },
          },
          validators: {
            validation: [zipValidator],
          },
        },
        {
          key: 'phone',
          type: 'input',
          className: 'w-full md:flex-4',
          props: {
            label: 'profile.addresses.form.phone.label',
            placeholder: 'profile.addresses.form.phone.placeholder',
            required: true,
            translate: true,
            minLength: 9,
            maxLength: 15,
            type: 'tel',
            attributes: {
              autocomplete: 'tel',
            },
          },
          validators: {
            validation: [phoneValidator],
          },
        },
      ],
    },
    {
      fieldGroupClassName: 'flex flex-col md:flex-row',
      fieldGroup: [
        {
          key: 'default',
          type: 'checkbox',
          className: 'w-full md:flex-1',
          props: {
            label: 'profile.addresses.form.default.label',
            translate: true,
          },
        },
      ],
    },
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: (editMode = false) => ({
      label: `profile.addresses.form.submit.${editMode ? 'edit' : 'add'}`,
    }),
  };
}
