import { EnvironmentInjector, provideZonelessChangeDetection, runInInjectionContext, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
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
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: {
            columnProperties: signal([]),
          },
        },
        {
          provide: llecoopUserOrderStore,
          useValue: {
            selectedItem: signal({ cart: [] }),
          },
        },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
  });

  it('should escape malicious XSS payloads in unit base inside name column (SEC-08)', () => {
    let tableDef: any;
    const injector = TestBed.inject(EnvironmentInjector);
    runInInjectionContext(injector, () => {
      tableDef = config.getTableDefinition();
    });

    const columns = tableDef.columnProperties();
    const nameCol = columns.find((col: any) => col.key === 'name');

    expect(nameCol).toBeTruthy();

    const mockProduct: Partial<LlecoopOrderProduct> = {
      name: 'Test Product',
      price: 15,
      unit: {
        type: 'unitWithFixedVolume',
        base: '<img src=x onerror="alert(2)">' as any,
      },
    };

    const result = nameCol?.formatting?.execute?.('', mockProduct as LlecoopOrderProduct) as any;
    const html = result.changingThisBreaksApplicationSecurity;

    expect(html).not.toContain('<img');
    expect(html).not.toContain('onerror="');
    expect(html).toContain('&lt;img src&#x3D;x onerror&#x3D;&quot;alert(2)&quot;&gt;');
  });
});
