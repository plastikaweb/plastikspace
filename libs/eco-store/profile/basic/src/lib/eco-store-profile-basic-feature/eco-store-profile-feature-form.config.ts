import { FormConfig, PocketBaseUser } from '@plastik/core/entities';
import { phoneValidator } from '@plastik/shared/form/util';

/**
 * @description Returns the Formly configuration for the profile personal data.
 * @returns {FormConfig<Partial<PocketBaseUser>>} The profile personal data form configuration.
 */
export function ecoStoreProfileFeatureFormConfig(): FormConfig<Partial<PocketBaseUser>> {
  const formConfig = [
    {
      fieldGroup: [
        {
          key: 'name',
          type: 'input',
          props: {
            label: 'profile.name',
            placeholder: 'profile.name',
            required: true,
            translate: true,
            // 2, as the address form's recipient name: 8 rejected short real names («Ana Gil»).
            minLength: 2,
            maxLength: 25,
            // The user's own name and phone: browsers may fill them in (WCAG 1.3.5, A11Y-025).
            attributes: {
              autocomplete: 'name',
            },
          },
        },
        {
          key: 'phone',
          type: 'input',
          props: {
            label: 'profile.phone',
            placeholder: 'profile.phone',
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
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      label: 'profile.submitButton',
      buttonStyle:
        'w-full md:w-auto mt-6 py-3 px-8 text-sys-on-primary bg-primary font-bold tracking-wide rounded-2xl shadow-md border-0',
    }),
  };
}
