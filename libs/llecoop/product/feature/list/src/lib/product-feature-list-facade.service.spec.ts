import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { llecoopProductStore } from '@plastik/llecoop/product/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';

import { LlecoopProductSearchFeatureFormConfig } from './product-feature-search-form.config';
import { LlecoopProductSearchFeatureTableConfig } from './product-feature-table.config';
import { LlecoopProductListFacadeService } from './product-feature-list-facade.service';

describe('LlecoopProductListFacadeService', () => {
  let service: LlecoopProductListFacadeService;
  const confirmService = { confirm: vi.fn().mockReturnValue(of(false)) };
  const store = { filter: signal({}), delete: vi.fn() };

  beforeEach(() => {
    confirmService.confirm.mockClear();
    confirmService.confirm.mockReturnValue(of(false));
    store.delete.mockClear();

    TestBed.configureTestingModule({
      providers: [
        { provide: llecoopProductStore, useValue: store },
        {
          provide: LlecoopProductSearchFeatureTableConfig,
          useValue: { getTableDefinition: () => ({}) },
        },
        { provide: LlecoopProductSearchFeatureFormConfig, useValue: { getConfig: () => [] } },
        { provide: SharedConfirmDialogService, useValue: confirmService },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: VIEW_CONFIG, useValue: signal([{ name: 'product' }]) },
      ],
    });

    service = TestBed.inject(LlecoopProductListFacadeService);
  });

  it('should escape HTML in the product name interpolated into the delete confirm message', () => {
    service.onTableActionDelete({
      id: 'p1',
      name: '<img src=x onerror=alert(1)>',
    } as LlecoopProduct);

    expect(confirmService.confirm).toHaveBeenCalledTimes(1);
    const message = confirmService.confirm.mock.calls[0][1] as string;
    expect(message).not.toContain('<img');
    expect(message).toContain('&lt;img');
    expect(store.delete).not.toHaveBeenCalled();
  });

  it('should delete the product only after the user confirms', () => {
    confirmService.confirm.mockReturnValueOnce(of(true));

    service.onTableActionDelete({ id: 'p1', name: 'Pomes' } as LlecoopProduct);

    expect(store.delete).toHaveBeenCalledWith('p1');
  });
});
