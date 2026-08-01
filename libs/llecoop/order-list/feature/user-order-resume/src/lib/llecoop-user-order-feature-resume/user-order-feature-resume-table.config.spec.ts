import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LlecoopOrderProduct, LlecoopProductUnit } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG, TableColumnFormatting } from '@plastik/shared/table/entities';
import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  let config: LlecoopUserOrderResumeTableConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: {
            columnProperties: signal([]),
          },
        },
        {
          provide: llecoopUserOrderStore,
          useValue: {
            selectedItem: signal(null),
          },
        },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
  });

  it('should create', () => {
    expect(config).toBeTruthy();
  });

  it('should escape malicious content in base unit text pipe output for name column (SEC-08)', () => {
    const tableDef = config.getTableDefinition();
    const columns = tableDef.columnProperties() as TableColumnFormatting<LlecoopOrderProduct, any>[];
    const nameColumn = columns.find(col => col.key === 'name');

    expect(nameColumn).toBeDefined();

    // Construct a malicious unit base that would execute XSS if unescaped
    const maliciousUnit: LlecoopProductUnit = {
      type: 'unitWithFixedVolume',
      base: '<img src=x onerror=alert(1)>' as any,
    };

    const element: Partial<LlecoopOrderProduct> = {
      name: 'Test Product',
      price: 15,
      unit: maliciousUnit,
    };

    const result = nameColumn?.formatting?.execute?.('', element as LlecoopOrderProduct) as any;
    const innerHtml = result?.changingThisBreaksApplicationSecurity;

    expect(innerHtml).toBeDefined();
    // Raw malicious HTML tags must be escaped
    expect(innerHtml).not.toContain('<img');
    expect(innerHtml).not.toContain('onerror=');
    expect(innerHtml).toContain('&lt;img');
    expect(innerHtml).toContain('&#x3D;'); // Escaped equals sign
  });
});
