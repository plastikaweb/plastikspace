import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SharedChipType } from '@plastik/shared/entities';

@Component({
  selector: 'plastik-shared-chip',
  imports: [MatIconModule],
  templateUrl: './shared-chip.component.html',
  styleUrl: './shared-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedChipComponent {
  /**
   * The text label to display inside the chip.
   */
  label = input<string>();

  /**
   * An optional icon name to display before the label.
   */
  icon = input<string>();

  /**
   * The semantic type of the chip, which determines its color scheme.
   * Defaults to 'neutral'.
   */
  type = input<SharedChipType>('neutral');

  /**
   * Additional custom CSS classes to apply to the chip.
   */
  customClass = input<string>('');

  /**
   * The ARIA role for the chip. Defaults to 'status'.
   */
  role = input<string>('status');

  /**
   * An optional ARIA label for screen readers. If not provided, the label input is used.
   */
  ariaLabel = input<string>();

  protected readonly computedClass = computed(() => {
    const baseClass =
      'flex justify-center items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide inset border transition-colors';
    const typeClasses: Record<SharedChipType, string> = {
      primary:
        'chip-primary bg-primary-50 text-primary-800 border-primary-400 dark:bg-primary-700 dark:text-primary-50 dark:border-primary-600',
      success:
        'chip-success bg-success-50 text-success-800 border-success-400 dark:bg-success-700 dark:text-success-50 dark:border-success-600',
      warning:
        'chip-warning bg-warning-50 text-warning-800 border-warning-400 dark:bg-warning-700 dark:text-warning-50 dark:border-warning-600',
      error:
        'chip-error bg-error-50 text-error-800 border-error-400 dark:bg-error-700 dark:text-error-50 dark:border-error-600',
      neutral:
        'chip-neutral bg-surface-container text-on-surface border-outline bg-surface-variant dark:text-neutral-50 dark:border-neutral-600',
      tertiary:
        'chip-tertiary bg-tertiary-50 text-tertiary-800 border-tertiary-400 dark:bg-tertiary-700 dark:text-tertiary-50 dark:border-tertiary-600',
    };

    return `${baseClass} ${typeClasses[this.type()]} ${this.customClass()}`;
  });
}
