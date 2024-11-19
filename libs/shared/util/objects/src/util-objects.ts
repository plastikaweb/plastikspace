import { coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * @description Check if an array or object are empty.
 * @param {any} obj Object parameter passed.
 * @returns {boolean}.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmpty(obj: any): boolean {
  return [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;
}

/**
 * @description Check if passed parameter is a string.
 * @param {any} obj Object parameter passed.
 * @returns {boolean}.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isString(obj: any): obj is string {
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
 * @param  {any} obj Object parameter passed.
 * @returns {boolean}.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(obj: any): boolean {
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
 * @param {any} params A list of query params.
 * @param  {Record<string, unknown>} defaultParams A list of default query parameters.
 * @returns {Record<string, unknown>}.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getQueryParams(params: any, defaultParams = {}): Record<string, unknown> {
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
 * @description Returns an object from a url with query params.
 * @param  {string} url The URL with query params.
 * @returns {Record<string, unknown>}.
 */
export function formatURLQueryParams(url: string): Record<string, unknown> {
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
 * @description Returns an object without properties with null value.
 * @param  {Record<string, string | number | boolean | null>} collection Object parameter passed.
 * @returns {Record<string, string | number | boolean>}.
 */
export function removeNullProperties(
  collection: Record<string, string | number | boolean | null>
): Record<string, string | number | boolean> {
  return Object.entries(collection).reduce(
    (currentCollection: Record<string, string | number | boolean | null>, [property, value]) =>
      value === null
        ? currentCollection
        : ((currentCollection[property] = value), currentCollection),
    {}
  ) as Record<string, string | number | boolean>;
}

/**
 * @description Returns an object with properties with empty string value replaced by null.
 * @param  {Record<string, string | number | boolean | null>} collection Object parameter passed.
 * @returns {Record<string, string | number | boolean | null>}.
 */
export function setEmptyStringPropertiesToNull(
  collection: Record<string, string | number | boolean | null>
): Record<string, string | number | boolean | null> {
  return Object.entries(collection).reduce(
    (currentCollection: Record<string, string | number | boolean | null>, [property, value]) => {
      currentCollection[property] = isString(value) && !value.length ? null : value;
      return currentCollection;
    },
    {}
  ) as Record<string, string | number | boolean | null>;
}

/**
 * @description Returns a boolean after comparing the object entries.
 * @param {object} prev First object.
 * @param {object} curr Current object.
 * @returns {boolean}.
 */
export function areObjectEntriesEqual(prev: object, curr: object): boolean {
  if (!prev && !curr) {
    return true;
  }

  if (!prev || !curr) {
    return false;
  }

  return Object.entries(prev).toString() === Object.entries(curr).toString();
}

/**
 * @description Returns an object with replaced values for "false" and "true" as boolean values.
 * @param  {Record<string, string | number | boolean | null>} collection Object parameter passed.
 * @returns {Record<string, string | number | boolean>}.
 */
export function transformStringToBooleanProperties(
  collection: Record<string, string | number | boolean | null>
): Record<string, string | number | boolean> {
  return Object.entries(collection).reduce(
    (currentCollection: Record<string, string | number | boolean | null>, [property, value]) => {
      currentCollection[property] =
        isString(value) && (value === 'false' || value === 'true')
          ? coerceBooleanProperty(value)
          : value;
      return currentCollection;
    },
    {}
  ) as Record<string, string | number | boolean>;
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
  } catch (_) {
    result = '';
  }

  return result;
}

/**
 * @description Returns an array based on passed collection.
 * @param {Record} collection The passed collection as parameter.
 * @returns {Array}.
 */
export function collectionToArray<T>(collection: Record<string, T>): T[] {
  return Object.keys(collection).map((key: string) => collection[key]);
}
