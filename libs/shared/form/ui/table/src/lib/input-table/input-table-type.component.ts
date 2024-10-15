import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  Signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyFieldProps, FormlyModule } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { BaseEntity } from '@plastik/core/entities';
import { TableControlStructure } from '@plastik/shared/table/entities';
import { InputTableComponent } from './input-table.component';

interface InputTableProps extends FormlyFieldProps {
  tableData: Signal<BaseEntity[]>;
  tableStructure: WritableSignal<TableControlStructure<BaseEntity>>;
  tableRowValueConditionFn: (element: BaseEntity) => boolean;
}

@Component({
  selector: 'plastik-input-table-type',
  standalone: true,
  imports: [
    InputTableComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormlyModule,
  ],
  templateUrl: './input-table-type.component.html',
  styleUrl: './input-table-type.component.scss',
  schemas: [NO_ERRORS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTableTypeComponent extends FieldType<FieldTypeConfig<InputTableProps>> {}
