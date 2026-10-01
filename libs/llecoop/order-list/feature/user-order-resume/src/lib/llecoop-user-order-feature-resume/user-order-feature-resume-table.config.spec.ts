import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG, TableDefinition } from '@plastik/shared/table/entities';
import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  const mockUserOrderStore = {
    selectedItem: signal(null),
  };

  let config: LlecoopUserOrderResumeTableConfig;
  let definition: TableDefinition<LlecoopOrderProduct>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        { provide: llecoopUserOrderStore, useValue: mockUserOrderStore },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
    definition = TestBed.runInInjectionContext(() => config.getTableDefinition());
  });

  it('should escape HTML in unit base text for name custom formatting', () => {
    const columns = definition.columnProperties();
    const nameCol = columns.find(c => c.key === 'name');

    const mockProduct = {
      name: 'Test Product',
      price: 10,
      unit: {
        type: 'unitWithFixedVolume',
        base: '<script>alert(1)</script>',
      },
    } as unknown as LlecoopOrderProduct;

    const safeHtml = nameCol?.formatting?.execute?.(null, mockProduct);
    const htmlString = String(safeHtml);

    expect(htmlString).not.toContain('<script>');
    expect(htmlString).toContain('&lt;script&gt;alert(1)&lt;&#x2F;script&gt;');
  });
});
