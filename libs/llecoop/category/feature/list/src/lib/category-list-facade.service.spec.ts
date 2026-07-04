import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { llecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';

import { LlecoopCategorySearchFeatureTableConfig } from './category-feature-table.config';
import { LlecoopCategoryListFacadeService } from './category-list-facade.service';

describe('LlecoopCategoryListFacadeService', () => {
  let service: LlecoopCategoryListFacadeService;
  const confirmService = { confirm: vi.fn().mockReturnValue(of(false)) };
  const store = { filter: signal({}), delete: vi.fn() };

  beforeEach(() => {
    confirmService.confirm.mockClear();
    confirmService.confirm.mockReturnValue(of(false));
    store.delete.mockClear();

    TestBed.configureTestingModule({
      providers: [
        { provide: llecoopCategoryStore, useValue: store },
        {
          provide: LlecoopCategorySearchFeatureTableConfig,
          useValue: { getTableDefinition: () => ({}) },
        },
        { provide: SharedConfirmDialogService, useValue: confirmService },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: VIEW_CONFIG, useValue: signal([{ name: 'category' }]) },
      ],
    });

    service = TestBed.inject(LlecoopCategoryListFacadeService);
  });

  it('should escape HTML in the category name interpolated into the delete confirm message', () => {
    service.onTableActionDelete({
      id: '1',
      name: '<img src=x onerror=alert(1)>',
    } as LlecoopProductCategory);

    expect(confirmService.confirm).toHaveBeenCalledTimes(1);
    const message = confirmService.confirm.mock.calls[0][1] as string;
    expect(message).not.toContain('<img');
    expect(message).toContain('&lt;img');
    expect(store.delete).not.toHaveBeenCalled();
  });

  it('should delete the category only after the user confirms', () => {
    confirmService.confirm.mockReturnValueOnce(of(true));

    service.onTableActionDelete({ id: '1', name: 'Fruita' } as LlecoopProductCategory);

    expect(store.delete).toHaveBeenCalledWith('1');
  });
});
