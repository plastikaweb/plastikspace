import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
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
        { provide: llecoopUserOrderStore, useValue: store },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
      ],
    });

    definition = TestBed.runInInjectionContext(() =>
      TestBed.inject(LlecoopUserOrderResumeTableConfig).getTableDefinition()
    );
  });

  it('should sanitize unit text in product name cell formatting to prevent XSS injection', () => {
    const columns = definition.columnProperties();
    const nameCol = columns.find(col => col.key === 'name');
    expect(nameCol).toBeDefined();

    const maliciousUnit = {
      type: 'unitWithFixedWeight' as const,
      base: '<img src=x onerror=alert(1)>' as unknown as number,
    };

    const product: Partial<LlecoopOrderProduct> = {
      name: 'Product Name',
      price: 5,
      unit: maliciousUnit,
    };

    const result = nameCol?.formatting.execute?.('', product as LlecoopOrderProduct);

    const serializedHtml = (result as unknown as { changingThisBreaksApplicationSecurity: string })
      .changingThisBreaksApplicationSecurity;

    expect(serializedHtml).not.toContain('<img');
    expect(serializedHtml).toContain('&lt;img');
  });
});
