import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { FormConfig } from '@plastik/core/entities';
import { EcoStoreTenant, EcoStoreTenantWindowStatus } from '@plastik/eco-store/entities';
import { StoreWindowComponent } from '@plastik/eco-store/store-window';
// import { SharedFormFeatureComponent } from '@plastik/shared/form';
import { EcoTenantLinkComponent } from '../tenant-link/tenant-link.component';

@Component({
  selector: 'eco-header',
  imports: [
    MatToolbar,
    MatIcon,
    MatButtonModule,
    TranslateModule,
    // SharedFormFeatureComponent,
    StoreWindowComponent,
    EcoTenantLinkComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    class: 'slide-in',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoHeaderComponent {
  readonly formConfig = input<FormConfig<{ query: string }>>();
  readonly tenant = input<EcoStoreTenant | null>();
  readonly storeStatus = input<EcoStoreTenantWindowStatus | undefined>();
  readonly nextOpenDate = input<Date | null | undefined>();
  readonly countdownSegments = input<string[]>([]);
  readonly is24h = input<boolean | undefined>();
  readonly closedReason = input<string | null | undefined>();
  readonly sideNavOpen = input<boolean>();
  readonly isMobile = input<boolean>();
  readonly hasSidenav = input<boolean>();
  readonly submitEvent = output<{ query: string }>();
  readonly toggleSidenav = output<void>();
}
