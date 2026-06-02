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
    it('should escape HTML in defaultFormatter', () => {
      const unsafeValue = '<script>alert("xss")</script>';
      const formatted = service.defaultFormatter(unsafeValue) as any;
      // In Angular testing, SafeHtml is often an object with a property like 'changingThisBreaksApplicationSecurity'
      const sanitizedValue =
        formatted['changingThisBreaksApplicationSecurity'] || formatted.toString();
      expect(sanitizedValue).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
      expect(sanitizedValue).not.toContain('<script>');
    });

    it('should escape HTML in booleanWithIconFormatter icons', () => {
      const unsafeTrueIcon = 'check"><script>alert(1)</script>';
      const formatted = service.booleanWithIconFormatter(true, () => ({
        iconTrue: unsafeTrueIcon,
        iconFalse: 'close',
      })) as any;
      const sanitizedValue =
        formatted['changingThisBreaksApplicationSecurity'] || formatted.toString();
      expect(sanitizedValue).toContain('check&quot;&gt;&lt;script&gt;alert(1)&lt;&#x2F;script&gt;');
      expect(sanitizedValue).not.toContain('<script>');
    });
  });
});
