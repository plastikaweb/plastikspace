import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { TranslateModule } from '@ngx-translate/core';

interface CustomLabelProps extends FormlyFieldProps {
  label: string;
  key: string;
  description?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  containerClasses?: string;
  labelClasses?: string;
  iconClasses?: string;
  value?: string;
}

@Component({
  selector: 'plastik-shared-form-ui-custom-label',
  imports: [MatIconModule, TranslateModule],
  templateUrl: './shared-form-ui-custom-label.component.html',
  styleUrl: './shared-form-ui-custom-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFormUiCustomLabelComponent extends FieldType<FieldTypeConfig<CustomLabelProps>> {
  setContainerClasses(): string {
    let baseClasses = 'flex justify-start text-md text-on-surface-variant items-start';
    if (this.props.iconPosition === 'right') {
      baseClasses += ' flex-row-reverse';
    }
    if (this.props.containerClasses) {
      baseClasses += ` ${this.props.containerClasses}`;
    }
    return baseClasses;
  }
}
