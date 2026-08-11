import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductUnitStepPipe } from '@plastik/llecoop/product/product-unit-step';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG, TableDefinition } from '@plastik/shared/table/entities';
import { OrderListUserOrderResumeTableConfig } from './order-list-user-order-resume-table.config';

describe('OrderListUserOrderResumeTableConfig', () => {
  const store = {
    sorting: signal(['name', 'asc']),
  };

  let definition: TableDefinition<LlecoopOrderProduct>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: llecoopOrderListStore, useValue: store },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
        OrderListUserOrderResumeTableConfig,
      ],
    });

    definition = TestBed.runInInjectionContext(() =>
      TestBed.inject(OrderListUserOrderResumeTableConfig).getTableDefinition()
    );
  });

  it('should escape HTML in the product name and info of OrderListUserOrderResumeTableConfig to prevent XSS', () => {
    const columnProperties = definition.columnProperties();
    const nameCol = columnProperties.find(col => col.key === 'name');
    expect(nameCol).toBeDefined();

    const maliciousProduct: LlecoopOrderProduct = {
      id: 'p1',
      name: '<script>alert("xss")</script>',
      info: '<img src=x onerror=alert(1)>',
      price: 10,
      iva: 10,
      priceWithIva: 11,
      unit: { type: 'unit' },
      quantity: 1,
      initQuantity: 1,
      finalQuantity: 1,
      initPrice: 11,
      finalPrice: 11,
      reviewed: false,
      extraInfo: '',
    };

    const result = nameCol?.formatting?.execute?.(null, maliciousProduct) as SafeHtml;
    const htmlString = (result as any).changingThisBreaksApplicationSecurity;
    expect(htmlString).not.toContain('<script>');
    expect(htmlString).not.toContain('<img');
    expect(htmlString).toContain('&lt;script&gt;');
    expect(htmlString).toContain('&lt;img');
  });
});
