import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';

/**
 * A reusable presentational component to display a consistent \"no results\" state.
 * Features an illustration, a title, a description, and an optional action slot.
 */
@Component({
  selector: 'eco-store-shared-no-results',
  imports: [SharedImgContainerComponent, TranslateModule],
  templateUrl: './eco-store-shared-no-results.component.html',
  styleUrl: './eco-store-shared-no-results.component.scss',
  host: {
    class: 'flex flex-1 flex-col items-center justify-center gap-8 text-center',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreSharedNoResultsComponent {
  /** The descriptive text for the empty state illustration. Should be specific to the image content. */
  imgTitle = input.required<string>();
}
