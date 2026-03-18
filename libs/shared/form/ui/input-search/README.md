# @plastik/shared/form/ui/input-search

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular%20material-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/shared/form/ui/input-search](#plastiksharedformuiinput-search)
  - [Description](#description)
  - [Running unit tests](#running-unit-tests)

## Description

This library provides a reusable **search input component** based on **Angular Material**, featuring integrated search icons and clear buttons, commonly used for filtering lists or querying data.

### Features

- **Smart Search Triggers**: Search actions (`onSearch` and `onPartialSearch`) only trigger when the input has at least 2 characters or is completely empty (for filter resets).
- **Integrated Icons**: Search prefix icon and optional clear suffix icon.
- **Formly Integration**: Fully compatible with `@ngx-formly`, supporting `props` like `minLength`, `noButton`, and `resetSearch`.
- **Validation**: Automatically respects `minLength` validation to prevent premature searches.

## Running unit tests

Run `nx test shared-form-ui-input-search` to execute the unit tests.
