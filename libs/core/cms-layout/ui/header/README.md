# @plastik/core/cms-layout/ui/header

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/core/cms-layout/ui/header](#plastikcorecms-layoutuiheader)
  - [Description](#description)
  - [Content Projection](#content-projection)
  - [Usage](#usage)
  - [Running Unit Tests](#running-unit-tests)

## Description

A **Core Header Components** with flexible content zones.

## Content Projection

| Selector  | Description                          |
| :-------- | :----------------------------------- |
| `[start]` | Content aligned to the left (start). |
| `[end]`   | Content aligned to the right (end).  |

## Usage

Import `CoreCmsLayoutUiHeaderComponent` and project your content:

```html
<plastik-core-cms-layout-ui-header>
  <!-- Left Side -->
  <div start>
    <a href="/">
      <img src="logo.png" alt="Logo" />
      <span>My App</span>
    </a>
  </div>

  <!-- Right Side -->
  <div end>
    <button>Profile</button>
  </div>
</plastik-core-cms-layout-ui-header>
```

## Running Unit Tests

Run `nx test core-cms-layout-ui-header` to execute the unit tests.
