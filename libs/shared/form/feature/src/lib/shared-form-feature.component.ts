import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  Signal,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { SubmitFormConfig } from '@plastik/core/entities';
import { FORM_DISABLE_TOKEN } from '@plastik/shared/form/util';

@Component({
  selector: 'plastik-shared-form-feature',
  imports: [ReactiveFormsModule, FormlyModule, MatButtonModule, MatIconModule, NgClass],
  templateUrl: './shared-form-feature.component.html',
  styleUrl: './shared-form-feature.component.scss',
  host: {
    class: 'w-full',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFormFeatureComponent<T> implements AfterViewInit {
  fields = input.required<FormlyFieldConfig[]>();
  model = input<T | null>(null);
  submitConfig = input<SubmitFormConfig | null>(null);
  autoFocus = input(false);
  disableForm = input<boolean>(false);

  changeEvent = output<T>();
  temporaryChangeEvent = output<T>();
  pendingChangesEvent = output<boolean>();

  readonly #submitted = signal(false);

  protected readonly config = linkedSignal({
    source: this.submitConfig,
    computation: (newConfig: SubmitFormConfig | null) => {
      return {
        emitOnChange: false,
        submitAvailable: true,
        disableOnSubmit: false,
        ...newConfig,
      };
    },
  });
  readonly #newModel = signal<T | null>(null);

  protected form = new FormGroup({});
  protected options: FormlyFormOptions = {};
  readonly #elementRef = inject(ElementRef);
  readonly #formDisableToken = inject(FORM_DISABLE_TOKEN) as Signal<boolean>;
  readonly #firstInput = signal<HTMLInputElement | null>(null);
  readonly #focusedInput = signal<HTMLInputElement | null>(null);

  constructor() {
    effect(() => {
      if (this.autoFocus() && this.#firstInput() instanceof HTMLInputElement) {
        this.#firstInput()?.focus();
      }
    });
    effect(() => {
      if (this.#formDisableToken() || this.disableForm()) {
        this.#focusedInput.set(
          this.#elementRef.nativeElement.querySelector(
            'input:not([type="hidden"]):not([readonly]):focus'
          )
        );
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
        this.#focusedInput()?.focus();
      }
    });
  }

  ngAfterViewInit(): void {
    this.form.markAsUntouched();
    this.form.markAsPristine();
    this.#submitted.set(false);
    this.#newModel.set(this.model());
    this.#firstInput.set(
      this.#elementRef.nativeElement.querySelector('input:not([type="hidden"]):not([readonly])')
    );
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.emitChange();
  }

  onModelChange(model: T): void {
    if (this.#submitted()) return;

    this.#newModel.set(model);
    this.pendingChangesEvent.emit(this.form.dirty);
    if (!this.config().submitAvailable) this.emitChange();
    if (this.config().emitOnChange) this.temporaryChangeEvent.emit(model);
  }

  private emitChange(): void {
    if (this.form.valid) {
      if (this.config().disableOnSubmit) this.form.disable({ emitEvent: false });
      this.form.markAsPristine();
      this.form.markAsUntouched();
      this.pendingChangesEvent.emit(false);
      this.#submitted.set(true);
      this.changeEvent.emit(this.#newModel() as T);
    }
  }
}
