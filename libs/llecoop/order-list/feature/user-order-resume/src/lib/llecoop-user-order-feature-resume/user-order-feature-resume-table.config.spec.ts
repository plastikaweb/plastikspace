import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG, TableDefinition } from '@plastik/shared/table/entities';

import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  const userOrderStoreMock = {
    selectedItem: signal(null),
  };

  let definition: TableDefinition<LlecoopOrderProduct>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        { provide: llecoopUserOrderStore, useValue: userOrderStoreMock },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    definition = TestBed.runInInjectionContext(() =>
      TestBed.inject(LlecoopUserOrderResumeTableConfig).getTableDefinition()
    );
  });

  it('should escape HTML in unit base text in name formatting (SEC-08)', () => {
    const columns = definition.columnProperties();
    const nameColumn = columns.find(col => col.key === 'name');

    const result = nameColumn?.formatting?.execute?.(null, {
      name: 'Test Product',
      price: 5.5,
      unit: { type: 'unitWithFixedWeight', base: '<img src=x onerror=alert(1)>' },
    } as unknown as LlecoopOrderProduct) as unknown as {
      changingThisBreaksApplicationSecurity?: string;
    };

    const html = result?.changingThisBreaksApplicationSecurity ?? String(result);
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
  });
});
