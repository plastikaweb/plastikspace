import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { LlecoopOrder } from '@plastik/llecoop/entities';
import { llecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';

import { LlecoopOrderListFeatureListFacadeService } from './order-list-feature-list-facade.service';
import { LlecoopOrderListFeatureListTableConfig } from './order-list-feature-list-table/order-list-feature-list-table.config';
import { LlecoopOrderListFeatureListTotalDetailTableConfig } from './order-list-feature-list-total-detail/order-list-feature-list-total-detail-table.config';

describe('LlecoopOrderListFeatureListFacadeService', () => {
  let service: LlecoopOrderListFeatureListFacadeService;
  const confirmService = { confirm: vi.fn().mockReturnValue(of(false)) };
  const store = { filter: signal({}), delete: vi.fn(), currentOrderList: signal(null) };

  beforeEach(() => {
    confirmService.confirm.mockClear();
    confirmService.confirm.mockReturnValue(of(false));
    store.delete.mockClear();

    TestBed.configureTestingModule({
      providers: [
        { provide: llecoopOrderListStore, useValue: store },
        {
          provide: LlecoopOrderListFeatureListTableConfig,
          useValue: { getTableDefinition: () => ({}) },
        },
        {
          provide: LlecoopOrderListFeatureListTotalDetailTableConfig,
          useValue: { getTableDefinition: () => ({}) },
        },
        { provide: SharedConfirmDialogService, useValue: confirmService },
        { provide: Router, useValue: { navigate: vi.fn() } },
        {
          provide: VIEW_CONFIG,
          useValue: signal([
            {
              name: 'order',
              title: 'Comandes',
              children: [{ name: 'order-list', title: 'Setmanals' }],
            },
          ]),
        },
      ],
    });

    service = TestBed.inject(LlecoopOrderListFeatureListFacadeService);
  });

  it('should escape HTML in the order name interpolated into the delete confirm message', () => {
    service.onTableActionDelete({
      id: 'o1',
      name: '<img src=x onerror=alert(1)>',
    } as unknown as LlecoopOrder);

    expect(confirmService.confirm).toHaveBeenCalledTimes(1);
    const message = confirmService.confirm.mock.calls[0][1] as string;
    expect(message).not.toContain('<img');
    expect(message).toContain('&lt;img');
    expect(store.delete).not.toHaveBeenCalled();
  });

  it('should delete the order only after the user confirms', () => {
    confirmService.confirm.mockReturnValueOnce(of(true));

    service.onTableActionDelete({ id: 'o1', name: '2026-27' } as unknown as LlecoopOrder);

    expect(store.delete).toHaveBeenCalledWith('o1');
  });
});
