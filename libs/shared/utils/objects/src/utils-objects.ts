import { coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * checks if an array or object are empty.
 * @param  {any} obj
 * @returns boolean
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmpty(obj: any) {
  return [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;
}

/**
 * checks if passed parameter is a string.
 * @param  {string|T} str
 * @returns boolean
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isString<T = any>(str: string | T): str is string {
  return typeof str === 'string';
}
/**
 * checks if passed parameter is null or undefined.
 * @param  {unknown} value
 * @returns boolean
 */
export function isNil(value: unknown): boolean {
  return value === undefined || value === null;
}

/**
 * checks if passed parameter is an object.
 * @param  {any} obj
 * @returns boolean
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(obj: any) {
  return obj instanceof Object && obj.constructor === Object;
}

/**
 * given an url returns an object with name/value pairs of all the query params available.
 * @param  {string} url
 * @param  {Record<string, unknown>} defaultParams?
 * @returns Record<string, unknown>
 */
export function getQueryParams(url: string, defaultParams?: Record<string, unknown>): Record<string, unknown>;
/**
 * Given a name/value pairs object it returns an object with name/value pairs of all the query params available.
 * @param  {Record<string, unknown>} urlParams
 * @param  {Record<string, unknown>} defaultParams?
 * @returns Record<string, unknown>
 */
export function getQueryParams(urlParams: Record<string, unknown>, defaultParams?: Record<string, unknown>): Record<string, unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getQueryParams(params: any, defaultParams = {}) {
  if (isString(params)) {
    return { ...defaultParams, ...formatURLQueryParams(params) };
  } else if (isObject(params)) {
    return { ...defaultParams, ...params };
  }
  throw new Error('getQueryParams has no valid parameters. You need to pass a string or a object of name/value pairs.');
}

/**
 * returns an object from a url with query params.
 * @param  {string} url
 * @returns object
 */
export function formatURLQueryParams(url: string) {
  const urlParams = url.split('?')[1].split('&');
  return urlParams.reduce((prev, current) => {
    const pair = current.split('=');
    return {
      ...prev,
      [pair[0]]: decodeURIComponent(pair[1]),
    };
  }, {});
}

/**
 * returns an object without properties with null value.
 * @param  {Record<string, string | number | boolean | null>} collection
 * @returns object
 */
export function removeNullProperties(collection: Record<string, string | number | boolean | null>) {
  return Object.entries(collection).reduce(
    (currentCollection: Record<string, string | number | boolean | null>, [property, value]) =>
      value === null ? currentCollection : ((currentCollection[property] = value), currentCollection),
    {},
  ) as Record<string, string | number | boolean>;
}

/**
 * returns an object with properties with empty string value replaced by null.
 * @param  {Record<string, string | number | boolean | null>} collection
 * @returns object
 */
export function setEmptyStringPropertiesToNull(collection: Record<string, string | number | boolean | null>) {
  return Object.entries(collection).reduce((currentCollection: Record<string, string | number | boolean | null>, [property, value]) => {
    currentCollection[property] = isString(value) && !value.length ? null : value;
    return currentCollection;
  }, {}) as Record<string, string | number | boolean | null>;
}

/**
 * returns a boolean after comparing the object entries.
 * @param {object} prev
 * @param {object} curr
 * @returns boolean
 */
export function areObjectEntriesEqual(prev: object, curr: object) {
  if (!prev && !curr) {
    return true;
  }

  if (!prev || !curr) {
    return false;
  }

  return Object.entries(prev).toString() === Object.entries(curr).toString();
}

/**
 * returns an object with replaced values for "false" and "true" as boolean values.
 * @param  {Record<string, string | number | boolean | null>} collection
 * @returns object
 */
export function transformStringToBooleanProperties(collection: Record<string, string | number | boolean | null>) {
  return Object.entries(collection).reduce((currentCollection: Record<string, string | number | boolean | null>, [property, value]) => {
    currentCollection[property] = isString(value) && (value === 'false' || value === 'true') ? coerceBooleanProperty(value) : value;
    return currentCollection;
  }, {}) as Record<string, string | number | boolean>;
}
/**
 * returns a boolean value depending if all elements in the passed array are false or not.
 * @param {boolean[]} arr
 * @returns boolean
 */
export function allAreFalsy(arr: boolean[]): boolean {
  return arr.every(element => element === false);
}
/**
 * returns a string value when the input was able to be converted in string, otherwise null.
 * @param {unknown} value
 * @returns string | null
 */
export function transformToString(value: unknown): string {
  if (isString(value)) {
    return value;
  }

  let result;

  try {
    result = JSON.stringify(value) ?? '';
  } catch (_) {
    result = '';
  }

  return result;
}
