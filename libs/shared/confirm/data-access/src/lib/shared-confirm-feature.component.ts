import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'plastik-shared-confirm-feature',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './shared-confirm-feature.component.html',
    styleUrl: './shared-confirm-feature.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedConfirmFeatureComponent {
  data = inject(DIALOG_DATA);
}
