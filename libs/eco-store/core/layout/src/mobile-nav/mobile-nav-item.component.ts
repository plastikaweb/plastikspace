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
  label = input<string>();
  routerLink = input<string>();
  active = input<boolean>(false);
  routerLinkActiveOptions = input<
    | {
        exact: boolean;
      }
    | IsActiveMatchOptions
  >({ exact: false });
}
