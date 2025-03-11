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
  imports: [ReactiveFormsModule, FormlyModule, MatButtonModule, MatIconModule, NgClass],
  templateUrl: './shared-form-feature.component.html',
  styleUrls: ['./shared-form-feature.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFormFeatureComponent<T> implements AfterViewInit {
  fields = input.required<FormlyFieldConfig[]>();
  model = input<T | null>(null);
  submitAvailable = input(true);
  submitConfig = input<SubmitFormConfig | null>({
    emitOnChange: true,
  });
  autoFocus = input(true);

  changeEvent = output<T>();
  temporaryChangeEvent = output<T>();
  pendingChangesEvent = output<boolean>();

  protected form = new FormGroup({});
  protected options: FormlyFormOptions = {};

  readonly #newModel = signal<T | null>(null);

  ngAfterViewInit(): void {
    this.form.markAsUntouched();
    this.form.markAsPristine();
    this.#newModel.set(this.model());

    if (this.autoFocus()) {
      setTimeout(() => {
        const firstInput = document.querySelector('input:not([type="hidden"]):not([readonly])');
        if (firstInput instanceof HTMLInputElement) {
          firstInput.focus();
        }
      });
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.emitChange();
  }

  onModelChange(model: T): void {
    this.#newModel.set(model);
    this.pendingChangesEvent.emit(this.form.dirty);
    if (!this.submitAvailable()) this.emitChange();
    if (this.submitConfig()?.emitOnChange) this.temporaryChangeEvent.emit(model);
  }

  private onReset(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private emitChange(): void {
    if (this.form.valid) {
      this.form.markAsPristine();
      this.form.markAsUntouched();
      this.changeEvent.emit(this.#newModel() as T);
      if (this.submitConfig()?.disableOnSubmit) this.form.disable();
    }
  }
}
