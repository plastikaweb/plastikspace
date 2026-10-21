import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export type FavoriteButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type FavoriteButtonAppearance = 'glass' | 'none';

/**
 * Interactive button component for toggling an item's favorite state.
 */
@Component({
  selector: 'eco-store-shared-favorite-button',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './eco-store-shared-favorite-button.component.html',
  styleUrl: './eco-store-shared-favorite-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreSharedFavoriteButtonComponent {
  readonly isFavorite = input<boolean>(false);
  readonly ariaLabel = input<string>('');
  readonly size = input<FavoriteButtonSize>('sm');
  readonly appearance = input<FavoriteButtonAppearance>('glass');
  readonly toggleFavorite = output<Event>();

  /** Signal to trigger the heart-beat animation. */
  protected readonly isAnimating = signal(false);

  /** Resolved accessible label for screen readers and tooltips. */
  protected readonly computedAriaLabel = computed(() => {
    const customLabel = this.ariaLabel();

    if (customLabel) {
      return customLabel;
    }

    return this.isFavorite() ? 'Remove from favorites' : 'Add to favorites';
  });

  onToggle(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    // Trigger animation
    this.isAnimating.set(true);
    setTimeout(() => this.isAnimating.set(false), 450);

    this.toggleFavorite.emit(event);
  }
}
