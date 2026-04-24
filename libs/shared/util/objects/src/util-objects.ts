import { coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * Check if an array or object are empty.
 * @param obj - Object parameter passed.
 * @returns A boolean indicating if the object is empty.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmpty(obj: any): boolean {
  return [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;
}

/**
 * Check if passed parameter is a string.
 * @param obj - Object parameter passed.
 * @returns A boolean indicating if the object is a string.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isString(obj: any): obj is string {
  return typeof obj === 'string';
}

/**
 * Check if passed parameter is null or undefined.
 * @param value - The passed parameter.
 * @returns A boolean indicating if the value is null or undefined.
 */
export function isNil(value: unknown): boolean {
  return value === undefined || value === null;
}

/**
 * Check if passed parameter is an object.
 * @param obj - Object parameter passed.
 * @returns A boolean indicating if the parameter is an object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(obj: any): boolean {
  return obj instanceof Object && obj.constructor === Object;
}

/**
 * Returns an object from a url with query params.
 * @param url - The URL with query params.
 * @returns A record of query parameters.
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
 * Given an url returns an object with name/value pairs of all the query params available.
 * @param url - The string URL.
 * @param defaultParams - A list of default query parameters.
 * @returns A record of query parameters.
 */
export function getQueryParams(
  url: string,
  defaultParams?: Record<string, unknown>
): Record<string, unknown>;

/**
 * Given a name/value pairs object it returns an object with name/value pairs of all the query params available.
 * @param urlParams - A list of query parameters.
 * @param defaultParams - A list of default query parameters.
 * @returns A record of query parameters.
 */
export function getQueryParams(
  urlParams: Record<string, unknown>,
  defaultParams?: Record<string, unknown>
): Record<string, unknown>;

/**
 * Given an URL or a name/value pairs object it returns an object with name/value pairs of all the query params available.
 * @param params - A list of query params.
 * @param defaultParams - A list of default query parameters.
 * @returns A record of query parameters.
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
 * Returns an object without properties with null value.
 * @param collection - Object parameter passed.
 * @returns A record without null properties.
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
 * Returns an object with properties with empty string value replaced by null.
 * @param collection - Object parameter passed.
 * @returns A record with empty strings set to null.
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
 * Returns a boolean after comparing the object entries.
 * @param prev - First object.
 * @param curr - Current object.
 * @returns A boolean indicating if the object entries are equal.
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
 * Returns an object with replaced values for "false" and "true" as boolean values.
 * @param collection - Object parameter passed.
 * @returns A record with string booleans transformed.
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
 * Returns a boolean value depending if all elements in the passed array are false or not.
 * @param arr - An array of boolean values passed as parameter.
 * @returns A boolean indicating if all elements are falsy.
 */
export function allAreFalsy(arr: boolean[]): boolean {
  return arr.every(element => element === false);
}

/**
 * Returns a string value when the input was able to be converted in string format otherwise it returns an empty string.
 * @param value - The passed valued as parameter.
 * @returns The transformed string.
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
 * Returns an array based on passed collection.
 * @param collection - The passed collection as parameter.
 * @returns An array of the collection's values.
 */
export function collectionToArray<T>(collection: Record<string, T>): T[] {
  return Object.keys(collection).map((key: string) => collection[key]);
}
