/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { LLecoopUserStore } from '@plastik/llecoop/user/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { latinize } from '@plastik/shared/latinize';
import { TableSorting } from '@plastik/shared/table/entities';
import { filter, take } from 'rxjs';
import { getLlecoopUserSearchFeatureFormConfig } from './user-feature-search-form.config';
import { LlecoopUserSearchFeatureTableConfig } from './user-feature-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserListFacadeService implements TableWithFilteringFacade<LlecoopUser> {
  private readonly store = inject(LLecoopUserStore);
  private readonly table = inject(LlecoopUserSearchFeatureTableConfig);
  private readonly confirmService = inject(SharedConfirmDialogService);

  viewConfig = signal(inject(VIEW_CONFIG).filter(item => item.name === 'user')[0]);

  tableStructure = this.table.getTableStructure();
  tableData = this.store.entities;
  tableSorting = this.store.sorting;
  filterCriteria = signal<Record<string, string>>({
    text: '',
    role: 'all',
  });
  tableFilterPredicate = (data: LlecoopUser, criteria: Record<string, string>) => {
    let filterText = true;
    let filterRole = true;
    for (const key in criteria) {
      const value = criteria[key].toLowerCase();

      if (key === 'text') {
        filterText = [data.email].some(text => latinize(text?.toLowerCase() || '').includes(value));
      }

      if (key === 'role') {
        filterRole =
          value === 'all' ||
          (value === 'admin' && !!data.isAdmin) ||
          (value === 'soci' && !data.isAdmin);
      }
    }
    return filterText && filterRole;
  };
  count = this.store.count;
  routingToDetailPage = signal({ visible: true });

  formStructure = getLlecoopUserSearchFeatureFormConfig();

  onTableSorting({ active, direction }: TableSorting): void {
    this.store.setSorting([active, direction]);
  }

  onChangeFilterCriteria(criteria: Record<string, string>): void {
    this.filterCriteria.update(() => criteria);
  }

  onTableActionDelete(item: LlecoopUser): void {
    if (item.id) {
      this.confirmService
        .confirm(
          'Eliminar usuari',
          `Segur que vols eliminar l'usuari "${item.email}"?`,
          'Cancel·lar',
          'Eliminar'
        )
        .pipe(take(1), filter(Boolean))
        .subscribe(() => this.store.delete(item));
    }
  }
}
