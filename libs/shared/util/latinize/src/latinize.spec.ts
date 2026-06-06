import { describe, expect, it } from 'vitest';
import { latinize } from './latinize';

describe('latinize', () => {
  it('returns ASCII strings unchanged', () => {
    expect(latinize('hello world')).toBe('hello world');
    expect(latinize('ABC123')).toBe('ABC123');
  });

  it('converts accented Latin characters to ASCII equivalents', () => {
    expect(latinize('café')).toBe('cafe');
    expect(latinize('naïve')).toBe('naive');
    expect(latinize('résumé')).toBe('resume');
  });

  it('preserves uppercase Cyrillic А as uppercase A', () => {
    expect(latinize('А')).toBe('A');
  });

  it('preserves lowercase Cyrillic а as lowercase a', () => {
    expect(latinize('а')).toBe('a');
  });

  it('preserves uppercase Cyrillic Я as uppercase YA', () => {
    expect(latinize('Я')).toBe('YA');
  });

  it('preserves lowercase Cyrillic я as lowercase ya', () => {
    expect(latinize('я')).toBe('ya');
  });

  it('handles a mixed ASCII and non-ASCII string', () => {
    // em-dash is not in the characters map so it passes through unchanged
    expect(latinize('El Clot — Associació')).toBe('El Clot — Associacio');
  });

  it('returns an empty string unchanged', () => {
    expect(latinize('')).toBe('');
  });

  it('leaves unmapped non-ASCII characters as-is', () => {
    const unmapped = '日本語';
    expect(latinize(unmapped)).toBe(unmapped);
  });
});
