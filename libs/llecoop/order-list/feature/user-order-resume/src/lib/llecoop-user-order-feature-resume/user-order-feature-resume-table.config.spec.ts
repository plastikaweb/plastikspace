import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG, TableDefinition } from '@plastik/shared/table/entities';
import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  const storeMock = {
    selectedItem: signal(null),
  };

  let definition: TableDefinition<LlecoopOrderProduct>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        { provide: llecoopUserOrderStore, useValue: storeMock },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    definition = TestBed.runInInjectionContext(() =>
      TestBed.inject(LlecoopUserOrderResumeTableConfig).getTableDefinition()
    );
  });

  it('should escape HTML in unit text when formatting name column', () => {
    const columns = definition.columnProperties();
    const nameCol = columns.find(column => column.key === 'name');

    expect(nameCol).toBeDefined();

    const mockProduct = {
      id: 'p1',
      name: 'Test Product',
      price: 10,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<script>alert("xss")</script>' as unknown as number,
      },
    } as unknown as LlecoopOrderProduct;

    const result = nameCol?.formatting?.execute?.('Test Product', mockProduct) as {
      changingThisBreaksApplicationSecurity?: string;
    };
    const htmlString = result?.changingThisBreaksApplicationSecurity || String(result);

    expect(htmlString).not.toContain('<script>');
    expect(htmlString).toContain('&lt;script&gt;');
  });
});
