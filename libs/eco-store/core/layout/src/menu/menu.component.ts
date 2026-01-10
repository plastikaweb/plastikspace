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
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { filter, map, startWith } from 'rxjs';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';

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
    SharedImgContainerComponent,
    PocketBaseImageUrlPipe,
    NgTemplateOutlet,
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

  protected readonly bumpAnimation = signal(false);

  constructor() {
    effect(() => {
      if (this.cartStore.totalAmountWithIva() > 0) {
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
}
