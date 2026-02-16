import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { MobileNavItemComponent } from './mobile-nav-item.component';

@Component({
  selector: 'eco-mobile-nav',
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    MobileNavItemComponent,
    UserMenuComponent,
    MatBadgeModule,
    UserAvatarComponent,
    MatMenuModule,
  ],
  templateUrl: './mobile-nav.component.html',
  styleUrl: './mobile-nav.component.scss',
  host: {
    class:
      'mb-4 fixed bottom-1 left-1/2 z-100 -translate-x-1/2 flex justify-center items-center block md:hidden w-[calc(100%-2rem)] max-w-[calc(100%-2rem)]',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileNavComponent {
  protected readonly userProfileStore = inject(pocketBaseUserProfileStore);
  protected readonly cartStore = inject(ecoStoreCartStore);
  readonly userMenuComponent = viewChild.required<UserMenuComponent>('userMenuComponent');
}
