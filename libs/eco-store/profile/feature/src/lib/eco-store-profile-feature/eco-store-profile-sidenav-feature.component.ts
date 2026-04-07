import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'eco-eco-store-profile-sidenav-feature',
  imports: [
    MatCardModule,
    TranslateModule,
    MatNavList,
    MatListItem,
    MatIconModule,
    MatDividerModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './eco-store-profile-sidenav-feature.component.html',
  styleUrl: './eco-store-profile-sidenav-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProfileSidenavFeatureComponent {
  readonly router = inject(Router);

  protected readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );
}
