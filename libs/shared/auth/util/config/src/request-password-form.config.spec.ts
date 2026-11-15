import { loginFormConfig } from './login-form.config';
import { requestPasswordFormConfig } from './request-password-form.config';

describe('requestPasswordFormConfig', () => {
  it('asks for one address, required and checked as an address', () => {
    const fields = requestPasswordFormConfig().getConfig();
    const [email] = fields;

    expect(fields).toHaveLength(1);
    expect([email.key, email.type, email.props?.required]).toEqual(['email', 'input', true]);
    expect(email.props?.label).toBe('auth.forgotPassword.email');
    expect(email.props?.placeholder).toBe('auth.forgotPassword.email');
    expect(email.validators?.validation).toHaveLength(1);
  });

  it('draws the address field of the login form, with its own label', () => {
    const [email] = requestPasswordFormConfig().getConfig();
    const [group] = loginFormConfig().getConfig();
    const [loginEmail] = group.fieldGroup ?? [];

    expect(email).toEqual({
      ...loginEmail,
      props: {
        ...loginEmail.props,
        label: 'auth.forgotPassword.email',
        placeholder: 'auth.forgotPassword.email',
      },
    });
  });

  it('says what the field holds, so that a password manager can fill it', () => {
    const [email] = requestPasswordFormConfig().getConfig();

    expect(email.name).toBe('email');
    expect(email.props?.attributes?.['autocomplete']).toBe('username');
  });

  it('lays the props of the app over the field, and takes away a default set to undefined', () => {
    const [email] = requestPasswordFormConfig({
      fieldProps: { floatLabel: 'always', addonLeft: undefined },
    }).getConfig();

    expect(email.props?.['floatLabel']).toBe('always');
    expect(email.props).not.toHaveProperty('addonLeft');
    expect(email.props?.required).toBe(true);
  });

  it('keeps the submit of the shared form', () => {
    expect(requestPasswordFormConfig().getSubmitFormConfig?.()).toMatchObject({
      label: 'auth.forgotPassword.submit',
      disableOnSubmit: true,
    });
  });
});
