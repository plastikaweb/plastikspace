import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { SubmitFormConfig } from '@plastik/core/entities';

@Component({
  selector: 'plastik-shared-form-feature',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyModule, MatButtonModule, MatIconModule, NgClass],
  templateUrl: './shared-form-feature.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFormFeatureComponent<T> implements AfterViewInit {
  @Input() fields!: FormlyFieldConfig[];
  @Input() model!: T;
  @Input() submitAvailable = true;
  @Input() submitConfig?: SubmitFormConfig;

  @Output() changeEvent: EventEmitter<T> = new EventEmitter<T>();

  options: FormlyFormOptions = {};
  form = new FormGroup({});

  ngAfterViewInit(): void {
    this.form.markAsUntouched();
  }

  onSubmit(event: Event): void {
    event.stopPropagation();
    this.emitChange();
  }

  onModelChange(model: T): void {
    this.model = model;
    if (!this.submitAvailable) this.emitChange();
  }

  private emitChange(): void {
    if (this.model) {
      this.changeEvent.emit(this.model);
    }
  }
}
