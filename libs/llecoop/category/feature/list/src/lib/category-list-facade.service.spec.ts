import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { llecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { of } from 'rxjs';
import { LlecoopCategoryListFacadeService } from './category-list-facade.service';
import { LlecoopCategorySearchFeatureTableConfig } from './category-feature-table.config';

describe('LlecoopCategoryListFacadeService', () => {
  let service: LlecoopCategoryListFacadeService;
  let confirmService: SharedConfirmDialogService;

  beforeEach(() => {
    const confirmServiceMock = {
      confirm: vi.fn().mockReturnValue(of(true)),
    };

    const categoryStoreMock = {
      filter: vi.fn(),
      delete: vi.fn(),
    };

    const tableConfigMock = {
      getTableDefinition: vi.fn().mockReturnValue({}),
    };

    const routerMock = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        LlecoopCategoryListFacadeService,
        provideZonelessChangeDetection(),
        { provide: SharedConfirmDialogService, useValue: confirmServiceMock },
        { provide: llecoopCategoryStore, useValue: categoryStoreMock },
        { provide: LlecoopCategorySearchFeatureTableConfig, useValue: tableConfigMock },
        { provide: Router, useValue: routerMock },
        { provide: VIEW_CONFIG, useValue: vi.fn().mockReturnValue([{ name: 'category' }]) },
      ],
    });

    service = TestBed.inject(LlecoopCategoryListFacadeService);
    confirmService = TestBed.inject(SharedConfirmDialogService);
  });

  it('should escape the category name in the confirmation dialog (Sentinel)', () => {
    const maliciousItem = {
      id: '1',
      name: '<img src=x onerror=alert(1)>',
    };

    service.onTableActionDelete(maliciousItem as any);

    expect(confirmService.confirm).toHaveBeenCalledWith(
      'Eliminar categoria',
      expect.stringContaining('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;'),
      'Cancel·lar',
      'Eliminar'
    );
    expect(confirmService.confirm).toHaveBeenCalledWith(
      'Eliminar categoria',
      expect.not.stringContaining('<img'),
      'Cancel·lar',
      'Eliminar'
    );
  });
});
