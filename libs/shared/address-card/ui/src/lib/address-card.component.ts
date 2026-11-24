import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UserContact } from '@plastik/core/entities';

/**
 * AddressCardComponent
 *
 * A presentational component for displaying a user address.
 * Use content projection to add specific functionality (slots: [indicator], [actions]).
 */
@Component({
  selector: 'plastik-address-card',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './address-card.component.html',
  styleUrl: './address-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressCardComponent {
  /**
   * The address to display.
   */
  readonly address = input.required<UserContact>();

  /**
   * Whether the card is selected.
   */
  readonly selected = input<boolean>(false);

  /**
   * Whether the card is disabled.
   */
  readonly disabled = input<boolean>(false);

  /**
   * Whether the card acts as an interactive selector with hover effects.
   */
  readonly interactive = input<boolean>(true);

  /**
   * Event emitted when the card is clicked or activated.
   */
  readonly selectionChange = output<void>();

  /** Computed aria-label with full address context for screen readers. */
  protected readonly fullAriaLabel = computed(() => {
    const a = this.address();

    return [a.name, a.address, [a.zip, a.city].filter(Boolean).join(' ')]
      .filter(Boolean)
      .join(', ');
  });
}
