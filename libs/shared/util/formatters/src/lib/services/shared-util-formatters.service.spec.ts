import { DatePipe, PercentPipe, TitleCasePipe } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { SharedUtilFormattersService } from './shared-util-formatters.service';

describe('SharedUtilFormattersService', () => {
  let service: SharedUtilFormattersService;
  let sanitizer: DomSanitizer;

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
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('defaultFormatter', () => {
    it('should escape HTML and return SafeHtml', () => {
      const unsafeValue = '<script>alert("XSS")</script>';
      const result = service.defaultFormatter(unsafeValue) as any;

      expect(result.changingThisBreaksApplicationSecurity).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });
  });

  describe('booleanWithIconFormatter', () => {
    it('should escape icon names and return SafeHtml', () => {
      const result = service.booleanWithIconFormatter(true, () => ({
        iconTrue: '"><img src=x onerror=alert(1)>',
        iconFalse: 'close',
      })) as any;

      expect(result.changingThisBreaksApplicationSecurity).toContain('&quot;&gt;&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    });

    it('should use default icons and return SafeHtml', () => {
      const result = service.booleanWithIconFormatter(true) as any;
      expect(result.changingThisBreaksApplicationSecurity).toBe('<span class="material-icons">check</span>');
    });
  });
});
