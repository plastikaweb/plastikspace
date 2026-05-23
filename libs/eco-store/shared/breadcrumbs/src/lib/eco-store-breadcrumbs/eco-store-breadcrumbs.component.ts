import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Interface representing a single breadcrumb item in the `EcoStoreBreadcrumbsComponent`.
 *
 * This interface defines the structure for each breadcrumb item, including its label,
 * icon, navigation target, and loading state.
 */
export interface BreadcrumbItem {
  /**
   * Optional static label for the breadcrumb item.
   */
  label?: string;

  /**
   * Optional i18n key for the label.
   */
  labelKey?: string;

  /**
   * Optional parameters for the i18n label.
   */
  labelParams?: Record<string, unknown>;
  icon?: string;
  routerLink?: string[];
  queryParams?: Record<string, unknown>;
  loading?: boolean;
  skeletonWidth?: string;
}

@Component({
  selector: 'eco-store-breadcrumbs',
  imports: [MatButtonModule, MatIconModule, RouterLink, TranslatePipe],
  templateUrl: './eco-store-breadcrumbs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreBreadcrumbsComponent {
  readonly backAriaLabel = input<string>('');
  readonly items = input<BreadcrumbItem[]>([]);
  readonly goBack = output<void>();
}
