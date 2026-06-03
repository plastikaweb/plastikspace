import { DatePipe, PercentPipe, TitleCasePipe } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

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
      ],
    });
    service = TestBed.inject(SharedUtilFormattersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Security', () => {
    const maliciousHtml = '<img src=x onerror=alert(1)>';

    it('defaultFormatter should escape HTML to prevent XSS', () => {
      const result = service.defaultFormatter(maliciousHtml) as any;
      // Note: DomSanitizer.bypassSecurityTrustHtml returns an object that typically
      // has a property containing the actual HTML (e.g., 'changingThisBreaksApplicationSecurity')
      // but the exact structure depends on the implementation.
      // We expect the escaped version to be in there.
      const htmlValue = result.changingThisBreaksApplicationSecurity || result.toString();
      expect(htmlValue).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    });

    it('booleanWithIconFormatter should escape icon names to prevent XSS', () => {
      const maliciousExtras = () => ({
        iconTrue: maliciousHtml,
        iconFalse: 'close',
      });
      const result = service.booleanWithIconFormatter(true, maliciousExtras) as any;
      const htmlValue = result.changingThisBreaksApplicationSecurity || result.toString();
      expect(htmlValue).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    });
  });
});
