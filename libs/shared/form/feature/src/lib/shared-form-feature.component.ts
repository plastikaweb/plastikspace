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
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { SubmitFormConfig } from '@plastik/core/entities';
import { FORM_DISABLE_TOKEN } from '@plastik/shared/form/util';
import { deepClone } from '@plastik/shared/objects';

/**
 * Shared Form Feature Component.
 * Provides a highly configurable form using @ngx-formly.
 */
@Component({
  selector: 'plastik-shared-form-feature',
  imports: [ReactiveFormsModule, FormlyModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './shared-form-feature.component.html',
  styleUrl: './shared-form-feature.component.scss',
  host: {
    class: 'w-full',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFormFeatureComponent<T> implements AfterViewInit {
  /**
   * Formly field configuration.
   */
  readonly fields = input.required<FormlyFieldConfig[]>();

  /**
   * The model object to populate the form.
   */
  readonly model = input<T | null>(null);

  /**
   * Configuration for form submission.
   */
  readonly submitConfig = input<SubmitFormConfig | null>(null);

  /**
   * Whether to automatically focus the first input field.
   */
  readonly autoFocus = input(false);

  /**
   * Whether to disable the form.
   */
  readonly disableForm = input<boolean>(false);

  /**
   * Whether to reset the form.
   */
  readonly resetForm = input<boolean>(false);

  /**
   * Event emitted when the form is submitted.
   */
  readonly changeEvent = output<T>();

  /**
   * Event emitted on every model change.
   */
  readonly temporaryChangeEvent = output<T>();

  /**
   * Event emitted when there are pending changes.
   */
  readonly pendingChangesEvent = output<boolean>();

  /**
   * Event emitted when the form validity status changes.
   */
  readonly validChange = output<boolean>();

  readonly #submitted = signal(false);

  protected readonly formSubmitConfig = linkedSignal({
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

  /**
   * A mutable copy of the input model to be used by Formly.
   * Cloned to avoid mutating readonly objects from the store or other sources.
   */
  protected readonly mutableModel = linkedSignal({
    source: this.model,
    computation: (m: T | null) => (m ? (deepClone(m) as T) : m),
  });

  protected form = new FormGroup({});
  protected options: FormlyFormOptions = {};
  readonly #elementRef = inject(ElementRef);
  readonly #formDisableToken = inject(FORM_DISABLE_TOKEN) as Signal<boolean>;
  readonly #firstInput = signal<HTMLInputElement | null>(null);

  protected resetFormEffect = effect(() => {
    if (this.resetForm()) {
      this.#resetFormStatus();
    }
  });

  constructor() {
    const statusChanges = toSignal(this.form.statusChanges);

    effect(() => {
      this.validChange.emit(this.form.valid);
    });

    effect(() => {
      const isDisabled = this.#formDisableToken() || this.disableForm();
      const autoFocusEnabled = this.autoFocus();
      const firstInput = this.#firstInput();

      if (isDisabled) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });

        if (autoFocusEnabled && firstInput) {
          setTimeout(() => {
            firstInput.focus();
            this.#resetFormStatus();
          }, 0);
        }
      }
    });
  }

  /**
   * Initializes the component after view initialization.
   */
  ngAfterViewInit(): void {
    this.#resetFormStatus();
    this.#submitted.set(false);
    this.#firstInput.set(
      this.#elementRef.nativeElement.querySelector('input:not([type="hidden"]):not([readonly])')
    );
    this.validChange.emit(this.form.valid);
  }

  /**
   * Handles form submission.
   * @param {Event} event - The submission event.
   */
  onSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.#emitChange(this.form.value as T);
  }

  /**
   * Handles changes to the model.
   * @param {T} model - The updated model.
   */
  onModelChange(model: T): void {
    if (this.#submitted()) {
      return;
    }

    this.pendingChangesEvent.emit(this.form.dirty);
    if (!this.formSubmitConfig().submitAvailable) {
      this.#emitChange(model ?? (this.form.value as T));
    }

    if (
      this.formSubmitConfig().emitOnChange &&
      (this.form.valid || this.formSubmitConfig().emitInvalid)
    ) {
      this.temporaryChangeEvent.emit(model);
    }
  }

  /**
   * Determines if the submit button should be disabled.
   * @returns {boolean} True if submission is disabled.
   */
  protected submitDisabled(): boolean {
    return this.form.invalid || (!this.formSubmitConfig().enabledByDefault && this.form.untouched);
  }

  /**
   * Emits the change event if the form is valid.
   * @param {T} [model] - The model to emit.
   */
  #emitChange(model?: T): void {
    if (this.form.valid || this.formSubmitConfig().emitInvalid) {
      if (this.formSubmitConfig().disableOnSubmit) {
        this.form.disable({ emitEvent: false });
        this.#submitted.set(true);
      }

      this.pendingChangesEvent.emit(false);
      this.changeEvent.emit(model ?? (this.form.value as T));
      this.#submitted.set(false);
      this.#resetFormStatus();
    }
  }

  /**
   * Resets the form status.
   */
  #resetFormStatus(): void {
    this.form.markAsUntouched();
    this.form.markAsPristine();

    if (this.form.disabled) {
      this.form.enable();
    }
    if (this.formSubmitConfig().resetOnSubmit) {
      this.mutableModel.set(null);
      this.form.reset({});
    }
  }
}
