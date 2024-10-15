import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgZone, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';

import { take } from 'rxjs/operators';

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
export class TextareaWithCounterTypeComponent extends FieldType<FieldTypeConfig> {
  private readonly ngZone = inject(NgZone);

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  triggerResize() {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }
}
