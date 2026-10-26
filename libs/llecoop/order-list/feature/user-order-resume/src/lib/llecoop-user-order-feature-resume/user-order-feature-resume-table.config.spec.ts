import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG, TableDefinition } from '@plastik/shared/table/entities';
import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  const store = {
    selectedItem: signal({ cart: [] }),
  };
  let definition: TableDefinition<LlecoopOrderProduct>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        { provide: llecoopUserOrderStore, useValue: store },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    definition = TestBed.runInInjectionContext(() =>
      TestBed.inject(LlecoopUserOrderResumeTableConfig).getTableDefinition()
    );
  });

  it('should escape HTML in unit text to prevent XSS vulnerability', () => {
    const nameColumn = definition.columnProperties().find(col => col.key === 'name');
    expect(nameColumn).toBeDefined();

    const mockProduct = {
      name: 'Test Product',
      price: 10,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>' as unknown as number,
      },
    } as unknown as LlecoopOrderProduct;

    const result = nameColumn?.formatting?.execute?.(null, mockProduct) as {
      changingThisBreaksApplicationSecurity: string;
    };
    const htmlOutput = result.changingThisBreaksApplicationSecurity;

    expect(htmlOutput).not.toContain('<img');
    expect(htmlOutput).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
  });
});
