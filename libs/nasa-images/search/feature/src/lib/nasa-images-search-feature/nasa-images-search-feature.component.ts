import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LetDirective, PushPipe } from '@ngrx/component';
import { NasaImagesSearchFacade } from '@plastik/nasa-images/search/data-access';
import { NasaImagesSearchApiParams } from '@plastik/nasa-images/search/entities';
import { NasaImagesSearchUiNoResultsComponent } from '@plastik/nasa-images/search/ui/no-results';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { YearPickerFormlyModule } from '@plastik/shared/form/year-picker';
import { PageEventConfig } from '@plastik/shared/table/entities';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';

import { getNasaImagesSearchFeatureFormConfig } from './nasa-images-search-feature-form.config';
import { NasaImagesSearchFeatureTableConfig } from './nasa-images-search-feature-table.config';

@Component({
  selector: 'plastik-nasa-images-search',
  imports: [
    MatIconModule,
    PushPipe,
    LetDirective,
    SharedTableUiComponent,
    SharedFormFeatureModule,
    YearPickerFormlyModule,
    NasaImagesSearchUiNoResultsComponent,
  ],
  templateUrl: './nasa-images-search-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NasaImagesSearchFeatureComponent {
  readonly #facade = inject(NasaImagesSearchFacade);

  images$ = this.#facade.images$;
  isActiveSearch$ = this.#facade.isActiveSearch$;
  tableDefinition$ = NasaImagesSearchFeatureTableConfig.getTableDefinition();
  formStructure$ = getNasaImagesSearchFeatureFormConfig();
  formModel$ = this.#facade.routeQueryParams$;
  routeInfo$ = this.#facade.routeInfo$;

  onChange(model: Partial<NasaImagesSearchApiParams>): void {
    const length = model.q?.length ?? -1;
    if (length === 0 || length >= 2) {
      this.#facade.search(model as NasaImagesSearchApiParams);
    }
  }

  onChangePagination(tablePagination: PageEventConfig) {
    this.#facade.changePagination(tablePagination);
  }
}
