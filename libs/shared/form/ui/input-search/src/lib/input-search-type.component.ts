import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { TranslatePipe } from '@ngx-translate/core';

export type InputSearchProps = FieldTypeConfig['props'] & {
  onSearch?: (term: string, field: FormlyFieldConfig) => void;
  onPartialSearch?: (term: string, field: FormlyFieldConfig) => void;
  noButton?: boolean;
  resetSearch?: boolean;
  buttonEnabledIfValue?: boolean;
  showLabel?: boolean;
};

@Component({
  selector: 'plastik-input-search-type',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormlyModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './input-search-type.component.html',
  styleUrl: './input-search-type.component.scss',
  host: {
    class: 'flex w-full',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSearchTypeComponent extends FieldType<FieldTypeConfig<InputSearchProps>> {
  readonly #destroyRef = inject(DestroyRef);
  protected readonly formValue = signal<string>('');
  protected readonly formStatus = signal<string>('VALID');

  /**
   * The search button is disabled if the term length is 1,
   * or if it's 0 (unless we want to allow search on empty, but usually that's for reset).
   * It also respects the form control status unless overridden by buttonEnabledIfValue.
   */
  protected readonly isDisabled = computed(() => {
    const term = this.formValue();
    if (term.length > 0 && term.length < (this.props?.minLength || 2)) {
      return true;
    }
    return this.formStatus() === 'INVALID' && !this.props['buttonEnabledIfValue'];
  });

  constructor() {
    super();

    afterNextRender(() => {
      if (this.formControl) {
        this.syncControl();
        this.formControl.valueChanges
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe(() => this.syncControl());
        this.formControl.statusChanges
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe(() => this.syncControl());
      }
    });
  }

  protected syncControl(): void {
    this.formValue.set((this.formControl.value ?? '').toString());
    this.formStatus.set(this.formControl.status);
  }

  protected triggerSearch(event?: Event): void {
    if (this.isDisabled()) {
      return;
    }
    this.#handleSearch('onSearch', event);
  }

  protected triggerPartialSearch(event?: Event): void {
    this.#handleSearch('onPartialSearch', event);
  }

  #handleSearch(propName: 'onSearch' | 'onPartialSearch', event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    const term = (this.formControl?.value ?? '').toString();
    const handler = this.props[propName];

    if (
      typeof handler === 'function' &&
      (term.length >= (this.props.minLength || 2) || term.length === 0)
    ) {
      handler(term, this.field);
    }
  }

  protected resetSearch(): void {
    this.formControl.patchValue('');
    this.triggerPartialSearch();
  }
}
