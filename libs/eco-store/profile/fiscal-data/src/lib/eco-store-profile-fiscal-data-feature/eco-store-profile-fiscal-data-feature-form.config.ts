import { FormConfig, UserFiscalProfileForm } from '@plastik/core/entities';
import { nifValidator, zipValidator } from '@plastik/shared/form/util';

/**
 * Builds the fiscal data form configuration.
 * @returns {FormConfig<UserFiscalProfileForm>} The formly config for the fiscal data section.
 */
export function ecoStoreProfileFiscalDataFeatureFormConfig(): FormConfig<UserFiscalProfileForm> {
  const formConfig = [
    {
      fieldGroup: [
        {
          key: 'fiscalName',
          type: 'input',
          props: {
            label: 'profile.fiscalData.form.fiscalName.label',
            placeholder: 'profile.fiscalData.form.fiscalName.placeholder',
            required: true,
            translate: true,
            maxLength: 120,
            attributes: { autocomplete: 'name' },
          },
        },
        {
          key: 'nif',
          type: 'input',
          props: {
            label: 'profile.fiscalData.form.nif.label',
            placeholder: 'profile.fiscalData.form.nif.placeholder',
            required: true,
            translate: true,
            minLength: 9,
            maxLength: 9,
            attributes: { autocomplete: 'off' },
          },
          validators: { validation: [nifValidator] },
        },
        {
          key: 'address',
          type: 'input',
          props: {
            label: 'profile.fiscalData.form.address.label',
            placeholder: 'profile.fiscalData.form.address.placeholder',
            required: true,
            translate: true,
            attributes: { autocomplete: 'street-address' },
          },
        },
        {
          key: 'city',
          type: 'input',
          props: {
            label: 'profile.fiscalData.form.city.label',
            placeholder: 'profile.fiscalData.form.city.placeholder',
            required: true,
            translate: true,
            minLength: 5,
            maxLength: 50,
            attributes: { autocomplete: 'address-level2' },
          },
        },
        {
          key: 'zip',
          type: 'input',
          props: {
            label: 'profile.fiscalData.form.zip.label',
            placeholder: 'profile.fiscalData.form.zip.placeholder',
            required: true,
            translate: true,
            minLength: 5,
            maxLength: 5,
            attributes: { autocomplete: 'postal-code' },
          },
          validators: { validation: [zipValidator] },
        },
      ],
    },
  ];
  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      label: 'profile.fiscalData.form.submit',
      buttonStyle:
        'w-full md:w-auto mt-6 py-3 px-8 text-sys-on-primary bg-primary font-bold tracking-wide rounded-2xl shadow-md border-0',
    }),
  };
}
