import {
  allAreFalsy,
  areObjectEntriesEqual,
  getQueryParams,
  isEmpty,
  isNil,
  isObject,
  isString,
  removeNullProperties,
  setEmptyStringPropertiesToNull,
  transformStringToBooleanProperties,
  transformToString,
} from './utils-objects';

describe('Object Utils', () => {
  describe('isEmpty method', () => {
    it('should return true if object is empty', () => {
      expect(isEmpty({})).toBeTruthy();
    });

    it('should return false if object is not empty', () => {
      expect(isEmpty({ a: 1 })).toBeFalsy();
    });

    it('should return true if array is empty', () => {
      expect(isEmpty([])).toBeTruthy();
    });

    it('should return false if array is not empty', () => {
      expect(isEmpty([1, 2])).toBeFalsy();
    });
  });

  describe('isString method', () => {
    it('should return true if parameter is a string', () => {
      expect(isString('')).toBeTruthy();
    });

    it('should return false if parameter is not a string', () => {
      expect(isString({})).toBeFalsy();
      expect(isString(2)).toBeFalsy();
      expect(isString(null)).toBeFalsy();
      expect(isString(true)).toBeFalsy();
    });
  });

  describe('isObject method', () => {
    it('should return true if parameter is an object', () => {
      expect(isObject({})).toBeTruthy();
    });

    it('should return false if parameter is not an object', () => {
      expect(isObject('')).toBeFalsy();
      expect(isObject([])).toBeFalsy();
      expect(isObject(2)).toBeFalsy();
      expect(isObject(null)).toBeFalsy();
      expect(isObject(true)).toBeFalsy();
    });
  });

  describe('isNil method', () => {
    it('should return true if parameter is null or undefined', () => {
      expect(isNil(undefined)).toBeTruthy();
      expect(isNil(null)).toBeTruthy();
    });

    it('should return false if parameter is not null or undefined', () => {
      expect(isNil('')).toBeFalsy();
      expect(isNil([])).toBeFalsy();
      expect(isNil(0)).toBeFalsy();
      expect(isNil(2)).toBeFalsy();
      expect(isNil({})).toBeFalsy();
      expect(isNil(true)).toBeFalsy();
      expect(isNil(false)).toBeFalsy();
    });
  });

  describe('getQueryParams method', () => {
    const defaultParams = { test: 'test' };
    it('should return an object from a url query string', () => {
      const result = getQueryParams('https://example.com?example=something&data=13');
      expect(result).toEqual({ example: 'something', data: '13' });
    });

    it('should return an object from a url query string with default parameters', () => {
      const result = getQueryParams('https://example.com?example=something&data=13', defaultParams);
      expect(result).toEqual({ example: 'something', data: '13', test: 'test' });
    });

    it('should return an object from a name/value pairs', () => {
      const result = getQueryParams({ example: 'something', data: '13' });
      expect(result).toEqual({ example: 'something', data: '13' });
    });

    it('should return an object from a name/value pairs with default parameters', () => {
      const result = getQueryParams({ example: 'something', data: '13' }, defaultParams);
      expect(result).toEqual({ example: 'something', data: '13', test: 'test' });
    });

    it('should return an empty object if no url query string is passed as a parameter', () => {
      const result = getQueryParams({});
      expect(result).toEqual({});
    });

    it('should raise an error if no valid parameters are passed', () => {
      expect.assertions(1);

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getQueryParams(false as any, {});
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('removeNullProperties method', () => {
    it('should return an object without properties with no values equal to null ', () => {
      const result = removeNullProperties({ param1: null, param2: '', param3: true, param4: false, param6: 'test' });
      expect(result).toEqual({ param2: '', param3: true, param4: false, param6: 'test' });
    });
  });

  describe('setEmptyStringPropertiesToNull method', () => {
    it('should return an object with properties with an empty string value replaced with null', () => {
      const result = setEmptyStringPropertiesToNull({ param1: null, param2: '', param3: true, param4: false, param6: 'test' });
      expect(result).toEqual({ param1: null, param2: null, param3: true, param4: false, param6: 'test' });
    });
  });

  describe('areObjectEntriesEqual method', () => {
    it('compare the entries of two objects returning a boolean value', () => {
      const result = areObjectEntriesEqual({ key: 'test' }, { key: 'test' });
      expect(result).toEqual(true);
    });
  });

  describe('transformStringToBooleanProperties method', () => {
    it('should return an object with properties with "true" of "false" values replaced with corresponding boolean values', () => {
      const result = transformStringToBooleanProperties({ param1: 'false', param2: 'true', param3: true, param4: false, param6: 'test' });
      expect(result).toEqual({ param1: false, param2: true, param3: true, param4: false, param6: 'test' });
    });
  });

  describe('allAreFalsy method', () => {
    it('should return false if any element in passed array is truthy', () => {
      const result = allAreFalsy([false, false, true]);
      expect(result).toBeFalsy();
    });

    it('should return true if all elements in passed array are falsy', () => {
      const result = allAreFalsy([false, false, false]);
      expect(result).toBeTruthy();
    });
  });

  describe('transformToString method', () => {
    it('should return a value if we set an object as input', () => {
      const result = transformToString({});
      expect(result).toBe('{}');
    });

    it('should return a value if we set an array as input', () => {
      const result = transformToString([]);
      expect(result).toBe('[]');
    });

    it('should return a value if we set a string as input', () => {
      const result = transformToString('test');
      expect(result).toBe('test');
    });

    it('should return a value if we set a number as input', () => {
      const result = transformToString(4);
      expect(result).toBe('4');
    });

    it('should return a value if we set a boolean as input', () => {
      const result = transformToString(true);
      expect(result).toBe('true');
    });

    it('should return an empty string if we set a function as input', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const result = transformToString(() => {});
      expect(result).toBe('');
    });
  });
});
