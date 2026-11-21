import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { EcoAdminNavItem, EcoAdminNavVariant } from '@plastik/eco-admin/layout-config';

/**
 * How the panel is drawn: expanded beside the content (256px), folded to icons (72px), or as the
 * drawer laid over the content (290px, 48px rows and a close button).
 */
export type EcoAdminNavLayer = 'full' | 'rail' | 'drawer';

/**
 * The side navigation of the frozen `00 Components/Rail` and `00 Components/Calaix mòbil`: a header
 * with the mark and who the panel belongs to, then one link per entry. Folded, the labels leave the
 * screen but not the accessibility tree, and a tooltip says them.
 *
 * Beside the content the header is the shell's «menu» button; in the drawer it is a plain header
 * with a close button.
 */
@Component({
  selector: 'eco-admin-nav-panel',
  imports: [MatIcon, MatIconButton, MatTooltip, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './eco-admin-nav-panel.component.html',
  styleUrl: './eco-admin-nav-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-rail]': "layer() === 'rail'",
    '[class.is-drawer]': "layer() === 'drawer'",
    '[class.is-platform]': "variant() === 'platform'",
    '[class.is-animated]': 'animated()',
  },
})
export class EcoAdminNavPanelComponent {
  /** The entries, already filtered for the role and the tenant. */
  readonly items = input.required<readonly EcoAdminNavItem[]>();

  /** The tenant's rail, or the platform's dark one. */
  readonly variant = input<EcoAdminNavVariant>('tenant');

  /** Expanded, folded or drawer. */
  readonly layer = input<EcoAdminNavLayer>('full');

  /** Slides between widths: only once the user has folded or expanded the rail. */
  readonly animated = input(false);

  /** The first line of the header: the tenant's name, or the platform's. */
  readonly heading = input('');

  /** The second line of the header: the application, or the role. */
  readonly subheading = input('');

  /** What the header button folds or opens is on screen: `aria-expanded`. */
  readonly menuExpanded = input(true);

  /** The id of what the header button controls: the rail, or the open drawer. */
  readonly menuControls = input('');

  /** The header button was pressed. */
  readonly menuToggled = output<void>();

  /** The drawer's close button was pressed. */
  readonly closeRequested = output<void>();
}
