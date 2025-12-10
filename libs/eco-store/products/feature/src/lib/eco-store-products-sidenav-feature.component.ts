import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalizedFields } from '@plastik/core/entities';
import { ProductCategory, ProductCategoryGroup } from '@plastik/eco-store/entities';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'eco-store-products-sidenav-feature',
  imports: [
    MatCardModule,
    TranslateModule,
    MatNavList,
    MatListItem,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './eco-store-products-sidenav-feature.component.html',
  styleUrl: './eco-store-products-sidenav-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EcoStoreProductsSidenavFeatureComponent {
  readonly translateService = inject(TranslateService);
  readonly categoriesStore = inject(ecoStoreProductCategoriesStore);
  groupedCategories = this.categoriesStore.groupedCategories;
  totalProducts = this.categoriesStore.totalProducts;

  //TODO:  add all translations in template in a pipe
  protected readonly lang = toSignal(
    this.translateService.onLangChange.pipe(
      map(e => e.lang),
      startWith(this.translateService.getCurrentLang())
    ),
    { initialValue: this.translateService.getCurrentLang() }
  );

  getCategoryName(category: ProductCategory): string {
    const name = category.name;
    if (typeof name === 'string') {
      return name;
    }
    return name[this.lang() as keyof LocalizedFields] || name['ca'];
  }

  getGroupName(group: ProductCategoryGroup): string {
    const name = group.name;
    if (typeof name === 'string') {
      return name;
    }
    return name[this.lang() as keyof LocalizedFields] || name['ca'];
  }
}
