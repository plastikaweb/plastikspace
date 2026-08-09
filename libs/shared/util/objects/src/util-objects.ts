import { coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * @description Check if an array or object are empty.
 * Performance Optimization: Uses an O(1) path for arrays and an early-exit `for...in`
 * loop for objects instead of `Object.entries(obj).length` or `Object.keys(obj).length`
 * to avoid O(N) array allocations and unnecessary iterations.
 * Now explicitly supports prototype-less objects (Object.create(null)).
 * @param {unknown} obj Object parameter passed.
 * @returns {boolean}.
 */
export function isEmpty(obj: unknown): boolean {
  if (obj === null || obj === undefined) return true;

  if (Array.isArray(obj)) {
    return obj.length === 0;
  }

  if (typeof obj === 'object') {
    const proto = Object.getPrototypeOf(obj);
    if (proto === null || proto === Object.prototype) {
      for (const key in obj as object) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          return false;
        }
      }
      return true;
    }
  }

  return false;
}

/**
 * @description Check if passed parameter is a string.
 * @param {unknown} obj Object parameter passed.
 * @returns {boolean}.
 */
export function isString(obj: unknown): obj is string {
  return typeof obj === 'string';
}

/**
 * @description Check if passed parameter is null or undefined.
 * @param  {unknown} value The passed parameter.
 * @returns {boolean}.
 */
export function isNil(value: unknown): boolean {
  return value === undefined || value === null;
}

/**
 * @description Check if passed parameter is an object.
 * @param  {unknown} obj Object parameter passed.
 * @returns {boolean}.
 */
export function isObject(obj: unknown): boolean {
  return obj instanceof Object && obj.constructor === Object;
}

/**
 * @description Given an url returns an object with name/value pairs of all the query params available.
 * @param  {string} url The string URL.
 * @param  {Record<string, unknown>} defaultParams A list of default query parameters.
 * @returns {Record<string, unknown>}.
 */
export function getQueryParams(
  url: string,
  defaultParams?: Record<string, unknown>
): Record<string, unknown>;

/**
 * @description Given a name/value pairs object it returns an object with name/value pairs of all the query params available.
 * @param  {Record<string, unknown>} urlParams A list of query parameters.
 * @param  {Record<string, unknown>} defaultParams A list of default query parameters.
 * @returns {Record<string, unknown>}.
 */
export function getQueryParams(
  urlParams: Record<string, unknown>,
  defaultParams?: Record<string, unknown>
): Record<string, unknown>;

/**
 * @description Given an URL or a name/value pairs object it returns an object with name/value pairs of all the query params available.
 * @param {string | Record<string, unknown>} params A list of query params.
 * @param  {Record<string, unknown>} defaultParams A list of default query parameters.
 * @returns {Record<string, unknown>}.
 */
export function getQueryParams(
  params: string | Record<string, unknown>,
  defaultParams = {}
): Record<string, unknown> {
  if (isString(params)) {
    return { ...defaultParams, ...formatURLQueryParams(params) };
  } else if (isObject(params)) {
    return { ...defaultParams, ...params };
  }
  throw new Error(
    'getQueryParams has no valid parameters. You need to pass a string or a object of name/value pairs.'
  );
}

/**
 * @description Returns an object from a url with query params. Builds the result by
 * mutating the `reduce` accumulator instead of spreading it (O(N) instead of O(N²)),
 * and returns an empty object for URLs without a query string instead of throwing.
 * @param  {string} url The URL with query params.
 * @returns {Record<string, unknown>}.
 */
export function formatURLQueryParams(url: string): Record<string, unknown> {
  const parts = url.split('?');
  if (parts.length < 2) {
    return {};
  }
  const queryString = parts[1];
  const urlParams = queryString.split('&');
  return urlParams.reduce((prev: Record<string, unknown>, current) => {
    const pair = current.split('=');
    const key = pair[0];
    const value = pair[1];
    if (key) {
      prev[key] = decodeURIComponent(value);
    }
    return prev;
  }, {});
}

/**
 * @description Returns an object without properties with null value. Uses a `for...in`
 * loop instead of `Object.entries().reduce()` to avoid the O(N) array allocation.
 * @param  {Record<string, string | number | boolean | null>} collection Object parameter passed.
 * @returns {Record<string, string | number | boolean>}.
 */
export function removeNullProperties(
  collection: Record<string, string | number | boolean | null>
): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};
  for (const property in collection) {
    if (Object.prototype.hasOwnProperty.call(collection, property)) {
      const value = collection[property];
      if (value !== null) {
        result[property] = value;
      }
    }
  }
  return result;
}

/**
 * @description Returns an object with properties with empty string value replaced by null.
 * Uses a `for...in` loop instead of `Object.entries().reduce()` to avoid the O(N) array allocation.
 * @param  {Record<string, string | number | boolean | null>} collection Object parameter passed.
 * @returns {Record<string, string | number | boolean | null>}.
 */
export function setEmptyStringPropertiesToNull(
  collection: Record<string, string | number | boolean | null>
): Record<string, string | number | boolean | null> {
  const result: Record<string, string | number | boolean | null> = {};
  for (const property in collection) {
    if (Object.prototype.hasOwnProperty.call(collection, property)) {
      const value = collection[property];
      result[property] = isString(value) && !value.length ? null : value;
    }
  }
  return result;
}

/**
 * @description Returns a boolean after comparing the object entries.
 * Uses `for...in` with a `hasOwnProperty` guard instead of `Object.keys().every()` to avoid the
 * O(N) array allocations (and the predicate closure), while preserving own-enumerable-key semantics.
 * @param {object} prev First object.
 * @param {object} curr Current object.
 * @returns {boolean}.
 */
export function areObjectEntriesEqual(prev: object, curr: object): boolean {
  if (prev === curr) {
    return true;
  }

  if (!prev || !curr) {
    return false;
  }

  let prevCount = 0;
  for (const key in prev) {
    if (Object.prototype.hasOwnProperty.call(prev, key)) {
      prevCount++;
      if ((prev as Record<string, unknown>)[key] !== (curr as Record<string, unknown>)[key]) {
        return false;
      }
    }
  }

  let currCount = 0;
  for (const key in curr) {
    if (Object.prototype.hasOwnProperty.call(curr, key)) {
      currCount++;
    }
  }

  return prevCount === currCount;
}

/**
 * @description Returns an object with replaced values for"false" and"true" as boolean values.
 * Uses a `for...in` loop instead of `Object.entries().reduce()` to avoid the O(N) array allocation.
 * @param  {Record<string, string | number | boolean | null>} collection Object parameter passed.
 * @returns {Record<string, string | number | boolean>}.
 */
export function transformStringToBooleanProperties(
  collection: Record<string, string | number | boolean | null>
): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};
  for (const property in collection) {
    if (Object.prototype.hasOwnProperty.call(collection, property)) {
      const value = collection[property];
      result[property] =
        isString(value) && (value === 'false' || value === 'true')
          ? coerceBooleanProperty(value)
          : (value as string | number | boolean);
    }
  }
  return result;
}

/**
 * @description Returns a boolean value depending if all elements in the passed array are false or not.
 * @param {boolean[]} arr An array of boolean values passed as parameter.
 * @returns {boolean}.
 */
export function allAreFalsy(arr: boolean[]): boolean {
  return arr.every(element => element === false);
}

/**
 * @description Returns a string value when the input was able to be converted in string format otherwise it returns an empty string.
 * @param {unknown} value The passed valued as parameter.
 * @returns {string}.
 */
export function transformToString(value: unknown): string {
  if (isString(value)) {
    return value;
  }

  let result;

  try {
    result = JSON.stringify(value) ?? '';
  } catch {
    result = '';
  }

  return result;
}

/**
 * @description Returns an array based on passed collection, using native.
 * `Object.values()` instead of `Object.keys().map()`.
 * @template T
 * @param {Record<string, T>} collection The passed collection as parameter.
 * @returns {T[]}.
 */
export function collectionToArray<T>(collection: Record<string, T>): T[] {
  return Object.values(collection);
}

/**
 * @description Creates a deep clone of the provided value.
 * Uses a manual `for` loop for arrays and a `for...in` loop (guarded by
 * `hasOwnProperty`) for objects instead of `map`/`Object.keys().forEach()`,
 * to drop the intermediate key-array allocation and the per-item closure.
 * @template T
 * @param {T} obj The value to clone.
 * @example
 * deepClone({ a: 1, b: 2 });
 * // { a: 1, b: 2 }
 * @returns {T} A deep copy of the input.
 */
export function deepClone<T>(obj: T): T {
  // Primitives, null and functions are returned as-is; everything past this
  // guard is a non-null object (handled below), so no trailing fallback is needed.
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj) as T;
  }

  if (Array.isArray(obj)) {
    const length = obj.length;
    const cloned = new Array(length);
    for (let i = 0; i < length; i++) {
      cloned[i] = deepClone(obj[i]);
    }
    return cloned as T;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      (cloned as Record<string, unknown>)[key] = deepClone((obj as Record<string, unknown>)[key]);
    }
  }
  return cloned;
}

/** HTML special characters that need escaping. Non-global, for the fast-path `.test()`. */
const ESCAPE_HTML_CHARS = /[&<>"'/`=]/;
/** Global variant of {@link ESCAPE_HTML_CHARS} for `String.prototype.replace()`. */
const ESCAPE_HTML_CHARS_GLOBAL = /[&<>"'/`=]/g;
/** Mapping of HTML special characters to their escaped entities. */
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * @description Escapes HTML special characters to prevent XSS.
 * Hoists the character map and regex to module scope and short-circuits with a
 * `RegExp.test()` fast-path, returning the input unchanged when it has nothing
 * to escape (the common case). Behaviour-identical to the previous `replace`.
 * @param {string} text The string to escape.
 * @returns {string} The escaped string.
 */
export function escapeHtml(text: string): string {
  if (!ESCAPE_HTML_CHARS.test(text)) {
    return text;
  }
  return text.replace(ESCAPE_HTML_CHARS_GLOBAL, s => HTML_ESCAPE_MAP[s]);
}
