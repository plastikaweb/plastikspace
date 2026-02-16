import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreTenant } from '@plastik/eco-store/entities';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';

@Component({
  selector: 'eco-footer',
  imports: [
    MatToolbar,
    MatIcon,
    MatButtonModule,
    TranslateModule,
    SharedImgContainerComponent,
    PocketBaseImageUrlPipe,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly tenant = input<EcoStoreTenant | null>();
}
