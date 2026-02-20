import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalizedFields } from '@plastik/core/entities';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { ALL_PRODUCTS_ICON } from '@plastik/eco-store/shared/tokens';
import { filter, map, startWith } from 'rxjs';

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
  readonly router = inject(Router);
  readonly translateService = inject(TranslateService);
  readonly categoriesStore = inject(ecoStoreProductCategoriesStore);
  readonly defaultCategoryIcon = inject(ALL_PRODUCTS_ICON);
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

  groupedCategoriesWithNames = computed(() => {
    const currentLang = this.lang() as keyof LocalizedFields;
    return this.groupedCategories().map(group => {
      const gName = group.group.name;
      const translatedGroupName =
        typeof gName === 'string' ? gName : gName[currentLang] || gName['ca'];

      return {
        ...group,
        translatedGroupName,
        categories: group.categories.map(category => {
          const cName = category.name;
          const translatedName =
            typeof cName === 'string' ? cName : cName[currentLang] || cName['ca'];
          return {
            ...category,
            translatedName,
          };
        }),
      };
    });
  });

  protected readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );
}
