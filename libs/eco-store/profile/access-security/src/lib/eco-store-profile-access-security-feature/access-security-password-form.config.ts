import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormConfig } from '@plastik/core/entities';

export interface ChangePasswordFormModel {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AccessSecurityPasswordFormConfig extends FormConfig<ChangePasswordFormModel> {
  focusCurrentPassword: () => void;
}

/**
 * @description Form config for the in-session password change (PRV-02c).
 * Field keys `newPassword`/`confirmPassword` intentionally match the shared
 * `passwordMatch` group validator, which destructures exactly those keys.
 * Exposes `focusCurrentPassword()` so consumers can re-focus the current-password
 * field (e.g. after a rejected change) without knowing the form's field layout —
 * `formlyAttributes` observes `field.focus` and resets it to false on blur.
 * @returns {AccessSecurityPasswordFormConfig} The password change form config.
 */
export function accessSecurityPasswordFormConfig(): AccessSecurityPasswordFormConfig {
  const oldPasswordField: FormlyFieldConfig = {
    key: 'oldPassword',
    type: 'password-with-visibility',
    props: {
      label: 'profile.accessSecurity.password.currentLabel',
      placeholder: 'profile.accessSecurity.password.currentLabel',
      required: true,
      translate: true,
      // On re-focus after a rejected change, the (masked) value gets selected
      // so the user can retype the password straight away.
      selectOnFocus: true,
      attributes: { autocomplete: 'current-password' },
    },
  };

  const formConfig = [
    {
      fieldGroup: [
        oldPasswordField,
        {
          key: 'newPassword',
          type: 'password-with-visibility',
          props: {
            label: 'profile.accessSecurity.password.newLabel',
            placeholder: 'profile.accessSecurity.password.newLabel',
            required: true,
            translate: true,
            minLength: 8,
            maxLength: 25,
            attributes: { autocomplete: 'new-password' },
          },
          validators: { validation: ['password'] },
        },
        {
          key: 'confirmPassword',
          type: 'password-with-visibility',
          props: {
            label: 'profile.accessSecurity.password.confirmLabel',
            placeholder: 'profile.accessSecurity.password.confirmLabel',
            required: true,
            translate: true,
            attributes: { autocomplete: 'new-password' },
          },
        },
      ],
      validators: {
        validation: [{ name: 'passwordMatch', options: { errorPath: 'confirmPassword' } }],
      },
    },
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      label: 'profile.accessSecurity.password.submitButton',
      buttonStyle:
        'w-full md:w-auto mt-6 py-3 px-8 text-sys-on-primary bg-primary font-bold tracking-wide rounded-2xl shadow-md border-0',
    }),
    focusCurrentPassword: () => {
      oldPasswordField.focus = true;
    },
  };
}
