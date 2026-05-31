import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { HighlightPipe } from './highlight.pipe';
import { Injector, runInInjectionContext } from '@angular/core';

describe('HighlightPipe', () => {
  let pipe: HighlightPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (val: string) => val,
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

  it('should return original value if search is empty', () => {
    expect(pipe.transform('Hello World', '')).toBe('Hello World');
    expect(pipe.transform('Hello World', null)).toBe('Hello World');
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

  it('should return original value if no match found', () => {
    expect(pipe.transform('Hello World', 'NotFound')).toBe('Hello World');
  });
});
