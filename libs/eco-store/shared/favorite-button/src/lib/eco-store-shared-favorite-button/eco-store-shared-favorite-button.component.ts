import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type FavoriteButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type FavoriteButtonAppearance = 'glass' | 'none';

@Component({
  selector: 'eco-store-shared-favorite-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './eco-store-shared-favorite-button.component.html',
  styleUrl: './eco-store-shared-favorite-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreSharedFavoriteButtonComponent {
  isFavorite = input<boolean>(false);
  ariaLabel = input<string>('');
  size = input<FavoriteButtonSize>('sm');
  appearance = input<FavoriteButtonAppearance>('glass');
  toggleFavorite = output<Event>();

  /** Signal to trigger the heart-beat animation. */
  protected readonly isAnimating = signal(false);

  onToggle(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    // Trigger animation
    this.isAnimating.set(true);
    setTimeout(() => this.isAnimating.set(false), 450);

    this.toggleFavorite.emit(event);
  }
}
