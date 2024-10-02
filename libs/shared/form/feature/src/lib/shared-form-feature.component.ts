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
  styleUrls: ['./shared-form-feature.component.scss'],
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
    this.form.markAsPristine();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.emitChange();
  }

  onModelChange(model: T): void {
    this.model = model;
    if (!this.submitAvailable) this.emitChange();
  }

  private onReset(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private emitChange(): void {
    if (this.model && this.form.valid) {
      this.changeEvent.emit(this.model);
    }
  }
}
