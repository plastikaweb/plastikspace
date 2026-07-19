/// <reference path="../pb_data/types.d.ts" />

/**
 * Normalizes and validates the nif field on incoming writes.
 *
 * NOTE: isValidNif is intentionally nested inside this handler rather than
 * declared at module top-level. PocketBase's JSVM hook loader does not
 * resolve module-top-level function declarations from inside a named
 * handler passed by reference to onRecordCreateRequest/onRecordUpdateRequest
 * — verified empirically on PocketBase 0.36.7 (see PRV-04d Task 2 report for
 * the reproduction: a top-level `isValidNif` produced a runtime
 * `ReferenceError: isValidNif is not defined` on every create/update,
 * rejecting even checksum-valid NIFs). Sibling hooks in this directory avoid
 * the issue by only ever using inline arrow-function handlers.
 *
 * NOTE: uses `e.requestEvent.request` (not `e.httpContext.request()` and not
 * `e.request`) to read the bypass header. Neither `httpContext` nor a
 * top-level `request` exist on `RecordRequestEvent` in this PocketBase
 * build (0.36.7) — confirmed by dumping `Object.keys(e)` at runtime, which
 * has neither key. The actual HTTP request lives one level down, on the
 * embedded `requestEvent` (`e.requestEvent.request.header.get(...)`),
 * confirmed empirically (see PRV-04d Task 2 report). The `e.httpContext...`
 * pattern used by sibling hooks in this directory always evaluates falsy, so
 * `x-bypass-hooks` is silently a no-op for them — fixed here; sibling hooks
 * left untouched as out of scope for this task.
 *
 * @param {core.RecordRequestEvent} e
 */
function validateFiscalProfile(e) {
  if (
    e.requestEvent &&
    e.requestEvent.request &&
    e.requestEvent.request.header.get('x-bypass-hooks') === 'true'
  ) {
    return e.next();
  }

  /**
   * Validates the NIF/NIE/CIF checksum. Port of the frontend nifValidator
   * (libs/shared/form/util) — keep both in sync.
   * @param {string} raw
   * @returns {boolean}
   */
  function isValidNif(raw) {
    if (!raw) return false;
    const value = String(raw).trim().toUpperCase();
    const controlLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const cifControlLetters = 'JABCDEFGHI';
    const cifLetterOnlyOrgs = 'NPQRSW';
    const cifNumberOnlyOrgs = 'ABEH';

    const dniMatch = /^(\d{8})([A-Z])$/.exec(value);
    if (dniMatch) {
      return controlLetters[Number(dniMatch[1]) % 23] === dniMatch[2];
    }

    const nieMatch = /^([KLMXYZ])(\d{7})([A-Z])$/.exec(value);
    if (nieMatch) {
      const niePrefix = { K: '0', L: '0', M: '0', X: '0', Y: '1', Z: '2' }[nieMatch[1]];
      return controlLetters[Number(niePrefix + nieMatch[2]) % 23] === nieMatch[3];
    }

    const cifMatch = /^([ABCDEFGHJNPQRSUVW])(\d{7})([0-9A-J])$/.exec(value);
    if (cifMatch) {
      const orgLetter = cifMatch[1];
      const digits = cifMatch[2];
      const controlChar = cifMatch[3];
      let sum = 0;
      for (let i = 0; i < digits.length; i++) {
        const digit = Number(digits[i]);
        if (i % 2 === 0) {
          const doubled = digit * 2;
          sum += doubled > 9 ? Math.floor(doubled / 10) + (doubled % 10) : doubled;
        } else {
          sum += digit;
        }
      }
      const controlDigit = (10 - (sum % 10)) % 10;
      const expectedLetter = cifControlLetters[controlDigit];
      const expectedNumber = String(controlDigit);
      if (cifLetterOnlyOrgs.includes(orgLetter)) return controlChar === expectedLetter;
      if (cifNumberOnlyOrgs.includes(orgLetter)) return controlChar === expectedNumber;
      return controlChar === expectedLetter || controlChar === expectedNumber;
    }

    return false;
  }

  const nif = String(e.record.getString('nif')).trim().toUpperCase();
  if (!isValidNif(nif)) {
    throw new BadRequestError('Invalid NIF/NIE/CIF: checksum failed.');
  }
  e.record.set('nif', nif);
  e.next();
}

onRecordCreateRequest(validateFiscalProfile, 'user_fiscal_profiles');
onRecordUpdateRequest(validateFiscalProfile, 'user_fiscal_profiles');
