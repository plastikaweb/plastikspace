import { JsonPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LetDirective, PushPipe } from '@ngrx/component';
import { NasaImagesSearchFacade } from '@plastik/nasa-images/search/data-access';
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
  imports: [
    NgIf,
    JsonPipe,
    PushPipe,
    SharedTableUiComponent,
    SharedFormFeatureModule,
    NasaImagesSearchUiNoResultsComponent,
    MatIconModule,
    LetDirective,
  ],
  templateUrl: './nasa-images-search-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NasaImagesSearchFeatureComponent {
  private readonly facade = inject(NasaImagesSearchFacade);

  images$ = this.facade.images$;
  count$ = this.facade.count$;
  isActiveSearch$ = this.facade.isActiveSearch$;
  tableStructure$ = NasaImagesSearchFeatureTableConfig.getTableStructure();
  formStructure$ = getNasaImagesSearchFeatureFormConfig();
  formModel$ = this.facade.routeQueryParams$;
  routeInfo$ = this.facade.routeInfo$;

  onChange(model: Partial<NasaImagesSearchApiParams>): void {
    const length = model.q?.length ?? -1;
    if (length === 0 || length >= 2) {
      this.facade.search(model as NasaImagesSearchApiParams);
    }
  }

  onChangePagination(tablePagination: PageEventConfig) {
    this.facade.changePagination(tablePagination);
  }
}
