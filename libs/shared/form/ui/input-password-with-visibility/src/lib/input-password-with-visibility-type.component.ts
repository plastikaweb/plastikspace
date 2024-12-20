import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';

@Component({
  selector: 'plastik-input-password-with-visibility-type',
  imports: [MatButtonModule, MatIconModule, MatInputModule, FormlyModule, ReactiveFormsModule],
  templateUrl: './input-password-with-visibility-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPasswordWithVisibilityTypeComponent extends FieldType<FieldTypeConfig> {
  hiddenPass = signal(true);

  hidePassword(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.hiddenPass.update(value => !value);
  }
}
