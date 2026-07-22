import { DatePipe, PercentPipe, TitleCasePipe } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { SharedUtilFormattersService } from './shared-util-formatters.service';

describe('SharedUtilFormattersService', () => {
  let service: SharedUtilFormattersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        SharedUtilFormattersService,
        TitleCasePipe,
        DatePipe,
        PercentPipe,
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (val: string) => val,
          },
        },
      ],
    });
    service = TestBed.inject(SharedUtilFormattersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('XSS prevention', () => {
    it('defaultFormatter should escape HTML in user-controlled values', () => {
      const maliciousInput = '<img src=x onerror=alert(1)>';
      const result = service.defaultFormatter(maliciousInput) as string;
      expect(result).toBe('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    });

    it('defaultFormatter should leave plain text visually unchanged', () => {
      const result = service.defaultFormatter('Pomes Golden 1kg') as string;
      expect(result).toBe('Pomes Golden 1kg');
    });

    it('booleanWithIconFormatter should escape custom icon names', () => {
      const maliciousIcon = '"><img src=x onerror=alert(1)>';
      const result = service.booleanWithIconFormatter(true, () => ({
        iconTrue: maliciousIcon,
        iconFalse: 'close',
      })) as string;

      expect(result).not.toContain(maliciousIcon);
      expect(result).toContain('&quot;&gt;&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    });

    it('booleanWithIconFormatter should keep legit material icon names intact', () => {
      const result = service.booleanWithIconFormatter(false, () => ({
        iconTrue: 'check',
        iconFalse: 'close',
      })) as string;
      expect(result).toBe('<span class="material-icons">close</span>');
    });
  });

  describe('Performance fast-paths and custom configurations', () => {
    it('dateFormatter should format correctly without extras and with custom extras', () => {
      const date = new Date('2026-07-20T08:00:00Z');
      const standard = service.dateFormatter(date);
      expect(standard).toBeDefined();

      const custom = service.dateFormatter(date, () => ({
        dateDigitsInfo: 'fullDate',
      }));
      expect(custom).toBeDefined();
      expect(custom).not.toEqual(standard);
    });

    it('dateTimeFormatter should format correctly without extras and with custom extras', () => {
      const date = new Date('2026-07-20T08:00:00Z');
      const standard = service.dateTimeFormatter(date);
      expect(standard).toContain('26');

      const custom = service.dateTimeFormatter(date, () => ({
        locale: 'en-US',
      }));
      expect(custom).toBeDefined();
    });

    it('firebaseTimestampFormatter should format correctly without extras and with custom extras', () => {
      const timestamp = {
        toDate: () => new Date('2026-07-20T08:00:00Z'),
      } as any;
      const standard = service.firebaseTimestampFormatter(timestamp);
      expect(standard).toBeDefined();

      const custom = service.firebaseTimestampFormatter(timestamp, () => ({
        dateDigitsInfo: 'mediumDate',
      }));
      expect(custom).toBeDefined();

      expect(service.firebaseTimestampFormatter(null as any)).toBe('-');
    });

    it('percentageFormatter should format correctly without extras and with custom extras', () => {
      const standard = service.percentageFormatter(50);
      expect(standard).toBeDefined();

      const custom = service.percentageFormatter(50, () => ({
        numberDigitsInfo: '1.0-0',
      }));
      expect(custom).toBeDefined();
    });

    it('currencyFormatter should format correctly without extras and with custom extras', () => {
      const standard = service.currencyFormatter(1234.56);
      expect(standard).toBeDefined();

      const custom = service.currencyFormatter(1234.56, () => ({
        currencyCode: 'USD',
        currency: '$',
      }));
      expect(custom).toContain('$');
    });

    it('numberFormatter should format correctly without extras and with custom extras', () => {
      const standard = service.numberFormatter(9876.54);
      expect(standard).toBeDefined();

      const custom = service.numberFormatter(9876.54, () => ({
        numberDigitsInfo: '1.0-0',
      }));
      expect(custom).toBeDefined();
    });

    it('quantityFormatter should format correctly without extras and with custom extras', () => {
      const item = { id: 'test-item' } as any;
      const standard = service.quantityFormatter(100, item);
      expect(standard).toBe('100.00');

      const custom = service.quantityFormatter(100, item, (it) => ({
        prefix: 'Qty: ',
        suffix: ' units',
      }));
      expect(custom).toBe('Qty: 100.00 units');
    });

    it('booleanWithIconFormatter should format correctly without extras and with custom extras', () => {
      const standard = service.booleanWithIconFormatter(true);
      expect(standard).toContain('check');

      const custom = service.booleanWithIconFormatter(false, () => ({
        iconTrue: 'yes',
        iconFalse: 'no',
      }));
      expect(custom).toContain('no');
    });
  });
});
