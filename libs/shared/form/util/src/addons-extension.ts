import { FormlyFieldConfig } from '@ngx-formly/core';

// eslint-disable-next-line jsdoc/require-jsdoc
export function addonsExtension(field: FormlyFieldConfig): void {
  if (!field.props || (field.wrappers && field.wrappers.indexOf('addons') !== -1)) {
    return;
  }

  if (field.props['addonLeft'] || field.props['addonRight']) {
    field.wrappers = [...(field.wrappers || []), 'addons'];
  }
}

export interface AddonConfig {
  /**
   * Icon name to display
   */
  icon?: string;

  /**
   * Click handler for the addon
   */
  onClick?: (field: FormlyFieldConfig) => void;

  /**
   * Aria label for accessibility
   */
  aria?: string;

  /**
   * Type of the addon (icon or button)
   */
  type?: 'icon' | 'button' | 'text';

  /**
   * Whether the icon should be hidden from screen readers
   */
  ariaHidden?: boolean;
}
