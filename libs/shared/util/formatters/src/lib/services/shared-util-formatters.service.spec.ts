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

  describe('XSS Prevention', () => {
    it('defaultFormatter should escape HTML', () => {
      const maliciousInput = '<img src=x onerror=alert(1)>';
      const result = service.defaultFormatter(maliciousInput) as string;
      expect(result).toBe('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    });

    it('booleanWithIconFormatter should escape custom icons', () => {
      const maliciousIcon = '"><img src=x onerror=alert(1)>';
      const result = service.booleanWithIconFormatter(true, () => ({
        iconTrue: maliciousIcon,
        iconFalse: 'close',
      })) as string;

      expect(result).not.toContain(maliciousIcon);
      expect(result).toContain('&quot;&gt;&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    });
  });
});
