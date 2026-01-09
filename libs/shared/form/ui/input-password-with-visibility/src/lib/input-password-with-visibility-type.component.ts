import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'plastik-input-password-with-visibility-type',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormlyModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './input-password-with-visibility-type.component.html',
  styleUrls: ['./input-password-with-visibility-type.component.scss'],
  host: {
    class: 'flex w-full',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPasswordWithVisibilityTypeComponent extends FieldType<FieldTypeConfig> {
  readonly hiddenPass = signal(true);

  hidePassword(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.hiddenPass.update(value => !value);
  }
}
