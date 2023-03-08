# shared-util-objects

- [shared-util-objects](#shared-util-objects)
  - [Description](#description)
  - [How to use](#how-to-use)
  - [Available utilities](#available-utilities)
  - [Running unit tests](#running-unit-tests)

## Description

A shared library to transform data that involves object manipulation and/or generation.

## How to use

- Import directly any utility method where is needed.

## Available utilities

- `isEmpty`: checks if an array or object are empty.
- `isString`: checks if passed parameter is a string.
- `isObject`: checks if passed parameter is an object.
- `getQueryParams`: given an url or a name/value pairs object returns an object with name/value pairs of all the query params available.
- `formatURLQueryParams`: returns an object from a url with query params.
- `removeNullProperties`: returns an object without properties with null value.
- `setEmptyStringPropertiesToNull`: returns an object with properties with empty string value replaced by null.
- `areObjectEntriesEqual`: returns a boolean after comparing the object entries.
- `transformStringToBooleanProperties`: returns an object with replaced values for "false" and "true" as boolean values.
- `allAreFalsy`: returns a boolean value depending if all elements in the passed array are false or not.
- `collectionToArray`: returns an array based on passed collection.

## Running unit tests

Run `nx test shared-util-objects-objects` to execute the unit tests.
