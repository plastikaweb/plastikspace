import { DatePipe, PercentPipe, TitleCasePipe } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Timestamp } from '@angular/fire/firestore';
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

  describe('formatters fast-paths and custom options', () => {
    it('dateFormatter should format dates without extras', () => {
      const date = new Date('2023-01-15T10:00:00Z');
      const result = service.dateFormatter(date);

      expect(result).toBeTruthy();
    });

    it('dateFormatter should format dates with custom extras', () => {
      const date = new Date('2023-01-15T10:00:00Z');
      const result = service.dateFormatter(date, () => ({ dateDigitsInfo: 'mediumDate' }));

      expect(result).toBeTruthy();
    });

    it('dateTimeFormatter should format datetime without extras', () => {
      const date = new Date('2023-01-15T10:00:00Z');
      const result = service.dateTimeFormatter(date);

      expect(result).toBeTruthy();
    });

    it('dateTimeFormatter should format datetime with custom extras', () => {
      const date = new Date('2023-01-15T10:00:00Z');
      const result = service.dateTimeFormatter(date, () => ({ timezone: 'UTC' }));

      expect(result).toBeTruthy();
    });

    it('firebaseTimestampFormatter should handle null or undefined value', () => {
      expect(service.firebaseTimestampFormatter(null as unknown as Timestamp)).toBe('-');
    });

    it('firebaseTimestampFormatter should format timestamp without extras', () => {
      const mockTimestamp = { toDate: () => new Date('2023-01-15T10:00:00Z') } as Timestamp;
      const result = service.firebaseTimestampFormatter(mockTimestamp);

      expect(result).toBeTruthy();
      expect(result).not.toBe('-');
    });

    it('firebaseTimestampFormatter should format timestamp with custom extras', () => {
      const mockTimestamp = { toDate: () => new Date('2023-01-15T10:00:00Z') } as Timestamp;
      const result = service.firebaseTimestampFormatter(mockTimestamp, () => ({
        dateDigitsInfo: 'fullDate',
      }));

      expect(result).toBeTruthy();
      expect(result).not.toBe('-');
    });

    it('percentageFormatter should format percentage without extras', () => {
      expect(service.percentageFormatter(50)).toBe('50.00%');
    });

    it('percentageFormatter should format percentage with custom extras', () => {
      expect(service.percentageFormatter(50, () => ({ numberDigitsInfo: '1.0-0' }))).toBe('50%');
    });

    it('currencyFormatter should format currency without extras', () => {
      expect(service.currencyFormatter(12.5)).toBe('€12.50');
    });

    it('currencyFormatter should format currency with custom extras', () => {
      expect(service.currencyFormatter(12.5, () => ({ currency: '$', currencyCode: 'USD' }))).toBe(
        '$12.50'
      );
    });

    it('numberFormatter should format numbers without extras', () => {
      expect(service.numberFormatter(1234.567)).toBe('1,234.57');
    });

    it('numberFormatter should format numbers with custom extras', () => {
      expect(service.numberFormatter(1234.567, () => ({ numberDigitsInfo: '1.1-1' }))).toBe(
        '1,234.6'
      );
    });

    it('quantityFormatter should format quantity without extras', () => {
      const mockItem = { id: '1' };

      expect(service.quantityFormatter(5, mockItem)).toBe('5.00');
    });

    it('quantityFormatter should format quantity with custom extras', () => {
      const mockItem = { id: '1' };

      expect(
        service.quantityFormatter(5, mockItem, item => ({
          prefix: 'Qty: ',
          suffix: ' kg',
        }))
      ).toBe('Qty: 5.00 kg');
    });

    it('booleanWithIconFormatter should return pre-sanitized SafeHtml without extras', () => {
      const trueResult = service.booleanWithIconFormatter(true) as string;
      const falseResult = service.booleanWithIconFormatter(false) as string;

      expect(trueResult).toBe('<span class="material-icons">check</span>');
      expect(falseResult).toBe('<span class="material-icons">close</span>');
    });
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
});
