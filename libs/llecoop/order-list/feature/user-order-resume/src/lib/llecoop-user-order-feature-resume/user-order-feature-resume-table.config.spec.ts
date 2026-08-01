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
    selectedItem: signal(null),
  };
  const productBaseUnitTextPipe = {
    transform: vi.fn().mockImplementation(unit => `${unit.base || ''} unit-mock`),
  };
  const productUnitSuffixPipe = { transform: vi.fn() };

  let config: LlecoopUserOrderResumeTableConfig;
  let definition: TableDefinition<LlecoopOrderProduct>;

  beforeEach(() => {
    productBaseUnitTextPipe.transform.mockClear();

    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        { provide: llecoopUserOrderStore, useValue: store },
        { provide: LlecoopProductBaseUnitTextPipe, useValue: productBaseUnitTextPipe },
        { provide: LlecoopProductUnitSuffixPipe, useValue: productUnitSuffixPipe },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
    definition = TestBed.runInInjectionContext(() => config.getTableDefinition());
  });

  it('should escape HTML in LlecoopProductBaseUnitTextPipe output to prevent XSS', () => {
    productBaseUnitTextPipe.transform.mockReturnValue('<img src=x onerror=alert(2)>');

    const nameColumn = definition.columnProperties().find(col => col.key === 'name');
    expect(nameColumn).toBeTruthy();

    const element = {
      name: 'Test Product',
      price: 15,
      unit: { type: 'unitWithFixedVolume', base: '<script>alert(2)</script>' },
    } as unknown as LlecoopOrderProduct;

    const result = nameColumn?.formatting?.execute?.(null, element) as any;
    const htmlString = result.changingThisBreaksApplicationSecurity;

    expect(htmlString).not.toContain('<img');
    expect(htmlString).toContain('&lt;img');
  });
});
