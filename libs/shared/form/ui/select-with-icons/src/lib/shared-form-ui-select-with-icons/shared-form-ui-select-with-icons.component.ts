import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { SharedChipType } from '@plastik/shared/entities';

interface SelectWithIconsOption extends FormlyFieldProps {
  value: string;
  label: string;
  icon: string;
  type?: SharedChipType;
}

interface SelectWithIconsProps extends FormlyFieldProps {
  options: SelectWithIconsOption[];
}

@Component({
  selector: 'plastik-shared-form-ui-select-with-icons',
  imports: [MatSelectModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './shared-form-ui-select-with-icons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFormUiSelectWithIconsComponent extends FieldType<
  FieldTypeConfig<SelectWithIconsProps>
> {
  /**
   * @description Resolves the full option object for the currently selected value.
   * @returns {SelectWithIconsOption | null} The matching option or null if no selection.
   */
  protected selectedOption(): SelectWithIconsOption | null {
    return this.props.options?.find(opt => opt.value === this.formControl.value) ?? null;
  }
}
