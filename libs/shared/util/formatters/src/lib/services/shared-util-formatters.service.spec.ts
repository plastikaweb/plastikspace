import { DatePipe, PercentPipe, TitleCasePipe } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { Timestamp } from '@angular/fire/firestore';

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

  describe('Formatter methods behavior', () => {
    it('dateFormatter should format dates correctly', () => {
      const dateVal = '2021-09-01T02:10:06Z';
      const formatted = service.dateFormatter(dateVal, () => ({ locale: 'en-US', timezone: 'UTC' }));
      expect(formatted).toBe('9/1/21');
    });

    it('dateTimeFormatter should format timestamps with time', () => {
      const dateVal = '2021-09-01T02:10:06Z';
      const formatted = service.dateTimeFormatter(dateVal, () => ({ locale: 'en-US', timezone: 'UTC' }));
      expect(formatted).toBe('9/1/21, 02:10:06');
    });

    it('firebaseTimestampFormatter should return "-" when value is missing', () => {
      const formatted = service.firebaseTimestampFormatter(null as any);
      expect(formatted).toBe('-');
    });

    it('firebaseTimestampFormatter should format Timestamp correctly', () => {
      const ts = Timestamp.fromDate(new Date('2021-09-01T02:10:06Z'));
      const formatted = service.firebaseTimestampFormatter(ts, () => ({ locale: 'en-US', timezone: 'UTC' }));
      expect(formatted).toBe('9/1/21');
    });

    it('percentageFormatter should format percentage values', () => {
      const formatted = service.percentageFormatter(80, () => ({ locale: 'en-US' }));
      expect(formatted).toBe('80.00%');
    });

    it('currencyFormatter should format currency values correctly', () => {
      const formatted = service.currencyFormatter(3.08, () => ({ locale: 'en-US', currency: '$', currencyCode: 'USD' }));
      expect(formatted).toBe('$3.08');
    });

    it('numberFormatter should format numbers correctly', () => {
      const formatted = service.numberFormatter(1234.56, () => ({ locale: 'en-US' }));
      expect(formatted).toBe('1,234.56');
    });

    it('quantityFormatter should format quantity with suffix and prefix', () => {
      const item = { id: 'test' };
      const formatted = service.quantityFormatter(10, item, () => ({ prefix: '[', suffix: ' kg]', locale: 'en-US' }));
      expect(formatted).toBe('[10.00 kg]');
    });

    it('titleCaseFormatter should capitalize words', () => {
      const formatted = service.titleCaseFormatter('hello world');
      expect(formatted).toBe('Hello World');
    });

    it('customFormatter should invoke execute if present, else fallback', () => {
      const item = { id: 'test' };
      const config = { execute: (val: string) => `pre-${val}` };
      const formatted = service.customFormatter('value', config, item);
      expect(formatted).toBe('pre-value');

      const fallback = service.customFormatter('value', {}, item);
      expect(fallback).toBe('value');
    });

    it('componentFormatter should invoke execute if present, else fallback', () => {
      const item = { id: 'test' };
      const config = { execute: (val: string) => `cmp-${val}` };
      const formatted = service.componentFormatter('value', config, item);
      expect(formatted).toBe('cmp-value');

      const fallback = service.componentFormatter('value', {}, item);
      expect(fallback).toBe('value');
    });
  });
});
