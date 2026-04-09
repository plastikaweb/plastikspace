import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './address-card.component.html',
  styleUrl: './address-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressCardComponent {
  /**
   * The address to display.
   */
  address = input.required<UserContact>();

  /**
   * Whether the card is selected.
   */
  selected = input<boolean>(false);

  /**
   * Whether the card is disabled.
   */
  disabled = input<boolean>(false);

  /**
   * Event emitted when the card is clicked or activated.
   */
  selectionChange = output<void>();
}
