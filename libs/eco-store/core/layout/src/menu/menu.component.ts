import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatBadge } from '@angular/material/badge';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { filter, map, startWith } from 'rxjs';
import { EcoUserAvatarComponent } from '../user-avatar/user-avatar.component';
import { EcoUserMenuComponent } from '../user-menu/user-menu.component';
import { useCartBumpAnimation } from '../utils/cart-bump-animation.util';

@Component({
  selector: 'eco-menu',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatAnchor,
    MatButton,
    MatIconButton,
    MatIcon,
    MatBadge,
    TranslatePipe,
    CurrencyPipe,
    MatMenuModule,
    MatTooltipModule,
    EcoUserAvatarComponent,
    EcoUserMenuComponent,
  ],

  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoMenuComponent {
  readonly router = inject(Router);
  readonly cartStore = inject(ecoStoreCartStore);
  readonly profileStore = inject(pocketBaseUserProfileStore);
  readonly primaryMenu = viewChild.required<TemplateRef<unknown>>('primaryMenu');
  readonly secondaryMenu = viewChild.required<TemplateRef<unknown>>('secondaryMenu');
  readonly userMenuComponent = viewChild<EcoUserMenuComponent>('userMenuComponent');

  protected readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  protected readonly roleIcon = computed(() => {
    const role = this.profileStore.user()?.role;
    switch (role) {
      case 'PARTNER':
        return 'verified';
      case 'GLOBAL_ADMIN':
        return 'admin_panel_settings';
      case 'TENANT_ADMIN':
        return 'manage_accounts';
      default:
        return '';
    }
  });

  protected readonly bumpAnimation = useCartBumpAnimation(this.cartStore);

  login() {
    if (!this.profileStore.isAuthenticated()) {
      this.router.navigate(['/accedir']);
    }
  }

  logout() {
    this.profileStore.logout();
    if (!this.profileStore.isAuthenticated()) {
      this.router.navigate(['/accedir']);
    }
  }
}
