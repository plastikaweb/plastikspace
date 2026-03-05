import { FormlyFieldProps } from '@ngx-formly/core';
import { UserContact } from '@plastik/core/entities';

export interface AddressSelectorProps extends FormlyFieldProps {
  addresses: UserContact[];
  editable?: boolean;
  onEdit?: (address: UserContact) => void;
}
