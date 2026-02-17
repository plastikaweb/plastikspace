import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { EcoStoreTenant } from '@plastik/eco-store/entities';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';

@Component({
  selector: 'eco-tenant-logo',
  imports: [MatIcon, SharedImgContainerComponent, PocketBaseImageUrlPipe, TranslatePipe],
  templateUrl: './tenant-logo.component.html',
  host: {
    class: 'flex items-center gap-2 font-semibold tracking-wide',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantLogoComponent {
  readonly tenant = input<EcoStoreTenant | null>();
}
