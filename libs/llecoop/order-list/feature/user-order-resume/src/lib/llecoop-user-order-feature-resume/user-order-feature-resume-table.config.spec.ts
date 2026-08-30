import { TestBed } from '@angular/core/testing';
import { Injector, runInInjectionContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';
import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  let service: LlecoopUserOrderResumeTableConfig;
  let sanitizer: DomSanitizer;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        { provide: llecoopUserOrderStore, useValue: { selectedItem: () => null } },
        { provide: DEFAULT_TABLE_CONFIG, useValue: { columnProperties: [] } },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (val: string) => val,
          },
        },
      ],
    });
    service = TestBed.inject(LlecoopUserOrderResumeTableConfig);
    sanitizer = TestBed.inject(DomSanitizer);
    injector = TestBed.inject(Injector);
  });

  it('should escape XSS in unit.base', () => {
    const tableDef = runInInjectionContext(injector, () => service.getTableDefinition());
    const nameColumn = tableDef.columnProperties().find(c => c.key === 'name');
    const execute = nameColumn?.formatting?.execute;

    const mockProduct = {
      name: 'Test Product',
      price: 10,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>' as unknown as number,
      },
    } as LlecoopOrderProduct;

    const result = execute!('', mockProduct) as string;
    expect(result).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    expect(result).not.toContain('<img src=x onerror=alert(1)>');
  });
});
