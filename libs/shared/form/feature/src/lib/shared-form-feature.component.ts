import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  OnDestroy,
  output,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { SubmitFormConfig } from '@plastik/core/entities';
import { FORM_DISABLE_TOKEN } from '@plastik/shared/form/util';
import { deepClone } from '@plastik/shared/objects';
import { Subscription } from 'rxjs';

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
export class SharedFormFeatureComponent<T> implements AfterViewInit, OnDestroy {
  readonly fields = input.required<FormlyFieldConfig[]>();
  readonly model = input<T | null>(null);
  readonly submitConfig = input<SubmitFormConfig | null>(null);
  readonly autoFocus = input(false);
  readonly disableForm = input<boolean>(false);
  // Truthy value forces a full form + model reset; bind a counter to re-trigger on demand.
  readonly resetForm = input<boolean | number>(false);

  readonly changeEvent = output<T>();
  readonly temporaryChangeEvent = output<T>();
  readonly pendingChangesEvent = output<boolean>();
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

  // Clone incoming model to avoid mutating a readonly object provided by callers (e.g., store/state)
  protected readonly mutableModel = linkedSignal({
    source: this.model,
    computation: (m: T | null) => (m ? (deepClone(m) as T) : m),
  });

  protected form = new FormGroup({});
  protected options: FormlyFormOptions = {};
  readonly #elementRef = inject(ElementRef);
  readonly #formDisableToken = inject(FORM_DISABLE_TOKEN) as Signal<boolean>;
  readonly #firstInput = signal<HTMLInputElement | null>(null);
  protected readonly formGroupDirective = viewChild(FormGroupDirective);
  #statusChangesSubscription?: Subscription;

  protected resetFormEffect = effect(() => {
    if (this.resetForm()) {
      this.#resetFormStatus(true);
    }
  });

  constructor() {
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

  ngAfterViewInit(): void {
    this.#resetFormStatus();
    this.#submitted.set(false);
    this.#firstInput.set(
      this.#elementRef.nativeElement.querySelector('input:not([type="hidden"]):not([readonly])')
    );
    this.validChange.emit(this.form.valid);
    this.#statusChangesSubscription = this.form.statusChanges.subscribe(() => {
      this.validChange.emit(this.form.valid);
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.#emitChange(this.form.value as T);
  }

  ngOnDestroy(): void {
    this.#statusChangesSubscription?.unsubscribe();
  }

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

  protected submitDisabled(): boolean {
    return this.form.invalid || (!this.formSubmitConfig().enabledByDefault && this.form.untouched);
  }

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

  #resetFormStatus(forceReset = false): void {
    this.form.markAsUntouched();
    this.form.markAsPristine();

    if (this.form.disabled) {
      this.form.enable();
    }
    if (forceReset || this.formSubmitConfig().resetOnSubmit) {
      this.mutableModel.set(null);
      // Reset through the directive when available — it also clears the `submitted`
      // flag Material's error-state matcher uses, so pristine fields show no errors.
      const formGroupDirective = this.formGroupDirective();
      if (formGroupDirective) {
        formGroupDirective.resetForm({});
      } else {
        this.form.reset({});
      }
    }
  }
}
