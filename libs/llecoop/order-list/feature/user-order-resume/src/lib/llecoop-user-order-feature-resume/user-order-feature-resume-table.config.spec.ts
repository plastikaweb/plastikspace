import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG, TableDefinition } from '@plastik/shared/table/entities';

import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  let definition: TableDefinition<LlecoopOrderProduct>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        {
          provide: llecoopUserOrderStore,
          useValue: {
            selectedItem: signal(null),
          },
        },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    definition = TestBed.runInInjectionContext(() =>
      TestBed.inject(LlecoopUserOrderResumeTableConfig).getTableDefinition()
    );
  });

  it('should escape HTML in unit base text in name column formatting to prevent XSS', () => {
    const columns = definition.columnProperties();
    const nameCol = columns.find(col => col.key === 'name');

    const mockProduct = {
      name: 'Test Product',
      price: 2.5,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<script>alert("xss")</script>',
      },
    } as unknown as LlecoopOrderProduct;

    const formatted = nameCol?.formatting?.execute?.('Test Product', mockProduct, 0) as {
      changingThisBreaksApplicationSecurity: string;
    };

    const htmlString = formatted?.changingThisBreaksApplicationSecurity ?? String(formatted);

    expect(htmlString).not.toContain('<script>');
    expect(htmlString).toContain('&lt;script&gt;');
  });
});
