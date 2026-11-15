import { Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * The props of one Formly field.
 */
export type FieldProps = NonNullable<FormlyFieldConfig['props']>;

/**
 * What a password field holds, which is what tells one password field from another.
 */
export interface PasswordFieldSpec {
  /** The key of the value in the model. */
  key: string;
  /** The `name` of the input, which a password manager reads. */
  name: string;
  /** The translation key of the label. */
  label: string;
  /** The translation key of the placeholder. The label when left out. */
  placeholder?: string;
  /** Whether the field holds the password of the account or one being chosen. */
  autocomplete: 'current-password' | 'new-password';
}

/**
 * The classes of the group that stacks the fields of a form, unless the app names its own.
 */
export const FIELD_GROUP_CLASSES = 'flex flex-col gap-2';

/**
 * The icon that opens a field: 18px, 0.8rem from the border and 0.5rem from the text. Every
 * utility is important because Material sizes and pads the icon of a prefix with rules of its
 * own, which a plain utility does not beat.
 */
const LEADING_ICON_CLASSES =
  'size-[18px]! text-[18px]! leading-[18px]! m-0! py-0! pr-2! pl-[0.8rem]!';

/**
 * What every field of the auth forms shares. No `floatLabel`: the label rests inside the field
 * and floats to its border once the field has the focus or a value, and the placeholder shows
 * from then on.
 */
const FIELD_PROPS: FieldProps = {
  translate: true,
  required: true,
  hideRequiredMarker: true,
  subscriptSizing: 'fixed',
};

/**
 * @description Lays sets of props over one another, the last one winning, and drops every key left `undefined`.
 * @param {(FieldProps | undefined)[]} layers The sets of props, from the defaults to the most specific one.
 * @returns {FieldProps} The props of one field.
 */
function layProps(...layers: (FieldProps | undefined)[]): FieldProps {
  const merged: FieldProps = Object.assign({}, ...layers);

  return Object.fromEntries(Object.entries(merged).filter(([, value]) => value !== undefined));
}

/**
 * @description Builds the icon that opens a field. It is drawn where the route registers the addons wrapper (`provideFormlyAddons()`).
 * @param {string} icon The name of the icon.
 * @returns {{ type: string; icon: string; classes: string }} The addon of the field.
 */
function leadingIcon(icon: string): { type: string; icon: string; classes: string } {
  return { type: 'icon', icon, classes: LEADING_ICON_CLASSES };
}

/**
 * @description Builds the field that asks for the address of an account, the same in every auth form.
 * It says what it holds (`name`, `autocomplete`), so a browser or a password manager can fill it.
 * @param {string} label The translation key of the label, which is the placeholder too.
 * @param {(FieldProps | undefined)[]} layers Props laid over the defaults, the last one winning.
 * @returns {FormlyFieldConfig} The address field.
 */
export function emailField(
  label: string,
  ...layers: (FieldProps | undefined)[]
): FormlyFieldConfig {
  return {
    key: 'email',
    name: 'email',
    type: 'input',
    props: layProps(
      FIELD_PROPS,
      {
        type: 'email',
        label,
        placeholder: label,
        attributes: { autocomplete: 'username', autocapitalize: 'none', spellcheck: 'false' },
        addonLeft: leadingIcon('mail'),
      },
      ...layers
    ),
    validators: {
      validation: [Validators.email],
    },
  };
}

/**
 * @description Builds a password field with its show and hide button, the same in every auth form.
 * @param {PasswordFieldSpec} spec What the field holds.
 * @param {(FieldProps | undefined)[]} layers Props laid over the defaults, the last one winning.
 * @returns {FormlyFieldConfig} The password field.
 */
export function passwordField(
  spec: PasswordFieldSpec,
  ...layers: (FieldProps | undefined)[]
): FormlyFieldConfig {
  return {
    key: spec.key,
    name: spec.name,
    type: 'password-with-visibility',
    props: layProps(
      FIELD_PROPS,
      {
        type: 'password',
        label: spec.label,
        placeholder: spec.placeholder ?? spec.label,
        autocomplete: spec.autocomplete,
        addonLeft: leadingIcon('key'),
      },
      ...layers
    ),
  };
}
