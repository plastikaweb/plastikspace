import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';

@Component({
  selector: 'eco-store-shared-no-results',
  imports: [SharedImgContainerComponent, TranslateModule],
  templateUrl: './eco-store-shared-no-results.component.html',
  styleUrl: './eco-store-shared-no-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreSharedNoResultsComponent {
  imgTitle = input.required<string>();
}
