import { NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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

  protected form = new FormGroup({});
  protected options: FormlyFormOptions = {};

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
    if (!this.submitAvailable()) this.emitChange();
    if (this.submitConfig()?.emitOnChange) this.temporaryChangeEvent.emit(model);
  }

  private onReset(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private emitChange(): void {
    const model = {
      ...this.model(),
      ...this.form.value,
    };
    if (this.form.valid) {
      this.changeEvent.emit(model as T);
      if (this.submitConfig()?.disableOnSubmit) this.form.disable();
    }
  }
}
