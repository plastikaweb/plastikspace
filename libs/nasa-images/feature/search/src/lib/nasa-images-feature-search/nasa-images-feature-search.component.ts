import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PushModule } from '@ngrx/component';
import { NasaImagesDataAccessModule, NasaImagesFacade } from '@plastik/nasa-images/data-access';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';

import { NasaImagesFeatureSearchTableConfig } from './nasa-images-feature-search-table.config';

@Component({
  selector: 'plastik-nasa-images-feature-search',
  standalone: true,
  imports: [NasaImagesDataAccessModule, NgIf, PushModule, SharedTableUiComponent],
  templateUrl: './nasa-images-feature-search.component.html',
  styleUrls: ['./nasa-images-feature-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NasaImagesFeatureSearchComponent {
  images$ = this.facade.images$;
  count$ = this.facade.count$;
  tableStructure = NasaImagesFeatureSearchTableConfig.getTableStructure();

  constructor(private readonly facade: NasaImagesFacade) {}
}
