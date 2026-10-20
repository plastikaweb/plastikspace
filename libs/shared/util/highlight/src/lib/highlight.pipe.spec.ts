import { Injector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { HighlightPipe } from './highlight.pipe';

describe('HighlightPipe', () => {
  let pipe: HighlightPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (value: string) => value,
          },
        },
      ],
    });

    runInInjectionContext(TestBed.inject(Injector), () => {
      pipe = new HighlightPipe();
    });
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return escaped value if search is empty', () => {
    expect(pipe.transform('Hello World', '')).toBe('Hello World');
    expect(pipe.transform('<b>Hello</b>', null)).toBe('&lt;b&gt;Hello&lt;&#x2F;b&gt;');
  });

  it('should highlight matching text', () => {
    const result = pipe.transform('Hello World', 'Hello') as string;

    expect(result).toContain('<mark');
    expect(result).toContain('Hello');
  });

  it('should be case insensitive', () => {
    const result = pipe.transform('Hello World', 'hello') as string;

    expect(result).toContain('<mark');
    expect(result).toContain('Hello');
  });

  it('should be accent insensitive', () => {
    const result = pipe.transform('Héllò World', 'hello') as string;

    expect(result).toContain('<mark');
    expect(result).toContain('Héllò');
  });

  it('should return escaped value if no match found', () => {
    expect(pipe.transform('<b>Hello</b>', 'NotFound')).toBe('&lt;b&gt;Hello&lt;&#x2F;b&gt;');
  });

  it('should escape HTML to prevent XSS', () => {
    const maliciousInput = '<script>alert("xss")</script> Hello';
    const result = pipe.transform(maliciousInput, 'Hello') as string;

    expect(result).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    expect(result).toContain('<mark');
    expect(result).toContain('Hello');
  });

  it('should cache transform results for repeated evaluations', () => {
    const firstResult = pipe.transform('Caching test phrase', 'test');
    const secondResult = pipe.transform('Caching test phrase', 'test');

    expect(firstResult).toBe(secondResult);
  });

  it('should handle cache eviction without errors when capacity is exceeded', () => {
    for (let i = 0; i < 550; i++) {
      pipe.transform(`Unique item text ${i}`, 'item');
    }

    const newResult = pipe.transform('Unique item text 600', 'item') as string;

    expect(newResult).toContain('<mark');
    expect(newResult).toContain('item');
  });
});
