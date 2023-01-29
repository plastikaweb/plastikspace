# core-cms-layout-ui-footer

- [core-cms-layout-ui-footer](#core-cms-layout-ui-footer)
  - [Description](#description)
  - [Content projection](#content-projection)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

A core basic footer with content configuration options.

## Content projection

| Selector    | Description                 |
| ----------- | --------------------------- |
| `[content]` | The contents of the footer. |

## How to use

- Import the `CoreCmsLayoutUiFooterComponent` in your root component app.

- Insert the component in your template using content projection for content.

```html
<!-- component template -->

<plastik-core-cms-layout-ui-footer>
  <div content>&copy; 2022 My Company</div>
</plastik-core-cms-layout-ui-footer>
```

## Running unit tests

Run `nx test core-cms-layout-ui-footer` to execute the unit tests.
