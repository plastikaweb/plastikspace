import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PushModule } from '@ngrx/component';
import { NasaImagesFacade } from '@plastik/nasa-images/search/data-access';
import { NasaImagesSearchApiParams } from '@plastik/nasa-images/search/entities';
import { NasaImagesSearchUiNoResultsComponent } from '@plastik/nasa-images/search/ui/no-results';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { PageEventConfig } from '@plastik/shared/table/entities';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';

import { getNasaImagesSearchFeatureFormConfig } from './nasa-images-search-feature-form.config';
import { NasaImagesSearchFeatureTableConfig } from './nasa-images-search-feature-table.config';

@Component({
  selector: 'plastik-nasa-images-search',
  standalone: true,
  imports: [NgIf, PushModule, SharedTableUiComponent, SharedFormFeatureModule, NasaImagesSearchUiNoResultsComponent],
  templateUrl: './nasa-images-search-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NasaImagesSearchFeatureComponent {
  private readonly facade = inject(NasaImagesFacade);

  images$ = this.facade.images$;
  count$ = this.facade.count$;
  tableStructure$ = NasaImagesSearchFeatureTableConfig.getTableStructure();
  formStructure$ = getNasaImagesSearchFeatureFormConfig();

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
