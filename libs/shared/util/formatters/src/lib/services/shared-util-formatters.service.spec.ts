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

  describe('defaultFormatter', () => {
    it('should escape HTML special characters', () => {
      const unsafeValue = '<script>alert("XSS")</script>';
      const expectedEscapedValue = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;';
      const result = service.defaultFormatter(unsafeValue);
      expect(result.toString()).toBe(expectedEscapedValue);
    });
  });

  describe('booleanWithIconFormatter', () => {
    it('should escape icon names', () => {
      const unsafeIcon = 'check"><script>alert("XSS")</script>';
      const result = service.booleanWithIconFormatter(true, () => ({
        iconTrue: unsafeIcon,
        iconFalse: 'close',
      }));
      expect(result.toString()).toContain('&lt;script&gt;');
      expect(result.toString()).not.toContain('<script>');
    });
  });
});
