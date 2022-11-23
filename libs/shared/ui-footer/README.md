# shared-ui-footer

- [shared-ui-footer](#shared-ui-footer)
  - [Description](#description)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

A shared footer with configuration options.

## How to use

- Import the `SharedUiFooterModule` in your feature module.

- Insert the component in your template using content projection for content.

```html
<!-- component template -->

<plastikspace-ui-footer>
  <div content>&copy; 2022 My Company</div>
</plastikspace-ui-footer>
```

## Running unit tests

Run `nx test shared-ui-footer` to execute the unit tests.
