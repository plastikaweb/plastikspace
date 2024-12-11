import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';
import { LlecoopUserOrderResumeFacadeService } from '../user-order-resume-facade.service';

@Component({
    selector: 'plastik-llecoop-user-order-feature-resume',
    imports: [MatIconModule, MatButtonModule, RouterLink, TitleCasePipe, SharedTableUiComponent],
    templateUrl: './user-order-feature-resume.component.html',
    styleUrl: './user-order-feature-resume.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LlecoopUserOrderFeatureResumeComponent {
  protected facade = inject(LlecoopUserOrderResumeFacadeService);
}
