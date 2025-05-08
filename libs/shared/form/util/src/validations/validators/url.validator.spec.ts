import { FormControl } from '@angular/forms';
import { urlValidator } from './url.validator';

describe('urlValidator', () => {
  it('should return null for a valid URL with https', () => {
    const control = new FormControl('https://www.example.com');
    expect(urlValidator(control)).toBeNull();
  });

  it('should return null for a valid URL with http', () => {
    const control = new FormControl('http://example.com');
    expect(urlValidator(control)).toBeNull();
  });

  it('should return null for a valid URL without protocol', () => {
    const control = new FormControl('www.example.com');
    expect(urlValidator(control)).toBeNull();
  });

  it('should return null when value is empty', () => {
    const control = new FormControl('');
    expect(urlValidator(control)).toBeNull();
  });

  it('should return null when value is null', () => {
    const control = new FormControl(null);
    expect(urlValidator(control)).toBeNull();
  });

  it('should return error for an invalid URL format', () => {
    const control = new FormControl('not-a-url');
    expect(urlValidator(control)).toEqual({ url: true });
  });

  it('should return error for URL with invalid characters', () => {
    const control = new FormControl('http://example.com/<script>');
    expect(urlValidator(control)).toEqual({ url: true });
  });

  it('should return null for URL with valid path and query parameters', () => {
    const control = new FormControl('https://example.com/path?param=value&other=123');
    expect(urlValidator(control)).toBeNull();
  });

  it('should return null for URL with subdomain', () => {
    const control = new FormControl('https://subdomain.example.com');
    expect(urlValidator(control)).toBeNull();
  });
});
