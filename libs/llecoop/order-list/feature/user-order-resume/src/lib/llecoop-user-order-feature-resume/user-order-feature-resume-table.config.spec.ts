import { Injector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitStepPipe } from '@plastik/llecoop/product/product-unit-step';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';
import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  let config: LlecoopUserOrderResumeTableConfig;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: { columnProperties: () => [] },
        },
        {
          provide: llecoopUserOrderStore,
          useValue: {
            selectedItem: () => null,
          },
        },
        {
          provide: LlecoopProductBaseUnitTextPipe,
          useValue: {
            transform: (unit: unknown) => (unit as { base: string })?.base ?? '',
          },
        },
        {
          provide: LlecoopProductUnitSuffixPipe,
          useValue: {
            transform: () => 'kg',
          },
        },
        {
          provide: LlecoopProductUnitStepPipe,
          useValue: {
            transform: () => 1,
          },
        },
      ],
    });

    injector = TestBed.inject(Injector);
    config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
  });

  it('should escape XSS payloads in product unit inside name formatting', () => {
    const tableDef = runInInjectionContext(injector, () => config.getTableDefinition());
    const nameCol = tableDef.columnProperties().find(col => col.key === 'name');

    const mockProduct = {
      name: 'Test Product',
      price: 10,
      unit: { base: '<script>alert("xss")</script>' },
    } as unknown as LlecoopOrderProduct;

    const result = nameCol?.formatting?.execute?.('Test Product', mockProduct);
    const htmlString = (result as unknown as { changingThisBreaksApplicationSecurity: string })
      ?.changingThisBreaksApplicationSecurity;

    expect(htmlString).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    expect(htmlString).not.toContain('<script>alert("xss")</script>');
  });
});
