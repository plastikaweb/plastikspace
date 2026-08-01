import { TestBed } from '@angular/core/testing';
import { Injector, runInInjectionContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { LlecoopProductUnitStepPipe } from '@plastik/llecoop/product/product-unit-step';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';
import { LlecoopUserOrderDetailFormTableConfig } from './user-order-detail-table-form.config';

describe('LlecoopUserOrderDetailFormTableConfig', () => {
  let service: LlecoopUserOrderDetailFormTableConfig;
  let sanitizer: DomSanitizer;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderDetailFormTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
        { provide: llecoopUserOrderStore, useValue: { orderProductsSorting: () => null, orderProductsPagination: () => null } },
        { provide: llecoopOrderListStore, useValue: { currentOrderCount: () => 0, currentOrderAvailableProducts: () => [] } },
        { provide: DEFAULT_TABLE_CONFIG, useValue: { columnProperties: [] } },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (val: string) => val,
          },
        },
      ],
    });
    service = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
    sanitizer = TestBed.inject(DomSanitizer);
    injector = TestBed.inject(Injector);
  });

  it('should escape XSS in unit.base', () => {
    const tableDef = runInInjectionContext(injector, () => service.getTableDefinition());
    const priceWithIvaColumn = tableDef.columnProperties().find(c => c.key === 'priceWithIva');
    const execute = priceWithIvaColumn?.formatting?.execute;

    const mockProduct = {
      priceWithIva: 10,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>' as unknown as number,
      },
    } as LlecoopOrderProduct;

    const result = execute!('10', mockProduct) as string;
    expect(result).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    expect(result).not.toContain('<img src=x onerror=alert(1)>');
  });
});
