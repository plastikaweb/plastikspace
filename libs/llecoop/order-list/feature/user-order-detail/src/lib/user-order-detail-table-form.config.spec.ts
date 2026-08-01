import { EnvironmentInjector, provideZonelessChangeDetection, runInInjectionContext, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopOrderListStore, llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitStepPipe } from '@plastik/llecoop/product/product-unit-step';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';
import { LlecoopUserOrderDetailFormTableConfig } from './user-order-detail-table-form.config';

describe('LlecoopUserOrderDetailFormTableConfig', () => {
  let config: LlecoopUserOrderDetailFormTableConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LlecoopUserOrderDetailFormTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: {
            columnProperties: signal([]),
          },
        },
        {
          provide: llecoopOrderListStore,
          useValue: {
            currentOrderCount: signal(0),
            currentOrderAvailableProducts: signal([]),
          },
        },
        {
          provide: llecoopUserOrderStore,
          useValue: {
            orderProductsSorting: signal(null),
            orderProductsPagination: signal(null),
          },
        },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
  });

  it('should escape malicious XSS payloads in unit base inside priceWithIva column (SEC-08)', () => {
    let tableDef: any;
    const injector = TestBed.inject(EnvironmentInjector);
    runInInjectionContext(injector, () => {
      tableDef = config.getTableDefinition();
    });

    const columns = tableDef.columnProperties();
    const priceWithIvaCol = columns.find((col: any) => col.key === 'priceWithIva');

    expect(priceWithIvaCol).toBeTruthy();

    const mockProduct: Partial<LlecoopOrderProduct> = {
      priceWithIva: 10,
      unit: {
        type: 'unitWithFixedVolume',
        base: '<script>alert(1)</script>' as any,
      },
    };

    const result = priceWithIvaCol?.formatting?.execute?.('10', mockProduct as LlecoopOrderProduct) as any;
    const html = result.changingThisBreaksApplicationSecurity;

    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;&#x2F;script&gt;');
  });
});
