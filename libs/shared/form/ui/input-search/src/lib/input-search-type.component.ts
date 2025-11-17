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
import { FieldType } from '@ngx-formly/material';
import { TranslatePipe } from '@ngx-translate/core';

export type InputSearchProps = FieldTypeConfig['props'] & {
  onSearch?: (term: string, field: FormlyFieldConfig) => void;
  onPartialSearch?: (term: string, field: FormlyFieldConfig) => void;
  noButton?: boolean;
  resetSearch?: boolean;
  buttonEnabledIfValue?: boolean;
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly formValue = signal<string>('');
  private readonly formStatus = signal<string>('VALID');

  protected readonly isDisabled = computed(() => {
    const hasValue = !!this.formValue();
    const isInvalid = this.formStatus() === 'INVALID';
    const buttonEnabledIfValue = this.props['buttonEnabledIfValue'];

    if (buttonEnabledIfValue) {
      return !hasValue;
    }

    return isInvalid || !hasValue;
  });

  constructor() {
    super();

    afterNextRender(() => {
      if (this.formControl) {
        this.formValue.set(this.formControl.value);
        this.formStatus.set(this.formControl.status);

        this.formControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
          this.formValue.set(value);
        });

        this.formControl.statusChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(status => {
            this.formStatus.set(status);
          });
      }
    });
  }

  protected triggerSearch(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.isDisabled()) {
      return;
    }
    const term = (this.formControl?.value ?? '').toString();
    const handler = this.props['onSearch'];
    if (typeof handler === 'function') {
      handler(term, this.field);
    }
  }

  protected triggerPartialSearch(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const term = (this.formControl?.value ?? '').toString();
    const handler = this.props['onPartialSearch'];
    if (typeof handler === 'function') {
      handler(term, this.field);
    }
  }

  protected resetSearch(): void {
    this.formControl.patchValue('');
    this.triggerPartialSearch();
  }
}
