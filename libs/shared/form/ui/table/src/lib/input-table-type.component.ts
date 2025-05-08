import { ChangeDetectionStrategy, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { BaseEntity } from '@plastik/core/entities';

import { InputTableProps } from './input-table-props';
import { InputTableComponent } from './input-table.component';

@Component({
  selector: 'plastik-input-table-type',
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
export class InputTableTypeComponent extends FieldType<
  FieldTypeConfig<InputTableProps<BaseEntity>>
> {}
