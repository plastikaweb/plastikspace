import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';

@Component({
  selector: 'plastik-textarea-with-counter-type',
  standalone: true,
  templateUrl: './textarea-with-counter-type.component.html',
  imports: [
    CdkTextareaAutosize,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormlyModule,
    NgClass,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * A component that extends the `FieldType` from the `@ngx-formly/material/form-field` library.
 * It provides a textarea input with a character counter functionality.
 * The component uses the `CdkTextareaAutosize` directive from the Angular CDK to automatically resize the textarea based on its content.
 */
export class TextareaWithCounterTypeComponent extends FieldType<FieldTypeConfig> {
  private readonly _injector = inject(Injector);

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  triggerResize() {
    afterNextRender(
      () => {
        this.autosize.resizeToFitContent(true);
      },
      {
        injector: this._injector,
      }
    );
  }
}
