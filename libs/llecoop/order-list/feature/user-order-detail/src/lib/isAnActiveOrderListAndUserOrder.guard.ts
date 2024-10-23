import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { filter, map, Observable, take, tap } from 'rxjs';

// export const isAnActiveOrderListAndUserOrderGuard = () => {
//   const router = inject(Router);
//   const orderStore = inject(LlecoopUserOrderStore);
//   const orderListStore = inject(LLecoopOrderListStore);
//   const store = inject(Store);

//   return of(orderListStore.loaded()).pipe(
//     withLatestFrom(store.select(selectRouteParams)),
//     tap(console.log),
//     filter(([loaded]) => !!loaded),
//     tap(([, params]) => {
//       console.log('params', params);
//       console.log(orderListStore.entities());
//       console.log(orderListStore.currentOrder()?.id);
//       orderStore.setSelectedItemId(params['id']);
//       if (
//         orderStore.selectedItem()?.orderListId === orderListStore.currentOrder()?.id &&
//         orderListStore.entities().some(entity => entity.status === 'progress')
//       ) {
//         return true;
//       }

//       router.navigate(['/soci/comanda']);
//       return false;
//     })
//   );
// };

@Injectable({
  providedIn: 'root',
})
export class isAnActiveOrderListAndUserOrderGuard implements CanActivate {
  orderListStore = inject(LLecoopOrderListStore);
  orderStore = inject(LlecoopUserOrderStore);

  isLoaded = toObservable(this.orderListStore.loaded);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.waitForOrderListLoaded(route.params['id']);
  }

  private waitForOrderListLoaded(id: string): Observable<boolean> {
    return this.isLoaded.pipe(
      filter(Boolean),
      take(1),
      tap(() => {
        this.orderStore.setSelectedItemId(id);
      }),
      map(() => true)
    );
  }
}
