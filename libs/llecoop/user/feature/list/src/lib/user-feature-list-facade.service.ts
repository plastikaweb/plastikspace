import { filter, take } from 'rxjs';

import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { llecoopUserStore, StoreUserFilter } from '@plastik/llecoop/user/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { StoreFirebaseCrudPagination } from '@plastik/shared/signal-state-data-access';
import { TableSorting } from '@plastik/shared/table/entities';

import { getLlecoopUserSearchFeatureFormConfig } from './user-feature-search-form.config';
import { LlecoopUserSearchFeatureTableConfig } from './user-feature-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserListFacadeService
  implements TableWithFilteringFacade<LlecoopUser, StoreUserFilter>
{
  readonly #store = inject(llecoopUserStore);
  readonly #table = inject(LlecoopUserSearchFeatureTableConfig);
  readonly #confirmService = inject(SharedConfirmDialogService);
  readonly #router = inject(Router);

  viewConfig = signal(inject(VIEW_CONFIG)().filter(item => item.name === 'user')[0]);
  routingToDetailPage = signal({ visible: true, label: 'Afegir sòcia' });
  tableDefinition = this.#table.getTableDefinition();
  filterFormConfig = getLlecoopUserSearchFeatureFormConfig();
  filterCriteria = this.#store.filter;

  onChangeFilterCriteria(criteria: StoreUserFilter): void {
    this.#router.navigate([], {
      queryParams: { ...criteria, pageIndex: 0 },
      queryParamsHandling: 'merge',
    });
  }

  onChangePagination(pagination: StoreFirebaseCrudPagination<LlecoopUser>): void {
    this.#router.navigate([], {
      queryParams: { ...pagination },
      queryParamsHandling: 'merge',
    });
  }

  onTableSorting({ active, direction }: TableSorting): void {
    this.#router.navigate([], {
      queryParams: { active, direction, pageIndex: 0 },
      queryParamsHandling: 'merge',
    });
  }

  onTableActionDelete(item: LlecoopUser): void {
    if (item.id) {
      this.#confirmService
        .confirm(
          'Eliminar usuari',
          `Segur que vols eliminar l'usuari "${item.email}"?`,
          'Cancel·lar',
          'Eliminar'
        )
        .pipe(take(1), filter(Boolean))
        .subscribe(() => this.#store.delete(item));
    }
  }
}
