import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';

export interface TextProps extends FormlyFieldProps {
  text: string;
  icon?: string;
  containerClasses?: string;
}

@Component({
  selector: 'plastik-shared-form-text-type',
  imports: [MatIconModule],
  templateUrl: './shared-form-ui-text.component.html',
  styleUrl: './shared-form-ui-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFormUiTextTypeComponent extends FieldType<FieldTypeConfig<TextProps>> {}
