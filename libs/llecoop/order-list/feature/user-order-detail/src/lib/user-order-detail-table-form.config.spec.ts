import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopOrderProduct, LlecoopProductUnit } from '@plastik/llecoop/entities';
import { llecoopOrderListStore, llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitStepPipe } from '@plastik/llecoop/product/product-unit-step';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG, TableColumnFormatting } from '@plastik/shared/table/entities';
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
          provide: llecoopUserOrderStore,
          useValue: {
            orderProductsSorting: signal(['normalizedName', 'desc']),
            orderProductsPagination: signal({}),
          },
        },
        {
          provide: llecoopOrderListStore,
          useValue: {
            currentOrderCount: signal(0),
            currentOrderAvailableProducts: signal([]),
          },
        },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
  });

  it('should create', () => {
    expect(config).toBeTruthy();
  });

  it('should escape malicious content in base unit text pipe output for priceWithIva column (SEC-08)', () => {
    const tableDef = config.getTableDefinition();
    const columns = tableDef.columnProperties() as TableColumnFormatting<LlecoopOrderProduct, any>[];
    const priceColumn = columns.find(col => col.key === 'priceWithIva');

    expect(priceColumn).toBeDefined();

    // Construct a malicious unit base that would execute XSS if unescaped
    const maliciousUnit: LlecoopProductUnit = {
      type: 'unitWithFixedVolume',
      base: '<img src=x onerror=alert(1)>' as any,
    };

    const element: Partial<LlecoopOrderProduct> = {
      priceWithIva: 10,
      unit: maliciousUnit,
    };

    const result = priceColumn?.formatting?.execute?.('10', element as LlecoopOrderProduct) as any;
    const innerHtml = result?.changingThisBreaksApplicationSecurity;

    expect(innerHtml).toBeDefined();
    // Raw malicious HTML tags must be escaped
    expect(innerHtml).not.toContain('<img');
    expect(innerHtml).not.toContain('onerror=');
    expect(innerHtml).toContain('&lt;img');
    expect(innerHtml).toContain('&#x3D;'); // Escaped equals sign
  });
});
