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
  readonly label = input<string>();

  /**
   * An optional icon name to display before the label.
   */
  readonly icon = input<string>();

  /**
   * The semantic type of the chip, which determines its color scheme.
   * Defaults to 'neutral'.
   */
  readonly type = input<SharedChipType>('neutral');

  /**
   * Additional custom CSS classes to apply to the chip.
   */
  readonly customClass = input<string>('');

  /**
   * The ARIA role for the chip. Defaults to 'status'.
   */
  readonly role = input<string>('status');

  /**
   * An optional ARIA label for screen readers. If not provided, the label input is used.
   */
  readonly ariaLabel = input<string>();

  /**
   * Whether to render the chip label in uppercase. Defaults to true to keep
   * the historical chip look. Set to false on chips whose label is long
   * enough to read as body text (avoids the "all-caps body text" audit).
   */
  readonly uppercase = input<boolean>(true);

  protected readonly computedClass = computed(() => {
    const caseClass = this.uppercase() ? 'uppercase' : 'normal-case';
    const baseClass = `flex justify-center items-center gap-1.5 rounded-full px-3 py-2.5 text-xs font-bold ${caseClass} tracking-wide inset border transition-colors`;
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
      // Material roles switch with `color-scheme` (`light-dark()`), so the chip follows the system
      // theme too, which the `dark:` variants above miss: they need the `.dark` class (A11Y-022).
      tertiary:
        'chip-tertiary bg-sys-tertiary-container text-sys-on-tertiary-container border-sys-tertiary',
    };

    return `${baseClass} ${typeClasses[this.type()]} ${this.customClass()}`;
  });
}
