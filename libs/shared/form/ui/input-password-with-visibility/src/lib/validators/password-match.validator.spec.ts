import { FormControl, FormGroup } from '@angular/forms';

import { passwordMatchValidator } from './password-match.validator';

describe('passwordMatchValidator', () => {
  /**
   * Builds a group holding the given values, one control each.
   * @param {Record<string, string>} values The values, by key.
   * @returns {FormGroup} The group.
   */
  function groupOf(values: Record<string, string>): FormGroup {
    return new FormGroup(
      Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, new FormControl(value)])
      )
    );
  }

  it('reads the keys of the profile form when no key is named', () => {
    const same = groupOf({ newPassword: 'test-Secret1', confirmPassword: 'test-Secret1' });
    const different = groupOf({ newPassword: 'test-Secret1', confirmPassword: 'test-Secret2' });

    expect(passwordMatchValidator(same)).toBeNull();
    expect(passwordMatchValidator(different)).toEqual({ passwordMatch: true });
  });

  it('reads the keys it is told to', () => {
    const different = groupOf({ password: 'test-Secret1', repeat: 'test-Secret2' });

    expect(passwordMatchValidator(different)).toBeNull();
    expect(
      passwordMatchValidator(different, undefined, {
        passwordKey: 'password',
        confirmKey: 'repeat',
      })
    ).toEqual({ passwordMatch: true });
  });

  it('keeps quiet while one of the two fields is empty', () => {
    expect(
      passwordMatchValidator(groupOf({ newPassword: 'test-Secret1', confirmPassword: '' }))
    ).toBeNull();
    expect(
      passwordMatchValidator(groupOf({ newPassword: '', confirmPassword: 'test-Secret1' }))
    ).toBeNull();
  });
});
