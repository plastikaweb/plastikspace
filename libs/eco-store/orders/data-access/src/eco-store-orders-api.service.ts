import { Injectable } from '@angular/core';
import { EcoStoreCrudService } from '@plastik/eco-store/api';
import { EcoStoreOrder } from '@plastik/eco-store/entities';
import { latinize } from '@plastik/shared/latinize';
import { ListResult, RecordListOptions } from 'pocketbase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreOrdersApiService extends EcoStoreCrudService<EcoStoreOrder> {
  protected override collectionName(): string {
    return 'orders';
  }

  public override getList(params?: RecordListOptions): Observable<ListResult<EcoStoreOrder>> {
    if (params?.filter) {
      // Replace items='...' with items~'...' to allow partial matching within the JSON field.
      // We also normalize the search term.
      // PocketBase will search for this term anywhere in the JSON blob.
      params.filter = params.filter.replace(/items='([^']*)'/g, (_, value) => {
        const normalizedValue = latinize(value).toLowerCase();
        return `items~'${normalizedValue}'`;
      });
    }
    return super.getList(params);
  }
}
