import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type SharedChipType = 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'tertiary';

@Component({
  selector: 'plastik-shared-chip',
  imports: [CommonModule, MatIconModule],
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
      'flex justify-center items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide border transition-colors';
    const typeClasses: Record<SharedChipType, string> = {
      primary: 'bg-primary-100 text-primary-900 border-primary-200',
      success: 'bg-success-100 text-success-900 border-success-200',
      warning: 'bg-warning-100 text-warning-900 border-warning-200',
      error: 'bg-error-100 text-error-900 border-error-200',
      neutral: 'bg-neutral-100 text-neutral-900 border-neutral-200',
      tertiary: 'bg-tertiary-100 text-tertiary-900 border-tertiary-200',
    };

    return `${baseClass} ${typeClasses[this.type()]} ${this.customClass()}`;
  });
}
