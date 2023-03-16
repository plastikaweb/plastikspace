import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PushModule } from '@ngrx/component';
import { NasaImagesFacade } from '@plastik/nasa-images/data-access';
import { NasaImagesSearchApiParams } from '@plastik/nasa-images/entities';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { PageEventConfig } from '@plastik/shared/table/entities';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';

import { getNasaImagesFeatureSearchFormConfig } from './nasa-images-feature-search-form.config';
import { NasaImagesFeatureSearchTableConfig } from './nasa-images-feature-search-table.config';

@Component({
  selector: 'plastik-nasa-images-feature-search',
  standalone: true,
  providers: [NasaImagesFacade],
  imports: [NgIf, PushModule, SharedTableUiComponent, SharedFormFeatureModule, AsyncPipe],
  templateUrl: './nasa-images-feature-search.component.html',
  styleUrls: ['./nasa-images-feature-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NasaImagesFeatureSearchComponent {
  images$ = this.facade.images$;
  count$ = this.facade.count$;
  tableStructure$ = NasaImagesFeatureSearchTableConfig.getTableStructure();
  formStructure$ = getNasaImagesFeatureSearchFormConfig();

  constructor(private readonly facade: NasaImagesFacade) {}

  onChange(model: Partial<NasaImagesSearchApiParams>): void {
    const length = (Object.values(model)?.[0] as string)?.length;
    if (!length || length >= 2) {
      this.facade.search(model as NasaImagesSearchApiParams);
    }
  }

  onChangePagination(tablePagination: PageEventConfig) {
    this.facade.changePagination(tablePagination);
  }
}
