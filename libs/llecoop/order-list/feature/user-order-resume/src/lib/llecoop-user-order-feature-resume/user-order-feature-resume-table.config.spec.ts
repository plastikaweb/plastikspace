import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SafeHtml } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG, TableColumnFormatting } from '@plastik/shared/table/entities';
import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  let config: LlecoopUserOrderResumeTableConfig;

  const mockUserOrderStore = {
    selectedItem: signal(null),
  };

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
  });

  it('should escape HTML in unit base name when formatting name column', () => {
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const columns = tableDef.columnProperties() as TableColumnFormatting<LlecoopOrderProduct, 'CUSTOM'>[];
    const nameCol = columns.find(col => col.key === 'name');

    const productWithXss = {
      id: 'p1',
      name: 'Test Product',
      price: 2.5,
      unit: {
        type: 'unitWithFixedWeight' as const,
        base: '<script>alert(1)</script>',
      },
    } as unknown as LlecoopOrderProduct;

    const result = nameCol?.formatting?.execute?.('', productWithXss) as SafeHtml & {
      changingThisBreaksApplicationSecurity?: string;
    };

    const renderedHtml = result?.changingThisBreaksApplicationSecurity ?? String(result);

    expect(renderedHtml).not.toContain('<script>');
    expect(renderedHtml).toContain('&lt;script&gt;');
  });
});
