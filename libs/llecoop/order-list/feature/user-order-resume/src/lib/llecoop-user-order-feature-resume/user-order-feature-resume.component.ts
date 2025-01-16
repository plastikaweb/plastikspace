import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UiOrderStatusChipComponent } from '@plastik/llecoop/order-status-chip';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';

import { LlecoopUserOrderResumeFacadeService } from '../user-order-resume-facade.service';

@Component({
  selector: 'plastik-llecoop-user-order-feature-resume',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    UiOrderStatusChipComponent,
    RouterLink,
    TitleCasePipe,
    SharedTableUiComponent,
  ],
  templateUrl: './user-order-feature-resume.component.html',
  styleUrl: './user-order-feature-resume.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LlecoopUserOrderFeatureResumeComponent {
  protected facade = inject(LlecoopUserOrderResumeFacadeService);
}
