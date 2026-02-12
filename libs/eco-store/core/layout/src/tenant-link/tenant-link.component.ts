import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { EcoStoreTenant } from '@plastik/eco-store/entities';
import { TenantLogoComponent } from '../tenant-logo/tenant-logo.component';

@Component({
  selector: 'eco-tenant-link',
  imports: [MatButtonModule, RouterLink, TenantLogoComponent],
  template: `
    <button matButton routerLink="/" type="button" (click)="linkClicked.emit()">
      <eco-tenant-logo [tenant]="tenant()" />
    </button>
  `,
  styleUrl: './tenant-link.component.scss',
  host: { class: 'contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoTenantLinkComponent {
  readonly tenant = input<EcoStoreTenant | null>();
  readonly linkClicked = output<void>();
}
