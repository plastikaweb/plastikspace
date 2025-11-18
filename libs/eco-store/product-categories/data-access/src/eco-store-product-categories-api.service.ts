import { Injectable } from '@angular/core';
import { PocketBaseCrudService, PocketBaseGetAllService } from '@plastik/core/api';
import { LocalizedFields, ProductCategory } from '@plastik/eco-store/entities';
import { RecordFullListOptions } from 'pocketbase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreProductCategoriesApiService extends PocketBaseGetAllService<ProductCategory> {
  protected override collectionName(): string {
    return 'product_categories';
  }

  override getFullList(params?: RecordFullListOptions): Observable<ProductCategory[]> {
    const expandParams: RecordFullListOptions = {
      ...params,
      expand: 'product_categories_translations(product_category)',
      sort: 'name',
    };
    return super.getFullList(expandParams);
  }

  protected override createPocketCrudService(): PocketBaseCrudService<ProductCategory> {
    const collection = this.collectionName();
    const mapRecord = (record: ProductCategory) => this.mapCategoryWithTranslation(record);

    return new (class extends PocketBaseCrudService<ProductCategory> {
      protected override collectionName(): string {
        return collection;
      }

      protected override mapResponse(data: ProductCategory): ProductCategory {
        return mapRecord(data);
      }
    })();
  }

  private mapCategoryWithTranslation(record: ProductCategory): ProductCategory {
    const nameTranslations: LocalizedFields = {};
    const descriptionTranslations: LocalizedFields = {};

    const translations = record.expand?.['product_categories_translations(product_category)'] ?? [];

    translations.forEach(({ language_code, name, description }) => {
      nameTranslations[language_code] = name;
      descriptionTranslations[language_code] = description;
    });

    return {
      id: record.id,
      name: nameTranslations || record.name,
      description: descriptionTranslations || record.description,
      color: record.color,
      productCount: record.productCount,
      normalizedName: record.normalizedName,
      clientId: record.clientId,
      created: record.created,
      updated: record.updated,
    };
  }
}
