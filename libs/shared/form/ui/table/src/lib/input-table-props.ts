import { FormlyFieldProps } from '@ngx-formly/core';
import { BaseEntity } from '@plastik/core/entities';
import { TableDefinition } from '@plastik/shared/table/entities';

export interface InputTableProps<T extends BaseEntity> extends FormlyFieldProps {
  tableDefinition: TableDefinition<T>;
  tableRowValueConditionFn: (element: T) => boolean;
}
