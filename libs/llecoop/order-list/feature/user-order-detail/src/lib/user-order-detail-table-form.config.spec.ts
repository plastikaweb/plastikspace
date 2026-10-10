// eslint-disable-next-line @nx/enforce-module-boundaries
import '@plastik/shared/testing';

import { EnvironmentInjector, provideZonelessChangeDetection, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SafeHtml } from '@angular/platform-browser';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
  MockedOrderListStore,
  MockedUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitStepPipe } from '@plastik/llecoop/product/product-unit-step';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';

import { LlecoopUserOrderDetailFormTableConfig } from './user-order-detail-table-form.config';

describe('LlecoopUserOrderDetailFormTableConfig', () => {
  let config: LlecoopUserOrderDetailFormTableConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LlecoopUserOrderDetailFormTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
        { provide: llecoopUserOrderStore, useValue: MockedUserOrderStore },
        { provide: llecoopOrderListStore, useValue: MockedOrderListStore },
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: { columnProperties: [] },
        },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
  });

  it('should escape XSS payloads in unit text before bypassing security', () => {
    const injector = TestBed.inject(EnvironmentInjector);
    const tableDef = runInInjectionContext(injector, () => config.getTableDefinition());
    const priceColumn = tableDef.columnProperties()?.find(col => col.key === 'priceWithIva');

    const mockProduct = {
      priceWithIva: 2.5,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert("xss")>' as unknown as number,
      },
    } as unknown as LlecoopOrderProduct;

    const formatted = priceColumn?.formatting?.execute?.(2.5, mockProduct) as SafeHtml & {
      changingThisBreaksApplicationSecurity?: string;
    };

    const html = formatted?.changingThisBreaksApplicationSecurity || '';
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(&quot;xss&quot;)&gt;');
  });
});
