import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopOrderProduct, LlecoopProductUnit } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG, TableDefinition } from '@plastik/shared/table/entities';
import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  let config: LlecoopUserOrderResumeTableConfig;
  let definition: TableDefinition<LlecoopOrderProduct>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (val: string) => val,
          },
        },
        {
          provide: llecoopUserOrderStore,
          useValue: {
            selectedItem: signal(null),
          },
        },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
    definition = TestBed.runInInjectionContext(() => config.getTableDefinition());
  });

  it('should escape HTML in product base unit text for name column', () => {
    const columns = definition.columnProperties();
    const nameColumn = columns.find(col => col.key === 'name');

    const maliciousUnit = {
      type: 'unitWithFixedWeight',
      base: '<script>alert(1)</script>' as unknown as number,
    } as LlecoopProductUnit;

    const product = {
      id: 'p1',
      name: 'Test Product',
      price: 5,
      unit: maliciousUnit,
    } as unknown as LlecoopOrderProduct;

    const formattedHtml = nameColumn?.formatting?.execute?.(null, product) as unknown as string;

    expect(formattedHtml).not.toContain('<script>');
    expect(formattedHtml).toContain('&lt;script&gt;');
  });
});
