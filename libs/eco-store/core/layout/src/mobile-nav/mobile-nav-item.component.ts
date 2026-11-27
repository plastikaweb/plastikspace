import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IsActiveMatchOptions, RouterModule } from '@angular/router';

@Component({
  selector: 'eco-mobile-nav-item',
  imports: [RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './mobile-nav-item.component.html',
  styleUrl: './mobile-nav-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileNavItemComponent {
  readonly label = input<string>();
  readonly routerLink = input<string>();
  readonly active = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly routerLinkActiveOptions = input<
    | {
        exact: boolean;
      }
    | IsActiveMatchOptions
  >({ exact: false });
}
