import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreTenant } from '@plastik/eco-store/entities';
import { EcoTenantLogoComponent } from '../tenant-logo/tenant-logo.component';

@Component({
  selector: 'eco-tenant-link',
  imports: [MatButtonModule, MatTooltipModule, TranslateModule, RouterLink, EcoTenantLogoComponent],
  template: `
    <button
      matButton
      routerLink="/"
      type="button"
      [matTooltip]="'common.navigation.backToStore' | translate"
      [attr.aria-label]="'common.navigation.backToStore' | translate"
      (click)="linkClicked.emit()">
      <eco-tenant-logo showName="responsive" [tenant]="tenant()" />
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
