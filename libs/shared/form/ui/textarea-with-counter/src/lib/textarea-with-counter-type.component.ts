import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';

@Component({
    selector: 'plastik-textarea-with-counter-type',
    templateUrl: './textarea-with-counter-type.component.html',
    imports: [
        CdkTextareaAutosize,
        TextFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        FormlyModule,
        NgClass,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
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
