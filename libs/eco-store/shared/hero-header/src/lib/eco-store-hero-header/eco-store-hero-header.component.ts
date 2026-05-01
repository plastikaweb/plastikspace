import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Shared hero header for eco-store views. Renders the recurring page-header
 * pattern (subtitle row with icon + label, prominent title with optional
 * trailing action, plus an extras area below) while exposing the same
 * `.hero-header` / `.hero-content` shell used across the app.
 *
 * For simple cases pass `title`, `icon` and `subtitle` inputs. For richer
 * layouts (e.g. order detail, profile) omit the inputs and project the entire
 * content via the default slot, optionally combined with the `[heroAction]`
 * slot for the trailing element on the title row.
 */
@Component({
  selector: 'eco-store-hero-header',
  imports: [MatIconModule],
  templateUrl: './eco-store-hero-header.component.html',
  styleUrl: './eco-store-hero-header.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreHeroHeaderComponent {
  readonly title = input<string>('');
  readonly icon = input<string>('');
  readonly subtitle = input<string>('');
  readonly compact = input<boolean>(false);
  readonly revealDelay = input<string>('50ms');
  readonly disableReveal = input<boolean>(false);
  readonly headerRole = input<string | null>(null);
  readonly titleClass = input<string>('category-title font-bold');
  readonly subtitleClass = input<string>('category-subtitle flex items-center gap-2');
}
