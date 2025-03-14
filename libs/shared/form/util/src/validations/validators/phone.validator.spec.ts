import { FormControl } from '@angular/forms';
import { phoneValidator } from './phone.validator';

describe('phoneValidator', () => {
  it('should return null for a valid phone number', () => {
    const control = new FormControl('666777888');
    expect(phoneValidator(control)).toBeNull();
  });

  it('should return null when value is empty', () => {
    const control = new FormControl('');
    expect(phoneValidator(control)).toBeNull();
  });

  it('should return null when value is null', () => {
    const control = new FormControl(null);
    expect(phoneValidator(control)).toBeNull();
  });

  it('should return error for a number not starting with 6-9', () => {
    const control = new FormControl('555777888');
    expect(phoneValidator(control)).toEqual({ phone: true });
  });

  it('should return error for a number with less than 9 digits', () => {
    const control = new FormControl('66677788');
    expect(phoneValidator(control)).toEqual({ phone: true });
  });

  it('should return error for a number with more than 9 digits', () => {
    const control = new FormControl('6667778889');
    expect(phoneValidator(control)).toEqual({ phone: true });
  });

  it('should return error for a value with non-numeric characters', () => {
    const control = new FormControl('66677788a');
    expect(phoneValidator(control)).toEqual({ phone: true });
  });
});
