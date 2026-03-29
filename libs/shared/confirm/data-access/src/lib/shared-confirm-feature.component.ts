import { DIALOG_DATA } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'plastik-shared-confirm-feature',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './shared-confirm-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block',
  },
})
export class SharedConfirmFeatureComponent {
  data = inject(DIALOG_DATA);
  icon = computed(() => this.data.icon || 'help_outline');
}
