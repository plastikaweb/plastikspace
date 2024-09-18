import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

@Component({
  selector: 'plastik-input-password-with-type-visibility',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormlyMaterialModule,
    FormlyModule,
  ],
  templateUrl: './input-password-with-visibility-type.component.html',
})
export class InputPasswordWithVisibilityTypeComponent extends FieldType<FieldTypeConfig> {
  hiddenPass = signal(true);

  hidePassword(): void {
    this.hiddenPass.update(value => !value);
  }
}
