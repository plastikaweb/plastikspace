import { FormlyFieldConfig } from '@ngx-formly/core';

import { FIELD_GROUP_CLASSES } from './auth-form-fields';
import {
  resetPasswordFormConfig,
  ResetPasswordFormConfigOptions,
} from './reset-password-form.config';

describe('resetPasswordFormConfig', () => {
  /**
   * Reads the group and its two fields out of a configuration.
   * @param {ResetPasswordFormConfigOptions} [options] What the app changes in the look of the fields.
   * @returns {{ group: FormlyFieldConfig; password: FormlyFieldConfig; confirm: FormlyFieldConfig }} The group and its fields.
   */
  function fieldsOf(options?: ResetPasswordFormConfigOptions): {
    group: FormlyFieldConfig;
    password: FormlyFieldConfig;
    confirm: FormlyFieldConfig;
  } {
    const [group] = resetPasswordFormConfig(options).getConfig();
    const [password, confirm] = group.fieldGroup ?? [];

    return { group, password, confirm };
  }

  it('asks for a password twice, both required and with a button that shows them', () => {
    const { password, confirm } = fieldsOf();

    expect([password.key, password.type, password.props?.required]).toEqual([
      'password',
      'password-with-visibility',
      true,
    ]);
    expect([confirm.key, confirm.type, confirm.props?.required]).toEqual([
      'confirmPassword',
      'password-with-visibility',
      true,
    ]);
  });

  it('keeps the length rules of the password, and says the shortest one under the field', () => {
    const { password, confirm } = fieldsOf();

    expect(password.props?.minLength).toBe(8);
    expect(password.props?.maxLength).toBe(25);
    expect(password.props?.description).toBe('auth.resetPassword.passwordHint');
    expect(confirm.props).not.toHaveProperty('description');
  });

  it('checks the two fields against the keys they really have', () => {
    const { group, password, confirm } = fieldsOf();

    expect(group.validators?.validation).toEqual([
      {
        name: 'passwordMatch',
        options: { errorPath: confirm.key, passwordKey: password.key },
      },
    ]);
  });

  it('shows an error once a field was visited, not before', () => {
    const { password, confirm } = fieldsOf();

    expect(password.expressions).toBeUndefined();
    expect(confirm.expressions).toBeUndefined();
  });

  it('marks both fields as a new password, each with a name of its own', () => {
    const { password, confirm } = fieldsOf();

    expect(password.name).toBe('new-password');
    expect(confirm.name).toBe('new-password-repeat');
    expect(password.props?.['autocomplete']).toBe('new-password');
    expect(confirm.props?.['autocomplete']).toBe('new-password');
  });

  it('opens each field with the same icon, and lets its label float', () => {
    const { password, confirm } = fieldsOf();

    expect(password.props?.['addonLeft']).toMatchObject({ type: 'icon', icon: 'key' });
    expect(confirm.props?.['addonLeft']).toEqual(password.props?.['addonLeft']);

    for (const field of [password, confirm]) {
      expect(field.props).not.toHaveProperty('floatLabel');
      expect(field.props?.['hideRequiredMarker']).toBe(true);
      expect(field.props?.['subscriptSizing']).toBe('fixed');
      expect(field.props?.['translate']).toBe(true);
    }
  });

  it('stacks the fields with its own classes when the app names none', () => {
    expect(fieldsOf().group.fieldGroupClassName).toBe(FIELD_GROUP_CLASSES);
    expect(fieldsOf({ fieldGroupClassName: 'grid gap-2' }).group.fieldGroupClassName).toBe(
      'grid gap-2'
    );
  });

  it('lays the props of the app over both fields, and those of one field over them', () => {
    const { password, confirm } = fieldsOf({
      fieldProps: { maxLength: 71, subscriptSizing: 'fixed' },
      passwordProps: { description: undefined },
      confirmPasswordProps: { subscriptSizing: 'dynamic' },
    });

    expect(password.props?.maxLength).toBe(71);
    expect(confirm.props?.maxLength).toBe(71);
    expect(password.props?.['subscriptSizing']).toBe('fixed');
    expect(confirm.props?.['subscriptSizing']).toBe('dynamic');
    expect(password.props).not.toHaveProperty('description');
    expect(password.props?.minLength).toBe(8);
  });

  it('keeps the submit of the shared form', () => {
    expect(resetPasswordFormConfig().getSubmitFormConfig?.()).toMatchObject({
      label: 'auth.resetPassword.submitButton',
    });
  });
});
