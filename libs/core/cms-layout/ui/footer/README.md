# @plastik/core/cms-layout/ui/footer

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/core/cms-layout/ui/footer](#plastikcorecms-layoutuifooter)
  - [Description](#description)
  - [Content Projection](#content-projection)
  - [Usage](#usage)
  - [Running Unit Tests](#running-unit-tests)

## Description

A **Core Footer Component** with content projection support.

## Content Projection

| Selector    | Description                     |
| :---------- | :------------------------------ |
| `[content]` | The main content of the footer. |

## Usage

Import `CoreCmsLayoutUiFooterComponent` and project your content:

```html
<plastik-core-cms-layout-ui-footer>
  <div content>&copy; 2024 My Company. All rights reserved.</div>
</plastik-core-cms-layout-ui-footer>
```

## Running Unit Tests

Run `nx test core-cms-layout-ui-footer` to execute the unit tests.
