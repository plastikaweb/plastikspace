import { FormlyFieldProps } from '@ngx-formly/core';

export interface ShippingMethodOption {
  type: string;
  icon: string;
  title: string;
  subtitle?: string;
  theme?: 'primary' | 'secondary' | 'tertiary' | 'neutral';
  cost?: number;
}

export interface ShippingMethodSelectorProps extends FormlyFieldProps {
  shippingMethodOptions: ShippingMethodOption[];
}
