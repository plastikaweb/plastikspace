import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { vi, Mock } from 'vitest';
import { HumanizeUnitPipe } from './humanize-unit.pipe';

describe('HumanizeUnitPipe', () => {
  let pipe: HumanizeUnitPipe;
  let translateServiceMock: Partial<TranslateService>;

  beforeEach(() => {
    translateServiceMock = {
      getCurrentLang: vi.fn().mockReturnValue('en-US'),
    };

    TestBed.configureTestingModule({
      providers: [HumanizeUnitPipe, { provide: TranslateService, useValue: translateServiceMock }],
    });

    pipe = TestBed.inject(HumanizeUnitPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null, undefined, or NaN', () => {
    expect(pipe.transform(null, 'unit')).toBe('');
    expect(pipe.transform(undefined, 'unit')).toBe('');
    expect(pipe.transform(NaN, 'unit')).toBe('');
  });

  it('should format volume correctly (L for >= 1, mL for < 1)', () => {
    expect(pipe.transform(1.5, 'volume')).toBe('1.50\u00A0L');
    expect(pipe.transform(1, 'volume')).toBe('1\u00A0L');
    expect(pipe.transform(0.5, 'volume')).toBe('500\u00A0mL');
    expect(pipe.transform(0.001, 'volume')).toBe('1\u00A0mL');
  });

  it('should format weight correctly (kg for >= 1, g for < 1)', () => {
    expect(pipe.transform(1.5, 'weight')).toBe('1.50\u00A0kg');
    expect(pipe.transform(1, 'weight')).toBe('1\u00A0kg');
    expect(pipe.transform(0.5, 'weight')).toBe('500\u00A0g');
    expect(pipe.transform(0.001, 'weight')).toBe('1\u00A0g');
  });

  it('should use default formatting for"unit" type', () => {
    expect(pipe.transform(100, 'unit')).toBe('100');
    expect(pipe.transform(100.5, 'unit')).toBe('100.50');
  });

  it('should use locale formatting', () => {
    (translateServiceMock.getCurrentLang as Mock).mockReturnValue('de-DE');
    expect(pipe.transform(1.5, 'unit').replace(/\s/g, ' ')).toMatch(/1,5|1.5/);
  });

  it('should reuse cached Intl.NumberFormat instances for the same language and pattern', () => {
    const getSpy = vi.spyOn(Map.prototype, 'get');
    const setSpy = vi.spyOn(Map.prototype, 'set');

    // First transform: cache miss, instantiates and sets
    pipe.transform(1.5, 'unit');
    expect(setSpy).toHaveBeenCalled();

    // Reset spies
    getSpy.mockClear();
    setSpy.mockClear();

    // Second transform with same logic: cache hit, should NOT call set
    pipe.transform(1.5, 'unit');
    expect(getSpy).toHaveBeenCalled();
    expect(setSpy).not.toHaveBeenCalled();

    getSpy.mockRestore();
    setSpy.mockRestore();
  });

  it('should create a new Intl.NumberFormat instance if the language changes', () => {
    const setSpy = vi.spyOn(Map.prototype, 'set');

    pipe.transform(1.5, 'unit');
    expect(setSpy).toHaveBeenCalled();
    setSpy.mockClear();

    // Change lang
    (translateServiceMock.getCurrentLang as Mock).mockReturnValue('de-DE');
    pipe.transform(1.5, 'unit');
    expect(setSpy).toHaveBeenCalled(); // Cache miss due to different language

    setSpy.mockRestore();
  });
});
