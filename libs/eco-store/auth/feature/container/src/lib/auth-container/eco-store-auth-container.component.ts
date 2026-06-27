import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  viewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationService } from '@plastik/core/router-state';
import { PocketBaseImageUrlPipe, PwaNavigationService } from '@plastik/eco-store/shared/utils';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';
import { MatThemeToggleComponent } from '@plastik/shared/mat-theme-toggle';

/**
 * @description Branded container for authentication views in Eco Store.
 * Provides a consistent layout with logo, slogan, and PWA navigation.
 */
@Component({
  selector: 'eco-store-auth-container',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
    SharedImgContainerComponent,
    PocketBaseImageUrlPipe,
    MatThemeToggleComponent,
  ],
  templateUrl: './eco-store-auth-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreAuthContainerComponent {
  /**
   * @description Whether the container is in a loading state.
   */
  readonly isLoading = input<boolean>(false);

  protected readonly tenantStore = inject(ecoStoreTenantStore);
  readonly #navigationService = inject(NavigationService);
  readonly #pwaNavigationService = inject(PwaNavigationService);

  /**
   * @description Whether the application is running in standalone mode (PWA).
   */
  readonly isStandalone = this.#pwaNavigationService.isStandalone;

  /**
   * @description Detect if there is footer content projected.
   */
  protected readonly footerContent = viewChildren<ElementRef>('footer');

  protected get hasFooterContent(): boolean {
    return this.footerContent().length > 0;
  }

  /**
   * @description Navigates back.
   */
  protected goBack(): void {
    this.#navigationService.back('/botiga');
  }
}
