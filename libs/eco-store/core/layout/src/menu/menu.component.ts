import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatBadge } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map, startWith } from 'rxjs';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { CurrencyPipe } from '@angular/common';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

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
    MatDivider,
    UserAvatarComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  readonly router = inject(Router);
  readonly cartStore = inject(ecoStoreCartStore);
  readonly profileStore = inject(pocketBaseUserProfileStore);
  readonly primaryMenu = viewChild.required<TemplateRef<unknown>>('primaryMenu');
  readonly secondaryMenu = viewChild.required<TemplateRef<unknown>>('secondaryMenu');

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

  protected readonly bumpAnimation = signal(false);

  constructor() {
    effect(() => {
      if (this.cartStore.subtotal() + this.cartStore.tax() > 0) {
        this.bumpAnimation.set(true);
        const timer = setTimeout(() => {
          this.bumpAnimation.set(false);
          clearTimeout(timer);
        }, 300);
      }
    });
  }

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
