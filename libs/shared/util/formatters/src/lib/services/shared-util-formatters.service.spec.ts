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
            bypassSecurityTrustHtml: (htmlValue: string) => htmlValue,
          },
        },
      ],
    });
    service = TestBed.inject(SharedUtilFormattersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('formatters', () => {
    it('dateFormatter should format dates correctly with default and custom options', () => {
      const testDate = new Date('2025-01-15T12:00:00Z');

      expect(service.dateFormatter(testDate)).toBeTruthy();
      expect(
        service.dateFormatter(testDate, () => ({ dateDigitsInfo: 'yyyy-MM-dd' }))
      ).toContain('2025');
    });

    it('dateTimeFormatter should format date time correctly', () => {
      const testDate = new Date('2025-01-15T12:00:00Z');

      expect(service.dateTimeFormatter(testDate)).toBeTruthy();
    });

    it('percentageFormatter should format percentage values', () => {
      expect(service.percentageFormatter(50)).toContain('50');
      expect(service.percentageFormatter(50, () => ({ numberDigitsInfo: '1.0-0' }))).toContain('50');
    });

    it('currencyFormatter should format currency values', () => {
      expect(service.currencyFormatter(100)).toContain('100');
      expect(service.currencyFormatter(100, () => ({ currency: '$' }))).toContain('$');
    });

    it('numberFormatter should format numbers', () => {
      expect(service.numberFormatter(1234.56)).toContain('1,234.56');
    });

    it('quantityFormatter should format quantity with prefix and suffix', () => {
      const entity = { id: '1' };

      expect(service.quantityFormatter(10, entity, () => ({ prefix: '~', suffix: ' kg' }))).toBe(
        '~10.00 kg'
      );
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
