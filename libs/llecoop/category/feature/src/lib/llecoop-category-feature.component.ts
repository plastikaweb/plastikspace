import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';
import { ProductCategorySearchFeatureTableConfig } from './llecoop-category-feature-table.config';

@Component({
  selector: 'plastik-llecoop-category-feature',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, SharedTableUiComponent],
  providers: [ProductCategorySearchFeatureTableConfig],
  templateUrl: './llecoop-category-feature.component.html',
  styleUrl: './llecoop-category-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LlecoopCategoryFeatureComponent {
  protected readonly store = inject(LlecoopCategoryStore);
  protected readonly tableStructure = inject(
    ProductCategorySearchFeatureTableConfig
  ).getTableStructure();
}
