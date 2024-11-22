import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
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
  fields = input.required<FormlyFieldConfig[]>();
  model = input<T | null>(null);
  submitAvailable = input(true);
  submitConfig = input<SubmitFormConfig>();

  changeEvent = output<T>();
  temporaryChangeEvent = output<T>();

  options: FormlyFormOptions = {};
  form = new FormGroup({});

  protected computedModel = signal<T | null>(null);

  ngAfterViewInit(): void {
    this.form.markAsUntouched();
    this.form.markAsPristine();
    this.computedModel.update(() => this.model());
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.emitChange();
  }

  onModelChange(model: T): void {
    this.computedModel.set(model);
    if (!this.submitAvailable()) this.emitChange();
    if (this.submitConfig()?.emitOnChange) this.temporaryChangeEvent.emit(model);
  }

  private onReset(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private emitChange(): void {
    if (this.computedModel() && this.form.valid) {
      this.changeEvent.emit(this.computedModel() as T);
    }
  }
}
