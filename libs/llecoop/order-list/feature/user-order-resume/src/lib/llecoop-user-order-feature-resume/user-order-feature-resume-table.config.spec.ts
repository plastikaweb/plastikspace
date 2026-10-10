// eslint-disable-next-line @nx/enforce-module-boundaries
import '@plastik/shared/testing';

import { EnvironmentInjector, provideZonelessChangeDetection, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SafeHtml } from '@angular/platform-browser';
import {
  llecoopUserOrderStore,
  MockedUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';

import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  let config: LlecoopUserOrderResumeTableConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        { provide: llecoopUserOrderStore, useValue: MockedUserOrderStore },
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: { columnProperties: [] },
        },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
  });

  it('should escape XSS payloads in unit text before bypassing security', () => {
    const injector = TestBed.inject(EnvironmentInjector);
    const tableDef = runInInjectionContext(injector, () => config.getTableDefinition());
    const nameColumn = tableDef.columnProperties()?.find(col => col.key === 'name');

    const mockProduct = {
      name: 'Test Product',
      price: 1.5,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<script>alert(1)</script>' as unknown as number,
      },
    } as unknown as LlecoopOrderProduct;

    const formatted = nameColumn?.formatting?.execute?.(null, mockProduct) as SafeHtml & {
      changingThisBreaksApplicationSecurity?: string;
    };

    const html = formatted?.changingThisBreaksApplicationSecurity || '';
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;&#x2F;script&gt;');
  });
});
