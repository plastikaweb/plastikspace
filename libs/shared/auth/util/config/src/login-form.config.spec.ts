import { FormlyFieldConfig } from '@ngx-formly/core';

import { FIELD_GROUP_CLASSES } from './auth-form-fields';
import { loginFormConfig, LoginFormConfigOptions } from './login-form.config';

describe('loginFormConfig', () => {
  /**
   * Reads the group and its two fields out of a configuration.
   * @param {LoginFormConfigOptions} [options] What the app changes in the look of the fields.
   * @returns {{ group: FormlyFieldConfig; email: FormlyFieldConfig; password: FormlyFieldConfig }} The group and its fields.
   */
  function fieldsOf(options?: LoginFormConfigOptions): {
    group: FormlyFieldConfig;
    email: FormlyFieldConfig;
    password: FormlyFieldConfig;
  } {
    const [group] = loginFormConfig(options).getConfig();
    const [email, password] = group.fieldGroup ?? [];

    return { group, email, password };
  }

  it('asks for an address and a password, both required', () => {
    const { email, password } = fieldsOf();

    expect([email.key, email.type, email.props?.required]).toEqual(['email', 'input', true]);
    expect([password.key, password.type, password.props?.required]).toEqual([
      'password',
      'password-with-visibility',
      true,
    ]);
    expect(email.validators?.validation).toHaveLength(1);
  });

  it('keeps the length rules of the password', () => {
    const { password } = fieldsOf();

    expect(password.props?.minLength).toBe(8);
    expect(password.props?.maxLength).toBe(25);
  });

  it('lets the label float: it rests inside the field and no field pins it to the border', () => {
    const { email, password } = fieldsOf();

    for (const field of [email, password]) {
      expect(field.props).not.toHaveProperty('floatLabel');
      expect(field.props?.placeholder).toBe(field.props?.label);
      expect(field.props?.['hideRequiredMarker']).toBe(true);
      expect(field.props?.['subscriptSizing']).toBe('fixed');
      expect(field.props?.['translate']).toBe(true);
    }
  });

  it('opens each field with an icon of the same shape', () => {
    const { email, password } = fieldsOf();

    expect(email.props?.['addonLeft']).toEqual({
      ...password.props?.['addonLeft'],
      icon: 'mail',
    });
    expect(password.props?.['addonLeft']).toMatchObject({ type: 'icon', icon: 'key' });
  });

  it('says what each field holds, so that a password manager can fill it', () => {
    const { email, password } = fieldsOf();

    expect(email.name).toBe('email');
    expect(email.props?.attributes?.['autocomplete']).toBe('username');
    expect(password.name).toBe('password');
    expect(password.props?.['autocomplete']).toBe('current-password');
  });

  it('stacks the fields with its own classes when the app names none', () => {
    expect(fieldsOf().group.fieldGroupClassName).toBe(FIELD_GROUP_CLASSES);
    expect(fieldsOf({ fieldGroupClassName: 'grid gap-2' }).group.fieldGroupClassName).toBe(
      'grid gap-2'
    );
  });

  it('lays the props of the app over both fields, and those of one field over them', () => {
    const { email, password } = fieldsOf({
      fieldProps: { floatLabel: 'always', subscriptSizing: 'fixed' },
      emailProps: { subscriptSizing: 'dynamic' },
      passwordProps: { maxLength: 71 },
    });

    expect(email.props?.['floatLabel']).toBe('always');
    expect(email.props?.['subscriptSizing']).toBe('dynamic');
    expect(email.props?.maxLength).toBeUndefined();
    expect(password.props?.['floatLabel']).toBe('always');
    expect(password.props?.['subscriptSizing']).toBe('fixed');
    expect(password.props?.maxLength).toBe(71);
    expect(password.props?.label).toBe('auth.login.password');
    expect(password.props?.required).toBe(true);
  });

  it('takes a default away when the app sets it to undefined', () => {
    const { email, password } = fieldsOf({
      fieldProps: { placeholder: undefined },
      passwordProps: { addonLeft: undefined },
    });

    expect(email.props).not.toHaveProperty('placeholder');
    expect(password.props).not.toHaveProperty('placeholder');
    expect(email.props).toHaveProperty('addonLeft');
    expect(password.props).not.toHaveProperty('addonLeft');
  });

  it('keeps the submit of the shared form', () => {
    expect(loginFormConfig().getSubmitFormConfig?.()).toMatchObject({
      label: 'auth.login.submit',
      disableOnSubmit: true,
    });
  });
});
